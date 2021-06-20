# GO note chapter 9-

## package

- `unsafe`: 包含了一些打破 `Go` 语言 “类型安全” 的命令,一般的程序中不会被使用,可用在 `C/C++` 程序的调用中。
- `syscall-os-os/exec`:
  `os`: 提供给我们一个平台无关性的操作系统功能接口,采用类 `Unix` 设计,隐藏了不同操作系统间差异,让不同的文件系统和操作系统对象表现一致。
  `os/exec`: 提供我们运行外部操作系统命令和程序的方式。
  `syscall`: 底层的外部包,提供了操作系统底层调用的基本接口。

- `archive/tar` 和` /zip-compress`:压缩 (解压缩) 文件功能。
- `fmt-io-bufio-path/filepath-flag:`
  `fmt`: 提供了格式化输入输出功能。
  `io`: 提供了基本输入输出功能,大多数是围绕系统功能的封装。
  `bufio`: 缓冲输入输出功能的封装。
  `path/filepath:` 用来操作在当前系统中的目标文件名路径。
  `flag`: 对命令行参数的操作。
- `strings-strconv-unicode-regexp-bytes:`
  `strings`: 提供对字符串的操作。
  `strconv`: 提供将字符串转换为基础类型的功能。
  `unicode`: 为 unicode 型的字符串提供特殊的功能。
  `regexp`: 正则表达式功能。
  `bytes`: 提供对字符型分片的操作。
  `index/suffixarray`: 子字符串快速查询。
- `math-math/cmath-math/big-math/rand-sort`:
  `math`: 基本的数学函数。
  `math/cmath`: 对复数的操作。
  `math/rand`: 伪随机数生成。
  `sort`: 为数组排序和自定义集合。
  `math/big`: 大数的实现和计算。
- `container-/list-ring-heap`: 实现对集合的操作。
  `list`: 双链表。
  `ring`: 环形链表。
- `time-log`:
  `time`: 日期和时间的基本操作。
  `log`: 记录程序运行时产生的日志,我们将在后面的章节使用它。
- `encoding/json-encoding/xml-text/template`:
  `encoding/json`: 读取并解码和写入并编码 JSON 数据。
  `encoding/xml:` 简单的 XML1.0 解析器,有关 JSON 和 XML 的实例请查阅第 12.9/10 章节。
  `text/template`: 生成像 HTML 一样的数据与文本混合的数据驱动模板（参见第 15.7 节）。
- `net-net/http-html`:（参见第 15 章）
  `net`: 网络数据的基本操作。
  `http`: 提供了一个可扩展的 HTTP 服务器和基础客户端,解析 HTTP 请求和回复。
  `html`: HTML5 解析器。
- `runtime`: Go 程序运行时的交互操作,例如垃圾回收和 goroutine 创建。
- `reflect`: 实现通过程序运行时反射,让程序操作任意类型的变量。

## sync

在一些复杂的程序中,通常通过不同线程执行不同应用来实现程序的并发。当不同线程要使用同一个变量时,经常会出现一个问题:无法预知变量被不同线程修改的顺序！(这通常被称为资源竞争,指不同线程对同一变量使用的竞争) 显然这无法让人容忍,那我们该如何解决这个问题呢？

经典的做法是一次只能让一个线程对共享变量进行操作。当变量被一个线程改变时 (临界区),我们为它上锁,直到这个线程执行完成并解锁后,其他线程才能访问它。

特别是我们之前章节学习的 map 类型是不存在锁的机制来实现这种效果 (出于对性能的考虑),所以 map 类型是非线程安全的。当并行访问一个共享的 map 类型的数据,map 数据将会出错。

在 Go 语言中这种锁的机制是通过 sync 包中 Mutex 来实现的。sync 来源于 "synchronized" 一词,这意味着线程将有序的对同一变量进行访问。

sync.Mutex 是一个互斥锁,它的作用是守护在临界区入口来确保同一时间只能有一个线程进入临界区。

假设 info 是一个需要上锁的放在共享内存中的变量。通过包含 Mutex 来实现的一个典型例子如下:

```go
import  "sync"

type Info struct {
    mu sync.Mutex
    // ... other fields, e.g.: Str string
}

```

