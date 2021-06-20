/*
让我们来快速概括一下发生了什么和这些方法的调用顺序:

当 <Clock /> 被传给 ReactDOM.render()的时候，React 会调用 Clock 组件的构造函数。
因为 Clock 需要显示当前的时间，所以它会用一个包含当前时间的对象来初始化 this.state。
我们会在之后更新 state。
之后 React 会调用组件的 render() 方法。这就是 React 确定该在页面上展示什么的方式。
然后 React 更新 DOM 来匹配 Clock 渲染的输出。
当 Clock 的输出被插入到 DOM 中后，React 就会调用 ComponentDidMount() 生命周期方法。
在这个方法中，Clock 组件向浏览器请求设置一个计时器来每秒调用一次组件的 tick() 方法。
浏览器每秒都会调用一次 tick() 方法。 在这方法之中，Clock 组件会通过调用 setState() 
来计划进行一次 UI 更新。得益于 setState() 的调用，React 能够知道 state 已经改变了，
然后会重新调用 render() 方法来确定页面上该显示什么。这一次，render() 方法中的 
this.state.date 就不一样了，如此以来就会渲染输出更新过的时间。React 也会相应的更新 DOM。
一旦 Clock 组件从 DOM 中被移除，React 就会调用 componentWillUnmount() 生命周期方法，
这样计时器就停止了。
*/
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = { date: new Date() };
  }

  componentDidMount() {
    this.timerID = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: new Date(),
    });
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}

ReactDOM.render(<Clock />, document.getElementById("root"));
