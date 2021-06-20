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

我们可以为 class 组件声明一些特殊的方法，当组件挂载或卸载时就会去执行这些方法:

```jsx
componentDidMount() {
  }

componentWillUnmount() {
  }
```

这些方法叫做“生命周期方法”。

`componentDidMount()`方法会在组件已经被渲染到 DOM 中后运行
state 注意事项:

- 不要直接修改 State，而是用 setstate()
- State 的更新可能是异步的
  出于性能考虑，React 可能会把多个 setState() 调用合并成一个调用。

  因为 this.props 和 this.state 可能会异步更新，所以你不要依赖他们的值来更新下一个状态。
  要解决这个问题，可以让 setState() 接收一个函数而不是一个对象。这个函数用上一个 state 作为第一个参数，将此次更新被应用时的 props 做为第二个参数:

  ```js
  // Correct
  this.setState((state, props) => ({
    counter: state.counter + props.increment,
  }));
  ```

- State 的更新会被合并
  当你调用 setState() 的时候，React 会把你提供的对象合并到当前的 state。

- “自上而下”或是“单向”的数据流。
  任何的 state 总是所属于特定的组件，而且从该 state 派生的任何数据或 UI 只能影响树中“低于”它们的组件。

  如果你把一个以组件构成的树想象成一个 props 的数据瀑布的话，那么每一个组件的 state 就像是在任意一点上给瀑布增加额外的水源，但是它只能向下流动。

### 事件处理

React 事件的命名采用小驼峰式（camelCase），而不是纯小写。
使用 JSX 语法时你需要传入一个函数作为事件处理函数，而不是一个字符串。

```jsx
<button onClick={activateLasers}>Activate Lasers</button>
```

你不能通过返回 false 的方式阻止默认行为。你必须显式的使用 preventDefault

在 React 中，你可以创建不同的组件来封装各种你需要的行为。然后，依据应用的不同状态，你可以只渲染对应状态下的部分内容。

`&&` 运算符

```jsx
function Mailbox(props) {
  const unreadMessages = props.unreadMessages;
  return (
    <div>
      <h1>Hello!</h1>
      {unreadMessages.length > 0 && (
        <h2>You have {unreadMessages.length} unread messages.</h2>
      )}
    </div>
  );
}

const messages = ["React", "Re: React", "Re:Re: React"];
ReactDOM.render(
  <Mailbox unreadMessages={messages} />,
  document.getElementById("root")
);
```

是因为在 `JavaScript` 中，`true && expression` 总是会返回 `expression`, 而 fals`e && expression` 总是会返回 `false`。

因此，如果条件是 true，&& 右侧的元素就会被渲染，如果是 false，React 会忽略并跳过它。

请注意，返回 false 的表达式会使 && 后面的元素被跳过，但会返回 false 表达式。在下面示例中，render 方法的返回值是 `<div>0</div>`。

```jsx
render() {
  const count = 0;
  return (
    <div>
      { count && <h1>Messages: {count}</h1>}
    </div>
  );
}
```

- list and key
  `key` 帮助 React 识别哪些元素改变了，比如被添加或删除。因此你应当给数组中的每一个元素赋予一个确定的标识。
  一个元素的 key 最好是这个元素在列表中拥有的一个独一无二的字符串。通常，我们使用数据中的 id 来作为元素的 key:

```jsx
const todoItems = todos.map((todo) =>
  <li key={todo.id}>
    {todo.text}
  </li>
```

例子:正确的使用 key 的方式

```jsx
function ListItem(props) {
  // 正确！这里不需要指定 key:
  return <li>{props.value}</li>;
}

function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) => (
    // 正确！key 应该在数组的上下文中被指定
    <ListItem key={number.toString()} value={number} />
  ));
  return <ul>{listItems}</ul>;
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById("root")
);
```

