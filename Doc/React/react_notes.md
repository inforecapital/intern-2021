# Note for react

## study javacript first

### data structure:

- Number: store as IEEE number
- Number
- BigInt
- String
- Boolean
- Symbol (new in ES2015)
- Object:
  Function
  Array
  Date
  RegExp
- null
- undefined

### variables

New variables in JavaScript are declared using one of three keywords: let, const, or var

`let` allows you to declare block-level variables. The declared variable is available from the block it is enclosed in

```js
// myLetVariable is *not* visible out here

for (let myLetVariable = 0; myLetVariable < 5; myLetVariable++) {
  // myLetVariable is only visible in here
}

// myLetVariable is *not* visible out here
```

`const` allows you to declare variables whose values are never intended to change. The variable is available from the block it is declared in.

`var` is the most common declarative keyword. It does not have the restrictions that the other two keywords have. This is because it was traditionally the only way to declare a variable in JavaScript. A variable declared with the var keyword is available from the function it is declared in.

```js
// myVarVariable *is* visible out here

for (var myVarVariable = 0; myVarVariable < 5; myVarVariable++) {
  // myVarVariable is visible to the whole function
}

// myVarVariable *is* visible out here
```

If you declare a variable without assigning any value to it, its type is `undefined`.

### control structure

JavaScript also contains two other prominent for loops: `for...of`

```js
for (let value of array) {
  // do something with value
}
```

and `for...in`:

```js
for (let property in object) {
  // do something with object property
}
```

The switch statement can be used for multiple branches based on a number or string:

```js
switch (action) {
  case "draw":
    drawIt();
    break;
  case "eat":
    eatIt();
    break;
  default:
    doNothing();
}
```

The default clause is optional.

Warning: If you don't add a break statement, execution will "fall through" to the next level.
This is very rarely what you want — in fact it's worth specifically labeling deliberate fallthrough with a comment if you really meant it to aid debugging

### object

There are two basic ways to create an empty object:

`var obj = new Object();`
And:
`var obj = {};`

Object literal syntax can be used to initialize an object in its entirety:

```js
var obj = {
  name: "Carrot",
  _for: "Max", // 'for' is a reserved word, use '_for' instead.
  details: {
    color: "orange",
    size: 12,
  },
};
```

Attribute access can be chained together:

```js
obj.details.color; // orange
obj["details"]["size"]; // 12
```

Once created, an object's properties can again be accessed in one of two ways:
dot notation and bracket notation

### array

create an array:

```js
var a = new Array();
a[0] = "dog";
a[1] = "cat";
a[2] = "hen";
a.length; // 3
```

A more convenient notation is to use an array literal:

```js
var a = ["dog", "cat", "hen"];
a.length; // 3
```

append an item to an array do it like this: `a.push(item);`

### function

declared as

```js
function fname(parameter or ...param){
    function body here;
    return returnvalue;
}
```

could pass in multiple parameters. Stored as `arguments`. Use `for..of` to iterate `arguments`

Immediately invoked function expression (IIFE), and the syntax for using it with an anonymous function looks like this:

```js
(function () {
  // …
})();
```

- function as class

```js
function personFullName() {
  return this.first + " " + this.last;
}
function personFullNameReversed() {
  return this.last + ", " + this.first;
}
function Person(first, last) {
  this.first = first;
  this.last = last;
  this.fullName = personFullName;
  this.fullNameReversed = personFullNameReversed;
}

var s = new Person("Simon", "Willison");

s.fullName(); // "Simon Willison"
s.fullNameReversed(); // "Willison, Simon"
```

### closure

A closure is the combination of a function and the scope object in which it was created. Closures let you save state — as such, they can often be used in place of objects

function and closure are complicated, for detailed usage see [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript)

## React main concept

1. introducing JSX: syntax extension to JavaScript

Specifying Attributes with JSX
You may use quotes to specify string literals as attributes:

