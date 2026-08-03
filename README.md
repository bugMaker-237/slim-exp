# Slim-Exp

![logo](/slim-logo.png)

Slim-exp is a lightweight TypeScript expression parser. It parses arrow (or anonymous) functions into a reusable in-memory representation, making it easy to build query builders, LINQ-style libraries, and other expression-driven infrastructure without a full TypeScript compiler dependency.

It does not execute your function — it *reads* it. Given any inline function literal, slim-exp inspects the function's source text and produces a structured description of the expression it contains. You can then traverse that structure to build your own query trees, validators, serializers, or whatever else you need.

### Tested on

- Node.js v18 / v20 (LTS)
- TypeScript 5.x
- Modern browsers (Chromium 120+)

### Installing

```
npm i slim-exp
```

### How to use

Everything starts with a `SlimExpression<TIn, TContext, TOut>` instance. You hand it a function literal (with at most two parameters — the optional second one, conventionally `$`, is the context object), and you compile it.

There are two ways to compile:

| API | Returns | Purpose |
| --- | --- | --- |
| `compileAst()` | `AstExpression` | The raw, typed AST of the expression. The **recommended, first-class API**. |
| `compile()` | `void` | Builds the "legacy" description tree and exposes it through public getters. |
| `compile('ast')` | `AstExpression` | Explicit AST-mode compilation — identical to `compileAst()`. |
| `exp.ast` | `AstExpression \| undefined` | The raw AST captured during the last compilation. Available after `compile()` or `compileAst()`. |

Both APIs parse the same source; `compile()` additionally projects the AST into a description tree so you can access it via `leftHandSide`, `rightHandSide`, `operator`, `next` and `brackets` getters.

---

## `compileAst()` — the first-class API

`compileAst()` parses the function body into a typed abstract syntax tree. Every node has a `kind` discriminator and `start`/`end` offsets into the expression source, so you can walk the tree with exhaustiveness-checked code.

The node kinds are:

| Kind | Extra fields | Meaning |
| --- | --- | --- |
| `Identifier` | `name` | A bare variable, e.g. `n` |
| `Literal` | `value`, `valueType` | A `string`, `number`, `boolean` or `null` constant |
| `MemberExpression` | `object`, `property` | Property access, e.g. `n.name` or `$.code.is` |
| `UnaryExpression` | `operator`, `argument` | `!` negation |
| `CallExpression` | `callee`, `arguments` | Method calls, e.g. `n.name.includes('hello')` |
| `FunctionExpression` | `source` | A nested arrow/anonymous function literal passed as a method argument |
| `BinaryExpression` | `operator`, `left`, `right` | Logical (`&&`, `\|\|`) and comparison (`==`, `===`, `!=`, `!==`, `>`, `>=`, `<`, `<=`) operators |
| `GroupExpression` | `expression` | A parenthesised sub-expression |

The AST can be obtained three equivalent ways: `compileAst()`, `compile('ast')`, and the `exp.ast` getter after any compilation.

### AST mode via `compile()`

`compile('ast')` is a convenience alias for `compileAst()` — both return the raw AST, while plain `compile()` produces the legacy description tree. Every example below shows **both** results for the same expression: the AST you get from `compileAst()` (or `compile('ast')`), and the description tree `compile()` exposes through its getters.

#### Member access

```ts
const exp = new SlimExpression<User>((n) => n.name);

const ast = exp.compileAst(); // same as exp.compile('ast')
exp.compile();                // builds the legacy description tree
```

AST — `compileAst()` / `compile('ast')`:

```json
{
  "kind": "MemberExpression",
  "object": { "kind": "Identifier", "name": "n", "start": 0, "end": 1 },
  "property": "name",
  "start": 0,
  "end": 6
}
```

Legacy — `compile()`:

```json
{
  "lhs": {
    "propertyName": "name",
    "suffixOperator": "",
    "propertyTree": ["name"]
  },
  "context": null,
  "expObjectName": "n"
}
```

```ts
// exp.leftHandSide.propertyName === 'name'
```

#### Comparison with a constant

```ts
const exp = new SlimExpression<User>((n) => n.num > 25);

const ast = exp.compileAst(); // same as exp.compile('ast')
exp.compile();
```

AST — `compileAst()` / `compile('ast')`:

