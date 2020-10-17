import {
  SlimExpressionFunction,
  ExpressionDescription,
  ExpressionRightHandSide,
  ExpressionLeftHandSide,
  NextExpression,
  ExpressionResult,
  IParsingResult,
  ISlimExpression,
  ExpressionBrackets
} from './interfaces';
import {
  ComparisonOperators,
  RegExEscapedLogicalOperators,
  RegExEscapedComparisonOperators,
  RegExInnerFunction,
  RegExLegacyInnerFunction
} from './constants';
import { SlimExpressionParserException } from './expression-exception';

export class SlimExpression<
  TIn,
  TContext extends object = any,
  TOut extends ExpressionResult = any
> implements ISlimExpression<TIn, TOut, TContext> {
  private _expDesc: ExpressionDescription<TIn, TOut, TContext>;
  private _fn: SlimExpressionFunction<TIn, TOut, any>;
  context: TContext | null;
  private _throwIfContextIsNull: boolean;
  private _expObj: string;
  private _ctxName: string;
  private _lastBracketExp: ExpressionDescription<any>;
  private _nextRef: NextExpression<any, any, any>;
  private _openedBrackets: ExpressionDescription<any>[] = [];
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

  public compile() {
    this._compileInner();
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
    const res = SlimExpression._extractFnContent(
      fn.toString()
    ).expressionContent.split('.');
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

  private _compileInner(contextName?: string, fnAsString?: string) {
    fnAsString =
      fnAsString?.trim() || SlimExpression._escapeNewLine(this._fn?.toString());
    const { expStringParts, isLegacyFunc, expObj, ctxName } = this._parseFn(
      fnAsString,
      contextName
    );
    this._expObj = expObj;
    this._ctxName = ctxName;
    const context = this.context;
    const staticReplacer = '@%#';
    let expDesc: ExpressionDescription<TIn, TOut, TContext> = {} as any;
    let hasRightHandSide = false;
    let headExpression: ISlimExpression<TIn, TOut, TContext>;
    let head;
    for (const s of expStringParts) {
      const x = s.trim();
      if (this._isLogicalOperator(x)) {
        expDesc = this._compileLogicalOperator(expDesc, x);
      } else {
        ({ hasRightHandSide, head } = this._compileLHSRHS(
          s,
          expDesc,
          isLegacyFunc,
          staticReplacer,
          expObj,
          ctxName,
          context,
          hasRightHandSide
        ));
        if (!headExpression) headExpression = head || expDesc;
      }
    }

    this._expDesc = headExpression;
  }

  private _compileLHSRHS(
    expPartAsString: string,
    expDesc: ExpressionDescription<TIn, TOut, TContext>,
    isLegacyFunc: boolean,
    staticReplacer: string,
    expObj: string,
    ctxName: string,
    context: TContext,
    hasRightHandSide: boolean
  ) {
    const { finalExpContent: parsedBracketExpStr, head } = this._handleBrackets(
      expPartAsString,
      expDesc
    );
    // checking if expression part contains inner functino call
    const funcRegex = isLegacyFunc
      ? RegExLegacyInnerFunction
      : RegExInnerFunction;
    const expressionMatch = funcRegex.exec(parsedBracketExpStr);
    const innerValue = expressionMatch ? expressionMatch[0] : void 0;

    const comparisonParts = parsedBracketExpStr
      .replace(funcRegex, staticReplacer)
      .split(RegExEscapedComparisonOperators)
      // there are some values that are undefined. Thus filtering is necessary
      .filter((v) => !!v);
    for (const p of comparisonParts) {
      let c = p.trim();
      if (c.includes(staticReplacer)) {
        c = c.replace(staticReplacer, innerValue);
      }
      if (!expDesc.leftHandSide) {
        this._handleLeftHandSide(c, expDesc, expObj, context, ctxName);
      } else if (!expDesc.operator) {
        if (!this._isComparisonOperator(c))
          throw new SlimExpressionParserException(
            'Unsupported comparison operator'
          );
        hasRightHandSide = true;
        expDesc.operator = c;
      } else if (!expDesc.rightHandSide && hasRightHandSide) {
        this._handleRightHandSide(c, expDesc, context, ctxName);
      }
    }
    return { hasRightHandSide, head };
  }

  private _compileLogicalOperator(
    expDesc: ExpressionDescription<TIn, TOut, TContext>,
    x: string
  ) {
    const next = this._initialiseNextValueForExpDesc(expDesc, x);
    return next._expDesc;
  }

  private _handleBrackets(
    expContent: string,
    expDesc: ExpressionDescription<TIn, TOut, TContext>
  ) {
    const final = expContent.trim();
    const occurenceCount = (search: RegExp) =>
      (final.match(search) || []).length;

    const oc1 = occurenceCount(/\(/g);
    const oc2 = occurenceCount(/\)/g);
    if (oc1 > oc2) {
      const regStr = oc1 - oc2 === 1 ? `^\\(` : `^\\({${oc1 - oc2}}`;
      const rgxStart = new RegExp(regStr);
      const expBrackets: ExpressionDescription<TIn, TOut, TContext> = {} as any;
      expBrackets.brackets = {
        openingExp: this._createChildInstance(expDesc)
      };

      const last = this._createChildInstance(expBrackets);

      this._lastBracketExp = last._expDesc;
      this._openedBrackets.push(this._lastBracketExp);

      if (!this._nextRef) {
        return { finalExpContent: final.replace(rgxStart, ''), head: last };
      }
      this._nextRef.followedBy = last;
      return { finalExpContent: final.replace(rgxStart, '') };
    } else if (oc1 < oc2) {
      const regStr = oc2 - oc1 === 1 ? `\\)$` : `\\){${oc2 - oc1}}$`;
      const rgxEnd = new RegExp(regStr);
      let i = 0;
      do {
        const lastOpenedBrackets = this._openedBrackets.pop();
        lastOpenedBrackets.brackets.closingExp = this._createChildInstance(
          expDesc
        );
        i++;
      } while (i < oc2 - oc1);

      return { finalExpContent: final.replace(rgxEnd, '') };
    } else {
      if (final.startsWith('(') && final.endsWith(')')) {
        const [res] = /^\(+/.exec(final);
        const rgxFull = new RegExp(`^\\){${res.length}}$`);
        return {
          finalExpContent: final.replace(/^\(+/, '').replace(rgxFull, '')
        };
      }
    }

    return { finalExpContent: final };
  }

  private _handleLeftHandSide(
    p: string,
    expDesc: ExpressionDescription<TIn, TOut, TContext>,
    expObj: string,
    context: any,
    ctxName: string
  ) {
    expDesc.leftHandSide = {
      propertyName: '',
      suffixOperator: ''
    };

    let pParts = p.split('.');
    const initial = pParts.shift();

    if (!initial)
      throw new SlimExpressionParserException('Internal parsing error');

    if (!initial.includes(expObj))
      throw new SlimExpressionParserException(
        'Expression has to start with type member invocation'
      );

    if (initial[0].trim() !== '!' && !expObj.startsWith(initial[0]))
      throw new SlimExpressionParserException('Unsupported unary operator');

    if (!initial.startsWith(expObj)) {
      const initialUnaryOp = initial[0].trim();
      const initialSlice = initial.slice(0, 2).trim();
      // trying to check if it is an operator like "!!"
      expDesc.leftHandSide.suffixOperator =
        initialSlice === initialUnaryOp + initialUnaryOp
          ? initialSlice
          : initialUnaryOp;
    }

    if (/[(](.*)[)$]/.test(p)) {
      const res = /[(](.*)[)$]/.exec(p);
      const content = res[1];
      pParts = p.replace(res[0], '').split('.');
      // removing the first type call 'n.name.surname' => removing the 'n'
      pParts.shift();
      const invokablePropertyName = pParts[pParts.length - 1];

      expDesc.leftHandSide.isMethod = true;
      const parseRes: IParsingResult = this._tryParse(content);
      if (parseRes.parsed) {
        expDesc.leftHandSide.content = {
          type: parseRes.type,
          primitiveValue: parseRes.value
        };
      } else {
        if (this._isExpression(content)) {
          const exp = new SlimExpression();
          exp.context = context;
          exp._throwIfContextIsNull = this._throwIfContextIsNull;
          exp._compileInner(ctxName, content);
          expDesc.leftHandSide.content = {
            type: 'expression',
            isExpression: true,
            expression: exp
          };
        } else {
          const { val } = this._extractPropertyValueFromContext(
            content,
            context,
            ctxName
          );
          expDesc.leftHandSide.content = {
            type: typeof val,
            primitiveValue: val
          };
        }
      }

      expDesc.leftHandSide.content.methodName = invokablePropertyName;
    }

    expDesc.leftHandSide.propertyTree = pParts;
    expDesc.leftHandSide.propertyName = pParts.join('.') || initial;
  }
  private _isExpression(res: string) {
    return res.indexOf('=>') > -1 || res.startsWith('function');
  }

  private _handleRightHandSide(
    p: string,
    expDesc: ExpressionDescription<TIn, TOut, TContext>,
    context: any,
    ctxName?: string
  ) {
    expDesc.rightHandSide = {
      propertyType: '',
      propertyName: '',
      propertyValue: null,
      implicitContextName: null
    };

    const result: IParsingResult = this._tryParse(p);

    if (result.parsed) {
      expDesc.rightHandSide.propertyType = result.type;
      expDesc.rightHandSide.propertyValue = result.value;
      expDesc.rightHandSide.propertyName = '[CONSTANT]';
      return;
    }

    const { val, finalPropName } = this._extractPropertyValueFromContext(
      p,
      context,
      ctxName
    );

    expDesc.rightHandSide.propertyType = this._isValidDate(val)
      ? 'date'
      : typeof val;
    expDesc.rightHandSide.propertyName = finalPropName;
    expDesc.rightHandSide.propertyValue = val;
    expDesc.rightHandSide.implicitContextName = p.split('.')[0];
  }
  private _extractPropertyValueFromContext(
    p: string,
    context: any,
    ctxName: string
  ): { val: any; finalPropName: any } {
    const deepProps = p.split('.');
    if (context == null && this._throwIfContextIsNull)
      throw new SlimExpressionParserException(
        'ContextData must be managed but context is null or undefined'
      );
    if (deepProps.length > 2)
      console.warn(
        'It is more expensive to use complex object for context due to deep search of property value in object tree. Consider using simple objects. e.g: {id: myId}'
      );

    // removing the context accessor ($) from expression
    const ctx = deepProps.shift();

    if (ctxName !== ctx && this._throwIfContextIsNull)
      throw new SlimExpressionParserException(
        "Due to javascript limitations, it's not possible to process information out of context, please attach value to context"
      );

    const finalPropName = deepProps.join('.');
    const propName = deepProps.shift();

    if (!propName)
      throw new SlimExpressionParserException('Internal parsing error');

    let val = (context || {})[propName];

    for (const prop of deepProps) {
      if (val == null) break;

      val = val[prop];
    }

    if (val == null && this._throwIfContextIsNull)
      throw new SlimExpressionParserException(
        `Could not find property ${p} in provided context`
      );

    return { val, finalPropName };
  }
  private _tryParse(p: string): IParsingResult {
    if (!isNaN(Number.parseFloat(p))) {
      return { value: Number.parseFloat(p), type: typeof 1, parsed: true };
    }
    if (p.trim() === 'true' || p.trim() === 'false') {
      const res = { value: false, type: typeof true, parsed: true };

      res.value = p.trim() === 'true' ? Boolean('1') : Boolean();
      return res;
    }
    const possibleDate = this._checkDate(p);
    if (this._isValidDate(possibleDate)) {
      return {
        value: possibleDate,
        type: 'date',
        parsed: true
      };
    }
    if (/^("|').*("|')$/.test(p)) {
      return {
        value: p.substring(1, p.length - 1),
        type: typeof '',
        parsed: true
      };
    }

    return { parsed: false };
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
    if (!fnAsString)
      throw new SlimExpressionParserException('Expression function is not set');
    const {
      expressionContent,
      isLegacyFunc,
      expObj,
      ctxName
    } = SlimExpression._extractFnContent(fnAsString, contextName);

    const expStringParts = expressionContent
      .split(RegExEscapedLogicalOperators)
      .filter((v) => !!v);
    return { expStringParts, isLegacyFunc, expObj, ctxName };
  }

  private static _extractFnContent(fnAsString: string, ctxName?: string) {
    let fnStr = fnAsString;
    let isLegacyFunc = false;
    if (fnStr.startsWith('function')) {
      fnStr = fnStr
        .replace('return', '')
        // removes the beginig 'function' keyword
        .slice(fnStr.indexOf('('));

      // leaving out '{' because i need it as marker to get the content
      fnStr = fnStr
        .slice(0, fnStr.lastIndexOf('}'))
        .slice(0, fnStr.lastIndexOf(';'));

      // this => "function(x){return x.prop}" is a legacy function
      isLegacyFunc = true;
    }

    const expObj = SlimExpression._extractExpObj(fnStr, isLegacyFunc);

    if (fnStr.split(')')[0].indexOf(',') > -1)
      ctxName =
        ctxName ||
        fnStr.substring(fnStr.indexOf(',') + 1, fnStr.indexOf(')')).trim();

    const expressionContent = fnStr
      .substring(fnStr.indexOf(isLegacyFunc ? '{' : '>') + 1)
      .trim();
    return { expressionContent, isLegacyFunc, expObj, ctxName };
  }

  private static _extractExpObj(fnStr: string, isLegacyFunc = false) {
    return (
      fnStr.substring(0, fnStr.indexOf(',')) ||
      fnStr.substring(0, fnStr.indexOf(isLegacyFunc ? '{' : '='))
    )
      .replace('(', '')
      .replace(')', '')
      .trim();
  }

  private _initialiseNextValueForExpDesc(
    expDesc: ExpressionDescription<TIn, TOut, TContext>,
    bindedBy = ''
  ) {
    // normally if breackets have been open the initial expDesc
    // of this instance is the expDesc of the opening brackets
    const realExpDesc =
      (this._lastBracketExp?.brackets?.closingExp as SlimExpression<any>)
        ?._expDesc === expDesc
        ? this._lastBracketExp
        : expDesc;

    const next = this._createChildInstance();
    // actually expDesc is the last element of the array
    // it's equivalent to expressionParts[expressionParts.length - 1]
    realExpDesc.next = {
      bindedBy,
      followedBy: next
    };

    this._nextRef = realExpDesc.next;
    return next;
  }

  private _createChildInstance(
    expDesc?: ExpressionDescription<TIn, TOut, TContext>
  ): SlimExpression<any> {
    const next = new SlimExpression<TIn, TContext, TOut>();
    // next benefits of almost all props of 'this' since
    // there are parsed in the same section () => <section1> && <section2(next)>
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
