import { ValueTypes } from './constants';
export type ExpressionResult = object | string | number | boolean;

export type SlimExpressionFunction<
  T,
  S extends ExpressionResult = any,
  C extends object = any
> = (obj: T, $?: C) => S;

export interface ISlimExpression<
  T,
  S extends ExpressionResult = any,
  C extends object = any
> {
  compile(): void;
  fromAction<TContext extends C>(
    fn: SlimExpressionFunction<T, S, TContext>,
    context: TContext | null,
    throwIfContextIsNull: boolean
  ): void;
  fn: SlimExpressionFunction<T, S, C>;
  context: C;
  rightHandSide: ExpressionRightHandSide;
  leftHandSide: ExpressionLeftHandSide;
  operator: string;
  next: NextExpression<T, S, C>;
}

interface Invokable {
  isMethod?: boolean;
  content?: {
    type: string;
    methodName?: string;
    primitiveValue?: string | number;
    isExpression?: boolean;
    expression?: ISlimExpression<any>;
  };
}
export interface ExpressionRightHandSide {
  propertyType: string;
  propertyName: string;
  propertyValue: any;
}

export interface ExpressionLeftHandSide extends Invokable {
  suffixOperator: string;
  propertyName: string;
  propertyTree?: string[];
}

export interface NextExpression<
  TIn,
  TOut extends ExpressionResult = any,
  TContext extends object = any
> {
  bindedBy: string;
  followedBy: ISlimExpression<TIn, TOut, TContext>;
}

export interface ExpressionDescription<
  TIn,
  TOut extends ExpressionResult = any,
  TContext extends object = any
> {
  operator: string;
  rightHandSide: ExpressionRightHandSide;
  leftHandSide: ExpressionLeftHandSide;
  next: NextExpression<TIn, TOut, TContext>;
}
export interface IParsingResult {
  parsed: boolean;
  value?: any;
  type?: string;
}
