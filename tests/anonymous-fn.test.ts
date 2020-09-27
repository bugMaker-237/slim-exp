import { ComparisonOperators } from '../src/constants';
import { SlimExpression } from '../src/expression';
import { RESULT3, RESULT0 } from './RESULT';

interface PseudoModel {
  name: string;
  matricule: string;
  isFool: boolean;
}
describe('Anonymous function expression passes', () => {
  it('should have propertyName', () => {
    // Arrange
    const exp = new SlimExpression<PseudoModel>(function (n) {
      return n.name;
    });

    // Act
    exp.compile();

    // Assert
    expect(exp.leftHandSide.propertyName).toBe('name');
  });

  it('should have operator greater than', () => {
    // Arrange
    const exp = new SlimExpression<PseudoModel>();

    // Act
    exp.fromAction(
      function (n, $) {
        return n.name > $.hello;
      },
      { hello: 'world' }
    );
    exp.compile();

    // Assert
    expect(exp.operator).toBe(ComparisonOperators.GREATER_THAN);
  });

  it('should have logical operator binding', () => {
    // Arrange
    const exp = new SlimExpression<PseudoModel>();

    // Act
    exp.fromAction(
      function (n, $) {
        return n.name === $.hello && n.matricule > $.code.is;
      },
      {
        hello: 'world',
        code: { is: 'dope' }
      }
    );
    exp.compile();

    // Assert
    expect(exp.next.bindedBy).toBe('&&');
  });

  it('should be binded by && at first level then by || at next level', () => {
    // Arrange
    const exp = new SlimExpression<PseudoModel>(function (n) {
      return (n.name && n.matricule) || n.isFool;
    });

    // Act
    exp.compile();

    // Assert
    expect(exp.brackets).toBeDefined();
    expect(exp.brackets.openingExp.leftHandSide.propertyName).toEqual('name');
    expect(exp.brackets.openingExp.next.bindedBy).toBe('&&');
    expect(
      exp.brackets.openingExp.next.followedBy.leftHandSide.propertyName
    ).toEqual('matricule');
    expect(exp.brackets.openingExp.next.followedBy.next).toBeUndefined();
    expect(exp.next.bindedBy).toBe('||');
    expect(exp.next.followedBy).toBeDefined();
    expect(exp.next.followedBy.leftHandSide.propertyName).toEqual('isFool');
  });

  it('should handle the brackets seemlessly 3', () => {
    // Arrange
    const exp = new SlimExpression<any>();

    // Act
    // This will fail if your IDE wrap this return into (...) paranthesis.
    // Mine does.  In production using tools like webpack this es5 syntax 
    // will be fine... I think...
    exp.fromAction(function (p) {
      return (p.firstname.startsWith('Bugg') && p.lastname.includes('aker')) ||
        (p.IDNumber > 850000 &&
          (p.whatIf === true || !p.whatYouthink) &&
          p.helloMundo < 'thisOne')
        ;
    });
    exp.compile();

    // Assert
    expect(exp.toString()).toEqual(JSON.stringify(RESULT3, null, 2));
  });
  it('should be an amazing description of the expression', () => {
    // Arrange
    const exp = new SlimExpression<PseudoModel>();

    // Act
    exp.fromAction(
      function (n, $) {
        return (n.name.includes('hello') && n.isFool) ||
          (n.matricule !== 'mat22' &&
            n.name.startsWith($.name) &&
            n.complexValues.filter(function (c) {
              return c.complexity.made.simple.map(function (s) {
                return s.and.straightTo.the.point !== $.value;
              });
            }))
          ;
      },
      {
        name: '10x Dev',
        value: 82,
        obj: { the: {} }
      }
    );
    exp.compile();

    // Assert
    expect(exp.toString()).toEqual(JSON.stringify(RESULT0, null, 2));
  });
});