```json
{
  "kind": "BinaryExpression",
  "operator": ">",
  "left": {
    "kind": "MemberExpression",
    "object": { "kind": "Identifier", "name": "n", "start": 0, "end": 1 },
    "property": "num",
    "start": 0,
    "end": 5
  },
  "right": { "kind": "Literal", "value": 25, "valueType": "number", "start": 8, "end": 10 },
  "start": 0,
  "end": 10
}
```

Legacy — `compile()`:

```json
{
  "lhs": {
    "propertyName": "num",
    "suffixOperator": "",
    "propertyTree": ["num"]
  },
  "rhs": {
    "propertyType": "number",
    "propertyName": "[CONSTANT]",
    "propertyValue": 25,
    "implicitContextName": null
  },
  "operator": ">",
  "context": null,
  "expObjectName": "n"
}
```

```ts
// exp.rightHandSide.propertyName === '[CONSTANT]'
// exp.rightHandSide.propertyValue === 25
// exp.rightHandSide.propertyType === 'number'
```

Boolean, `null`, and string literals are handled the same way (`'boolean'`, `'null'`, `'string'` types).

#### Logical operators and grouping

`&&` binds tighter than `||`, and parentheses become `GroupExpression` nodes. Precedence and associativity are respected exactly as in JavaScript:

```ts
const exp = new SlimExpression<User>((n) => (n.name && n.matricule) || n.isFool);

const ast = exp.compileAst(); // same as exp.compile('ast')
exp.compile();
```

AST — `compileAst()` / `compile('ast')`:

```json
{
  "kind": "BinaryExpression",
  "operator": "||",
  "left": {
    "kind": "GroupExpression",
    "expression": {
      "kind": "BinaryExpression",
      "operator": "&&",
      "left": {
        "kind": "MemberExpression",
        "object": { "kind": "Identifier", "name": "n", "start": 1, "end": 2 },
        "property": "name",
        "start": 1,
        "end": 7
      },
      "right": {
        "kind": "MemberExpression",
        "object": { "kind": "Identifier", "name": "n", "start": 11, "end": 12 },
        "property": "matricule",
        "start": 11,
        "end": 22
      },
      "start": 1,
      "end": 22
    },
    "start": 0,
    "end": 23
  },
  "right": {
    "kind": "MemberExpression",
    "object": { "kind": "Identifier", "name": "n", "start": 27, "end": 28 },
    "property": "isFool",
    "start": 27,
    "end": 35
  },
  "start": 0,
  "end": 35
}
```

```ts
// ast.kind === 'BinaryExpression'        (operator: '||')
// ast.left.kind === 'GroupExpression'    (wraps the && sub-expression)
// ast.left.expression.operator === '&&'
// ast.right.kind === 'MemberExpression'  (n.isFool)
```

Legacy — `compile()`:

```json
{
  "brackets": {
    "openingExp": {
      "lhs": {
        "propertyName": "name",
        "suffixOperator": "",
        "propertyTree": ["name"]
      },
      "next": {
        "bindedBy": "&&",
        "following": {
          "lhs": {
            "propertyName": "matricule",
            "suffixOperator": "",
            "propertyTree": ["matricule"]
          },
          "context": null,
          "expObjectName": "n"
        }
      },
      "context": null,
      "expObjectName": "n"
    },
    "closingExp": {
      "lhs": {
        "propertyName": "matricule",
        "suffixOperator": "",
        "propertyTree": ["matricule"]
      },
      "context": null,
      "expObjectName": "n"
    }
  },
  "next": {
    "bindedBy": "||",
    "following": {
      "lhs": {
        "propertyName": "isFool",
        "suffixOperator": "",
        "propertyTree": ["isFool"]
      },
      "context": null,
      "expObjectName": "n"
    }
  },
  "context": null,
  "expObjectName": "n"
}
```

```ts
// exp.next.bindedBy === '||'
// exp.brackets.openingExp.next.bindedBy === '&&'
```

#### Comparison against the context object

Values that come from the `$` context are ordinary member accesses — the AST does not distinguish them from the input object. Only the legacy builder does.

```ts
const exp = new SlimExpression<User>();
exp.fromAction((n, $) => n.name === $.hello && n.matricule > $.code.is, {
  hello: 'world',
  code: { is: 'dope' }
});

const ast = exp.compileAst(); // same as exp.compile('ast')
exp.compile();
```

AST — `compileAst()` / `compile('ast')`:

