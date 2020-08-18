import { SlimExpression } from '../src/expression';
import { ComparisonOperators } from '../src/constants';

interface PseudoModel {
  name: string;
  num: number;
  matricule: string;
  isFool: boolean;
}

describe('Comparison expression passes', () => {
  it('should have lefthandside, righthandside and operator', () => {
    // Arrange
    const exp = new SlimExpression<PseudoModel>();

    // Act
    exp.fromAction((n, $) => n.name === $.hello, { hello: 'world' });
    exp.compile();

    // Assert
    expect(exp.leftHandSide).toBeDefined();
    expect(exp.rightHandSide).toBeDefined();
    expect(exp.operator).toBeDefined();
  });

  it('should set rightHandSide string constant', () => {
    // Arrange
    const exp = new SlimExpression<PseudoModel>((n) => n.name > 'hello');

    // Act && Assert
    exp.compile();

    // Assert
    expect(exp.rightHandSide).toBeDefined();
    expect(exp.rightHandSide.propertyName).toBe('[CONSTANT]');
    expect(exp.rightHandSide.propertyValue).toBe('hello');
    expect(exp.rightHandSide.propertyType).toBe('string');
  });

  it('should set rightHandSide number constant', () => {
    // Arrange
    const exp = new SlimExpression<PseudoModel>((n) => n.num > 25);

    // Act && Assert
    exp.compile();

    // Assert
    expect(exp.rightHandSide).toBeDefined();
    expect(exp.rightHandSide.propertyName).toBe('[CONSTANT]');
    expect(exp.rightHandSide.propertyValue).toBe(25);
    expect(exp.rightHandSide.propertyType).toBe('number');
  });

  it('should have righthandside.propertyName equal', () => {
    // Arrange
    const exp = new SlimExpression<PseudoModel>();

    // Act
    exp.fromAction((n, $) => n.name === $.hello, { hello: 'world' });
    exp.compile();

    // Assert
    expect(exp.rightHandSide.propertyName).toBe('hello');
    expect(exp.rightHandSide.propertyValue).toBe('world');
  });

  it('should have operator strictly equal', () => {
    // Arrange
    const exp = new SlimExpression<PseudoModel>();

    // Act
    exp.fromAction((n, $) => n.name === $.hello, { hello: 'world' });
    exp.compile();

    // Assert
    expect(exp.operator).toBe(ComparisonOperators.STRICTLY_EQUAL_TO);
  });

  it('should have operator greater than', () => {
    // Arrange
    const exp = new SlimExpression<PseudoModel>();

    // Act
    exp.fromAction((n, $) => n.name > $.hello, { hello: 'world' });
    exp.compile();

    // Assert
    expect(exp.operator).toBe(ComparisonOperators.GREATER_THAN);
  });

  it('should have propertyvalue with undefined value', () => {
    // Arrange
    const exp = new SlimExpression<PseudoModel>();
    const t = {} as any;
    // Act
    exp.fromAction((n) => n.name === t.name, null, false);
    exp.compile();

    // Assert
    expect(exp.rightHandSide.propertyName).toBe('name');
    expect(exp.rightHandSide.propertyValue).toBe(undefined);
  });
});
