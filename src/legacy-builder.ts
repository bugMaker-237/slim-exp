import { ComparisonOperators } from './constants';
import { SlimExpressionParserException } from './expression-exception';
import {
  AstBinaryExpression,
  AstCallExpression,
  AstExpression,
  AstFunctionExpression,
  AstGroupExpression,
  AstLiteral,
  AstMemberExpression,
  AstUnaryExpression,
} from './ast';
import {
  ExpressionDescription,
  ExpressionLeftHandSide,
  ExpressionRightHandSide,
  ExpressionResult,
  IParsingResult,
  ISlimExpression,
} from './interfaces';

// ── Types ──────────────────────────────────────────────────────────────────

export interface LegacyBuildResult<
  TIn,
  TOut extends ExpressionResult,
  TContext extends object
> {
  head: ExpressionDescription<TIn, TOut, TContext>;
  link: ExpressionDescription<TIn, TOut, TContext>;
  tail: ExpressionDescription<TIn, TOut, TContext>;
}

/**
 * Configuration bag required by the legacy AST-to-description builder.
 * Passed in by `SlimExpression` so the builder stays stateless and testable.
 */
export interface BuilderConfig<
  TIn,
  TOut extends ExpressionResult,
  TContext extends object
> {
  context: TContext | null;
  throwIfContextIsNull: boolean;
  ctxName: string;
  expObj: string;
  /** Factory that wraps an already-built description into a child instance. */
  createChild: (
    expDesc?: ExpressionDescription<TIn, TOut, TContext>
  ) => ISlimExpression<TIn, TOut, TContext>;
  /** Compiles a nested function source string and returns its expression. */
  compileInnerFn: (ctxName: string, source: string) => ISlimExpression<any>;
}

// ── Pure helpers ───────────────────────────────────────────────────────────

/** Returns true when `value` is a valid (non-NaN) Date instance. */
export function isValidDate(value: unknown): value is Date {
  return value instanceof Date && !isNaN(value.getTime());
}

/**
 * Attempts to parse `s` as a Date.
 * Returns the Date if valid, or `undefined` if the string is not a recognised
 * date format.
 */
export function parseDate(s: string): Date | undefined {
  const d = new Date(s);
  return isValidDate(d) ? d : undefined;
}

function isComparisonOp(op: string): boolean {
  return ComparisonOperators.ALL.includes(op.trim());
}

function isLogicalOp(op: string): boolean {
  return ['&&', '||'].includes(op.trim());
}

/** Walks an AST node and returns the dot-separated property path, or null. */
export function extractPropertyPath(node: AstExpression): string[] | null {
  if (node.kind === 'Identifier') return [(node as { name: string }).name];
  if (node.kind !== 'MemberExpression') return null;
  const member = node as AstMemberExpression;
  const objectPath = extractPropertyPath(member.object);
  if (!objectPath) return null;
  return [...objectPath, member.property];
}

/**
 * Strips leading `!` unary operators from a node, returning the inner target
 * and the accumulated operator string (e.g. `"!!"` for double negation).
 */
export function unwrapUnary(
  node: AstExpression
): { suffix: string; target: AstExpression } {
  let count = 0;
  let current = node;
  while (current.kind === 'UnaryExpression') {
    const unary = current as AstUnaryExpression;
    if (unary.operator !== '!') {
      throw new SlimExpressionParserException(
        `Unsupported unary operator: ${unary.operator}`,
        'UNSUPPORTED_UNARY_OPERATOR'
      );
    }
    count++;
    current = unary.argument;
  }
  return { suffix: '!'.repeat(count), target: current };
}

/**
 * Converts an AST literal node to a typed parsing result.
 * The `type` field reflects the JavaScript runtime type, with `'date'` used
 * for string literals that parse to a valid Date, and `'null'` for the null
 * literal.
 */
export function toLiteralValue(node: AstExpression): IParsingResult {
  if (node.kind !== 'Literal') return { parsed: false };
  const literal = node as AstLiteral;
  if (literal.valueType === 'null') {
    return { parsed: true, type: 'null', value: null };
  }
  if (literal.valueType === 'string') {
    const possibleDate = parseDate(literal.value as string);
    if (possibleDate !== undefined) {
      return { parsed: true, type: 'date', value: possibleDate };
    }
  }
  return { parsed: true, type: typeof literal.value, value: literal.value };
}