数组元素中使用的 key 在其兄弟节点之间应该是独一无二的。然而，它们不需要是全局唯一的。当我们生成两个不同的数组时，我们可以使用相同的 key 值

- lifting state up
  在 React 应用中，任何可变数据应当只有一个相对应的唯一“数据源”。通常，state 都是首先添加到需要渲染数据的组件中去。然后，如果其他组件也需要这个 state，那么你可以将它提升至这些组件的最近共同父组件中。你应当依靠自上而下的数据流，而不是尝试在不同组件间同步 state。
  如果某些数据可以由 props 或 state 推导得出，那么它就不应该存在于 state 中。

`render()`: The render() function should be pure, meaning that it does not modify component state, it returns the same result each time it’s invoked, and it does not directly interact with the browser

组件的生命周期分成三个状态:

`Mounting`:已插入真实 DOM
`Updating`:正在被重新渲染
`Unmounting`:已移出真实 DOM
`React` 为每个状态都提供了两种处理函数，will 函数在进入状态之前调用，did 函数在进入状态之后调用，三种状态共计五种处理函数。

`componentWillMount()`: As soon as your component is about to be mounted, this is called. This means that we can run code that is necessary to our component functioning. As render is called multiple times in the components life, we would generally put code here that we would only ever want executed once, i.e. XHR requests.
`componentDidMount(prevProps, prevState, snapshot)`:
componentDidMount() is invoked immediately after a component is mounted (inserted into the tree). Initialization that requires DOM nodes should go here. If you need to load data from a remote endpoint, this is a good place to instantiate the network request.

This method is a good place to set up any subscriptions. If you do that, don’t forget to unsubscribe in componentWillUnmount().

You may call setState() immediately in componentDidMount(). It will trigger an extra rendering, but it will happen before the browser updates the screen. This guarantees that even though the render() will be called twice in this case, the user won’t see the intermediate state. Use this pattern with caution because it often causes performance issues.
`componentWillUpdate(object nextProps, object nextState)`
`componentDidUpdate(object prevProps, object prevState)`
`componentWillUnmount()`: componentWillUnmount() is invoked immediately before a component is unmounted and destroyed. Perform any necessary cleanup in this method, such as invalidating timers, canceling network requests, or cleaning up any subscriptions that were created in componentDidMount().
此外，React 还提供两种特殊状态的处理函数。

`componentWillReceiveProps(object nextProps)`:已加载组件收到新的参数时调用
`shouldComponentUpdate(object nextProps, object nextState)`:组件判断是否重新渲染时调用

[Components Life Cycle Diagram](https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)

- 表单

`<input type="text">,` `<textarea>` 和 `<select>`之类的标签都非常相似—它们都接受一个 value 属性，你可以使用它来实现受控组件。

注意

你可以将数组传递到 value 属性中，以支持在 select 标签中选择多个选项：

`<select multiple={true} value={['B', 'C']}>`

## Advanced topic

### code splitting

`const OtherComponent = React.lazy(() => import('./OtherComponent'));`
This will automatically load the bundle containing the OtherComponent when this component is first rendered.

React.lazy takes a function that must call a dynamic import(). This must return a Promise which resolves to a module with a default export containing a React component.

The lazy component should then be rendered inside a Suspense component, which allows us to show some fallback content (such as a loading indicator) while we’re waiting for the lazy component to load.

```jsx
import React, { Suspense } from "react";

const OtherComponent = React.lazy(() => import("./OtherComponent"));

function MyComponent() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <OtherComponent />
      </Suspense>
    </div>
  );
}
```

### Context

Context provides a way to share values like these between components without having to explicitly pass a prop through every level of the tree.

