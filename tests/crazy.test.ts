import { SlimExpression } from '../src/expression';

const RESULT = {
  _expDesc: {
    leftHandSide: {
      propertyName: 'name.includes',
      suffixOperator: '',
      isMethod: true,
      content: {
        type: 'string',
        primitiveValue: 'hello',
        methodName: 'includes'
      },
      propertyTree: ['name', 'includes']
    },
    next: {
      bindedBy: '&&',
      followedBy: {
        leftHandSide: {
          propertyName: 'isFool',
          suffixOperator: '',
          propertyTree: ['isFool']
        },
        next: {
          bindedBy: '||',
          followedBy: {
            leftHandSide: {
              propertyName: 'matricule',
              suffixOperator: '',
              propertyTree: ['matricule']
            },
            operator: '!==',
            rightHandSide: {
              propertyType: 'string',
              propertyName: '[CONSTANT]',
              propertyValue: 'mat22'
            },
            next: {
              bindedBy: '&&',
              followedBy: {
                leftHandSide: {
                  propertyName: 'name.startsWith',
                  suffixOperator: '',
                  isMethod: true,
                  content: {
                    type: 'string',
                    primitiveValue: '10x Dev',
                    methodName: 'startsWith'
                  },
                  propertyTree: ['name', 'startsWith']
                },
                next: {
                  bindedBy: '&&',
                  followedBy: {
                    leftHandSide: {
                      propertyName: 'complexValues.filter',
                      suffixOperator: '',
                      isMethod: true,
                      content: {
                        type: 'expression',
                        isExpression: true,
                        expression: {
                          _expDesc: {
                            leftHandSide: {
                              propertyName: 'complexity.made.simple.map',
                              suffixOperator: '',
                              isMethod: true,
                              content: {
                                type: 'expression',
                                isExpression: true,
                                expression: {
                                  _expDesc: {
                                    leftHandSide: {
                                      propertyName: 'and.straightTo.the.point',
                                      suffixOperator: '',
                                      propertyTree: [
                                        'and',
                                        'straightTo',
                                        'the',
                                        'point'
                                      ]
                                    },
                                    operator: '!==',
                                    rightHandSide: {
                                      propertyType: 'number',
                                      propertyName: 'value',
                                      propertyValue: 82
                                    }
                                  },
                                  context: {
                                    name: '10x Dev',
                                    value: 82
                                  }
                                },
                                methodName: 'map'
                              },
                              propertyTree: [
                                'complexity',
                                'made',
                                'simple',
                                'map'
                              ]
                            }
                          },
                          context: {
                            name: '10x Dev',
                            value: 82
                          }
                        },
                        methodName: 'filter'
                      },
                      propertyTree: ['complexValues', 'filter']
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  context: {
    name: '10x Dev',
    value: 82
  }
};
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
        value: 82
      }
    );
    exp.compile();

    // Assert
    expect(exp).toMatchObject(RESULT);
  });
});
