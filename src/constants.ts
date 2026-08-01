export const ComparisonOperators = {
  ALL: ['==', '===', '>=', '<=', '!=', '!==', '<', '>'],
  EQUAL_TO: '==',
  STRICTLY_EQUAL_TO: '===',
  GREATER_THAN_OR_EQUAL: '>=',
  GREATER_THAN: '>',
  LESS_THAN_OR_EQUAL: '<=',
  LESS_THAN: '<',
  NOT_EQUAL_TO: '!=',
  STRICTLY_NOT_EQUAL_TO: '!=='
};

export const PrimitiveValueTypes = {
  string: 'string',
  date: 'date',
  number: 'number',
  boolean: 'boolean',
  null: 'null',
  undefined: 'undefined'
};

export const ValueTypes = {
  ...PrimitiveValueTypes,
  expression: 'expression',
  object: 'object',
  function: 'function'
};

export const LogicalOperators = {
  ALL: ['&&', '||'],
  AND: '&&',
  OR: '||'
};

/**
 * @deprecated No longer used internally. Will be removed in a future release.
 */
// eslint-disable-next-line no-useless-escape
export const RegExEscapedComparisonOperators = /(\=\=\=?|\>\=?|\<\=?|\!\=\=?)(?<!(\=\>))(?<!(\=\<))/;
/**
 * @deprecated No longer used internally. Will be removed in a future release.
 */
// eslint-disable-next-line no-useless-escape
export const RegExEscapedLogicalOperators = /(\&\&|\|\|)/;
/**
 * @deprecated No longer used internally. Will be removed in a future release.
 */
export const RegExInnerFunction = /((?<=\().*(?=\)))+/g;
/**
 * @deprecated No longer used internally. Will be removed in a future release.
 */
export const RegExLegacyInnerFunction = /(function\s+\((.*)\)\s+\{\s+return\s(.*))(?=\))/g;