```json
{
  "kind": "BinaryExpression",
  "operator": "&&",
  "left": {
    "kind": "BinaryExpression",
    "operator": "===",
    "left": {
      "kind": "MemberExpression",
      "object": { "kind": "Identifier", "name": "n", "start": 0, "end": 1 },
      "property": "name",
      "start": 0,
      "end": 6
    },
    "right": {
      "kind": "MemberExpression",
      "object": { "kind": "Identifier", "name": "$", "start": 11, "end": 12 },
      "property": "hello",
      "start": 11,
      "end": 18
    },
    "start": 0,
    "end": 18
  },
  "right": {
    "kind": "BinaryExpression",
    "operator": ">",
    "left": {
      "kind": "MemberExpression",
      "object": { "kind": "Identifier", "name": "n", "start": 22, "end": 23 },
      "property": "matricule",
      "start": 22,
      "end": 33
    },
    "right": {
      "kind": "MemberExpression",
      "object": {
        "kind": "MemberExpression",
        "object": { "kind": "Identifier", "name": "$", "start": 36, "end": 37 },
        "property": "code",
        "start": 36,
        "end": 42
      },
      "property": "is",
      "start": 36,
      "end": 45
    },
    "start": 22,
    "end": 45
  },
  "start": 0,
  "end": 45
}
```

Legacy — `compile()`:

```json
{
  "lhs": {
    "propertyName": "name",
    "suffixOperator": "",
    "propertyTree": ["name"]
  },
  "rhs": {
    "propertyType": "string",
    "propertyName": "hello",
    "propertyValue": "world",
    "implicitContextName": "$"
  },
  "operator": "===",
  "next": {
    "bindedBy": "&&",
    "following": {
      "lhs": {
        "propertyName": "matricule",
        "suffixOperator": "",
        "propertyTree": ["matricule"]
      },
      "rhs": {
        "propertyType": "string",
        "propertyName": "code.is",
        "propertyValue": "dope",
        "implicitContextName": "$"
      },
      "operator": ">",
      "context": { "hello": "world", "code": { "is": "dope" } },
      "contextName": "$",
      "expObjectName": "n"
    }
  },
  "context": { "hello": "world", "code": { "is": "dope" } },
  "contextName": "$",
  "expObjectName": "n"
}
```

```ts
// exp.operator === '==='
// exp.next.bindedBy === '&&'
// exp.next.followedBy.rightHandSide.propertyName === 'code.is'
// exp.next.followedBy.rightHandSide.propertyValue === 'dope'
```

#### Method calls

Calls become `CallExpression` nodes. Arguments can be literals, member expressions, or nested function literals:

```ts
const exp = new SlimExpression<User>((n) => n.name.includes('hello'));

const ast = exp.compileAst(); // same as exp.compile('ast')
exp.compile();
```

AST — `compileAst()` / `compile('ast')`:

```json
{
  "kind": "CallExpression",
  "callee": {
    "kind": "MemberExpression",
    "object": {
      "kind": "MemberExpression",
      "object": { "kind": "Identifier", "name": "n", "start": 0, "end": 1 },
      "property": "name",
      "start": 0,
      "end": 6
    },
    "property": "includes",
    "start": 0,
    "end": 15
  },
  "arguments": [
    {
      "kind": "Literal",
      "value": "hello",
      "valueType": "string",
      "start": 0,
      "end": 7
    }
  ],
  "start": 0,
  "end": 24
}
```

```ts
// ast.kind === 'CallExpression'
// ast.callee.property === 'includes'
// ast.callee.object.property === 'name'
// ast.arguments[0].value === 'hello'
```

Legacy — `compile()`:

```json
{
  "lhs": {
    "propertyName": "name.includes",
    "suffixOperator": "",
    "isMethod": true,
    "content": {
      "type": "string",
      "primitiveValue": "hello",
      "methodName": "includes"
    },
    "propertyTree": ["name", "includes"]
  },
  "context": null,
  "expObjectName": "n"
}
```

```ts
// exp.leftHandSide.isMethod === true
// exp.leftHandSide.propertyName === 'name.includes'
// exp.leftHandSide.content.methodName === 'includes'
// exp.leftHandSide.content.primitiveValue === 'hello'
```

Method arguments that come from the context are resolved too:

```ts
const exp = new SlimExpression<User>();
exp.fromAction((n, $) => n.name.includes($.hello), { hello: 'mundo' });
exp.compile();
// exp.leftHandSide.content.primitiveValue === 'mundo'
```

