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
  /**
   * Compiles the expression into an object tree
   */
  compile(): void;
  /**
   * Save the actions and actions params
   * @param fn The expression function
   * @param context The context object containing values to be parsed in the expression
   * @param throwIfContextIsNull Value indicating whether exception must be thrown in case context is null
   */
  fromAction<TContext extends C = any>(
    fn: SlimExpressionFunction<T, S, TContext>,
    context: TContext | null,
    throwIfContextIsNull: boolean
  ): void;
  // fn: SlimExpressionFunction<T, S, C>;

  /**
   * The context object containing the values to be parsed in the expression
   */
  context: C;

  /**
   * The expression object property name
   */
  expObjectName: string;

  /**
   * The context name
   */
  contextName: string;

  /**
   * Compiled right handside of the expression
   */
  rightHandSide: ExpressionRightHandSide;

  /**
   * Compiled left handside of the expression 
   */
  leftHandSide: ExpressionLeftHandSide;

  /**
   * Bracket group
   */
  brackets: ExpressionBrackets;

  /**
   * The operator used between the 2 sides (Left hand side & Right hand side), if any
   */
  operator: string;

  /**
   * The Expression following this one, which is bounded by logical operator 
   */
  next: NextExpression<T, S, C>;

  /**
   * A hash string identifying this expression uniquely
   */
  hash: string;

  /**
   * A stringified version of the object
   */
  toString(): string;
}

/**
 * Invokable (method-like) expression side
 */
interface Invokable {
  /**
   * Value indication wether the callable expression side is a method
   */
  isMethod?: boolean;
  /**
   * The content description of the invokable 
   */
  content?: {
    /**
     * The type of the invokable method content.
     * This can be any primitive type (number, string, date) or the type 'expression'
     */
    type: string;
    /**
     * The name of the invokable method
     */
    methodName?: string;
    /**
     * The compiled primitive value, if any, of the invokable method content 
     */
    primitiveValue?: string | number;
    /**
     * Value indication whether the invokable method content is another expression
     */
    isExpression?: boolean;
    /**
     * The invokable method content expression if any
     */
    expression?: ISlimExpression<any>;
  };
}
/**
 * The Right Hand Side (RHS) of the expression
 */
export interface ExpressionRightHandSide {
  /**
   * The context name used for this expression RHS
   */
  implicitContextName: string;
  /**
   * The RHS property type
   */
  propertyType: string;
  /**
   * The RHS property name or '[CONSTANT]' if value is a contsant
   */
  propertyName: string;
  /**
   * The RHS property compiled value
   */
  propertyValue: any;
}

/**
 * The Left Hand Side (LHS) of the expression
 */
export interface ExpressionLeftHandSide extends Invokable {
  /**
   * The suffix operator (! or !!) if any
   */
  suffixOperator: string;
  /**
   * The LHS property name
   */
  propertyName: string;
  /**
   * The LHS property calling tree
   * @example ['person', 'name', 'firstName']
   */
  propertyTree?: string[];
}

/**
 * The following expression
 */
export interface NextExpression<
  TIn,
  TOut extends ExpressionResult = any,
  TContext extends object = any
  > {
  /**
   * The logical operator binding both expressions
   */
  bindedBy: string;
  /**
   * The following expressions
   */
  followedBy: ISlimExpression<TIn, TOut, TContext>;
}

/**
 * The expression bracket group
 */
export interface ExpressionBrackets {
  /**
   * The expression at the opening bracket position 
   * i.e the first expression in the bracket group
   */
  openingExp?: ISlimExpression<any>;
  /**
   * The expression at the closing bracket position
   * i.e the last expression in the bracket group
   */
  closingExp?: ISlimExpression<any>;
}


export interface ExpressionDescription<
  TIn,
  TOut extends ExpressionResult = any,
  TContext extends object = any
  > {
  brackets: ExpressionBrackets;
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
