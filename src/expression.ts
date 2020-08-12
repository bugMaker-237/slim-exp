import {
  ExpressionFunction,
  ExpressionDescription,
  ExpressionRightHandSide,
  ExpressionLeftHandSide,
  NextExpression,
  ExpressionResult,
  ExpressionContextFunction,
  IParsingResult,
  IExpression
} from './interfaces';
import {
  ComparisonOperators,
  RegExEscapedLogicalOperators,
  RegExEscapedComparisonOperators,
  RegExInnerFunction
} from './constants';
import { ExpressionParserException } from './expression-exception';

export class Expression<
  TIn,
  TContext extends object = any,
  TOut extends ExpressionResult = any
> implements IExpression<TIn, TOut, TContext> {
  private _expDesc: ExpressionDescription;
  fn: ExpressionFunction<TIn, TOut, any>;
  context: TContext | null;

  public get rightHandSide(): ExpressionRightHandSide {
    return this._expDesc?.rightHandSide;
  }

  public get leftHandSide(): ExpressionLeftHandSide {
    return this._expDesc?.leftHandSide;
  }

  public get operator(): string {
    return this._expDesc?.operator;
  }

  public get next(): NextExpression {
    return this._expDesc?.next;
  }

  constructor();
  constructor(fn: ExpressionFunction<TIn, TOut>);
  constructor(fn?: ExpressionFunction<TIn, TOut>) {
    this.fn = fn;
    this._expDesc = {} as any;
  }

  public fromAction<C extends TContext>(
    fn: ExpressionFunction<TIn, TOut, C>,
    context: C | null = null
  ) {
    this.fn = fn;
    this.context = context;
  }

  public compile() {
    this._compileInner();
  }

  private _compileInner(ctxName?: string) {
    // removing all line returns
    const fnStr = this.fn
      .toString()
      .split(/\r\n/)
      .join('')
      .split(/\r/)
      .join('')
      .split(/\n/)
      .join('')
      .trim();

    if (fnStr.startsWith('function'))
      throw new ExpressionParserException(
        'Only arrow functions are allowed. Make sure you have set your minimum target to ES2017 in tsconfig.json'
      );

    const expObj = (
      fnStr.substring(0, fnStr.indexOf(',')) ||
      fnStr.substring(0, fnStr.indexOf('='))
    )
      .replace('(', '')
      .replace(')', '')
      .trim();

    if (fnStr.indexOf(',') > -1)
      ctxName =
        ctxName ||
        fnStr.substring(fnStr.indexOf(',') + 1, fnStr.indexOf(')')).trim();

    const expressionContent = fnStr.substring(fnStr.indexOf('>') + 1).trim();

    const expressionParts: ExpressionDescription[] = [];

    const expStringParts = expressionContent
      .split(RegExEscapedLogicalOperators)
      .filter((v) => !!v);
    const staticReplacer = '@%#';
    let expDesc: ExpressionDescription = {} as any;
    let hasRightHandSide = false;
    for (const s of expStringParts) {
      let x = this._cleanString(s);
      // checking if expression part contains inner functino call
      const expressionMatch = RegExInnerFunction.exec(x);
      const innerValue = expressionMatch ? expressionMatch[0] : undefined;
      x = x.replace(RegExInnerFunction, staticReplacer);
      if (this._isLogicalOperator(x)) {
        const next = {} as any;
        // actually expDesc is the last element of the array
        // it's equivalent to expressionParts[expressionParts.length - 1]
        expDesc.next = {
          bindedBy: x,
          followedBy: next
        };
        expDesc = next;
      } else {
        const comparisonParts = x
          .split(RegExEscapedComparisonOperators)
          // there are some values that are undefined. Thus filtering is necessary
          .filter((v) => !!v);
        for (const p of comparisonParts) {
          let c = this._cleanString(p);
          if (c.includes(staticReplacer)) {
            c = c.replace(staticReplacer, innerValue);
          }
          if (!expDesc.leftHandSide) {
            this._handleLeftHandSide(c, expDesc, expObj, this.context, ctxName);
          } else if (!expDesc.operator) {
            if (!this._isComparisonOperator(c))
              throw new ExpressionParserException(
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
    this._expDesc = expressionParts[0] || expDesc;
  }
  private _cleanString(s: string) {
    const final = s.trim();

    const occurenceCount = (search: RegExp) =>
      (final.match(search) || []).length;

    if (final.startsWith('(') && final.endsWith(')')) {
      if (occurenceCount(/\(/g) > occurenceCount(/\)/g)) {
        return final.replace('(', '');
      } else if (occurenceCount(/\(/g) < occurenceCount(/\)/g)) {
        return final.substring(0, final.lastIndexOf(')'));
      } else {
        return final.substring(1, final.lastIndexOf(')'));
      }
    }

    if (
      final.startsWith('(') &&
      occurenceCount(/\(/g) !== occurenceCount(/\)/g)
    )
      return final.replace('(', '').trim();

    if (final.endsWith(')') && occurenceCount(/\(/g) !== occurenceCount(/\)/g))
      return final.substring(0, final.lastIndexOf(')'));

    return final;
  }

  private _handleLeftHandSide(
    p: string,
    expDesc: ExpressionDescription,
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

    if (!initial) throw new ExpressionParserException('Internal parsing error');

    if (!initial.includes(expObj))
      throw new ExpressionParserException(
        'Expression has to start with type member invocation'
      );

    if (initial[0].trim() !== '!' && !expObj.startsWith(initial[0]))
      throw new ExpressionParserException('Unsupported unary operator');

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
          const exp = new Expression();
          // tslint:disable-next-line: no-eval
          exp.fromAction(eval(content), context);
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
    expDesc: ExpressionDescription,
    context: any,
    ctxName?: string
  ) {
    expDesc.rightHandSide = {
      propertyType: '',
      propertyName: '',
      propertyValue: null
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
  }
  private _extractPropertyValueFromContext(
    p: string,
    context: any,
    ctxName: string
  ): { val: any; finalPropName: any } {
    const deepProps = p.split('.');
    if (context == null)
      throw new ExpressionParserException(
        'ContextData must be managed but context is null or undefined'
      );
    // if (deepProps.length > 2)
    // console.warn(
    //   'It is more expensive to use complex object for context due to deep search of property value in object tree. Consider using simple objects. e.g: {id: myId}'
    // );

    // removing the context accessor ($) from expression
    const ctx = deepProps.shift();

    if (ctxName !== ctx)
      throw new ExpressionParserException(
        "Due to javascript limitations, it's not possible to process information out of context, please attach value to context"
      );

    const finalPropName = deepProps.join('.');
    const propName = deepProps.shift();

    if (!propName)
      throw new ExpressionParserException('Internal parsing error');

    let val = context[propName];

    for (const prop of deepProps) {
      if (val == null) break;

      val = val[prop];
    }

    if (val == null)
      throw new ExpressionParserException(
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
