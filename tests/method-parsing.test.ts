import { SlimExpression } from '../src/expression';
import { ExpressionParserException } from '../src/expression-exception';
import { ComparisonOperators } from '../src/constants';

interface PseudoModel {
  name: string;
  matricule: string;
  values: string[];
  complexValues: { complexity: { made: { simple: number } } }[];
  isFool: boolean;
}

describe('Method expression passes', () => {
  it('should have lefthandside with method content', () => {
    // Arrange
    const exp = new SlimExpression<PseudoModel>((n) =>
      n.name.includes('hello')
    );

    // Act
    exp.compile();

    // Assert
    expect(exp.leftHandSide).toBeDefined();
    expect(exp.leftHandSide.propertyName).toBe('name.includes');
    expect(exp.leftHandSide.isMethod).toBeTruthy();
    expect(exp.leftHandSide.content.methodName).toBe('includes');
    expect(exp.leftHandSide.content.primitiveValue).toBe('hello');
  });

  it('should have lefthandside with method content and context value', () => {
    // Arrange
    const exp = new SlimExpression<PseudoModel>();

    // Act
    exp.fromAction((n, $) => n.name.includes($.hello), { hello: 'mundo' });
    exp.compile();

    // Assert
    expect(exp.leftHandSide).toBeDefined();
    expect(exp.leftHandSide.propertyName).toBe('name.includes');
    expect(exp.leftHandSide.isMethod).toBeTruthy();
    expect(exp.leftHandSide.content.methodName).toBe('includes');
    expect(exp.leftHandSide.content.primitiveValue).toBe('mundo');
  });

  it('should have lefthandside with method content and expression value', () => {
    // Arrange
    const exp = new SlimExpression<PseudoModel>((n) => n.values.map((v) => v));

    // Act
    exp.compile();

    // Assert
    expect(exp.leftHandSide).toBeDefined();
    expect(exp.leftHandSide.propertyName).toBe('values.map');
    expect(exp.leftHandSide.isMethod).toBeTruthy();
    expect(exp.leftHandSide.content.methodName).toBe('map');
    expect(exp.leftHandSide.content.isExpression).toBeTruthy();
    expect(exp.leftHandSide.content.expression.fn.toString()).toBe('(v) => v');
  });

  it('should have lefthandside with method content and expression value (more complex)', () => {
    // Arrange
    const exp = new SlimExpression<PseudoModel>((n) =>
      n.complexValues.map((v) => v.complexity.made.simple)
    );

    // Act
    exp.compile();

    // Assert
    expect(exp.leftHandSide).toBeDefined();
    expect(exp.leftHandSide.propertyName).toBe('complexValues.map');
    expect(exp.leftHandSide.isMethod).toBeTruthy();
    expect(exp.leftHandSide.content.methodName).toBe('map');
    expect(exp.leftHandSide.content.isExpression).toBeTruthy();
    expect(exp.leftHandSide.content.expression.fn.toString()).toBe(
      '(v) => v.complexity.made.simple'
    );
  });

  it('should have lefthandside with method content, expression value and context value', () => {
    // Arrange
    const exp = new SlimExpression<PseudoModel>();

    // Act
    exp.fromAction(
      (n, $) =>
        n.complexValues.map((v) => v.complexity.made.simple === $.complexValue),
      {
        complexValue: 45
      }
    );
    exp.compile();

    // Assert
    expect(exp.leftHandSide).toBeDefined();
    expect(exp.leftHandSide.propertyName).toBe('complexValues.map');
    expect(exp.leftHandSide.isMethod).toBeTruthy();
    expect(exp.leftHandSide.content.methodName).toBe('map');
    expect(exp.leftHandSide.content.isExpression).toBeTruthy();
    expect(exp.leftHandSide.content.expression.rightHandSide.propertyName).toBe(
      'complexValue'
    );
    expect(
      exp.leftHandSide.content.expression.rightHandSide.propertyValue
    ).toBe(45);
  });
});
