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

export const LogicalOperators = {
  ALL: ['&&', '||'],
  AND: '&&',
  OR: '||'
};
export const RegExEscapedComparisonOperators = /(\=\=\=?|\>\=?|\<\=?|\!\=\=?)(?<!(\=\>))(?<!(\=\<))/;
export const RegExEscapedLogicalOperators = /(\&\&|\|\|)/;
export const RegExInnerFunction = /((?<=\().*(?=\)))+/g;
