export type AstLogicalOperator = '&&' | '||';
export type AstComparisonOperator =
  '==' | '===' | '!=' | '!==' | '>' | '>=' | '<' | '<=';
export type AstUnaryOperator = '!';

export interface AstBaseNode {
  kind: string;
  start: number;
  end: number;
}

export interface AstIdentifier extends AstBaseNode {
  kind: 'Identifier';
  name: string;
}

export interface AstLiteral extends AstBaseNode {
  kind: 'Literal';
  value: string | number | boolean | null;
  valueType: 'string' | 'number' | 'boolean' | 'null';
}

export interface AstMemberExpression extends AstBaseNode {
  kind: 'MemberExpression';
  object: AstExpression;
  property: string;
}

export interface AstUnaryExpression extends AstBaseNode {
  kind: 'UnaryExpression';
  operator: AstUnaryOperator;
  argument: AstExpression;
}

export interface AstFunctionExpression extends AstBaseNode {
  kind: 'FunctionExpression';
  source: string;
  /** The AST for the function body, parsed independently of its parameters. */
  compiled: AstExpression;
}

export interface AstCallExpression extends AstBaseNode {
  kind: 'CallExpression';
  callee: AstExpression;
  arguments: AstExpression[];
}

export interface AstBinaryExpression extends AstBaseNode {
  kind: 'BinaryExpression';
  operator: AstLogicalOperator | AstComparisonOperator;
  left: AstExpression;
  right: AstExpression;
}

export interface AstGroupExpression extends AstBaseNode {
  kind: 'GroupExpression';
  expression: AstExpression;
}

export type AstExpression =
  | AstIdentifier
  | AstLiteral
  | AstMemberExpression
  | AstUnaryExpression
  | AstFunctionExpression
  | AstCallExpression
  | AstBinaryExpression
  | AstGroupExpression;
