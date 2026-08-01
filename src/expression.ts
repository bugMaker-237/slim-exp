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
import { SlimExpressionParserException } from './expression-exception';
import {
  AstExpression,
} from './ast';
import { parseExpressionAst } from './parser';
import { extractFunctionContent } from './function-extract';
import { buildLegacyFromAst, LegacyBuildResult } from './legacy-builder';

export class SlimExpression<
  TIn,
  TContext extends object = any,
  TOut extends ExpressionResult = any
> implements ISlimExpression<TIn, TOut, TContext> {
  private _expDesc: ExpressionDescription<TIn, TOut, TContext> = {} as ExpressionDescription<TIn, TOut, TContext>;
  private _fn: SlimExpressionFunction<TIn, TOut, any> | undefined;
  private _ast: AstExpression | undefined;
  context: TContext | null = null;
  private _throwIfContextIsNull = false;
  private _expObj = '';
  private _ctxName = '';
  private _hash = '';

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

  /** The raw AST produced during compilation. Only available after `compile()`. */
  public get ast(): AstExpression | undefined {
    return this._ast;
  }

  constructor();
  constructor(fn: SlimExpressionFunction<TIn, TOut>);
  constructor(fn?: SlimExpressionFunction<TIn, TOut, TContext>) {
    this._fn = fn;
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
    // _compileInner always sets _ast when mode is 'ast'
    return this._ast as AstExpression;
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
      if (err instanceof SlimExpressionParserException) throw err;
      throw new SlimExpressionParserException(
        err instanceof Error ? err.message : String(err)
      );
    }
  }

  private _buildLegacyFromAst(
    ast: AstExpression
  ): LegacyBuildResult<TIn, TOut, TContext> {
    return buildLegacyFromAst(ast, {
      context: this.context,
      throwIfContextIsNull: this._throwIfContextIsNull,
      ctxName: this._ctxName,
      expObj: this._expObj,
      createChild: (expDesc) => this._createChildInstance(expDesc),
      compileInnerFn: (ctxName, source) => {
        const exp = new SlimExpression<TIn, TContext, TOut>();
        exp.context = this.context;
        exp._throwIfContextIsNull = this._throwIfContextIsNull;
        exp._compileInner(ctxName, source);
        return exp;
      },
    });
  }

  private _parseFn(fnAsString: string, contextName?: string) {
    if (!fnAsString) throw new SlimExpressionParserException(
      'Expression function is not set',
      'FUNCTION_NOT_SET'
    );
    return SlimExpression._extractFnContent(fnAsString, contextName);
  }

  private static _extractFnContent(fnAsString: string, ctxName?: string) {
    return extractFunctionContent(fnAsString, ctxName);
  }

  private _createChildInstance(
    expDesc?: ExpressionDescription<TIn, TOut, TContext>
  ): SlimExpression<TIn, TContext, TOut> {
    const next = new SlimExpression<TIn, TContext, TOut>();
    next._expDesc = expDesc ?? ({} as ExpressionDescription<TIn, TOut, TContext>);
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

  public toString(): string {
    return JSON.stringify(_getExpressionDefinition(this), null, 2);
  }
}

interface ExpressionDefinitionShape {
  lhs: unknown;
  rhs: ExpressionRightHandSide | undefined;
  brackets: { openingExp: ExpressionDefinitionShape | undefined; closingExp: ExpressionDefinitionShape | undefined } | undefined;
  operator: string | undefined;
  next: { bindedBy: string; following: ExpressionDefinitionShape } | undefined;
  context: object | null;
  contextName: string;
  expObjectName: string;
}

function _getExpressionDefinition<
  T,
  C extends object = any,
  S extends ExpressionResult = any
>(exp: ISlimExpression<T, S, C>): ExpressionDefinitionShape {
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
          openingExp: that.brackets.openingExp
            ? _getExpressionDefinition(that.brackets.openingExp)
            : undefined,
          closingExp: that.brackets.closingExp
            ? _getExpressionDefinition(that.brackets.closingExp)
            : undefined,
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
