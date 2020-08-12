import { Expression } from '../src/expression';
import { ExpressionParserException } from '../src/expression-exception';
import { ComparisonOperators } from '../src/constants';

interface PseudoModel {
  name: string;
  matricule: string;
  isFool: boolean;
}

describe('Comparison & logical expression passes', () => {
  it('should have lefthandside, righthandside, operator and next expression', () => {
    // Arrange
    const exp = new Expression<PseudoModel>();

    // Act
    exp.fromAction((n, $) => n.name === $.hello && n.matricule > $.code.is, {
      hello: 'world',
      code: { is: 'dope' }
    });
    exp.compile();

    // Assert
    expect(exp.leftHandSide).toBeDefined();
    expect(exp.rightHandSide).toBeDefined();
    expect(exp.operator).toBeDefined();
    expect(exp.next).toBeDefined();
  });

  it('should have righthandside.propertyName of initial expression equal', () => {
    // Arrange
    const exp = new Expression<PseudoModel>();

    // Act
    exp.fromAction((n, $) => n.name === $.hello && n.matricule > $.code.is, {
      hello: 'world',
      code: { is: 'dope' }
    });
    exp.compile();

    // Assert
    expect(exp.rightHandSide.propertyName).toBe('hello');
    expect(exp.rightHandSide.propertyValue).toBe('world');
  });

  it('should have righthandside.propertyName of next expression equal', () => {
    // Arrange
    const exp = new Expression<PseudoModel>();

    // Act
    exp.fromAction((n, $) => n.name === $.hello && n.matricule > $.code.is, {
      hello: 'world',
      code: { is: 'dope' }
    });
    exp.compile();

    // Assert
    expect(exp.next.followedBy.rightHandSide.propertyName).toBe('code.is');
    expect(exp.next.followedBy.rightHandSide.propertyValue).toBe('dope');
  });

  it('should have logical operator binding', () => {
    // Arrange
    const exp = new Expression<PseudoModel>();

    // Act
    exp.fromAction((n, $) => n.name === $.hello && n.matricule > $.code.is, {
      hello: 'world',
      code: { is: 'dope' }
    });
    exp.compile();

    // Assert
    expect(exp.next.bindedBy).toBe('&&');
  });
});