```jsx
// Context lets us pass a value deep into the component tree
// without explicitly threading it through every component.
// Create a context for the current theme (with "light" as the default).
const ThemeContext = React.createContext('light');

class App extends React.Component {
  render() {
    // Use a Provider to pass the current theme to the tree below.
    // Any component can read it, no matter how deep it is.
    // In this example, we're passing "dark" as the current value.
    return (
      <ThemeContext.Provider value="dark">
        <Toolbar />
      </ThemeContext.Provider>
    );
  }
}

// A component in the middle doesn't have to
// pass the theme down explicitly anymore.
function Toolbar() {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

class ThemedButton extends React.Component {
  // Assign a contextType to read the current theme context.
  // React will find the closest theme Provider above and use its value.
  // In this example, the current theme is "dark".
  static contextType = ThemeContext;
  render() {
    return <Button theme={this.context} />;
  }
```

Context is primarily used when some data needs to be accessible by many components at different nesting levels. Apply it sparingly because it makes component reuse more difficult.

If you only want to avoid passing some props through many levels, component composition is often a simpler solution than context.

For example, consider a Page component that passes a user and avatarSize prop several levels down so that deeply nested Link and Avatar components can read it:

```jsx
<Page user={user} avatarSize={avatarSize} />
// ... which renders ...
<PageLayout user={user} avatarSize={avatarSize} />
// ... which renders ...
<NavigationBar user={user} avatarSize={avatarSize} />
// ... which renders ...
<Link href={user.permalink}>
  <Avatar user={user} size={avatarSize} />
</Link>
```

It might feel redundant to pass down the user and avatarSize props through many levels if in the end only the Avatar component really needs it. It’s also annoying that whenever the Avatar component needs more props from the top, you have to add them at all the intermediate levels too.

One way to solve this issue without context is to pass down the Avatar component itself so that the intermediate components don’t need to know about the user or avatarSize props:

```jsx
function Page(props) {
  const user = props.user;
  const userLink = (
    <Link href={user.permalink}>
      <Avatar user={user} size={props.avatarSize} />
    </Link>
  );
  return <PageLayout userLink={userLink} />;
}

// Now, we have:
<Page user={user} avatarSize={avatarSize} />
// ... which renders ...
<PageLayout userLink={...} />
// ... which renders ...
<NavigationBar userLink={...} />
// ... which renders ...
{props.userLink}
```

With this change, only the top-most Page component needs to know about the Link and Avatar components’ use of user and avatarSize.

React.createContext
`const MyContext = React.createContext(defaultValue);`
创建一个 `Context` 对象。当 `React` 渲染一个订阅了这个 `Context` 对象的组件，这个组件会从组件树中离自身最近的那个匹配的 `Provider` 中读取到当前的 `context` 值。

Context.Provider
`<MyContext.Provider value={/* 某个值 */}>`
每个 Context 对象都会返回一个 Provider React 组件，它允许消费组件订阅 context 的变化。

`Provider` 接收一个 `value` 属性，传递给消费组件。一个 `Provider` 可以和多个消费组件有对应关系。多个 `Provider` 也可以嵌套使用，里层的会覆盖外层的数据。

当 `Provider` 的 `value` 值发生变化时(`Object.is()`)，它内部的所有消费组件都会重新渲染。Provider 及其内部 consumer 组件都不受制于 `shouldComponentUpdate` 函数，因此当 consumer 组件在其祖先组件退出更新的情况下也能更新。

挂载在 class 上的 contextType 属性会被重赋值为一个由 `React.createContext()` 创建的 `Context` 对象。此属性能让你使用 `this.context` 来消费最近 `Context` 上的那个值。你可以在任何生命周期中访问到它，包括 `render` 函数中

一个 React 组件可以订阅 context 的变更，此组件可以让你在函数式组件中可以订阅 context:

```jsx
<MyContext.Consumer>
  {value => /* 基于 context 值进行渲染*/}
</MyContext.Consumer>
```

这种方法需要一个函数作为子元素（function as a child）。这个函数接收当前的 context 值，并返回一个 React 节点。传递给函数的 value 值等价于组件树上方离这个 context 最近的 Provider 提供的 value 值。如果没有对应的 Provider，value 参数等同于传递给 createContext() 的 defaultValue。

