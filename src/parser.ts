import {
  AstBinaryExpression,
  AstCallExpression,
  AstExpression,
  AstFunctionExpression,
  AstGroupExpression,
  AstIdentifier,
  AstLiteral,
  AstMemberExpression,
  AstUnaryExpression
} from './ast';
import { Token, tokenizeExpression } from './tokenizer';

function createIdentifier(token: Token): AstIdentifier {
  return {
    kind: 'Identifier',
    name: token.value,
    start: token.start,
    end: token.end
  };
}

function createLiteral(token: Token): AstLiteral {
  if (token.type === 'number') {
    return {
      kind: 'Literal',
      value: Number.parseFloat(token.value),
      valueType: 'number',
      start: token.start,
      end: token.end
    };
  }
  if (token.type === 'boolean') {
    return {
      kind: 'Literal',
      value: token.value === 'true',
      valueType: 'boolean',
      start: token.start,
      end: token.end
    };
  }
  if (token.type === 'null') {
    return {
      kind: 'Literal',
      value: null,
      valueType: 'null',
      start: token.start,
      end: token.end
    };
  }
  return {
    kind: 'Literal',
    value: token.value,
    valueType: 'string',
    start: token.start,
    end: token.end
  };
}

export class ExpressionAstParser {
  private readonly _source: string;
  private readonly _tokens: Token[];
  private _index = 0;

  constructor(source: string) {
    this._source = source;
    this._tokens = tokenizeExpression(source);
  }

  parse(): AstExpression {
    const expression = this._parseExpression();
    this._expectType('eof');
    return expression;
  }

  private _parseExpression() {
    return this._parseLogicalOr();
  }

  private _parseLogicalOr() {
    let node = this._parseLogicalAnd();

    while (this._matchOperator('||')) {
      const operator = this._previous();
      const right = this._parseLogicalAnd();
      node = {
        kind: 'BinaryExpression',
        operator: operator.value,
        left: node,
        right,
        start: node.start,
        end: right.end
      } as AstBinaryExpression;
    }
    return node;
  }

  private _parseLogicalAnd() {
    let node = this._parseComparison();

    while (this._matchOperator('&&')) {
      const operator = this._previous();
      const right = this._parseComparison();
      node = {
        kind: 'BinaryExpression',
        operator: operator.value,
        left: node,
        right,
        start: node.start,
        end: right.end
      } as AstBinaryExpression;
    }
    return node;
  }

  private _parseComparison() {
    let node = this._parseUnary();

    while (
      this._matchOperator('===') ||
      this._matchOperator('!==') ||
      this._matchOperator('==') ||
      this._matchOperator('!=') ||
      this._matchOperator('>=') ||
      this._matchOperator('<=') ||
      this._matchOperator('>') ||
      this._matchOperator('<')
    ) {
      const operator = this._previous();
      const right = this._parseUnary();
      node = {
        kind: 'BinaryExpression',
        operator: operator.value,
        left: node,
        right,
        start: node.start,
        end: right.end
      } as AstBinaryExpression;
    }
    return node;
  }

  private _parseUnary(): AstExpression {
    if (this._matchOperator('!')) {
      const operator = this._previous();
      const argument = this._parseUnary();
      return {
        kind: 'UnaryExpression',
        operator: '!',
        argument,
        start: operator.start,
        end: argument.end
      } as AstUnaryExpression;
    }

    return this._parsePostfix();
  }

  private _parsePostfix(): AstExpression {
    let expression = this._parsePrimary();

    while (true) {
      if (this._matchPunctuation('.')) {
        const property = this._expectType('identifier');
        expression = {
          kind: 'MemberExpression',
          object: expression,
          property: property.value,
          start: expression.start,
          end: property.end
        } as AstMemberExpression;
        continue;
      }

      if (this._matchPunctuation('(')) {
        const open = this._previous();
        const args = this._parseCallArguments();
        expression = {
          kind: 'CallExpression',
          callee: expression,
          arguments: args,
          start: expression.start,
          end: this._previous().end || open.end
        } as AstCallExpression;
        continue;
      }
      break;
    }

    return expression;
  }

