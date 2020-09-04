import { SlimExpression } from '../src/expression';

interface PseudoModel {
  name: string;
  matricule: string;
  isFool: boolean;
}

describe('logical expression passes', () => {
  it('should have lefthandside and next', () => {
    // Arrange
    const exp = new SlimExpression<PseudoModel>((n) => n.name && n.isFool);

    // Act
    exp.compile();

    // Assert
    expect(exp.leftHandSide).toBeDefined();
    expect(exp.next).toBeDefined();
  });

  it('should be binded by &&', () => {
    // Arrange
    const exp = new SlimExpression<PseudoModel>((n) => n.name && n.isFool);

    // Act
    exp.compile();

    // Assert
    expect(exp.next.bindedBy).toBe('&&');
  });

  it('should be binded by ||', () => {
    // Arrange
    const exp = new SlimExpression<PseudoModel>((n) => n.name || n.isFool);

    // Act
    exp.compile();

    // Assert
    expect(exp.next.bindedBy).toBe('||');
  });

  it('should be binded by && at first level then by || at next level', () => {
    // Arrange
    const exp = new SlimExpression<PseudoModel>(
      (n) => (n.name && n.matricule) || n.isFool
    );

    // Act
    exp.compile();

    // Assert
    expect(exp.brackets).toBeDefined();
    expect(exp.brackets.openingExp.leftHandSide.propertyName).toEqual(
      'name'
    );
    expect(exp.brackets.openingExp.next.bindedBy).toBe('&&');
    expect(
      exp.brackets.openingExp.next.followedBy.leftHandSide.propertyName
    ).toEqual('matricule');
    expect(exp.brackets.openingExp.next.followedBy.next).toBeUndefined();
    expect(exp.next.bindedBy).toBe('||');
    expect(exp.next.followedBy).toBeDefined();
    expect(exp.next.followedBy.leftHandSide.propertyName).toEqual('isFool');
  });
});
