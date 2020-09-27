const RESULT0 = {
  "brackets": {
    "openingExp": {
      "lhs": {
        "propertyName": "name.includes",
        "suffixOperator": "",
        "isMethod": true,
        "content": {
          "type": "string",
          "primitiveValue": "hello",
          "methodName": "includes"
        },
        "propertyTree": [
          "name",
          "includes"
        ]
      },
      "next": {
        "bindedBy": "&&",
        "following": {
          "lhs": {
            "propertyName": "isFool",
            "suffixOperator": "",
            "propertyTree": [
              "isFool"
            ]
          },
          "context": {
            "name": "10x Dev",
            "value": 82,
            "obj": {
              "the": {}
            }
          },
          "contextName": "$",
          "expObjectName": "n"
        }
      },
      "context": {
        "name": "10x Dev",
        "value": 82,
        "obj": {
          "the": {}
        }
      },
      "contextName": "$",
      "expObjectName": "n"
    },
    "closingExp": {
      "lhs": {
        "propertyName": "isFool",
        "suffixOperator": "",
        "propertyTree": [
          "isFool"
        ]
      },
      "context": {
        "name": "10x Dev",
        "value": 82,
        "obj": {
          "the": {}
        }
      },
      "contextName": "$",
      "expObjectName": "n"
    }
  },
  "next": {
    "bindedBy": "||",
    "following": {
      "brackets": {
        "openingExp": {
          "lhs": {
            "propertyName": "matricule",
            "suffixOperator": "",
            "propertyTree": [
              "matricule"
            ]
          },
          "rhs": {
            "propertyType": "string",
            "propertyName": "[CONSTANT]",
            "propertyValue": "mat22",
            "implicitContextName": null
          },
          "operator": "!==",
          "next": {
            "bindedBy": "&&",
            "following": {
              "lhs": {
                "propertyName": "name.startsWith",
                "suffixOperator": "",
                "isMethod": true,
                "content": {
                  "type": "string",
                  "primitiveValue": "10x Dev",
                  "methodName": "startsWith"
                },
                "propertyTree": [
                  "name",
                  "startsWith"
                ]
              },
              "next": {
                "bindedBy": "&&",
                "following": {
                  "lhs": {
                    "propertyName": "complexValues.filter",
                    "suffixOperator": "",
                    "isMethod": true,
                    "content": {
                      "type": "expression",
                      "isExpression": true,
                      "expression": {
                        "lhs": {
                          "propertyName": "complexity.made.simple.map",
                          "suffixOperator": "",
                          "isMethod": true,
                          "content": {
                            "type": "expression",
                            "isExpression": true,
                            "expression": {
                              "lhs": {
                                "propertyName": "and.straightTo.the.point",
                                "suffixOperator": "",
                                "propertyTree": [
                                  "and",
                                  "straightTo",
                                  "the",
                                  "point"
                                ]
                              },
                              "rhs": {
                                "propertyType": "number",
                                "propertyName": "value",
                                "propertyValue": 82,
                                "implicitContextName": "$"
                              },
                              "operator": "!==",
                              "context": {
                                "name": "10x Dev",
                                "value": 82,
                                "obj": {
                                  "the": {}
                                }
                              },
                              "contextName": "$",
                              "expObjectName": "s"
                            },
                            "methodName": "map"
                          },
                          "propertyTree": [
                            "complexity",
                            "made",
                            "simple",
                            "map"
                          ]
                        },
                        "context": {
                          "name": "10x Dev",
                          "value": 82,
                          "obj": {
                            "the": {}
                          }
                        },
                        "contextName": "$",
                        "expObjectName": "c"
                      },
                      "methodName": "filter"
                    },
                    "propertyTree": [
                      "complexValues",
                      "filter"
                    ]
                  },
                  "context": {
                    "name": "10x Dev",
                    "value": 82,
                    "obj": {
                      "the": {}
                    }
                  },
                  "contextName": "$",
                  "expObjectName": "n"
                }
              },
              "context": {
                "name": "10x Dev",
                "value": 82,
                "obj": {
                  "the": {}
                }
              },
              "contextName": "$",
              "expObjectName": "n"
            }
          },
          "context": {
            "name": "10x Dev",
            "value": 82,
            "obj": {
              "the": {}
            }
          },
          "contextName": "$",
          "expObjectName": "n"
        },
        "closingExp": {
          "lhs": {
            "propertyName": "complexValues.filter",
            "suffixOperator": "",
            "isMethod": true,
            "content": {
              "type": "expression",
              "isExpression": true,
              "expression": {
                "lhs": {
                  "propertyName": "complexity.made.simple.map",
                  "suffixOperator": "",
                  "isMethod": true,
                  "content": {
                    "type": "expression",
                    "isExpression": true,
                    "expression": {
                      "lhs": {
                        "propertyName": "and.straightTo.the.point",
                        "suffixOperator": "",
                        "propertyTree": [
                          "and",
                          "straightTo",
                          "the",
                          "point"
                        ]
                      },
                      "rhs": {
                        "propertyType": "number",
                        "propertyName": "value",
                        "propertyValue": 82,
                        "implicitContextName": "$"
                      },
                      "operator": "!==",
                      "context": {
                        "name": "10x Dev",
                        "value": 82,
                        "obj": {
                          "the": {}
                        }
                      },
                      "contextName": "$",
                      "expObjectName": "s"
                    },
                    "methodName": "map"
                  },
                  "propertyTree": [
                    "complexity",
                    "made",
                    "simple",
                    "map"
                  ]
                },
                "context": {
                  "name": "10x Dev",
                  "value": 82,
                  "obj": {
                    "the": {}
                  }
                },
                "contextName": "$",
                "expObjectName": "c"
              },
              "methodName": "filter"
            },
            "propertyTree": [
              "complexValues",
              "filter"
            ]
          },
          "context": {
            "name": "10x Dev",
            "value": 82,
            "obj": {
              "the": {}
            }
          },
          "contextName": "$",
          "expObjectName": "n"
        }
      },
      "context": {
        "name": "10x Dev",
        "value": 82,
        "obj": {
          "the": {}
        }
      },
      "contextName": "$",
      "expObjectName": "n"
    }
  },
  "context": {
    "name": "10x Dev",
    "value": 82,
    "obj": {
      "the": {}
    }
  },
  "contextName": "$",
  "expObjectName": "n"
}
const RESULT1 = {
  "brackets": {
    "openingExp": {
      "lhs": {
        "propertyName": "firstname.startsWith",
        "suffixOperator": "",
        "isMethod": true,
        "content": {
          "type": "string",
          "primitiveValue": "Bugg",
          "methodName": "startsWith"
        },
        "propertyTree": [
          "firstname",
          "startsWith"
        ]
      },
      "next": {
        "bindedBy": "&&",
        "following": {
          "lhs": {
            "propertyName": "lastname.includes",
            "suffixOperator": "",
            "isMethod": true,
            "content": {
              "type": "string",
              "primitiveValue": "aker",
              "methodName": "includes"
            },
            "propertyTree": [
              "lastname",
              "includes"
            ]
          },
          "context": null,
          "expObjectName": "p"
        }
      },
      "context": null,
      "expObjectName": "p"
    },
    "closingExp": {
      "lhs": {
        "propertyName": "lastname.includes",
        "suffixOperator": "",
        "isMethod": true,
        "content": {
          "type": "string",
          "primitiveValue": "aker",
          "methodName": "includes"
        },
        "propertyTree": [
          "lastname",
          "includes"
        ]
      },
      "context": null,
      "expObjectName": "p"
    }
  },
  "next": {
    "bindedBy": "||",
    "following": {
      "lhs": {
        "propertyName": "IDNumber",
        "suffixOperator": "",
        "propertyTree": [
          "IDNumber"
        ]
      },
      "rhs": {
        "propertyType": "number",
        "propertyName": "[CONSTANT]",
        "propertyValue": 850000,
        "implicitContextName": null
      },
      "operator": ">",
      "context": null,
      "expObjectName": "p"
    }
  },
  "context": null,
  "expObjectName": "p"
}
const RESULT2 = {
  "brackets": {
    "openingExp": {
      "lhs": {
        "propertyName": "firstname.startsWith",
        "suffixOperator": "",
        "isMethod": true,
        "content": {
          "type": "string",
          "primitiveValue": "Bugg",
          "methodName": "startsWith"
        },
        "propertyTree": [
          "firstname",
          "startsWith"
        ]
      },
      "next": {
        "bindedBy": "&&",
        "following": {
          "lhs": {
            "propertyName": "lastname.includes",
            "suffixOperator": "",
            "isMethod": true,
            "content": {
              "type": "string",
              "primitiveValue": "aker",
              "methodName": "includes"
            },
            "propertyTree": [
              "lastname",
              "includes"
            ]
          },
          "context": null,
          "expObjectName": "p"
        }
      },
      "context": null,
      "expObjectName": "p"
    },
    "closingExp": {
      "lhs": {
        "propertyName": "lastname.includes",
        "suffixOperator": "",
        "isMethod": true,
        "content": {
          "type": "string",
          "primitiveValue": "aker",
          "methodName": "includes"
        },
        "propertyTree": [
          "lastname",
          "includes"
        ]
      },
      "context": null,
      "expObjectName": "p"
    }
  },
  "next": {
    "bindedBy": "||",
    "following": {
      "brackets": {
        "openingExp": {
          "lhs": {
            "propertyName": "IDNumber",
            "suffixOperator": "",
            "propertyTree": [
              "IDNumber"
            ]
          },
          "rhs": {
            "propertyType": "number",
            "propertyName": "[CONSTANT]",
            "propertyValue": 850000,
            "implicitContextName": null
          },
          "operator": ">",
          "next": {
            "bindedBy": "&&",
            "following": {
              "brackets": {
                "openingExp": {
                  "lhs": {
                    "propertyName": "whatIf",
                    "suffixOperator": "",
                    "propertyTree": [
                      "whatIf"
                    ]
                  },
                  "rhs": {
                    "propertyType": "boolean",
                    "propertyName": "[CONSTANT]",
                    "propertyValue": true,
                    "implicitContextName": null
                  },
                  "operator": "===",
                  "next": {
                    "bindedBy": "||",
                    "following": {
                      "lhs": {
                        "propertyName": "whatYouthink",
                        "suffixOperator": "!",
                        "propertyTree": [
                          "whatYouthink"
                        ]
                      },
                      "context": null,
                      "expObjectName": "p"
                    }
                  },
                  "context": null,
                  "expObjectName": "p"
                },
                "closingExp": {
                  "lhs": {
                    "propertyName": "whatYouthink",
                    "suffixOperator": "!",
                    "propertyTree": [
                      "whatYouthink"
                    ]
                  },
                  "context": null,
                  "expObjectName": "p"
                }
              },
              "context": null,
              "expObjectName": "p"
            }
          },
          "context": null,
          "expObjectName": "p"
        },
        "closingExp": {
          "lhs": {
            "propertyName": "whatYouthink",
            "suffixOperator": "!",
            "propertyTree": [
              "whatYouthink"
            ]
          },
          "context": null,
          "expObjectName": "p"
        }
      },
      "context": null,
      "expObjectName": "p"
    }
  },
  "context": null,
  "expObjectName": "p"
}
const RESULT3 = {
  "brackets": {
    "openingExp": {
      "lhs": {
        "propertyName": "firstname.startsWith",
        "suffixOperator": "",
        "isMethod": true,
        "content": {
          "type": "string",
          "primitiveValue": "Bugg",
          "methodName": "startsWith"
        },
        "propertyTree": [
          "firstname",
          "startsWith"
        ]
      },
      "next": {
        "bindedBy": "&&",
        "following": {
          "lhs": {
            "propertyName": "lastname.includes",
            "suffixOperator": "",
            "isMethod": true,
            "content": {
              "type": "string",
              "primitiveValue": "aker",
              "methodName": "includes"
            },
            "propertyTree": [
              "lastname",
              "includes"
            ]
          },
          "context": null,
          "expObjectName": "p"
        }
      },
      "context": null,
      "expObjectName": "p"
    },
    "closingExp": {
      "lhs": {
        "propertyName": "lastname.includes",
        "suffixOperator": "",
        "isMethod": true,
        "content": {
          "type": "string",
          "primitiveValue": "aker",
          "methodName": "includes"
        },
        "propertyTree": [
          "lastname",
          "includes"
        ]
      },
      "context": null,
      "expObjectName": "p"
    }
  },
  "next": {
    "bindedBy": "||",
    "following": {
      "brackets": {
        "openingExp": {
          "lhs": {
            "propertyName": "IDNumber",
            "suffixOperator": "",
            "propertyTree": [
              "IDNumber"
            ]
          },
          "rhs": {
            "propertyType": "number",
            "propertyName": "[CONSTANT]",
            "propertyValue": 850000,
            "implicitContextName": null
          },
          "operator": ">",
          "next": {
            "bindedBy": "&&",
            "following": {
              "brackets": {
                "openingExp": {
                  "lhs": {
                    "propertyName": "whatIf",
                    "suffixOperator": "",
                    "propertyTree": [
                      "whatIf"
                    ]
                  },
                  "rhs": {
                    "propertyType": "boolean",
                    "propertyName": "[CONSTANT]",
                    "propertyValue": true,
                    "implicitContextName": null
                  },
                  "operator": "===",
                  "next": {
                    "bindedBy": "||",
                    "following": {
                      "lhs": {
                        "propertyName": "whatYouthink",
                        "suffixOperator": "!",
                        "propertyTree": [
                          "whatYouthink"
                        ]
                      },
                      "context": null,
                      "expObjectName": "p"
                    }
                  },
                  "context": null,
                  "expObjectName": "p"
                },
                "closingExp": {
                  "lhs": {
                    "propertyName": "whatYouthink",
                    "suffixOperator": "!",
                    "propertyTree": [
                      "whatYouthink"
                    ]
                  },
                  "context": null,
                  "expObjectName": "p"
                }
              },
              "next": {
                "bindedBy": "&&",
                "following": {
                  "lhs": {
                    "propertyName": "helloMundo",
                    "suffixOperator": "",
                    "propertyTree": [
                      "helloMundo"
                    ]
                  },
                  "rhs": {
                    "propertyType": "string",
                    "propertyName": "[CONSTANT]",
                    "propertyValue": "thisOne",
                    "implicitContextName": null
                  },
                  "operator": "<",
                  "context": null,
                  "expObjectName": "p"
                }
              },
              "context": null,
              "expObjectName": "p"
            }
          },
          "context": null,
          "expObjectName": "p"
        },
        "closingExp": {
          "lhs": {
            "propertyName": "helloMundo",
            "suffixOperator": "",
            "propertyTree": [
              "helloMundo"
            ]
          },
          "rhs": {
            "propertyType": "string",
            "propertyName": "[CONSTANT]",
            "propertyValue": "thisOne",
            "implicitContextName": null
          },
          "operator": "<",
          "context": null,
          "expObjectName": "p"
        }
      },
      "context": null,
      "expObjectName": "p"
    }
  },
  "context": null,
  "expObjectName": "p"
}
const RESULT4 = {
  "lhs": {
    "propertyName": "email.endsWith",
    "suffixOperator": "",
    "isMethod": true,
    "content": {
      "type": "string",
      "primitiveValue": "um",
      "methodName": "endsWith"
    },
    "propertyTree": [
      "email",
      "endsWith"
    ]
  },
  "next": {
    "bindedBy": "||",
    "following": {
      "brackets": {
        "openingExp": {
          "lhs": {
            "propertyName": "name.includes",
            "suffixOperator": "",
            "isMethod": true,
            "content": {
              "type": "string",
              "primitiveValue": "um",
              "methodName": "includes"
            },
            "propertyTree": [
              "name",
              "includes"
            ]
          },
          "next": {
            "bindedBy": "&&",
            "following": {
              "lhs": {
                "propertyName": "id",
                "suffixOperator": "",
                "propertyTree": [
                  "id"
                ]
              },
              "rhs": {
                "propertyType": "number",
                "propertyName": "[CONSTANT]",
                "propertyValue": 45,
                "implicitContextName": null
              },
              "operator": ">",
              "context": {
                "name": "um"
              },
              "contextName": "_",
              "expObjectName": "a"
            }
          },
          "context": {
            "name": "um"
          },
          "contextName": "_",
          "expObjectName": "a"
        },
        "closingExp": {
          "lhs": {
            "propertyName": "id",
            "suffixOperator": "",
            "propertyTree": [
              "id"
            ]
          },
          "rhs": {
            "propertyType": "number",
            "propertyName": "[CONSTANT]",
            "propertyValue": 45,
            "implicitContextName": null
          },
          "operator": ">",
          "context": {
            "name": "um"
          },
          "contextName": "_",
          "expObjectName": "a"
        }
      },
      "context": {
        "name": "um"
      },
      "contextName": "_",
      "expObjectName": "a"
    }
  },
  "context": {
    "name": "um"
  },
  "contextName": "_",
  "expObjectName": "a"
}
export { RESULT0, RESULT1, RESULT2, RESULT3, RESULT4 }