如果一个函数想要改变这个变量:

```go
func Update(info *Info) {
    info.mu.Lock()
    // critical section:
    info.Str = // new value
    // end critical section
    info.mu.Unlock()
}
```

在 `sync` 包中还有一个 `RWMutex` 锁:他能通过 `RLock()` 来允许同一时间多个线程对变量进行读操作,但是只能一个线程进行写操作。如果使用 `Lock()` 将和普通的 `Mutex` 作用相同。包中还有一个方便的 `Once` 类型变量的方法 `once.Do(call)`,这个方法确保被调用函数只能被调用一次。

相对简单的情况下,通过使用 `sync` 包可以解决同一时间只能一个线程访问变量或 `map` 类型数据的问题。如果这种方式导致程序明显变慢或者引起其他问题,我们要重新思考来通过 `goroutines` 和 `channels` 来解决问题,这是在 Go 语言中所提倡用来实现并发的技术。

## 自定义包和可见性

Import with _:
`import _ "./pack1"`
pack1 包只导入其副作用,也就是说,只执行它的 init 函数并初始化其中的全局变量。

a）一个包能分成多个源文件么？Yes

b）一个源文件是否能包含多个包？NO

## struct

```go
type identifier struct {
    field1 type1
    field2 type2
    ...
}
```

使用 new: `t := new(T)`

- 初始化

```go
type Interval struct {
    start int
    end   int
}
```

```go
intr := Interval{0, 3}            (A)
intr := Interval{end:5, start:1}  (B)
intr := Interval{end:5}           (C)
```

在（A）中,值必须以字段在结构体定义时的顺序给出,& 不是必须的。（B）显示了另一种方式,字段名加一个冒号放在值的前面,这种情况下值的顺序不必一致,并且某些字段还可以被忽略掉,就像（C）中那样。