#### Nested function expressions

When a method argument is itself an arrow function, it is kept as a `FunctionExpression` node carrying the raw source text. Call `compileAst()` on a new instance to get its own AST, or let the legacy builder compile it recursively:

```ts
const exp = new SlimExpression<User>((n) =>
  n.complexValues.map((v) => v.complexity.made.simple)
);

const ast = exp.compileAst(); // same as exp.compile('ast')
exp.compile();
```

AST — `compileAst()` / `compile('ast')`:

```json
{
  "kind": "CallExpression",
  "callee": {
    "kind": "MemberExpression",
    "object": {
      "kind": "MemberExpression",
      "object": { "kind": "Identifier", "name": "n", "start": 0, "end": 1 },
      "property": "complexValues",
      "start": 0,
      "end": 15
    },
    "property": "map",
    "start": 0,
    "end": 19
  },
  "arguments": [
    {
      "kind": "FunctionExpression",
      "source": "v => v.complexity.made.simple",
      "start": 20,
      "end": 49
    }
  ],
  "start": 0,
  "end": 50
}
```

Legacy — `compile()`:

```json
{
  "lhs": {
    "propertyName": "complexValues.map",
    "suffixOperator": "",
    "isMethod": true,
    "content": {
      "type": "expression",
      "isExpression": true,
      "expression": {
        "lhs": {
          "propertyName": "complexity.made.simple",
          "suffixOperator": "",
          "propertyTree": ["complexity", "made", "simple"]
        },
        "context": null,
        "expObjectName": "v"
      },
      "methodName": "map"
    },
    "propertyTree": ["complexValues", "map"]
  },
  "context": null,
  "expObjectName": "n"
}
```

```ts
// exp.leftHandSide.isMethod === true
// exp.leftHandSide.content.methodName === 'map'
// exp.leftHandSide.content.isExpression === true
// exp.leftHandSide.content.expression.leftHandSide.propertyName === 'complexity.made.simple'
```

Context values flow into nested expressions as well:

```ts
const exp = new SlimExpression<User>();
exp.fromAction(
  (n, $) => n.complexValues.map((v) => v.complexity.made.simple === $.complexValue),
  { complexValue: 45 }
);
exp.compile();
// exp.leftHandSide.content.expression.rightHandSide.propertyName === 'complexValue'
// exp.leftHandSide.content.expression.rightHandSide.propertyValue === 45
```

#### Unary negation

```ts
const exp = new SlimExpression<User>((n) => !n.matricule);

const ast = exp.compileAst(); // same as exp.compile('ast')
exp.compile();
```

AST — `compileAst()` / `compile('ast')`:

```json
{
  "kind": "UnaryExpression",
  "operator": "!",
  "argument": {
    "kind": "MemberExpression",
    "object": { "kind": "Identifier", "name": "n", "start": 1, "end": 2 },
    "property": "matricule",
    "start": 1,
    "end": 12
  },
  "start": 0,
  "end": 12
}
```

```ts
// ast.kind === 'UnaryExpression'
// ast.operator === '!'
// ast.argument.property === 'matricule'
```

Legacy — `compile()`:

```json
{
  "lhs": {
    "propertyName": "matricule",
    "suffixOperator": "!",
    "propertyTree": ["matricule"]
  },
  "context": null,
  "expObjectName": "n"
}
```

```ts
// exp.leftHandSide.suffixOperator === '!'
```

`!!` is parsed as two nested `UnaryExpression` nodes. When it is the root of the expression the legacy builder collapses the chain into `leftHandSide.suffixOperator` (`'!!'`); the AST keeps the full nesting.

---

## `compile()` — the legacy description tree

`compile()` runs the same parse and then projects the AST into the "legacy" description tree, which is exposed through public getters rather than returned:

| Getter | Description |
| --- | --- |
| `leftHandSide` | The LHS: `propertyName`, `propertyTree`, `suffixOperator`, plus method details (`isMethod`, `content`) when the LHS is a call. |
| `rightHandSide` | The RHS: `propertyType`, `propertyName`, `propertyValue`, `implicitContextName`. Constants are reported with `propertyName === '[CONSTANT]'`. |
| `operator` | The comparison operator joining LHS and RHS, if any. |
| `next` | `{ bindedBy, followedBy }` — the next expression chained by a logical operator. |
| `brackets` | `{ openingExp, closingExp }` — the first/last expression of a parenthesised group. |
| `context` / `contextName` / `expObjectName` | The supplied context, the context parameter name, and the input parameter name. |
| `ast` | The raw AST produced during compilation (same shape as `compileAst()`). |

