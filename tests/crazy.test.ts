import { SlimExpression } from '../src/expression';
import { RESULT0, RESULT1, RESULT2, RESULT3, RESULT4 } from './RESULT';

interface PseudoModel {
  name: string;
  matricule: string;
  values: string[];
  complexValues: {
    complexity: {
      made: { simple: { and: { straightTo: { the: { point } } } }[] };
    };
  }[];
  isFool: boolean;
}

describe('Method expression passes', () => {
  it('should be an amazing description of the expression', () => {
    // Arrange
    const exp = new SlimExpression<PseudoModel>();

    // Act
    exp.fromAction(
      (n, $) =>
        (n.name.includes('hello') && n.isFool) ||
        (n.matricule !== 'mat22' &&
          n.name.startsWith($.name) &&
          n.complexValues.filter((c) =>
            c.complexity.made.simple.map(
              (s) => s.and.straightTo.the.point !== $.value
            )
          )),
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
  it('should handle the brackets seemlessly 1', () => {
    // Arrange
    const exp = new SlimExpression<any>();

    // Act
    exp.fromAction(
      (p) =>
        (p.firstname.startsWith('Bugg') && p.lastname.includes('aker')) ||
        p.IDNumber > 850000
    );
    exp.compile();

    // Assert
    expect(exp.toString()).toEqual(JSON.stringify(RESULT1, null, 2));
  });

  it('should handle the brackets seemlessly 2', () => {
    // Arrange
    const exp = new SlimExpression<any>();

    // Act
    exp.fromAction(
      (p) =>
        (p.firstname.startsWith('Bugg') && p.lastname.includes('aker')) ||
        (p.IDNumber > 850000 && (p.whatIf === true || !p.whatYouthink))
    );
    exp.compile();

    // Assert
    expect(exp.toString()).toEqual(JSON.stringify(RESULT2, null, 2));
  });

  it('should handle the brackets seemlessly 3', () => {
    // Arrange
    const exp = new SlimExpression<any>();

    // Act
    exp.fromAction(
      (p) =>
        (p.firstname.startsWith('Bugg') && p.lastname.includes('aker')) ||
        (p.IDNumber > 850000 &&
          (p.whatIf === true || !p.whatYouthink) &&
          p.helloMundo < 'thisOne')
    );
    exp.compile();

    // Assert
    expect(exp.toString()).toEqual(JSON.stringify(RESULT3, null, 2));
  });

  it('should handle the brackets seemlessly 4', () => {
    // Arrange
    const $ = {
      name: 'um'
    };
    const exp = new SlimExpression<any, any>();
    // Act
    exp.fromAction((a, _) => a.email.endsWith(_.name) || (a.name.includes(_.name) && a.id > 45), $);
    exp.compile();

    // Assert
    expect(exp.toString()).toEqual(JSON.stringify(RESULT4, null, 2));
  });
});
