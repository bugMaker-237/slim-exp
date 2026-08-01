import { SlimExpression } from '../src/expression';
import { SlimExpressionParserException } from '../src/expression-exception';
import { PrimitiveValueTypes } from '../src/constants';

interface PseudoModel {
  name: string;
  num: number;
  active: boolean;
  tag: string | null;
}

describe('Edge-case: constant right-hand side types', () => {
  it('should handle boolean true constant as RHS', () => {
    const exp = new SlimExpression<PseudoModel>((n) => n.active === true);
    exp.compile();

    expect(exp.rightHandSide.propertyName).toBe('[CONSTANT]');
    expect(exp.rightHandSide.propertyValue).toBe(true);
    expect(exp.rightHandSide.propertyType).toBe(PrimitiveValueTypes.boolean);
  });

  it('should handle boolean false constant as RHS', () => {
    const exp = new SlimExpression<PseudoModel>((n) => n.active === false);
    exp.compile();

    expect(exp.rightHandSide.propertyName).toBe('[CONSTANT]');
    expect(exp.rightHandSide.propertyValue).toBe(false);
    expect(exp.rightHandSide.propertyType).toBe(PrimitiveValueTypes.boolean);
  });

  it('should handle null literal constant as RHS with type "null"', () => {
    const exp = new SlimExpression<PseudoModel>((n) => n.tag === null);
    exp.compile();

    expect(exp.rightHandSide.propertyName).toBe('[CONSTANT]');
    expect(exp.rightHandSide.propertyValue).toBeNull();
    expect(exp.rightHandSide.propertyType).toBe(PrimitiveValueTypes.null);
  });

  it('should handle negative number constant as RHS', () => {
    const exp = new SlimExpression<PseudoModel>((n) => n.num > 0);
    exp.compile();

    expect(exp.rightHandSide.propertyName).toBe('[CONSTANT]');
    expect(exp.rightHandSide.propertyValue).toBe(0);
    expect(exp.rightHandSide.propertyType).toBe(PrimitiveValueTypes.number);
  });
});

describe('Edge-case: error handling', () => {
  it('should throw SlimExpressionParserException when no function is set', () => {
    const exp = new SlimExpression();
    expect(() => exp.compile()).toThrow(SlimExpressionParserException);
  });

  it('should carry a FUNCTION_NOT_SET code when function is missing', () => {
    const exp = new SlimExpression();
    try {
      exp.compile();
      fail('Expected exception');
    } catch (e) {
      expect(e).toBeInstanceOf(SlimExpressionParserException);
      expect((e as SlimExpressionParserException).code).toBe('FUNCTION_NOT_SET');
    }
  });

  it('should throw SlimExpressionParserException when context is required but null', () => {
    const exp = new SlimExpression<PseudoModel>();
    exp.fromAction((n, $) => n.name === $.hello, null, true);
    expect(() => exp.compile()).toThrow(SlimExpressionParserException);
  });

  it('should carry CONTEXT_REQUIRED code when context is null', () => {
    const exp = new SlimExpression<PseudoModel>();
    exp.fromAction((n, $) => n.name === $.hello, null, true);
    try {
      exp.compile();
      fail('Expected exception');
    } catch (e) {
      expect(e).toBeInstanceOf(SlimExpressionParserException);
      expect((e as SlimExpressionParserException).code).toBe('CONTEXT_REQUIRED');
    }
  });

  it('should not throw when throwIfContextIsNull is false and context is null', () => {
    const exp = new SlimExpression<PseudoModel>();
    exp.fromAction((n, $) => n.name === $.hello, null, false);
    expect(() => exp.compile()).not.toThrow();
    expect(exp.rightHandSide.propertyValue).toBeUndefined();
  });
});

describe('Edge-case: nameOf', () => {
  it('should return multi-level property name', () => {
    const name = SlimExpression.nameOf<PseudoModel>((n) => n.name);
    expect(name).toBe('name');
  });

  it('should return dot-separated path for nested access', () => {
    interface Nested { profile: { firstName: string } }
    const name = SlimExpression.nameOf<Nested>((n) => n.profile.firstName);
    expect(name).toBe('profile.firstName');
  });
});

describe('Edge-case: extractContent', () => {
  it('should extract arrow-function content correctly', () => {
    const result = SlimExpression.extractContent<PseudoModel>(
      (n) => n.name === 'test'
    );
    expect(result.isLegacyFunc).toBe(false);
    expect(result.expressionContent).toContain('===');
    expect(result.expObj).toBe('n');
  });

  it('should extract legacy-function content correctly', () => {
    const result = SlimExpression.extractContent<PseudoModel>(
      function (n) { return n.num > 5; }
    );
    expect(result.isLegacyFunc).toBe(true);
    expect(result.expressionContent).toContain('>');
    expect(result.expObj).toBe('n');
  });
});

describe('Edge-case: compileAst', () => {
  it('should return a valid AST root node', () => {
    const exp = new SlimExpression<PseudoModel>((n) => n.num > 10);
    const ast = exp.compileAst();
    expect(ast).toBeDefined();
    expect(ast.kind).toBe('BinaryExpression');
  });
});
