# Slim-Exp

![logo](/slim-logo.png)

Slim-exp is simple typescript expression parser. As a core developer I know the importance of facilitating my teams' work when building softwares. Expression use the right way at the right time facilitates life. The objectif of this library is not just to write some cool stuff but to help developers build an infrastructure, based on expressions, which will ease life.

### Works/tested on

- Modern browsers (Chromuim 84.0)
- NodeJs v12.16.2

### Installing

```
npm i slim-exp
```

### How to use

It is pretty straight forward. You get a description of the arrow function instanciated or set in an expression object

The ExpressionDescription looks like this

```ts

ExpressionDescription {
  operator: string;
  rightHandSide: ExpressionRightHandSide;
  leftHandSide: ExpressionLeftHandSide;
  next: NextExpression;
}

ExpressionRightHandSide {
  propertyType: string;
  propertyName: string;
  propertyValue: any;
}

ExpressionLeftHandSide extends Invokable {
  suffixOperator: string;
  propertyName: string;
  propertyTree?: string[];
}

NextExpression {
  bindedBy: string;
  followedBy: ISlimExpression;
}

Invokable {
  isMethod?: boolean;
  content?: {
    type: string;
    methodName?: string;
    primitiveValue?: string | number;
    isExpression?: boolean;
    expression?: ISlimExpression<any>;
  };
}

```

An expression is composed of a leftHandSide, a rightHandSide, an operator and a next Expression. The expression can have at most 2 parameters with the second one, the context (\$) being optional.

Consider the arrow function expression below:

`(n, $) => n.name === $.hello && n.matricule > $.code.is`

This function expression is considered to have 2 sections. A section is seperated from another by a logical operator, in this case `&&`. Each section consist of a leftHandSide and optionnally a rightHandSide which are seperated by a comparison operator in this case `===` and `>` respective to the sections.

Section 1: `n.name === $.hello`
Section 2: `n.matricule > $.code.is`

The `$` is the context. It is pass as parameter when creating the context `fromAction` as you will see below.

Thus we have as resulting expression description, for the above arrow function (assuming the context is `{ hello: 'world', code: { is: 'dope' } }`):

```json
{
  "_expDesc": {
    "leftHandSide": {
      "propertyName": "name",
      "suffixOperator": "",
      "propertyTree": ["name"]
    },
    "operator": "===",
    "rightHandSide": {
      "propertyType": "string",
      "propertyName": "hello",
      "propertyValue": "world"
    },
    "next": {
      "bindedBy": "&&",
      "followedBy": {
        "leftHandSide": {
          "propertyName": "matricule",
          "suffixOperator": "",
          "propertyTree": ["matricule"]
        },
        "operator": ">",
        "rightHandSide": {
          "propertyType": "string",
          "propertyName": "code.is",
          "propertyValue": "dope"
        }
      }
    }
  },
  "context": {
    "hello": "world",
    "code": {
      "is": "dope"
    }
  }
}
```

Other example use cases with implementation are shown below

```ts
const exp = new SlimExpression<PseudoModel>((n) => n.name);
exp.compile();

console.log(exp.leftHandSide.propertyName); // 'name'
```

```ts
const exp = new SlimExpression<PseudoModel>((n) => n.name && n.matricule || n.isFool);
exp.compile();

...
// Result

{
  "_expDesc": {
    "leftHandSide": {
      "propertyName": "name",
      "suffixOperator": "",
      "propertyTree": [
        "name"
      ]
    },
    "next": {
      "bindedBy": "&&",
      "followedBy": {
        "leftHandSide": {
          "propertyName": "matricule",
          "suffixOperator": "",
          "propertyTree": [
            "matricule"
          ]
        },
        "next": {
          "bindedBy": "||",
          "followedBy": {
            "leftHandSide": {
              "propertyName": "isFool",
              "suffixOperator": "",
              "propertyTree": [
                "isFool"
              ]
            }
          }
        }
      }
    }
  }
}


```

Example use of context and `fromAction` method

```ts
const exp = new SlimExpression<PseudoModel>();

exp.fromAction(
    (n, $) => n.name === $.hello && n.matricule > $.code.is,
    { hello: 'world', code: { is: 'dope' } }
);
exp.compile();

// Result
{
  "_expDesc": {
    "leftHandSide": {
      "propertyName": "name",
      "suffixOperator": "",
      "propertyTree": ["name"]
    },
    "operator": "===",
    "rightHandSide": {
      "propertyType": "string",
      "propertyName": "hello",
      "propertyValue": "world"
    },
    "next": {
      "bindedBy": "&&",
      "followedBy": {
        "leftHandSide": {
          "propertyName": "matricule",
          "suffixOperator": "",
          "propertyTree": ["matricule"]
        },
        "operator": ">",
        "rightHandSide": {
          "propertyType": "string",
          "propertyName": "code.is",
          "propertyValue": "dope"
        }
      }
    }
  },
  "context": {
    "hello": "world",
    "code": {
      "is": "dope"
    }
  }
}

```

It is also possible tu use constants as rightHandSide

```ts


const exp2 = new SlimExpression<PseudoModel>((n) => n.num > 25)
exp2.compile();

// Result
{
  "_expDesc": {
    "leftHandSide": {
      "propertyName": "num",
      "suffixOperator": "",
      "propertyTree": [
        "num"
      ]
    },
    "operator": ">",
    "rightHandSide": {
      "propertyType": "number",
      "propertyName": "[CONSTANT]",
      "propertyValue": 25
    }
  }
}
```

Method calls are also parsed

```ts
const exp = new SlimExpression<PseudoModel>((n) => n.name.includes('hello'));
exp.compile();

// Result

{
  "_expDesc": {
    "leftHandSide": {
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
    }
  }
}

```

Inner arrow function expression in Method calls are created automatically and parsed to obtain description

```ts
const exp = new SlimExpression<PseudoModel>((n) =>
    n.complexValues.map((v) => v.complexity.made.simple)
  );
exp.compile();

// Result

{
  "_expDesc": {
    "leftHandSide": {
      "propertyName": "complexValues.map",
      "suffixOperator": "",
      "isMethod": true,
      "content": {
        "type": "expression",
        "isExpression": true,
        "expression": {
          "_expDesc": {
            "leftHandSide": {
              "propertyName": "complexity.made.simple",
              "suffixOperator": "",
              "propertyTree": [
                "complexity",
                "made",
                "simple"
              ]
            }
          },
          "context": null
        },
        "methodName": "map"
      },
      "propertyTree": [
        "complexValues",
        "map"
      ]
    }
  }
}

```

You can combine all the different possibilities offered by slim-exp to get more complex arrow function expressions.

```ts
const exp = new SlimExpression<PseudoModel>();

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

// Result
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
       next: {...} // A LOT of code was ommitted for brevity
      }
    }
  }

```

More examples can be found in the tests files.

## Authors

- **Etienne Yamsi Aka. Bugmaker** - _Initial work_ - [Bugmaker](https://github.com/bugmaker-237)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