function extractPropertyValueFromContext(
  p: string,
  context: unknown,
  ctxName: string,
  throwIfContextIsNull: boolean
): { val: unknown; finalPropName: string } {
  const deepProps = p.split('.');
  if (context == null && throwIfContextIsNull) {
    throw new SlimExpressionParserException(
      'ContextData must be managed but context is null or undefined',
      'CONTEXT_REQUIRED'
    );
  }
  if (deepProps.length > 2) {
    // eslint-disable-next-line no-console
    console.warn(
      'It is more expensive to use complex object for context due to deep ' +
        'search of property value in object tree. Consider using simple ' +
        'objects. e.g: {id: myId}'
    );
  }

  const ctx = deepProps.shift();
  if (ctxName !== ctx && throwIfContextIsNull) {
    throw new SlimExpressionParserException(
      "Due to javascript limitations, it's not possible to process information " +
        'out of context, please attach value to context',
      'CONTEXT_REQUIRED'
    );
  }

  const finalPropName = deepProps.join('.');
  const propName = deepProps.shift();

  if (!propName) {
    throw new SlimExpressionParserException(
      'Internal parsing error when extracting property value from context: ' + p,
      'PARSE_ERROR'
    );
  }

  const contextObj = (context ?? {}) as Record<string, unknown>;
  let val: unknown = contextObj[propName];

  for (const prop of deepProps) {
    if (val == null) break;
    val = (val as Record<string, unknown>)[prop];
  }

  if (val == null && throwIfContextIsNull) {
    throw new SlimExpressionParserException(
      `Could not find property ${p} in provided context`,
      'CONTEXT_PROPERTY_NOT_FOUND'
    );
  }

  return { val, finalPropName };
}

// ── Builder functions ──────────────────────────────────────────────────────

function buildCallContent<
  TIn,
  TOut extends ExpressionResult,
  TContext extends object
>(
  call: AstCallExpression,
  config: BuilderConfig<TIn, TOut, TContext>
): NonNullable<ExpressionLeftHandSide['content']> {
  const firstArg = call.arguments[0];
  if (!firstArg) {
    return { type: 'undefined' };
  }

  if (firstArg.kind === 'FunctionExpression') {
    const fnArg = firstArg as AstFunctionExpression;
    const exp = config.compileInnerFn(config.ctxName, fnArg.source);
    return { type: 'expression', isExpression: true, expression: exp };
  }

  const literal = toLiteralValue(firstArg);
  if (literal.parsed) {
    return {
      type: literal.type,
      primitiveValue: literal.value as string | number,
    };
  }

  const propertyPath = extractPropertyPath(firstArg);
  if (!propertyPath) {
    throw new SlimExpressionParserException(
      'Unsupported method argument',
      'UNSUPPORTED_METHOD_ARGUMENT'
    );
  }

  const path = propertyPath.join('.');
  const { val } = extractPropertyValueFromContext(
    path,
    config.context,
    config.ctxName,
    config.throwIfContextIsNull
  );
  return {
    type: isValidDate(val) ? 'date' : typeof val,
    primitiveValue: val as string | number,
  };
}

function buildLeftHandSide<
  TIn,
  TOut extends ExpressionResult,
  TContext extends object
>(
  node: AstExpression,
  config: BuilderConfig<TIn, TOut, TContext>
): ExpressionLeftHandSide {
  const unary = unwrapUnary(node);
  const result: ExpressionLeftHandSide = {
    propertyName: '',
    suffixOperator: unary.suffix,
  };

  if (unary.target.kind === 'CallExpression') {
    const call = unary.target as AstCallExpression;
    const callPath = extractPropertyPath(call.callee);
    if (!callPath || !callPath.length) {
      throw new SlimExpressionParserException(
        'Expression has to start with type member invocation',
        'INVALID_EXPRESSION_ROOT'
      );
    }
    if (callPath[0] !== config.expObj) {
      throw new SlimExpressionParserException(
        'Expression has to start with type member invocation',
        'INVALID_EXPRESSION_ROOT'
      );
    }
    const callLocalPath = callPath.slice(1);
    const content = buildCallContent(call, config);
    content.methodName = callPath[callPath.length - 1];
    result.isMethod = true;
    result.content = content;
    result.propertyTree = callLocalPath;
    result.propertyName = callLocalPath.join('.');
    return result;
  }

  const lhsPath = extractPropertyPath(unary.target);
  if (!lhsPath || !lhsPath.length) {
    throw new SlimExpressionParserException(
      'Expression has to start with type member invocation',
      'INVALID_EXPRESSION_ROOT'
    );
  }
  if (lhsPath[0] !== config.expObj) {
    throw new SlimExpressionParserException(
      'Expression has to start with type member invocation',
      'INVALID_EXPRESSION_ROOT'
    );
  }
  const lhsLocalPath = lhsPath.slice(1);
  result.propertyTree = lhsLocalPath;
  result.propertyName = lhsLocalPath.join('.');
  return result;
}