注意事项
因为 context 会使用参考标识（reference identity）来决定何时进行渲染，这里可能会有一些陷阱，当 provider 的父组件进行重渲染时，可能会在 consumers 组件中触发意外的渲染。举个例子，当每一次 Provider 重渲染时，以下的代码会重渲染所有下面的 consumers 组件，因为 value 属性总是被赋值为新的对象：

```jsx
class App extends React.Component {
  render() {
    return (
      <MyContext.Provider value={{ something: "something" }}>
        <Toolbar />
      </MyContext.Provider>
    );
  }
}
```

为了防止这种情况，将 value 状态提升到父节点的 state 里：

```jsx
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: { something: "something" },
    };
  }

  render() {
    return (
      <MyContext.Provider value={this.state.value}>
        <Toolbar />
      </MyContext.Provider>
    );
  }
}
```

### error boundaries

错误边界是一种 React 组件，这种组件可以捕获发生在其子组件树任何位置的 JavaScript 错误，并打印这些错误，同时展示降级 UI，而并不会渲染那些发生崩溃的子组件树。错误边界在渲染期间、生命周期方法和整个组件树的构造函数中捕获错误。

注意

错误边界无法捕获以下场景中产生的错误：

事件处理（了解更多）
异步代码（例如 setTimeout 或 requestAnimationFrame 回调函数）
服务端渲染
它自身抛出来的错误（并非它的子组件）

如果你需要在事件处理器内部捕获错误，使用普通的 JavaScript try / catch 语句：

```jsx
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    try {
      // 执行操作，如有错误则会抛出
    } catch (error) {
      this.setState({ error });
    }
  }

  render() {
    if (this.state.error) {
      return <h1>Caught an error.</h1>;
    }
    return <button onClick={this.handleClick}>Click Me</button>;
  }
}
```

### Refs 转发

Ref: React supports a special attribute that you can attach to any component. The ref attribute can be an object created by React.createRef() function or a callback function, or a string (in legacy API). When the ref attribute is a callback function, the function receives the underlying DOM element or class instance (depending on the type of element) as its argument. This allows you to have direct access to the DOM element or component instance.

(vs Key: A “key” is a special string attribute you need to include when creating arrays of elements. Keys help React identify which items have changed, are added, or are removed. Keys should be given to the elements inside an array to give the elements a stable identity.

Keys only need to be unique among sibling elements in the same array. They don’t need to be unique across the whole application or even a single component.)
Ref 转发是一项将 ref 自动地通过组件传递到其一子组件的技巧。
Ref 转发是一个可选特性，其允许某些组件接收 ref，并将其向下传递（换句话说，“转发”它）给子组件

在下面的示例中，FancyButton 使用 React.forwardRef 来获取传递给它的 ref，然后转发到它渲染的 DOM button：

```jsx
const FancyButton = React.forwardRef((props, ref) => (
  <button ref={ref} className="FancyButton">
    {props.children}
  </button>
));

// 你可以直接获取 DOM button 的 ref：
const ref = React.createRef();
<FancyButton ref={ref}>Click me!</FancyButton>;
```

这样，使用 FancyButton 的组件可以获取底层 DOM 节点 button 的 ref ，并在必要时访问，就像其直接使用 DOM button 一样。

以下是对上述示例发生情况的逐步解释：

我们通过调用 `React.createRef` 创建了一个 `React ref` 并将其赋值给 `ref` 变量。
我们通过指定 `ref` 为 `JSX` 属性，将其向下传递给 `<FancyButton ref={ref}>`。
`React` 传递 `ref` 给 `forwardRef` 内函数 `(props, ref) => ...`，作为其第二个参数。
我们向下转发该 `ref` 参数到 `<button ref={ref}>`，将其指定为 `JSX` 属性。
当 `ref` 挂载完成，`ref.current` 将指向 `<button> DOM` 节点。