Reusing the earlier example:

```ts
const exp = new SlimExpression<User>();
exp.fromAction(
  (n, $) => n.name === $.hello && n.matricule > $.code.is,
  { hello: 'world', code: { is: 'dope' } }
);
exp.compile();

console.log(exp.operator);                 // '==='
console.log(exp.leftHandSide.propertyName); // 'name'
console.log(exp.rightHandSide.propertyName); // 'hello'
console.log(exp.rightHandSide.propertyValue); // 'world'
console.log(exp.next.bindedBy);            // '&&'
console.log(exp.next.followedBy.operator); // '>'
console.log(exp.next.followedBy.rightHandSide.propertyName); // 'code.is'
console.log(exp.next.followedBy.rightHandSide.propertyValue); // 'dope'
console.log(exp.ast.kind);                 // 'BinaryExpression'
```

The full description tree for the same expression is shown in the "Comparison against the context object" example above.

### How the two results relate

`compileAst()` and `compile()` never disagree about the parse — one is a raw syntax tree, the other is a purpose-built projection:

- **Where the value lives.** In the AST, `$.code.is` is a `MemberExpression`. In the legacy tree, the builder walks the context object, resolves the actual value, and reports it as `rightHandSide.propertyValue` with `propertyName` set to the context-relative path (`'code.is'`).
- **Logical chains.** The AST nests `&&`/`||` as left-deep `BinaryExpression`s. The legacy tree flattens them into the `next` chain (`bindedBy` + `followedBy`).
- **Brackets.** The AST preserves parentheses as `GroupExpression`. The legacy tree materialises them as `brackets.openingExp` / `brackets.closingExp`.
- **Method calls.** The AST keeps `CallExpression` with a `callee` chain. The legacy tree flattens that into `leftHandSide.isMethod`, `propertyName` (e.g. `'name.includes'`), and `content.methodName`.
- **Constants.** The AST keeps a typed `Literal`. The legacy tree converts it to `rightHandSide.propertyType`/`propertyValue` with the sentinel `propertyName === '[CONSTANT]'`.
- **Nested functions.** A `FunctionExpression` argument is recompiled recursively by the legacy builder into `leftHandSide.content.expression`, a full child `SlimExpression` with its own getters.

### Legacy anonymous functions

`function (n) { return n.name > 5; }` style functions are supported everywhere arrow functions are:

```ts
const exp = new SlimExpression<User>(function (n) {
  return n.name === $.hello;
});
exp.compile();
exp.compileAst(); // the AST and the description tree are both available
```

---

## Utilities

### `nameOf`

Extracts the property name of a member-access expression without compiling:

```ts
SlimExpression.nameOf((n) => n.name);             // 'name'
SlimExpression.nameOf((n) => n.profile.firstName); // 'profile.firstName'
```

### `extractContent`

Gives low-level access to the extracted function source before parsing:

```ts
const result = SlimExpression.extractContent((n) => n.name === 'test');
// result.expressionContent === 'n.name === \'test\''
// result.isLegacyFunc === false
// result.expObj === 'n'
// result.ctxName === undefined
```

### `computeHash`

Produces a stable hash of the compiled description. Two expressions with the same shape hash identically:

```ts
const a = new SlimExpression<User>((n) => !!n.name);
const b = new SlimExpression<User>((n) => !!n.name);
a.compile(); b.compile();
a.computeHash() === b.computeHash(); // true
```

### `toString`

`exp.toString()` returns a pretty-printed JSON representation of the description tree (including `context`, `contextName` and `expObjectName`).

---

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

Context-related codes deserve special attention:

- `FUNCTION_NOT_SET` — no function was passed to the constructor or `fromAction`.
- `CONTEXT_REQUIRED` — the expression references `$` but no context was supplied (or `throwIfContextIsNull` was `true` and the context was `null`).
- `CONTEXT_PROPERTY_NOT_FOUND` — a property referenced on the context is missing. Pass `throwIfContextIsNull: false` to resolve missing values to `undefined` instead of throwing.

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