function buildRightHandSide<
  TIn,
  TOut extends ExpressionResult,
  TContext extends object
>(
  node: AstExpression,
  config: BuilderConfig<TIn, TOut, TContext>
): ExpressionRightHandSide {
  const expDescRight: ExpressionRightHandSide = {
    propertyType: '',
    propertyName: '',
    propertyValue: null,
    implicitContextName: null,
  };

  const literal = toLiteralValue(node);
  if (literal.parsed) {
    expDescRight.propertyType = literal.type;
    expDescRight.propertyName = '[CONSTANT]';
    expDescRight.propertyValue = literal.value;
    return expDescRight;
  }

  const path = extractPropertyPath(node);
  if (!path) {
    throw new SlimExpressionParserException(
      'Unsupported right hand side expression',
      'UNSUPPORTED_RIGHT_HAND_SIDE'
    );
  }
  const fullPath = path.join('.');
  const { val, finalPropName } = extractPropertyValueFromContext(
    fullPath,
    config.context,
    config.ctxName,
    config.throwIfContextIsNull
  );

  expDescRight.propertyType = isValidDate(val) ? 'date' : typeof val;
  expDescRight.propertyName = finalPropName;
  expDescRight.propertyValue = val;
  expDescRight.implicitContextName = path[0] ?? null;
  return expDescRight;
}

function buildSingleExpression<
  TIn,
  TOut extends ExpressionResult,
  TContext extends object
>(
  ast: AstExpression,
  config: BuilderConfig<TIn, TOut, TContext>
): ExpressionDescription<TIn, TOut, TContext> {
  const expDesc = {} as ExpressionDescription<TIn, TOut, TContext>;
  if (
    ast.kind === 'BinaryExpression' &&
    isComparisonOp((ast as AstBinaryExpression).operator)
  ) {
    const binary = ast as AstBinaryExpression;
    expDesc.leftHandSide = buildLeftHandSide(binary.left, config);
    expDesc.operator = binary.operator;
    expDesc.rightHandSide = buildRightHandSide(binary.right, config);
    return expDesc;
  }

  expDesc.leftHandSide = buildLeftHandSide(ast, config);
  return expDesc;
}

/**
 * Converts an AST node into the legacy expression-description tree that
 * `SlimExpression` exposes through its public properties.
 */
export function buildLegacyFromAst<
  TIn,
  TOut extends ExpressionResult,
  TContext extends object
>(
  ast: AstExpression,
  config: BuilderConfig<TIn, TOut, TContext>
): LegacyBuildResult<TIn, TOut, TContext> {
  if (ast.kind === 'GroupExpression') {
    const groupResult = buildLegacyFromAst(
      (ast as AstGroupExpression).expression,
      config
    );
    const container = {} as ExpressionDescription<TIn, TOut, TContext>;
    container.brackets = {
      openingExp: config.createChild(groupResult.head),
      closingExp: config.createChild(groupResult.tail),
    };
    return { head: container, link: container, tail: groupResult.tail };
  }

  if (
    ast.kind === 'BinaryExpression' &&
    isLogicalOp((ast as AstBinaryExpression).operator)
  ) {
    const logical = ast as AstBinaryExpression;
    const left = buildLegacyFromAst(logical.left, config);
    const right = buildLegacyFromAst(logical.right, config);
    left.link.next = {
      bindedBy: logical.operator,
      followedBy: config.createChild(right.head),
    };
    return { head: left.head, link: right.link, tail: right.tail };
  }

  const description = buildSingleExpression(ast, config);
  return { head: description, link: description, tail: description };
}
