import { SlimExpression } from '../src/expression';

const RESULT = {
  _expDesc: {
    brackets: {
      openingExp: {
        _openedBrackets: [],
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
              _openedBrackets: [],
              _expDesc: {
                leftHandSide: {
                  propertyName: 'isFool',
                  suffixOperator: '',
                  propertyTree: ['isFool']
                }
              },
              _throwIfContextIsNull: true,
              context: {
                name: '10x Dev',
                value: 82,
                obj: {
                  the: {}
                }
              },
              _ctxName: '$',
              _expObj: 'n'
            }
          }
        },
        _throwIfContextIsNull: true,
        context: {
          name: '10x Dev',
          value: 82,
          obj: {
            the: {}
          }
        },
        _ctxName: '$',
        _expObj: 'n'
      },
      closingExp: {
        _openedBrackets: [],
        _expDesc: {
          leftHandSide: {
            propertyName: 'isFool',
            suffixOperator: '',
            propertyTree: ['isFool']
          }
        },
        _throwIfContextIsNull: true,
        context: {
          name: '10x Dev',
          value: 82,
          obj: {
            the: {}
          }
        },
        _ctxName: '$',
        _expObj: 'n'
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
                  propertyName: 'matricule',
                  suffixOperator: '',
                  propertyTree: ['matricule']
                },
                operator: '!==',
                rightHandSide: {
                  propertyType: 'string',
                  propertyName: '[CONSTANT]',
                  propertyValue: 'mat22',
                  implicitContextName: null
                },
                next: {
                  bindedBy: '&&',
                  followedBy: {
                    _openedBrackets: [],
                    _expDesc: {
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
                          _openedBrackets: [],
                          _expDesc: {
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
                                      propertyName:
                                        'complexity.made.simple.map',
                                      suffixOperator: '',
                                      isMethod: true,
                                      content: {
                                        type: 'expression',
                                        isExpression: true,
                                        expression: {
                                          _expDesc: {
                                            leftHandSide: {
                                              propertyName:
                                                'and.straightTo.the.point',
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
                                              propertyValue: 82,
                                              implicitContextName: '$'
                                            }
                                          },
                                          context: {
                                            name: '10x Dev',
                                            value: 82,
                                            obj: {
                                              the: {}
                                            }
                                          },
                                          _throwIfContextIsNull: true,
                                          _expObj: 's',
                                          _ctxName: '$'
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
                                    value: 82,
                                    obj: {
                                      the: {}
                                    }
                                  },
                                  _throwIfContextIsNull: true,
                                  _expObj: 'c',
                                  _ctxName: '$'
                                },
                                methodName: 'filter'
                              },
                              propertyTree: ['complexValues', 'filter']
                            }
                          },
                          _throwIfContextIsNull: true,
                          context: {
                            name: '10x Dev',
                            value: 82,
                            obj: {
                              the: {}
                            }
                          },
                          _ctxName: '$',
                          _expObj: 'n'
                        }
                      }
                    },
                    _throwIfContextIsNull: true,
                    context: {
                      name: '10x Dev',
                      value: 82,
                      obj: {
                        the: {}
                      }
                    },
                    _ctxName: '$',
                    _expObj: 'n'
                  }
                }
              },
              _throwIfContextIsNull: true,
              context: {
                name: '10x Dev',
                value: 82,
                obj: {
                  the: {}
                }
              },
              _ctxName: '$',
              _expObj: 'n'
            },
            closingExp: {
              _openedBrackets: [],
              _expDesc: {
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
                                  propertyValue: 82,
                                  implicitContextName: '$'
                                }
                              },
                              context: {
                                name: '10x Dev',
                                value: 82,
                                obj: {
                                  the: {}
                                }
                              },
                              _throwIfContextIsNull: true,
                              _expObj: 's',
                              _ctxName: '$'
                            },
                            methodName: 'map'
                          },
                          propertyTree: ['complexity', 'made', 'simple', 'map']
                        }
                      },
                      context: {
                        name: '10x Dev',
                        value: 82,
                        obj: {
                          the: {}
                        }
                      },
                      _throwIfContextIsNull: true,
                      _expObj: 'c',
                      _ctxName: '$'
                    },
                    methodName: 'filter'
                  },
                  propertyTree: ['complexValues', 'filter']
                }
              },
              _throwIfContextIsNull: true,
              context: {
                name: '10x Dev',
                value: 82,
                obj: {
                  the: {}
                }
              },
              _ctxName: '$',
              _expObj: 'n'
            }
          }
        },
        _throwIfContextIsNull: true,
        context: {
          name: '10x Dev',
          value: 82,
          obj: {
            the: {}
          }
        },
        _ctxName: '$',
        _expObj: 'n'
      }
    }
  },
  context: {
    name: '10x Dev',
    value: 82,
    obj: {
      the: {}
    }
  },
  _throwIfContextIsNull: true,
  _expObj: 'n',
  _ctxName: '$',
  _lastBracketExp: {
    brackets: {
      openingExp: {
        _openedBrackets: [],
        _expDesc: {
          leftHandSide: {
            propertyName: 'matricule',
            suffixOperator: '',
            propertyTree: ['matricule']
          },
          operator: '!==',
          rightHandSide: {
            propertyType: 'string',
            propertyName: '[CONSTANT]',
            propertyValue: 'mat22',
            implicitContextName: null
          },
          next: {
            bindedBy: '&&',
            followedBy: {
              _openedBrackets: [],
              _expDesc: {
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
                    _openedBrackets: [],
                    _expDesc: {
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
                                        propertyName:
                                          'and.straightTo.the.point',
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
                                        propertyValue: 82,
                                        implicitContextName: '$'
                                      }
                                    },
                                    context: {
                                      name: '10x Dev',
                                      value: 82,
                                      obj: {
                                        the: {}
                                      }
                                    },
                                    _throwIfContextIsNull: true,
                                    _expObj: 's',
                                    _ctxName: '$'
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
                              value: 82,
                              obj: {
                                the: {}
                              }
                            },
                            _throwIfContextIsNull: true,
                            _expObj: 'c',
                            _ctxName: '$'
                          },
                          methodName: 'filter'
                        },
                        propertyTree: ['complexValues', 'filter']
                      }
                    },
                    _throwIfContextIsNull: true,
                    context: {
                      name: '10x Dev',
                      value: 82,
                      obj: {
                        the: {}
                      }
                    },
                    _ctxName: '$',
                    _expObj: 'n'
                  }
                }
              },
              _throwIfContextIsNull: true,
              context: {
                name: '10x Dev',
                value: 82,
                obj: {
                  the: {}
                }
              },
              _ctxName: '$',
              _expObj: 'n'
            }
          }
        },
        _throwIfContextIsNull: true,
        context: {
          name: '10x Dev',
          value: 82,
          obj: {
            the: {}
          }
        },
        _ctxName: '$',
        _expObj: 'n'
      },
      closingExp: {
        _openedBrackets: [],
        _expDesc: {
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
                            propertyTree: ['and', 'straightTo', 'the', 'point']
                          },
                          operator: '!==',
                          rightHandSide: {
                            propertyType: 'number',
                            propertyName: 'value',
                            propertyValue: 82,
                            implicitContextName: '$'
                          }
                        },
                        context: {
                          name: '10x Dev',
                          value: 82,
                          obj: {
                            the: {}
                          }
                        },
                        _throwIfContextIsNull: true,
                        _expObj: 's',
                        _ctxName: '$'
                      },
                      methodName: 'map'
                    },
                    propertyTree: ['complexity', 'made', 'simple', 'map']
                  }
                },
                context: {
                  name: '10x Dev',
                  value: 82,
                  obj: {
                    the: {}
                  }
                },
                _throwIfContextIsNull: true,
                _expObj: 'c',
                _ctxName: '$'
              },
              methodName: 'filter'
            },
            propertyTree: ['complexValues', 'filter']
          }
        },
        _throwIfContextIsNull: true,
        context: {
          name: '10x Dev',
          value: 82,
          obj: {
            the: {}
          }
        },
        _ctxName: '$',
        _expObj: 'n'
      }
    }
  },
  _nextRef: {
    bindedBy: '&&',
    followedBy: {
      _openedBrackets: [],
      _expDesc: {
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
                          propertyTree: ['and', 'straightTo', 'the', 'point']
                        },
                        operator: '!==',
                        rightHandSide: {
                          propertyType: 'number',
                          propertyName: 'value',
                          propertyValue: 82,
                          implicitContextName: '$'
                        }
                      },
                      context: {
                        name: '10x Dev',
                        value: 82,
                        obj: {
                          the: {}
                        }
                      },
                      _throwIfContextIsNull: true,
                      _expObj: 's',
                      _ctxName: '$'
                    },
                    methodName: 'map'
                  },
                  propertyTree: ['complexity', 'made', 'simple', 'map']
                }
              },
              context: {
                name: '10x Dev',
                value: 82,
                obj: {
                  the: {}
                }
              },
              _throwIfContextIsNull: true,
              _expObj: 'c',
              _ctxName: '$'
            },
            methodName: 'filter'
          },
          propertyTree: ['complexValues', 'filter']
        }
      },
      _throwIfContextIsNull: true,
      context: {
        name: '10x Dev',
        value: 82,
        obj: {
          the: {}
        }
      },
      _ctxName: '$',
      _expObj: 'n'
    }
  }
};
const RESULT2 = {
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
            bindedBy: '&&',
            followedBy: {
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
            bindedBy: '&&',
            followedBy: {
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
          }
        },
        _throwIfContextIsNull: true,
        context: null,
        _expObj: 'p'
      }
    }
  },
  _nextRef: {
    bindedBy: '||',
    followedBy: {
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
        }
      },
      _throwIfContextIsNull: true,
      context: null,
      _expObj: 'p'
    }
  }
};
const RESULT3 = {
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
            bindedBy: '&&',
            followedBy: {
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
                              bindedBy: '||',
                              followedBy: {
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
                  propertyName: 'whatYouthink',
                  suffixOperator: '!',
                  propertyTree: ['whatYouthink']
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
            bindedBy: '||',
            followedBy: {
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
    }
  },
  _nextRef: {
    bindedBy: '||',
    followedBy: {
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
  }
};
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
    expect(exp).toMatchObject(RESULT);
  });
  it('should handle the brackets seemlessly', () => {
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
    expect(exp).toMatchObject(RESULT2);
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
    expect(exp).toMatchObject(RESULT3);
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
    expect(exp).toMatchObject(RESULT4);
  });
});
