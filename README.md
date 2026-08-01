# Slim-Exp

![logo](/slim-logo.png)

Slim-exp is a lightweight TypeScript expression parser. It parses arrow (or anonymous) functions into structured description objects, making it easy to build query builders, LINQ-style libraries, and other expression-driven infrastructure without a full TypeScript compiler dependency.

### Tested on

- Node.js v18 / v20 (LTS)
- TypeScript 5.x
- Modern browsers (Chromium 120+)

### Installing

```
npm i slim-exp
```

### How to use

You get a structured description of an arrow function passed to a `SlimExpression` instance.

The core types look like this:

```ts
export interface ExpressionBrackets {
  openingExp?: ISlimExpression<any>;
  closingExp?: ISlimExpression<any>;
}

export interface ExpressionDescription<TIn, TOut, TContext> {
  brackets: ExpressionBrackets;
  operator: string;
  rightHandSide: ExpressionRightHandSide;
  leftHandSide: ExpressionLeftHandSide;
  next: NextExpression<TIn, TOut, TContext>;
}

export interface ExpressionRightHandSide {
  implicitContextName: string | null;
  propertyType: string;
  propertyName: string;
  propertyValue: unknown;
}

export interface ExpressionLeftHandSide extends Invokable {
  suffixOperator: string;
  propertyName: string;
  propertyTree?: string[];
}

export interface NextExpression<TIn, TOut, TContext> {
  bindedBy: string;
  followedBy: ISlimExpression<TIn, TOut, TContext>;
}
```

An expression is composed of a `leftHandSide`, an optional `rightHandSide`, an `operator`, and an optional `next` expression. The expression function can have at most two parameters — the second (`$`) is the optional context object.

Consider the arrow function expression below:

`(n, $) => n.name === $.hello && n.matricule > $.code.is`

This function has two sections separated by the `&&` logical operator. Each section has a left-hand side and a right-hand side separated by a comparison operator.

For the above arrow function (assuming context `{ hello: 'world', code: { is: 'dope' } }`):

```json
{
  "lhs": {
    "propertyName": "name",
    "suffixOperator": "",
    "propertyTree": ["name"]
  },
  "operator": "===",
  "rhs": {
    "propertyType": "string",
    "propertyName": "hello",
    "propertyValue": "world"
  },
  "next": {
    "bindedBy": "&&",
    "following": {
      "lhs": {
        "propertyName": "matricule",
        "suffixOperator": "",
        "propertyTree": ["matricule"]
      },
      "operator": ">",
      "rhs": {
        "propertyType": "string",
        "propertyName": "code.is",
        "propertyValue": "dope"
      }
    }
  }
}
```

Other example use cases are shown below.

```ts
const exp = new SlimExpression<PseudoModel>((n) => n.name);
exp.compile();

console.log(exp.leftHandSide.propertyName); // 'name'
```

```ts
const exp = new SlimExpression<PseudoModel>((n) => n.name && n.matricule || n.isFool);
exp.compile();
// exp.next.bindedBy === '&&'
// exp.next.followedBy.next.bindedBy === '||'
```

Example use of context and `fromAction` method:

```ts
const exp = new SlimExpression<PseudoModel>();

exp.fromAction(
    (n, $) => n.name === $.hello && n.matricule > $.code.is,
    { hello: 'world', code: { is: 'dope' } }
);
exp.compile();
```

Using constants as `rightHandSide`:

```ts
const exp2 = new SlimExpression<PseudoModel>((n) => n.num > 25);
exp2.compile();

// exp2.rightHandSide.propertyName === '[CONSTANT]'
// exp2.rightHandSide.propertyValue === 25
// exp2.rightHandSide.propertyType === 'number'
```

Method calls are also parsed:

```ts
const exp = new SlimExpression<PseudoModel>((n) => n.name.includes('hello'));
exp.compile();

// exp.leftHandSide.isMethod === true
// exp.leftHandSide.content.methodName === 'includes'
// exp.leftHandSide.content.primitiveValue === 'hello'
```

Inner arrow function expressions in method calls are parsed recursively:

```ts
const exp = new SlimExpression<PseudoModel>((n) =>
    n.complexValues.map((v) => v.complexity.made.simple)
);
exp.compile();

// exp.leftHandSide.content.isExpression === true
// exp.leftHandSide.content.methodName === 'map'
```

### Error handling

All parsing errors throw a `SlimExpressionParserException` with a `code` property:

```ts
import { SlimExpressionParserException } from 'slim-exp';

try {
  exp.compile();
} catch (e) {
  if (e instanceof SlimExpressionParserException) {
    console.error(e.code, e.message);
    // e.code is one of: 'FUNCTION_NOT_SET' | 'INVALID_ARROW_FUNCTION' |
    //   'INVALID_LEGACY_FUNCTION' | 'CONTEXT_REQUIRED' |
    //   'CONTEXT_PROPERTY_NOT_FOUND' | 'INVALID_EXPRESSION_ROOT' |
    //   'UNSUPPORTED_UNARY_OPERATOR' | 'UNSUPPORTED_METHOD_ARGUMENT' |
    //   'UNSUPPORTED_RIGHT_HAND_SIDE' | 'PARSE_ERROR'
  }
}
```

### Compiling as AST

In addition to the legacy description tree, you can compile to a raw AST:

```ts
const ast = exp.compileAst();
// ast.kind === 'BinaryExpression'
```

More examples can be found in the tests.

## Not Supported

- Logical operators inside nested method-argument functions. The sub-expression
  `(s) => s.value !== $.v && s.value > 50` cannot yet be handled when it appears
  as the argument to `.filter()` or similar.
- Function references — slim-exp works by parsing function source text, so only
  inline function literals are supported.

## Authors

- **Etienne Yamsi (Bugmaker)** — [bugmaker-237](https://github.com/bugmaker-237)

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
