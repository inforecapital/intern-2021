# Notes for TypeScript

## any

TypeScript also has a special type, `any`, that you can use whenever you don’t want a particular value to cause typechecking errors.

When a value is of type `any`, you can access any properties of it (which will in turn be of type `any`), call it like a function, assign it to (or from) a value of any type, or pretty much anything else that’s syntactically legal:

```ts
let obj: any = { x: 0 };
// None of the following lines of code will throw compiler errors.
// Using `any` disables all further type checking, and it is assumed
// you know the environment better than TypeScript.
obj.foo();
obj();
obj.bar = 100;
obj = "hello";
const n: number = obj;
```

## Type Annotations on Variables

When you declare a variable using `const`, `var`, or `let`, you can optionally add a type annotation to explicitly specify the type of the variable:

`let myName: string = "Alice";`

TypeScript doesn’t use “types on the left”-style declarations like `int x = 0;` Type annotations will always go after the thing being typed.

## Parameter Type Annotations

When you declare a function, you can add type annotations after each parameter to declare what types of parameters the function accepts. Parameter type annotations go after the parameter name:

```ts
// Parameter type annotation
function greet(name: string) {
  console.log("Hello, " + name.toUpperCase() + "!!");
}
```

## Return Type Annotations

You can also add return type annotations. Return type annotations appear after the parameter list:

```ts
function getFavoriteNumber(): number {
  return 26;
}
```

## Optional Properties

Object types can also specify that some or all of their properties are optional. To do this, add a `?` after the property name:

```ts
function printName(obj: { first: string; last?: string }) {
  // ...
}
// Both OK
printName({ first: "Bob" });
printName({ first: "Alice", last: "Alisson" });
```

In JavaScript, if you access a property that doesn’t exist, you’ll get the value `undefined` rather than a runtime error. Because of this, when you read from an optional property, you’ll have to check for `undefined` before using it.

## Union Type

The first way to combine types you might see is a union type. A union type is a type formed from two or more other types, representing values that may be any one of those types. We refer to each of these types as the union’s members.

TypeScript will only allow you to do things with the union if that thing is valid for every member of the union. For example, if you have the union string | number, you can’t use methods that are only available on string like `toUpperCase()`

Sometimes you’ll have a union where all the members have something in common. For example, both arrays and strings have a slice method. If every member in a union has a property in common, you can use that property without narrowing:

```ts
// Return type is inferred as number[] | string
function getFirstThree(x: number[] | string) {
  return x.slice(0, 3);
}
```

## Type Aliases

The syntax for a type alias is:

```ts
type Point = {
  x: number;
  y: number;
};

// Exactly the same as the earlier example
function printCoord(pt: Point) {
  console.log("The coordinate's x value is " + pt.x);
  console.log("The coordinate's y value is " + pt.y);
}

printCoord({ x: 100, y: 100 });
```

You can actually use a type alias to give a name to any type at all, not just an object type. For example, a type alias can name a union type:

`type ID = number | string;`

## Interface vs Type alias

- Type aliases may not participate in declaration merging, but interfaces can.
- Interfaces may only be used to declare the shapes of object, not re-name primitives.
- Interface names will always appear in their original form in error messages, but only when they are used by name.

## Type Assertions

Sometimes you will have information about the type of a value that TypeScript can’t know about.

For example, if you’re using `document.getElementById`, TypeScript only knows that this will return some kind of HTMLElement, but you might know that your page will always have an `HTMLCanvasElement` with a given ID.

In this situation, you can use a type assertion to specify a more specific type:

`const myCanvas = document.getElementById("main_canvas") as HTMLCanvasElement;`

## Non-null Assertion Operator (Postfix !)

TypeScript also has a special syntax for removing null and undefined from a type without doing any explicit checking. Writing ! after any expression is effectively a type assertion that the value isn’t null or undefined:

```ts
function liveDangerously(x?: number | null) {
  // No error
  console.log(x!.toFixed());
}
```

## Enums

Enums are a feature added to JavaScript by TypeScript which allows for describing a value which could be one of a set of possible named constants.

## The `in` operator narrowing

Javascript has an operator for determining if an object has a property with a name: the in operator. TypeScript takes this into account as a way to narrow down potential types.

For example, with the code: "value" in x. where "value" is a string literal and x is a union type. The “true” branch narrows x’s types which have either an optional or required property value, and the “false” branch narrows to types which have an optional or missing property value.

```ts
type Fish = { swim: () => void };
type Bird = { fly: () => void };

function move(animal: Fish | Bird) {
  if ("swim" in animal) {
    return animal.swim();
  }

  return animal.fly();
}
```

The `never` type
When narrowing, you can reduce the options of a union to a point where you have removed all possibilities and have nothing left. In those cases, TypeScript will use a `never` type to represent a state which shouldn’t exist.

## function Call Signatures

In JavaScript, functions can have properties in addition to being callable. However, the function type expression syntax doesn’t allow for declaring properties. If we want to describe something callable with properties, we can write a call signature in an object type:

```ts
type DescribableFunction = {
  description: string;
  (someArg: number): boolean;
};
function doSomething(fn: DescribableFunction) {
  console.log(fn.description + " returned " + fn(6));
}
```

Note that the syntax is slightly different compared to a function type expression - use `:` between the parameter list and the return type rather than `=>`.

## Generics

In TypeScript, generics are used when we want to describe a correspondence between two values. We do this by declaring a type parameter in the function signature:

```ts
function firstElement<Type>(arr: Type[]): Type {
  return arr[0];
}
```
