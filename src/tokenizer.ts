export type TokenType =
  | 'identifier'
  | 'number'
  | 'string'
  | 'boolean'
  | 'null'
  | 'operator'
  | 'punctuation'
  | 'eof';

export interface Token {
  type: TokenType;
  value: string;
  start: number;
  end: number;
}

const Operators = [
  '===',
  '!==',
  '==',
  '!=',
  '>=',
  '<=',
  '&&',
  '||',
  '=>',
  '>',
  '<',
  '!'
];
const Punctuations = ['.', '(', ')', ',', '{', '}', ';'];

export function tokenizeExpression(source: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  const push = (type: TokenType, value: string, start: number, end: number) =>
    tokens.push({ type, value, start, end });

  while (i < source.length) {
    const ch = source[i];

    if (/\s/.test(ch)) {
      i++;
      continue;
    }

    if (ch === '"' || ch === "'") {
      const quote = ch;
      const start = i;
      i++;
      let value = '';
      while (i < source.length) {
        const c = source[i];
        if (c === '\\') {
          value += c;
          i++;
          if (i < source.length) {
            value += source[i];
            i++;
          }
          continue;
        }
        if (c === quote) break;
        value += c;
        i++;
      }
      if (i >= source.length || source[i] !== quote) {
        throw new Error(`Unterminated string at position ${start}`);
      }
      i++;
      push('string', value, start, i);
      continue;
    }

    if (/[0-9]/.test(ch)) {
      const start = i;
      i++;
      while (i < source.length && /[0-9.]/.test(source[i])) i++;
      push('number', source.slice(start, i), start, i);
      continue;
    }

    if (/[A-Za-z_$]/.test(ch)) {
      const start = i;
      i++;
      while (i < source.length && /[A-Za-z0-9_$]/.test(source[i])) i++;
      const value = source.slice(start, i);
      if (value === 'true' || value === 'false') {
        push('boolean', value, start, i);
      } else if (value === 'null') {
        push('null', value, start, i);
      } else {
        push('identifier', value, start, i);
      }
      continue;
    }

    const possibleOperator = Operators.find((op) => source.startsWith(op, i));
    if (possibleOperator) {
      const start = i;
      i += possibleOperator.length;
      push('operator', possibleOperator, start, i);
      continue;
    }

    if (Punctuations.includes(ch)) {
      push('punctuation', ch, i, i + 1);
      i++;
      continue;
    }

    throw new Error(`Unexpected token "${ch}" at position ${i}`);
  }

  tokens.push({
    type: 'eof',
    value: '<eof>',
    start: source.length,
    end: source.length
  });
  return tokens;
}
