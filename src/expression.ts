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
  RegExInnerFunction
} from './constants';
import { SlimExpressionParserException } from './expression-exception';

export class SlimExpression<
  TIn,
  TContext extends object = any,
  TOut extends ExpressionResult = any
> implements ISlimExpression<TIn, TOut, TContext> {
  private _expDesc: ExpressionDescription<TIn, TOut, TContext>;
  fn: SlimExpressionFunction<TIn, TOut, any>;
  context: TContext | null;
  private _throwIfContextIsNull: boolean;
  private _expObj: string;
  private _ctxName: string;
  private _lastBracketExp: ExpressionDescription<any>;
  private _nextRef: NextExpression<any, any, any>;
  private _openedBrackets: ExpressionDescription<any>[] = [];

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

  public get next(): NextExpression<TIn, TOut, TContext> {
    return this._expDesc?.next;
  }

  constructor();
  constructor(fn: SlimExpressionFunction<TIn, TOut>);
  constructor(fn?: SlimExpressionFunction<TIn, TOut>) {
    this.fn = fn;
    this._expDesc = {} as any;
  }

  public fromAction<C extends TContext>(
    fn: SlimExpressionFunction<TIn, TOut, C>,
    context: C | null = null,
    throwIfContextIsNull = true
  ) {
    this.fn = fn;
    this.context = context;
    this._throwIfContextIsNull = throwIfContextIsNull;
  }

  public compile() {
    this._compileInner();
  }

  public static nameOf<TIn = any, TOut extends ExpressionResult = any>(
    fn: SlimExpressionFunction<TIn, TOut>
  ): string {
    const elts = SlimExpression._escapeNewLine(fn.toString())
      .split('=>')[1]
      .split('.');
    elts.shift();
    return elts.join('.');
  }

  private _compileInner(ctxName?: string) {
    // removing all line returns
    let fnStr = SlimExpression._escapeNewLine(this.fn.toString());
    let isLegacyFunc = false;
    if (fnStr.startsWith('function')) {
      fnStr = fnStr
        .replace('return', '')
        // leaving out '{' because i need it as marker to get the content
        .replace('}', '')
        .replace(/;.*/, '')
        .slice(fnStr.indexOf('('));

      // this => "function(x){return x.prop}" is a legacy function
      isLegacyFunc = true;
    }

    const expObj = this._extractExpObj(fnStr, isLegacyFunc);
    this._expObj = expObj;

    if (fnStr.split(')')[0].indexOf(',') > -1)
      ctxName =
        ctxName ||
        fnStr.substring(fnStr.indexOf(',') + 1, fnStr.indexOf(')')).trim();

    this._ctxName = ctxName;
    const expressionContent = fnStr
      .substring(fnStr.indexOf(isLegacyFunc ? '{' : '>') + 1)
      .trim();

    let expressionParts: ExpressionDescription<TIn, TOut, TContext>[] = [];

    const expStringParts = expressionContent
      .split(RegExEscapedLogicalOperators)
      .filter((v) => !!v);
    const staticReplacer = '@%#';
    let expDesc: ExpressionDescription<TIn, TOut, TContext> = {} as any;
    let hasRightHandSide = false;
    for (const s of expStringParts) {
      let x = s.trim();
      if (this._isLogicalOperator(x)) {
        const next = this._initialiseNextValueForExpDesc(expDesc, x);
        expDesc = next._expDesc;
      } else {
        x = this._handleBrackets(s, expDesc);
        // checking if expression part contains inner functino call
        const expressionMatch = RegExInnerFunction.exec(x);
        const innerValue = expressionMatch ? expressionMatch[0] : void 0;
        x = x.replace(RegExInnerFunction, staticReplacer);
        const comparisonParts = x
          .split(RegExEscapedComparisonOperators)
          // there are some values that are undefined. Thus filtering is necessary
          .filter((v) => !!v);
        for (const p of comparisonParts) {
          let c = p.trim();
          if (c.includes(staticReplacer)) {
            c = c.replace(staticReplacer, innerValue);
          }
          if (!expDesc.leftHandSide) {
            this._handleLeftHandSide(c, expDesc, expObj, this.context, ctxName);
          } else if (!expDesc.operator) {
            if (!this._isComparisonOperator(c))
              throw new SlimExpressionParserException(
                'Unsupported comparison operator'
              );
            hasRightHandSide = true;
            expDesc.operator = c;
          } else if (!expDesc.rightHandSide && hasRightHandSide) {
            this._handleRightHandSide(c, expDesc, this.context, ctxName);
          }
        }
        expressionParts.push(expDesc);
      }
    }
    // may have been reinitialiased with a bracket Expression so testing
    // if value already exists
    this._expDesc = this._expDesc.brackets
      ? this._expDesc
      : expressionParts[0] || expDesc;

    expressionParts = void 0;
    this._openedBrackets = void 0;
  }
  private _extractExpObj(fnStr: string, isLegacyFunc = false) {
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

  private static _escapeNewLine(str: string) {
    return str
      .split(/\r\n/)
      .join('')
      .split(/\r/)
      .join('')
      .split(/\n/)
      .join('')
      .trim();
  }

  private _handleBrackets(
    s: string,
    expDesc: ExpressionDescription<TIn, TOut, TContext>
  ) {
    const final = s.trim();
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

      if (!this._lastBracketExp) {
        this._lastBracketExp = this._expDesc = expBrackets;
      } else {
        const last = this._createChildInstance(expBrackets);

        // if (!this._lastBracketExp.next) {
        //   // This implies that new brakets are been opened inside this brackets
        //   // Need to do some expensive work here.
        //   // We need to go up the tree to get the last next value.
        //   let head = this._lastBracketExp.brackets.openingExp;
        //   let next = head.next;
        //   do {
        //     if (next.followedBy.next?.bindedBy) {
        //       next = next.followedBy.next;
        //       head = next.followedBy;
        //     }
        //   } while (next.followedBy.next?.bindedBy);
        //   (head as SlimExpression<any>)._expDesc.next = void 0;
        //   this._lastBracketExp.next = next;
        // }
        this._nextRef.followedBy = last;
        this._lastBracketExp = last._expDesc;
      }
      this._openedBrackets.push(this._lastBracketExp);

      return final.replace(rgxStart, '');
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

      return final.replace(rgxEnd, '');
    } else {
      if (final.startsWith('(') && final.endsWith(')')) {
        const [res] = /^\(+/.exec(final);
        const rgxFull = new RegExp(`^\\){${res.length}}$`);
        return final.replace(/^\(+/, '').replace(rgxFull, '');
      }
    }

    return final;
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
          // tslint:disable-next-line: no-eval
          exp.fromAction(eval(content), context, this._throwIfContextIsNull);
          exp._compileInner(ctxName);
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
    return res.indexOf('=>') > -1;
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

    expDesc.rightHandSide.propertyType = typeof val;
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
    // if (deepProps.length > 2)
    // console.warn(
    //   'It is more expensive to use complex object for context due to deep search of property value in object tree. Consider using simple objects. e.g: {id: myId}'
    // );

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
    if (/^("|').*("|')$/.test(p)) {
      return {
        value: p.substring(1, p.length - 1),
        type: typeof '',
        parsed: true
      };
    }

    return { parsed: false };
  }

  private _isComparisonOperator(op: string) {
    return ComparisonOperators.ALL.includes(op.trim());
  }

  private _isLogicalOperator(op: string) {
    return ['&&', '||'].includes(op.trim());
  }
}