![alt text](https://cdn.learnku.com/uploads/images/201808/27/23/OLAUFPV0cu.jpg?imageView2/2/w/1240/h/0)

## 结构体转换

Go 中的类型转换遵循严格的规则。当为结构体定义了一个 alias 类型时,此结构体类型和它的 alias 类型都有相同的底层类型,它们可以如示例 10.3 那样互相转换,同时需要注意其中非法赋值或转换引起的编译错误。

## methods

The general format of a method is:
`func (recv receiver_type) methodName(parameter_list) (return_value_list) { … }`
The receiver is specified in ( ) before the method name after the func keyword.
If `recv` is the receiver instance and `Method1` the method name, then the call or invocation of the
method follows the traditional `object.method` selector notation: `recv.Method1()`
In this expression if recv is a pointer, then it is automatically dereferenced.
If the method does not need to use the value recv, you can discard it by subsituting a _, as in:
`func (_ receiver_type) methodName(parameter_list) (return_value_list) { … }`

- 函数和方法的区别
  函数将变量作为参数:`Function1(recv)`

方法在变量上被调用:`recv.Method1()`

在 receiver 是指针时,方法可以改变 receiver 的值（或状态）,这点函数也可以做到（当参数作为指针传递,即通过引用调用时,函数也可以改变参数的状态）。

`receiver_type` 叫做 （receiver）基本类型,这个类型必须在和方法同样的包中被声明。

指针方法和值方法都可以在指针或非指针上被调用

假设定义: `type Integer int`,完成 `get()` 方法的方法体: `func (p Integer) get() int { ... }`。

b）定义: `func f(i int) {}; var v Integer` ,如何就 v 作为参数调用 f？ `f(int(integer))`

c）假设 `Integer` 定义为 `type Integer struct {n int}`,完成 `get()` 方法的方法体:`func (p Integer) get() int { ... }`。

d）对于新定义的 Integer,和 b）中同样的问题 `f(integer.n)`

## interface

接口定义了一组方法（方法集）,但是这些方法不包含（实现）代码:它们没有被实现（它们是抽象的）。接口里也不能包含变量。

通过如下格式定义接口:

```go
type Namer interface {
    Method1(param_list) return_type
    Method2(param_list) return_type
    ...
}

```

A type doesn’t have to state explicitly that it implements an interface: interfaces are satisfied implicitly.
Multiple types can implement the same interface.
A type that implements an interface can also have other functions.
A type can implement many interfaces.
An interface type can contain a reference to an instance of any of the types that implement the interface
(an interface has what is called a dynamic type

- type assertion

  ```go
  if v, ok := varI.(T); ok {  // checked type assertion
      Process(v)
      return
  }
  // varI is not of type T
  ```

  Go 语言规范定义了接口方法集的调用规则:

  类型 *T 的可调用方法集包含接受者为 *T 或 T 的所有方法集
  类型 T 的可调用方法集包含接受者为 T 的所有方法
  类型 T 的可调用方法集不包含接受者为 \*T 的方法

- 空接口
  空接口或者最小接口 不包含任何方法,它对实现不做任何要求:

  `type Any interface {}`
  任何其他类型都实现了空接口（它不仅仅像 Java/C# 中 Object 引用类型）,`any` 或 `Any` 是空接口一个很好的别名或缩写。

- 动态方法的调用

  Go 的实现与此相反,通常需要编译器静态检查的支持:当变量被赋值给一个接口类型的变量时,编译器会检查其是否实现了该接口的所有函数。如果方法调用作用于像 interface{} 这样的 “泛型” 上,你可以通过类型断言（参见 11.3 节）来检查变量是否实现了相应接口。

  例如,你用不同的类型表示 XML 输出流中的不同实体。然后我们为 XML 定义一个如下的 “写” 接口（甚至可以把它定义为私有接口）:

  ```go
  type xmlWriter interface {
      WriteXML(w io.Writer) error
  }
  ```

  现在我们可以实现适用于该流类型的任何变量的 StreamXML 函数,并用类型断言检查传入的变量是否实现了该接口；如果没有,我们就调用内建的 encodeToXML 来完成相应工作:

  ```go
  // Exported XML streaming function.
  func StreamXML(v interface{}, w io.Writer) error {
      if xw, ok := v.(xmlWriter); ok {
          // It’s an  xmlWriter, use method of asserted type.
          return xw.WriteXML(w)
      }
      // No implementation, so we have to use our own function (with perhaps reflection):
      return encodeToXML(v, w)
  }


  // Internal XML encoding function.
  func encodeToXML(v interface{}, w io.Writer) error {
      // ...
  }
  ```

  Go 在这里用了和 gob 相同的机制:定义了两个接口 GobEncoder 和 GobDecoder。这样就允许类型自己实现从流编解码的具体方式；如果没有实现就使用标准的反射方式。

- empty interface and function overloading

  递任何数量任何类型的参数给函数,即重载的实际含义。

  函数 fmt.Printf 就是这样做的:
  `fmt.Printf(format string, a ...interface{}) (n int, errno error)`
  这个函数通过枚举 slice 类型的实参动态确定所有参数的类型。并查看每个类型是否实现了 String() 方法,如果是就用于产生输出信息。

## object orientedness of GO

The 3 important aspects of OO-languages are encapsulation, inheritance and polymorphism, how
are they envisioned in Go?

1. `Encapsulation` (data hiding): in contrast to other OO languages where there are 4 or more access-levels, Go simplifies this to only 2 (see the Visibility Rule in § 4.2):
   a. `package scope`: ‘object’ is only known in its own package, how? it starts with a lowercase letter
   b. `exported`: ‘object’ is visible outside of its package, how? it starts with an uppercase letter
   A type can only have methods defined in its own package.

1. `Inheritance`: how? composition: embedding of 1 (or more) type(s) with the desired behavior (fields and methods); multiple inheritance is possible through embedding multiple types
1. `Polymorphism`: how? interfaces: a variable of a type can be assigned to a variable of any interface it implements. Types and interfaces are loosely coupled, again multiple inheritance is possible through implementing multiple interfaces. Go’s interfaces aren’t a variant on Java or C# interfaces, they’re much more: they are ndependent and are key to large-scale programming and adaptable, evolutionary design.

## Errors

任何时候当你需要一个新的错误类型,都可以用 errors（必须先 import）包的 errors.New 函数接收合适的错误信息来创建,像下面这样:`err := errors.New("math - square root of negative number")`

## panic

Go panicking:

在多层嵌套的函数调用中调用 panic,可以马上中止当前函数的执行,所有的 defer 语句都会保证执行并把控制权交还给接收到 panic 的函数调用者。这样向上冒泡直到最顶层,并执行（每层的） defer,在栈顶处程序崩溃,并在命令行中用传给 `panic` 的值报告错误情况:这个终止过程就是 `panicking。`

标准库中有许多包含 Must 前缀的函数,像 `regexp.MustComplie` 和 `template.Must`；当正则表达式或模板中转入的转换字符串导致错误时,这些函数会 panic。

不能随意地用 `panic` 中止程序,必须尽力补救错误让程序能继续执行。

（参见 6.4 节）中使用:用于取得 `panic` 调用中传递过来的错误值,如果是正常执行,调用 `recover` 会返回 `nil`, 且没有其它效果。

总结:panic 会导致栈被展开直到 defer 修饰的 recover () 被调用或者程序中止

## goroutine and channel

The parts of an application that run concurrently are called goroutines in Go, they are in effect concurrently executing computations. There is no one-to-one correspondence between a goroutine and an operating system thread: a goroutine is mapped onto (multiplexed, executed by) one or more threads, according to their availability; this is accomplished by the goroutine-scheduler in the Go runtime.
Goroutines run in the same address space, so access to shared memory must be synchronized; this could be done via the sync package (see § 9.3), but this is highly discouraged: Go use channels to synchronize goroutines

Two styles of concurrency exist: deterministic (well-defined ordering) and non-deterministic (locking/mutual exclusion but order undefined). Go’s goroutines and channels promote deterministic concurrency (e.g. channels with one sender, one receiver), which is easier to reason about. We will compare both approaches in a commonly occurring algorithm (the Worker-problem) in § 14.7A goroutine is implemented as a function or method (this can also be an anonymous or lambda function) and called (invoked) with the keyword go.

GOMAXPROCS 等同于（并发的）线程数量,在一台核心数多于 1 个的机器上,会尽可能有等同于核心数的线程在并行运行。

当 `main()` 函数返回的时候,程序退出:它不会等待任何其他非 `main` goroutine 的结束。这就是为什么在服务器程序中,每一个请求都会启动一个 goroutine 来处理,`server()` 函数必须保持运行状态。通常使用一个无限循环来达到这样的目的。

## channel

通常使用这样的格式来声明 channel:`var identifier chan datatype`

未初始化的 channel 的值是 `nil`

所以 channel 只能传输一种类型的数据,比如 `chan int` 或者 `chan string`,所有的类型都可以用于 channel,空接口 `interface{}` 也可以。甚至可以（有时非常有用）创建 channel 的 channel。

channel 也是引用类型,所以我们使用 make() 函数来给它分配内存。这里先声明了一个字符串 channel ch1,然后创建了它（实例化）:

```go
var ch1 chan string
ch1 = make(chan string)

```

or `ch1 := make(chan string)`
函数 channel:`funcChan := chan func()`
所以 channel 是对象的第一类型:可以存储在变量中,作为函数的参数传递,从函数返回以及通过 channel 发送它们自身。另外它们是类型化的,允许类型检查,比如尝试使用整数 channel 发送一个指针

- 通信操作符 <-
  这个操作符直观的标示了数据的传输:信息按照箭头的方向流动。

  流向 channel（发送）

  `ch <- int1` 表示:用 channel `ch` 发送变量 `int1`（双目运算符,中缀 = 发送）

  从 channel 流出（接收）,三种方式:

  `int2 = <- ch` 表示:变量 `int2` 从 channel `ch`（一元运算的前缀操作符,前缀 = 接收）接收数据（获取新值）；假设 int2 已经声明过了,如果没有的话可以写成:`int2 := <- ch`。

  `<- ch` 可以单独调用获取 channel 的（下一个）值,当前值会被丢弃,但是可以用来验证,所以以下代码是合法的:

  ```go
  if <- ch != 1000{
      ...
  }
  ```

  操作符 `<-` 也被用来发送和接收,Go 尽管不必要,为了可读性,channel 的命名通常以 ch 开头或者包含 chan。channel 的发送和接收操作都是自动的:它们通常一气呵成。

- blocking of channels
  1）对于同一个 channel,发送操作（goroutine 或者函数中的）,在 receiver 准备好之前是阻塞的:如果 ch 中的数据无人接收,就无法再给 channel 传入其他数据:新的输入无法在 channel 非空的情况下传入。所以发送操作会等待 ch 再次变为可用状态:就是 channel 值被接收时（可以传入变量）。

2）对于同一个 channel,接收操作是阻塞的（goroutine 或函数中的）,直到发送者可用:如果 channel 中没有数据,receiver 就阻塞了。

`ch :=make(chan type, value)`

`value == 0 -> synchronous, unbuffered`(阻塞）
`value > 0 -> asynchronous, buffered`（非阻塞）取决于 `value` 元素
若使用通道的缓冲,你的程序会在 “请求” 激增的时候表现更好:更具弹性,专业术语叫:更具有伸缩性（scalable）。要在首要位置使用无缓冲通道来设计算法,只在不确定的情况下使用缓冲。

信号量是实现互斥锁（排外锁）常见的同步机制,限制对资源的访问,解决读写问题,比如没有实现信号量的 sync 的 Go 包,使用带缓冲的通道可以轻松实现:

带缓冲通道的容量和要同步的资源容量相同
通道的长度（当前存放的元素个数）与当前资源被使用的数量相同
容量减去通道的长度就是未处理的资源个数（标准信号量的整数值）

- 通道类型可以用注解来表示它只发送或者只接收:

  `var send_only chan<- int // channel can only receive data`
  `var recv_only <-chan int // channel can only send data`
  只接收的通道（<-chan T）无法关闭,因为关闭通道是发送者用来表示不再给通道发送值了,所以对只接收通道是没有意义的。通道创建的时候都是双向的,但也可以分配有方向的通道变量,就像以下代码:

  ```go
  var c = make(chan int) // bidirectional
  go source(c)
  go sink(c)

  func source(ch chan<- int){
      for { ch <- 1 }
  }

  func sink(ch <-chan int) {
      for { <-ch }
  }

  ```

  [素数筛](./chapter9.11-14/sieve.go)图解:

  ![alt text](https://cdn.jsdelivr.net/gh/jasonkayzk/blog_static@master/images/go_prime.png)

  第一次的 channel 的数据是 generate()产生的自然数序列,之后 channel 被迭代,迭代的方法是调用 filter()生成一个不会被当前 prime 整除的数的序列。序列中第一个数为最新的 prime,作为接下来 filter 的筛选标准。

- 关闭 channel
  通道可以被显式的关闭；尽管它们和文件不同:不必每次都关闭。只有在当需要告诉接收者不会再提供新的值的时候,才需要关闭通道。只有发送者需要关闭通道,接收者永远不会需要。

  1. defer

  ```go
      ch := make(chan float64)
      defer close(ch)
  ```

  1. use ok to check if the channel is closed

  ```go
  if v, ok := <-ch; ok {
    process(v)
  }
  ```

  1. for loop use break

  ```go
  v, ok := <-ch
  if !ok {
    break
  }
  process(v)
  ```

- select to switch goroutine

  select 监听进入通道的数据,也可以是用通道发送值的时候。

```go
select {
case u:= <- ch1:
        ...
case v:= <- ch2:
        ...
        ...
default: // no value ready to be received
        ...
}
```

`default` 语句是可选的；`fallthrough` 行为,和普通的 `switch` 相似,是不允许的。在任何一个 `case` 中执行 `break` 或者 `return,select` 就结束了。

`select` 做的就是:选择处理列出的多个通信情况中的一个。

如果都阻塞了,会等待直到其中一个可以处理
如果多个可以处理,随机选择一个
如果没有通道操作可以处理并且写了 `default` 语句,它就会执行:`default` 永远是可运行的（这就是准备好了,可以执行）。
在 `select` 中使用发送操作并且有 `default` 可以确保发送不被阻塞！如果没有 `case`,`select` 就会一直阻塞。

`select` 语句实现了一种监听模式,通常用在（无限）循环中；在某种情况下,通过 `break` 语句使循环退出。
