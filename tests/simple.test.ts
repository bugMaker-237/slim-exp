import { Expression } from '../src/expression';

interface PseudoModel {
  name: string;
  matricule: string;
}

describe('Simple expression passes', () => {
  it('should have propertyName', () => {
    // Arrange
    const exp = new Expression<PseudoModel>((n) => n.name);

    // Act
    exp.compile();

    // Assert
    expect(exp.leftHandSide.propertyName).toBe('name');
  });
  it('should have suffix operator `Exclamation mark`', () => {
    // Arrange
    const exp = new Expression<PseudoModel>((n) => !n.matricule);

    // Act
    exp.compile();

    // Assert
    expect(exp.leftHandSide.suffixOperator).toBe('!');
  });

  it('should have suffix operator `Exclamation mark` (doubled)', () => {
    // Arrange
    const exp = new Expression<PseudoModel>((n) => !!n.name);

    // Act
    exp.compile();

    // Assert
    expect(exp.leftHandSide.suffixOperator).toBe('!!');
  });
});
