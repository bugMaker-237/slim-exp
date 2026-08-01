export type ExpressionErrorCode =
  | 'FUNCTION_NOT_SET'
  | 'INVALID_ARROW_FUNCTION'
  | 'INVALID_LEGACY_FUNCTION'
  | 'CONTEXT_REQUIRED'
  | 'CONTEXT_PROPERTY_NOT_FOUND'
  | 'INVALID_EXPRESSION_ROOT'
  | 'UNSUPPORTED_UNARY_OPERATOR'
  | 'UNSUPPORTED_METHOD_ARGUMENT'
  | 'UNSUPPORTED_RIGHT_HAND_SIDE'
  | 'PARSE_ERROR';

export class SlimExpressionParserException extends Error {
  constructor(
    message: string,
    public readonly code: ExpressionErrorCode = 'PARSE_ERROR'
  ) {
    super(message);
    this.name = 'SlimExpressionParserException';
  }
}
