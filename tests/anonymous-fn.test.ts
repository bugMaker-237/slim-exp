import { ComparisonOperators } from '../src/constants';
import { SlimExpression } from '../src/expression';

interface PseudoModel {
  name: string;
  matricule: string;
  isFool: boolean;
}
const RESULT4 = {
  _expDesc: {
    brackets: {
      openingExp: {
        _openedBrackets: [],
        _expDesc: {
          leftHandSide: {
            propertyName: 'firstname.startsWith',
            suffixOperator: '',
            isMethod: true,
            content: {
              type: 'string',
              primitiveValue: 'Bugg',
              methodName: 'startsWith'
            },
            propertyTree: ['firstname', 'startsWith']
          },
          next: {
            bindedBy: '&&'
          }
        },
        _throwIfContextIsNull: true,
        context: null,
        _expObj: 'p'
      },
      closingExp: {
        _openedBrackets: [],
        _expDesc: {
          leftHandSide: {
            propertyName: 'lastname.includes',
            suffixOperator: '',
            isMethod: true,
            content: {
              type: 'string',
              primitiveValue: 'aker',
              methodName: 'includes'
            },
            propertyTree: ['lastname', 'includes']
          }
        },
        _throwIfContextIsNull: true,
        context: null,
        _expObj: 'p'
      }
    },
    next: {
      bindedBy: '||',
      followedBy: {
        _openedBrackets: [],
        _expDesc: {
          brackets: {
            openingExp: {
              _openedBrackets: [],
              _expDesc: {
                leftHandSide: {
                  propertyName: 'IDNumber',
                  suffixOperator: '',
                  propertyTree: ['IDNumber']
                },
                operator: '>',
                rightHandSide: {
                  propertyType: 'number',
                  propertyName: '[CONSTANT]',
                  propertyValue: 850000,
                  implicitContextName: null
                },
                next: {
                  bindedBy: '&&',
                  followedBy: {
                    _openedBrackets: [],
                    _expDesc: {
                      brackets: {
                        openingExp: {
                          _openedBrackets: [],
                          _expDesc: {
                            leftHandSide: {
                              propertyName: 'whatIf',
                              suffixOperator: '',
                              propertyTree: ['whatIf']
                            },
                            operator: '===',
                            rightHandSide: {
                              propertyType: 'boolean',
                              propertyName: '[CONSTANT]',
                              propertyValue: true,
                              implicitContextName: null
                            },
                            next: {
                              bindedBy: '||'
                            }
                          },
                          _throwIfContextIsNull: true,
                          context: null,
                          _expObj: 'p'
                        },
                        closingExp: {
                          _openedBrackets: [],
                          _expDesc: {
                            leftHandSide: {
                              propertyName: 'whatYouthink',
                              suffixOperator: '!',
                              propertyTree: ['whatYouthink']
                            }
                          },
                          _throwIfContextIsNull: true,
                          context: null,
                          _expObj: 'p'
                        }
                      },
                      next: {
                        bindedBy: '&&'
                      }
                    },
                    _throwIfContextIsNull: true,
                    context: null,
                    _expObj: 'p'
                  }
                }
              },
              _throwIfContextIsNull: true,
              context: null,
              _expObj: 'p'
            },
            closingExp: {
              _openedBrackets: [],
              _expDesc: {
                leftHandSide: {
                  propertyName: 'helloMundo',
                  suffixOperator: '',
                  propertyTree: ['helloMundo']
                },
                operator: '<',
                rightHandSide: {
                  propertyType: 'string',
                  propertyName: '[CONSTANT]',
                  propertyValue: 'thisOne',
                  implicitContextName: null
                }
              },
              _throwIfContextIsNull: true,
              context: null,
              _expObj: 'p'
            }
          }
        },
        _throwIfContextIsNull: true,
        context: null,
        _expObj: 'p'
      }
    }
  },
  context: null,
  _throwIfContextIsNull: true,
  _expObj: 'p',
  _lastBracketExp: {
    brackets: {
      openingExp: {
        _openedBrackets: [],
        _expDesc: {
          leftHandSide: {
            propertyName: 'whatIf',
            suffixOperator: '',
            propertyTree: ['whatIf']
          },
          operator: '===',
          rightHandSide: {
            propertyType: 'boolean',
            propertyName: '[CONSTANT]',
            propertyValue: true,
            implicitContextName: null
          },
          next: {
            bindedBy: '||'
          }
        },
        _throwIfContextIsNull: true,
        context: null,
        _expObj: 'p'
      },
      closingExp: {
        _openedBrackets: [],
        _expDesc: {
          leftHandSide: {
            propertyName: 'whatYouthink',
            suffixOperator: '!',
            propertyTree: ['whatYouthink']
          }
        },
        _throwIfContextIsNull: true,
        context: null,
        _expObj: 'p'
      }
    },
    next: {
      bindedBy: '&&'
    }
  },
  _nextRef: {
    bindedBy: '&&'
  }
};
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
          p.helloMundo < 'thisOne');
    });
    exp.compile();

    // Assert
    expect(exp).toMatchObject(RESULT4);
  });
});
