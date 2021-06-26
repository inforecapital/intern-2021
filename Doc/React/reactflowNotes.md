# ReactFlow

This is the list of `prop` types you can pass to the main ReactFlow component.
`import ReactFlow from 'react-flow-renderer';`

## Basic Props

`elements`: array of `nodes` and `edges` (required)
`style`: css properties
`className`: additional class name

`Typescript`: The interface of the ReactFlow Prop Types are exported as ReactFlowProps. You can use it in your code as follows:
`import { ReactFlowProps } from 'react-flow-renderer';`

## Helper Functions

If you want to remove a node or connect two nodes with each other you need to pass a function to onElementsRemove and onConnect. In order to simplify this process there are some helper functions you can use:

```jsx
import ReactFlow, {
  isNode,
  isEdge,
  removeElements,
  addEdge,
} from "react-flow-renderer";
```

## Node Options

You create nodes by adding them to the elements array of the ReactFlow component.
Node example:

```jsx
{
  id: '1',
  type: 'input',
  data: { label: 'Node 1' },
  position: { x: 250, y: 5 }
}
```

Options
`id`: `string` (required)
`position`: `{ x: number, y: number }` (required)
`data`: `{}` (required if you are using a standard type, otherwise depends on your implementation)
`type`: `'input' | 'output' | 'default'` or a custom one you implemented

## Edge options

`id`: `string` (required)
`source`: `string` (an id of a node) (required)
`target`: `string` (an id of a node) (required)