`const element = <div tabIndex="0"></div>;`
You may also use curly braces to embed a JavaScript expression in an attribute:

`const element = <img src={user.avatarUrl}></img>;`
Don’t put quotes around curly braces when embedding a JavaScript expression in an attribute. You should either use quotes (for string values) or curly braces (for expressions), but not both in the same attribute.

JSX Prevents Injection Attacks
It is safe to embed user input in JSX:

```jsx
const title = response.potentiallyMaliciousInput;
// This is safe:
const element = <h1>{title}</h1>;
```

By default, React DOM escapes any values embedded in JSX before rendering them. Thus it ensures that you can never inject anything that’s not explicitly written in your application. Everything is converted to a string before being rendered.

### JSX

以小写字母开头的元素代表一个 HTML 内置组件，比如`<div>`或者 `<span>`会生成相应的字符串 'div' 或者 'span' 传递给 `React.createElement`（作为参数）。大写字母开头的元素则对应着在 `JavaScript` 引入或自定义的组件，如 `<Foo />`会编译为 `React.createElement(Foo)。`

你不能将通用表达式作为 React 元素类型。如果你想通过通用表达式来（动态）决定元素类型，你需要首先将它赋值给大写字母开头的变量。

```jsx
import React from "react";
import { PhotoStory, VideoStory } from "./stories";

const components = {
  photo: PhotoStory,
  video: VideoStory,
};

function Story(props) {
  // 正确！JSX 类型可以是大写字母开头的变量。
  const SpecificStory = components[props.storyType];
  return <SpecificStory story={props.story} />;
}
```

if 语句以及 for 循环不是 JavaScript 表达式，所以不能在 JSX 中直接使用。但是，你可以用在 JSX 以外的代码中

`Props` 默认值为 “`True`”

如果你已经有了一个 props 对象，你可以使用展开运算符 ... 来在 JSX 中传递整个 props 对象。以下两个组件是等价的:

```jsx
function App1() {
  return <Greeting firstName="Ben" lastName="Hector" />;
}

function App2() {
  const props = { firstName: "Ben", lastName: "Hector" };
  return <Greeting {...props} />;
}
```

你还可以选择只保留当前组件需要接收的 props，并使用展开运算符将其他 props 传递下去。

```jsx
const Button = (props) => {
  const { kind, ...other } = props;
  const className = kind === "primary" ? "PrimaryButton" : "SecondaryButton";
  return <button className={className} {...other} />;
};

const App = () => {
  return (
    <div>
      <Button kind="primary" onClick={() => console.log("clicked!")}>
        Hello World!
      </Button>
    </div>
  );
};
```

在上述例子中，`kind` 的 `prop` 会被安全的保留，它将不会被传递给 `DOM` 中的 `<button>` 元素。 所有其他的 `props` 会通过 `...other` 对象传递，使得这个组件的应用可以非常灵活。你可以看到它传递了一个 `onClick` 和 `children` 属性。

通常，JSX 中的 JavaScript 表达式将会被计算为字符串、React 元素或者是列表。不过，props.children 和其他 prop 一样，它可以传递任意类型的数据，而不仅仅是 React 已知的可渲染类型。例如，如果你有一个自定义组件，你可以把回调函数作为 props.children 进行传递:

```jsx
// 调用子元素回调 numTimes 次，来重复生成组件
function Repeat(props) {
  let items = [];
  for (let i = 0; i < props.numTimes; i++) {
    items.push(props.children(i));
  }
  return <div>{items}</div>;
}

function ListOfTenThings() {
  return (
    <Repeat numTimes={10}>
      {(index) => <div key={index}>This is item {index} in the list</div>}
    </Repeat>
  );
}
```

### back to React

`Props` 的只读性: 组件无论是使用函数声明还是通过 `class` 声明，都决不能修改自身的 `props`。
`State` 与 `props` 类似，但是 `state` 是私有的，并且完全受控于当前组件。

将生命周期方法添加到 Class 中:
