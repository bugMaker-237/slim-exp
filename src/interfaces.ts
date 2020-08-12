export type ExpressionResult = object | string | number | boolean;
export type ExpressionContextFunction = {
  like(obj: string, expValue: string): void;
};
export type ExpressionFunction<
  T,
  S extends ExpressionResult = any,
  C extends object = any
> = (obj: T, $?: C) => S;

export interface IExpression<
  T,
  S extends ExpressionResult = any,
  C extends object = any
> {
  compile(): void;
  fromAction<TContext extends C>(
    fn: ExpressionFunction<T, S, TContext>,
    context: TContext | null
  ): void;
  fn: ExpressionFunction<T, S, C>;
  context: C;
  rightHandSide: ExpressionRightHandSide;
  leftHandSide: ExpressionLeftHandSide;
  operator: string;
  next: NextExpression;
}

interface Invokable {
  isMethod?: boolean;
  content?: {
    type: string;
    methodName?: string;
    primitiveValue?: string | number;
    isExpression?: boolean;
    expression?: IExpression<any>;
  };
}
export interface ExpressionRightHandSide extends Invokable {
  propertyType: string;
  propertyName: string;
  propertyValue: any;
}

export interface ExpressionLeftHandSide extends Invokable {
  suffixOperator: string;
  propertyName: string;
  propertyTree?: string[];
}

export interface NextExpression {
  bindedBy: string;
  followedBy: ExpressionDescription;
}

export interface ExpressionDescription {
  operator: string;
  rightHandSide: ExpressionRightHandSide;
  leftHandSide: ExpressionLeftHandSide;
  next: NextExpression;
}
export interface IParsingResult {
  parsed: boolean;
  value?: any;
  type?: string;
}
