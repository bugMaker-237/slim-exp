import {
  SlimExpressionFunction,
  ExpressionDescription,
  ExpressionRightHandSide,
  ExpressionLeftHandSide,
  NextExpression,
  ExpressionResult,
  ISlimExpression,
  ExpressionBrackets
} from './interfaces';
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
  AstUnaryExpression
} from './ast';
import { parseExpressionAst } from './parser';
import { extractFunctionContent } from './function-extract';

interface LegacyBuildResult<TIn, TOut extends ExpressionResult, TContext extends object> {
  head: ExpressionDescription<TIn, TOut, TContext>;
  tail: ExpressionDescription<TIn, TOut, TContext>;
}

export class SlimExpression<
  TIn,
  TContext extends object = any,
  TOut extends ExpressionResult = any
> implements ISlimExpression<TIn, TOut, TContext> {
  private _expDesc: ExpressionDescription<TIn, TOut, TContext>;
  private _fn: SlimExpressionFunction<TIn, TOut, any>;
  private _ast: AstExpression;
  context: TContext | null;
  private _throwIfContextIsNull: boolean;
  private _expObj: string;
  private _ctxName: string;
  private _hash: string;

  public get rightHandSide(): ExpressionRightHandSide {
    return this._expDesc?.rightHandSide;
  }

  public get brackets(): ExpressionBrackets {
    return this._expDesc?.brackets;
  }

  public get expObjectName(): string {
    return this._expObj;
  }

  public get contextName(): string {
    return this._ctxName;
  }

  public get leftHandSide(): ExpressionLeftHandSide {
    return this._expDesc?.leftHandSide;
  }

  public get operator(): string {
    return this._expDesc?.operator;
  }

  public get lastComputedHash(): string {
    return this._hash;
  }

  public get next(): NextExpression<TIn, TOut, TContext> {
    return this._expDesc?.next;
  }

  public get ast(): AstExpression {
    return this._ast;
  }

  constructor();
  constructor(fn: SlimExpressionFunction<TIn, TOut>);
  constructor(fn?: SlimExpressionFunction<TIn, TOut, TContext>) {
    this._fn = fn;
    this._expDesc = {} as any;
  }

  public fromAction<C extends TContext>(
    fn: SlimExpressionFunction<TIn, TOut, C>,
    context: C | null = null,
    throwIfContextIsNull = true
  ) {
    this._fn = fn;
    this.context = context;
    this._throwIfContextIsNull = throwIfContextIsNull;
  }

  public compile(mode: 'legacy' | 'ast' = 'legacy'): void | AstExpression {
    if (mode === 'ast') return this.compileAst();
    this._compileInner();
  }

  public compileAst(): AstExpression {
    this._compileInner(undefined, undefined, 'ast');
    return this._ast;
  }

  public computeHash(): string {
    if (!this._expDesc) this.compile();

    const obj = JSON.stringify(_getExpressionDefinition(this));
    let h = 0;
    for (let i = 0; i < obj.length; i++) {
      h += obj.charCodeAt(i);
    }
    return (this._hash = h.toString());
  }

  public static nameOf<TIn = any, TOut extends ExpressionResult = any>(
    fn: SlimExpressionFunction<TIn, TOut>
  ): string {
    const res = SlimExpression._extractFnContent(fn.toString()).expressionContent
      .split('.');
    res.shift();
    return res.join('.');
  }

  public static extractContent<TIn = any, TOut extends ExpressionResult = any>(
    fn: SlimExpressionFunction<TIn, TOut>,
    ctxName?: string
  ): {
    expressionContent: string;
    isLegacyFunc: boolean;
    expObj: string;
    ctxName: string;
  } {
    return SlimExpression._extractFnContent(fn.toString(), ctxName);
  }

  private _compileInner(
    contextName?: string,
    fnAsString?: string,
    mode: 'legacy' | 'ast' = 'legacy'
  ) {
    try {
      const fnString =
        fnAsString?.trim() || SlimExpression._escapeNewLine(this._fn?.toString());
      const { expressionContent, expObj, ctxName } = this._parseFn(
        fnString,
        contextName
      );

      this._expObj = expObj;
      this._ctxName = ctxName;
      this._ast = parseExpressionAst(expressionContent);

      if (mode === 'ast') return;

      const legacy = this._buildLegacyFromAst(this._ast);
      this._expDesc = legacy.head;
    } catch (err) {
      throw new SlimExpressionParserException(
        err instanceof Error ? err.message : String(err)
      );
    }
  }

  private _buildLegacyFromAst(
    ast: AstExpression
  ): LegacyBuildResult<TIn, TOut, TContext> {
    if (ast.kind === 'GroupExpression') {
      const groupResult = this._buildLegacyFromAst(
        (ast as AstGroupExpression).expression
      );
      const container = {} as ExpressionDescription<TIn, TOut, TContext>;
      container.brackets = {
        openingExp: this._createChildInstance(groupResult.head),
        closingExp: this._createChildInstance(groupResult.tail)
      };
      return { head: container, tail: container };
    }

    if (
      ast.kind === 'BinaryExpression' &&
      this._isLogicalOperator((ast as AstBinaryExpression).operator)
    ) {
      const logical = ast as AstBinaryExpression;
      const left = this._buildLegacyFromAst(logical.left);
      const right = this._buildLegacyFromAst(logical.right);
      left.tail.next = {
        bindedBy: logical.operator,
        followedBy: this._createChildInstance(right.head)
      };
      return { head: left.head, tail: right.tail };
    }

    const description = this._buildSingleExpression(ast);
    return { head: description, tail: description };
  }

  private _buildSingleExpression(ast: AstExpression) {
    const expDesc = {} as ExpressionDescription<TIn, TOut, TContext>;
    if (
      ast.kind === 'BinaryExpression' &&
      this._isComparisonOperator((ast as AstBinaryExpression).operator)
    ) {
      const binary = ast as AstBinaryExpression;
      expDesc.leftHandSide = this._buildLeftHandSide(binary.left);
      expDesc.operator = binary.operator;
      expDesc.rightHandSide = this._buildRightHandSide(binary.right);
      return expDesc;
    }

    expDesc.leftHandSide = this._buildLeftHandSide(ast);
    return expDesc;
  }

  private _buildLeftHandSide(node: AstExpression): ExpressionLeftHandSide {
    const unary = this._unwrapUnary(node);
    const result: ExpressionLeftHandSide = {
      propertyName: '',
      suffixOperator: unary.suffix
    };

    if (unary.target.kind === 'CallExpression') {
      const call = unary.target as AstCallExpression;
      const path = this._extractPropertyPath(call.callee);
      if (!path || !path.length) {
        throw new Error('Expression has to start with type member invocation');
      }
      this._ensureExpressionRoot(path[0]);
      const localPath = path.slice(1);
      result.propertyTree = localPath;
      result.propertyName = localPath.join('.');
      result.isMethod = true;
      result.content = this._buildCallContent(call);
      result.content.methodName = path[path.length - 1];
      return result;
    }

    const path = this._extractPropertyPath(unary.target);
    if (!path || !path.length) {
      throw new Error('Expression has to start with type member invocation');
    }

    this._ensureExpressionRoot(path[0]);
    const localPath = path.slice(1);
    result.propertyTree = localPath;
    result.propertyName = localPath.join('.');
    return result;
  }

  private _buildCallContent(call: AstCallExpression) {
    const firstArg = call.arguments[0];
    if (!firstArg) {
      return {
        type: 'undefined',
        primitiveValue: undefined as any
      };
    }

    if (firstArg.kind === 'FunctionExpression') {
      const fnArg = firstArg as AstFunctionExpression;
      const exp = new SlimExpression();
      exp.context = this.context;
      exp._throwIfContextIsNull = this._throwIfContextIsNull;
      exp._compileInner(this._ctxName, fnArg.source);
      return {
        type: 'expression',
        isExpression: true,
        expression: exp
      };
    }

    const literal = this._toLiteralValue(firstArg);
    if (literal.parsed) {
      return {
        type: literal.type,
        primitiveValue: literal.value as any
      };
    }

    const propertyPath = this._extractPropertyPath(firstArg);
    if (!propertyPath) throw new Error('Unsupported method argument');
    const path = propertyPath.join('.');
    const { val } = this._extractPropertyValueFromContext(
      path,
      this.context,
      this._ctxName
    );
    return {
      type: this._isValidDate(val) ? 'date' : typeof val,
      primitiveValue: val
    };
  }

  private _buildRightHandSide(node: AstExpression): ExpressionRightHandSide {
    const expDescRight: ExpressionRightHandSide = {
      propertyType: '',
      propertyName: '',
      propertyValue: null,
      implicitContextName: null
    };

    const literal = this._toLiteralValue(node);
    if (literal.parsed) {
      expDescRight.propertyType = literal.type;
      expDescRight.propertyName = '[CONSTANT]';
      expDescRight.propertyValue = literal.value;
      return expDescRight;
    }

    const path = this._extractPropertyPath(node);
    if (!path) throw new Error('Unsupported right hand side');
    const fullPath = path.join('.');
    const { val, finalPropName } = this._extractPropertyValueFromContext(
      fullPath,
      this.context,
      this._ctxName
    );

    expDescRight.propertyType = this._isValidDate(val) ? 'date' : typeof val;
    expDescRight.propertyName = finalPropName;
    expDescRight.propertyValue = val;
    expDescRight.implicitContextName = path[0] || null;
    return expDescRight;
  }

  private _toLiteralValue(node: AstExpression): {
    parsed: boolean;
    type?: string;
    value?: any;
  } {
    if (node.kind !== 'Literal') return { parsed: false };
    const literal = node as AstLiteral;
    if (literal.valueType === 'null') {
      return { parsed: true, type: typeof true, value: null };
    }
    if (literal.valueType === 'string') {
      const possibleDate = this._checkDate(literal.value as string);
      if (this._isValidDate(possibleDate)) {
        return { parsed: true, type: 'date', value: possibleDate };
      }
    }
    return {
      parsed: true,
      type:
        literal.valueType === 'null'
          ? typeof true
          : typeof literal.value,
      value: literal.value
    };
  }

  private _extractPropertyPath(node: AstExpression): string[] | null {
    if (node.kind === 'Identifier') return [(node as any).name];
    if (node.kind !== 'MemberExpression') return null;

    const member = node as AstMemberExpression;
    const objectPath = this._extractPropertyPath(member.object);
    if (!objectPath) return null;
    return [...objectPath, member.property];
  }

  private _unwrapUnary(node: AstExpression): {
    suffix: string;
    target: AstExpression;
  } {
    let count = 0;
    let current = node;
    while (current.kind === 'UnaryExpression') {
      const unary = current as AstUnaryExpression;
      if (unary.operator !== '!') {
        throw new Error('Unsupported unary operator');
      }
      count++;
      current = unary.argument;
    }
    return { suffix: '!'.repeat(count), target: current };
  }

  private _ensureExpressionRoot(initial: string) {
    if (!initial.includes(this._expObj)) {
      throw new Error('Expression has to start with type member invocation');
    }
  }

  private _extractPropertyValueFromContext(
    p: string,
    context: any,
    ctxName: string
  ): { val: any; finalPropName: any } {
    const deepProps = p.split('.');
    if (context == null && this._throwIfContextIsNull)
      throw new Error('ContextData must be managed but context is null or undefined');
    if (deepProps.length > 2)
      console.warn(
        'It is more expensive to use complex object for context due to deep search of property value in object tree. Consider using simple objects. e.g: {id: myId}'
      );

    const ctx = deepProps.shift();
    if (ctxName !== ctx && this._throwIfContextIsNull)
      throw new Error(
        "Due to javascript limitations, it's not possible to process information out of context, please attach value to context"
      );

    const finalPropName = deepProps.join('.');
    const propName = deepProps.shift();

    if (!propName)
      throw new Error(
        'Internal parsing error when extracting property value from context: ' + p
      );

    let val = (context || {})[propName];

    for (const prop of deepProps) {
      if (val == null) break;

      val = val[prop];
    }

    if (val == null && this._throwIfContextIsNull)
      throw new Error(`Could not find property ${p} in provided context`);

    return { val, finalPropName };
  }

  private _isValidDate(possibleDate: any): boolean {
    return (
      typeof possibleDate === 'object' &&
      possibleDate.toString().toLowerCase() !== 'invalid date'
    );
  }

  private _checkDate(p: string): Date | undefined {
    return new Date(p);
  }

  private _parseFn(fnAsString: string, contextName: string) {
    if (!fnAsString) throw new Error('Expression function is not set');
    return SlimExpression._extractFnContent(fnAsString, contextName);
  }

  private static _extractFnContent(fnAsString: string, ctxName?: string) {
    return extractFunctionContent(fnAsString, ctxName);
  }

  private _createChildInstance(
    expDesc?: ExpressionDescription<TIn, TOut, TContext>
  ): SlimExpression<any> {
    const next = new SlimExpression<TIn, TContext, TOut>();
    next._expDesc = expDesc || ({} as any);
    next._throwIfContextIsNull = this._throwIfContextIsNull;
    next.context = this.context;
    next._ctxName = this.contextName;
    next._expObj = this.expObjectName;
    return next;
  }

  private static _escapeNewLine(str?: string) {
    return (str || '')
      .split(/\r\n/)
      .join('')
      .split(/\r/)
      .join('')
      .split(/\n/)
      .join('')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private _isComparisonOperator(op: string) {
    return ComparisonOperators.ALL.includes(op.trim());
  }

  private _isLogicalOperator(op: string) {
    return ['&&', '||'].includes(op.trim());
  }

  public toString(): string {
    return JSON.stringify(_getExpressionDefinition(this), null, 2);
  }
}

function _getExpressionDefinition<
  T,
  C extends object = any,
  S extends ExpressionResult = any
>(exp: ISlimExpression<T, S, C>) {
  const that = exp as SlimExpression<T, C, S>;

  return {
    lhs: that.leftHandSide
      ? {
          ...that.leftHandSide,
          content: that.leftHandSide?.content
            ? {
                ...that.leftHandSide.content,
                expression: that.leftHandSide.content.expression
                  ? _getExpressionDefinition(
                      that.leftHandSide.content.expression
                    )
                  : void 0
              }
            : void 0
        }
      : void 0,
    rhs: that.rightHandSide,
    brackets: that.brackets
      ? {
          openingExp: _getExpressionDefinition(that.brackets.openingExp),
          closingExp: _getExpressionDefinition(that.brackets.closingExp)
        }
      : void 0,
    operator: that.operator,
    next: that.next
      ? {
          bindedBy: that.next.bindedBy,
          following: _getExpressionDefinition(that.next.followedBy)
        }
      : void 0,
    context: that.context,
    contextName: that.contextName,
    expObjectName: that.expObjectName
  };
}