  private _parseCallArguments(): AstExpression[] {
    const args: AstExpression[] = [];
    if (this._checkPunctuation(')')) {
      this._advance();
      return args;
    }

    const slices = this._collectArgumentTokenSlices();
    for (const slice of slices) {
      const raw = this._source.slice(slice.start, slice.end).trim();
      if (!raw) continue;
      args.push(this._parseArgumentSource(raw, slice.start));
    }

    return args;
  }

  private _collectArgumentTokenSlices(): { start: number; end: number }[] {
    const slices: { start: number; end: number }[] = [];
    let parenDepth = 1;
    let braceDepth = 0;
    let argStart: number | null = null;

    while (!this._isAtEnd()) {
      const token = this._peek();
      if (token.type === 'punctuation') {
        if (token.value === '(') parenDepth++;
        if (token.value === ')') {
          parenDepth--;
          if (parenDepth === 0) {
            const previous = this._previous();
            if (argStart != null) {
              slices.push({ start: argStart, end: previous.end });
            }
            this._advance();
            return slices;
          }
        }
        if (token.value === '{') braceDepth++;
        if (token.value === '}') braceDepth--;
        if (token.value === ',' && parenDepth === 1 && braceDepth === 0) {
          if (argStart != null) {
            slices.push({ start: argStart, end: token.start });
          }
          argStart = null;
          this._advance();
          continue;
        }
      }

      if (argStart == null) argStart = token.start;
      this._advance();
    }

    throw new Error('Unterminated call expression');
  }

  private _parseArgumentSource(raw: string, start: number): AstExpression {
    if (raw.indexOf('=>') > -1 || raw.startsWith('function')) {
      return {
        kind: 'FunctionExpression',
        source: raw,
        start,
        end: start + raw.length
      } as AstFunctionExpression;
    }

    return new ExpressionAstParser(raw).parse();
  }

  private _parsePrimary(): AstExpression {
    const token = this._peek();

    if (token.type === 'identifier') {
      this._advance();
      return createIdentifier(token);
    }

    if (
      token.type === 'number' ||
      token.type === 'string' ||
      token.type === 'boolean' ||
      token.type === 'null'
    ) {
      this._advance();
      return createLiteral(token);
    }

    if (this._matchPunctuation('(')) {
      const open = this._previous();
      const inner = this._parseExpression();
      this._expectPunctuation(')');
      return {
        kind: 'GroupExpression',
        expression: inner,
        start: open.start,
        end: this._previous().end
      } as AstGroupExpression;
    }

    throw new Error(
      `Unexpected token "${token.value}" at position ${token.start}`
    );
  }

  private _matchOperator(op: string) {
    if (this._checkOperator(op)) {
      this._advance();
      return true;
    }
    return false;
  }

  private _checkOperator(op: string) {
    const token = this._peek();
    return token.type === 'operator' && token.value === op;
  }

  private _matchPunctuation(value: string) {
    if (this._checkPunctuation(value)) {
      this._advance();
      return true;
    }
    return false;
  }

  private _checkPunctuation(value: string) {
    const token = this._peek();
    return token.type === 'punctuation' && token.value === value;
  }

  private _expectPunctuation(value: string) {
    if (!this._matchPunctuation(value)) {
      const token = this._peek();
      throw new Error(`Expected "${value}" at position ${token.start}`);
    }
  }

  private _expectType(type: Token['type']) {
    const token = this._peek();
    if (token.type !== type) {
      throw new Error(
        `Expected token type "${type}" at position ${token.start}, found "${token.type}"`
      );
    }
    return this._advance();
  }

  private _advance() {
    if (!this._isAtEnd()) this._index++;
    return this._tokens[this._index - 1];
  }

  private _peek() {
    return this._tokens[this._index];
  }

  private _previous() {
    return this._tokens[this._index - 1];
  }

  private _isAtEnd() {
    return this._peek().type === 'eof';
  }
}

export function parseExpressionAst(source: string): AstExpression {
  return new ExpressionAstParser(source).parse();
}
