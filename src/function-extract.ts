export interface ExtractedFunctionContent {
  expressionContent: string;
  isLegacyFunc: boolean;
  expObj: string;
  ctxName: string;
}

function stripWrappingParentheses(input: string): string {
  const value = input.trim();
  if (!value.startsWith('(') || !value.endsWith(')')) return value;

  let depth = 0;
  for (let i = 0; i < value.length; i++) {
    const ch = value[i];
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (depth === 0 && i < value.length - 1) return value;
  }
  return value.slice(1, -1).trim();
}

function extractParams(paramsRaw: string): string[] {
  return stripWrappingParentheses(paramsRaw)
    .split(',')
    .map((v) => v.trim())
    .filter((v) => !!v);
}

function extractLegacyReturnExpression(body: string): string {
  const trimmed = body.trim();
  if (!trimmed.startsWith('return')) return trimmed.replace(/;$/, '').trim();
  return trimmed
    .slice('return'.length)
    .trim()
    .replace(/;$/, '')
    .trim();
}

function extractArrowBody(bodyRaw: string): string {
  const trimmed = bodyRaw.trim();
  if (!(trimmed.startsWith('{') && trimmed.endsWith('}'))) return trimmed;
  const inner = trimmed.slice(1, -1).trim();
  return extractLegacyReturnExpression(inner);
}

function findArrowIndex(source: string): number {
  let parenDepth = 0;
  let braceDepth = 0;
  let quote: '"' | "'" | null = null;

  for (let i = 0; i < source.length - 1; i++) {
    const ch = source[i];
    const next = source[i + 1];

    if (quote) {
      if (ch === '\\') {
        i++;
        continue;
      }
      if (ch === quote) quote = null;
      continue;
    }

    if (ch === '"' || ch === "'") {
      quote = ch;
      continue;
    }
    if (ch === '(') parenDepth++;
    if (ch === ')') parenDepth--;
    if (ch === '{') braceDepth++;
    if (ch === '}') braceDepth--;
    if (ch === '=' && next === '>' && parenDepth === 0 && braceDepth === 0) {
      return i;
    }
  }
  return -1;
}

export function extractFunctionContent(
  fnAsString: string,
  providedContextName?: string
): ExtractedFunctionContent {
  const source = fnAsString.trim();
  if (!source) throw new Error('Expression function is not set');

  if (source.startsWith('function')) {
    const startParams = source.indexOf('(');
    const endParams = source.indexOf(')');
    const startBody = source.indexOf('{');
    const endBody = source.lastIndexOf('}');
    if (startParams < 0 || endParams < 0 || startBody < 0 || endBody < 0) {
      throw new Error('Invalid legacy function expression');
    }

    const legacyParams = extractParams(source.slice(startParams, endParams + 1));
    const legacyBody = source.slice(startBody + 1, endBody);
    return {
      expressionContent: extractLegacyReturnExpression(legacyBody),
      isLegacyFunc: true,
      expObj: legacyParams[0],
      ctxName: providedContextName || legacyParams[1]
    };
  }

  const arrowIndex = findArrowIndex(source);
  if (arrowIndex < 0) throw new Error('Invalid arrow function expression');

  const arrowParams = extractParams(source.slice(0, arrowIndex));
  const arrowBody = source.slice(arrowIndex + 2);
  return {
    expressionContent: extractArrowBody(arrowBody),
    isLegacyFunc: false,
    expObj: arrowParams[0],
    ctxName: providedContextName || arrowParams[1]
  };
}
