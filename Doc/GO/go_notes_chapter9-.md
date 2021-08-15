# GO note chapter 9-

## Context

`Context` 机制，相互调用的 `goroutine` 之间通过传递 `context` 变量保持关联，这样在不用暴露各 `goroutine` 内部实现细节的前提下，有效地控制各 goroutine 的运行。
![alt text](https://img2020.cnblogs.com/blog/1093617/202101/1093617-20210126142158021-2146921433.png)

如此一来，通过传递 `Context` 就可以追踪 `goroutine` 调用树，并在这些调用树之间传递通知和元数据。
虽然 `goroutine` 之间是平行的，没有继承关系，但是 Context 设计成是包含父子关系的，这样可以更好的描述 `goroutine` 调用之间的树型关系。

使用：
`Done()` 方法在 Context 被取消或超时时返回一个 `close` 的 `channel`,`close` 的 `channel` 可以作为广播通知，告诉给 `context` 相关的函数要停止当前工作然后返回。
After the last value has been received from a closed channel c, any receive from c will succeed without blocking, returning the zero value for the channel element.

Any number of goroutines can select on <-ctx.Done().

Using close requires care.

- closing a nil channel panics
- closing a closed channel panics
  Done returns a receive-only channel that can only be canceled using the cancel function returned by WithCancel. It ensures the channel is closed exactly once.

当一个父 `operation` 启动一个 `goroutine` 用于子 operation，这些子 operation 不能够取消父 operation。下面描述的 `WithCancel` 函数提供一种方式可以取消新创建的 `Context`.

`Context` 可以安全的被多个 `goroutine` 使用。开发者可以把一个 `Context` 传递给任意多个 `goroutine` 然后 `cancel` 这个 `context` 的时候就能够通知到所有的 `goroutine。`

`Err` 方法返回 `context` 为什么被取消。

`Deadline` 返回 `context` 何时会超时。

`Value` 返回 `context` 相关的数据

要创建 Context 树，首先就是要创建根节点

```go
// Background returns an empty Context. It is never canceled, has no deadline,
// and has no values. Background is typically used in main, init, and tests,
// and as the top-level Context for incoming requests.
func Background() Context
```

`Backgound()`是所有 Context 的 root，不能够被 cancel。该 Context 通常由接收 request 的第一个 goroutine 创建，它不能被取消、没有值、也没有过期时间，常作为处理 request 的顶层 context 存在。

下层 Context：`WithCancel`/`WithDeadline`/`WithTimeout`
了根节点之后，接下来就是创建子孙节点。为了可以很好的控制子孙节点，Context 包提供的创建方法均是带有第二返回值（CancelFunc 类型），它相当于一个 Hook，在子 goroutine 执行过程中，可以通过触发 Hook 来达到控制子 goroutine 的目的（通常是取消，即让其停下来）。再配合 Context 提供的 Done 方法，子 goroutine 可以检查自身是否被父级节点 Cancel：

```go
select {
case <-ctx.Done():
// do some clean…
}
```

注：父节点 Context 可以主动通过调用 cancel 方法取消子节点 Context，而子节点 Context 只能被动等待。同时父节点 Context 自身一旦被取消（如其上级节点 Cancel），其下的所有子节点 Context 均会自动被取消。

有四种创建方法：

```go
//Used for passing request-scoped values. The complete signature of the function is

func withValue(parent Context, key, val interface{}) (ctx Context)
// It takes in a parent context, key, value and returns a derived context  This derived context has key associated with the value. Here the parent context can be either context.Background() or any other context. Further, any context which is derived from this context will have this value.
// 带cancel返回值的Context，一旦cancel被调用，即取消该创建的context
func WithCancel(parent Context) (ctx Context, cancel CancelFunc)

// 带有效期cancel返回值的Context，即必须到达指定时间点调用的cancel方法才会被执行
func WithDeadline(parent Context, deadline time.Time) (Context, CancelFunc)

// 带超时时间cancel返回值的Context，类似Deadline，前者是时间点，后者为时间间隔
// 相当于WithDeadline(parent, time.Now().Add(timeout)).
func WithTimeout(parent Context, timeout time.Duration) (Context, CancelFunc)
```

- context tree:
  ![alt text](https://i2.wp.com/golangbyexample.com/wp-content/uploads/2020/09/Context-Tree-2-1.jpg?resize=231%2C206&ssl=1)
- official suggestions:

1. Do not store Contexts inside a struct type; instead, pass a Context explicitly to each function that needs it. The Context should be the first parameter, typically named ctx.
1. Do not pass a nil Context, even if a function permits it. Pass context.TODO if you are unsure about which Context to use.
1. Use context Values only for request-scoped data that transits processes and APIs, not for passing optional parameters to functions.


The same Context may be passed to functions running in different goroutines; Contexts are safe for simultaneous use by multiple goroutines.

http 实例：

```go
const requestIDKey int = 0

func WithRequestID(next http.Handler) http.Handler {
    return http.HandlerFunc(
        func(rw http.ResponseWriter, req *http.Request) {
            // 从 header 中提取 request-id
            reqID := req.Header.Get("X-Request-ID")
            // 创建 valueCtx。使用自定义的类型，不容易冲突
            ctx := context.WithValue(
                req.Context(), requestIDKey, reqID)

            // 创建新的请求
            req = req.WithContext(ctx)

            // 调用 HTTP 处理函数
            next.ServeHTTP(rw, req)
        }
    )
}

// 获取 request-id
func GetRequestID(ctx context.Context) string {
    ctx.Value(requestIDKey).(string)
}

func Handle(rw http.ResponseWriter, req *http.Request) {
    // 拿到 reqId，后面可以记录日志等等
    reqID := GetRequestID(req.Context())
    ...
}

func main() {
    handler := WithRequestID(http.HandlerFunc(Handle))
    http.ListenAndServe("/", handler)
}
```

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

## struct tag

Go struct tags are annotations that appear after the type in a Go struct declaration. Each tag is composed of short strings associated with some corresponding value.

A struct tag looks like this, with the tag offset with backtick ` characters:

```go
type User struct {
    Name string `example:"name"`
}
```

The struct tag that encoding/json recognizes has a key of json and a value that controls the output. By placing the camel-cased version of the field names as the value to the json key, the encoder will use that name instead:

```go
package main

import (
    "encoding/json"
    "fmt"
    "log"
    "os"
    "time"
)

type User struct {
    Name          string    `json:"name"`
    Password      string    `json:"password"`
    PreferredFish []string  `json:"preferredFish"`
    CreatedAt     time.Time `json:"createdAt"`
}

func main() {
    u := &User{
        Name:      "Sammy the Shark",
        Password:  "fisharegreat",
        CreatedAt: time.Now(),
    }

    out, err := json.MarshalIndent(u, "", "  ")
    if err != nil {
        log.Println(err)
        os.Exit(1)
    }

    fmt.Println(string(out))
}
```

This will output:

```go
Output
{
  "name": "Sammy the Shark",
  "password": "fisharegreat",
  "preferredFish": null,
  "createdAt": "2019-09-23T18:16:17.57739-04:00"
}
```

Within the value part of any json struct tag, you can suffix the desired name of your field with `,omitempty` to tell the JSON encoder to suppress the output of this field when the field is set to the zero value.
`-` hide the value from output (eg: value of password)

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

  类型 *T 的可调用方法集包含接受者为*T 或 T 的所有方法集
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

- 14.5. 通道、超时和计时器（Ticker）

`time` 包中有一些有趣的功能可以和通道组合使用。

其中就包含了 `time.Ticker` 结构体，这个对象以指定的时间间隔重复的向通道 C 发送时间值：

```go
type Ticker struct {
    C <-chan Time // the channel on which the ticks are delivered.
    // contains filtered or unexported fields
    ...
}
```

时间间隔的单位是 ns（纳秒，int64），在工厂函数 `time.NewTicker` 中以 `Duration` 类型的参数传入：`func Newticker(dur) *Ticker`。

在协程周期性的执行一些事情（打印状态日志，输出，计算等等）的时候非常有用。

调用 `Stop()` 使计时器停止，在 `defer` 语句中使用。这些都很好的适应 `select` 语句:
```go
ticker := time.NewTicker(updateInterval)
defer ticker.Stop()
...
select {
case u:= <-ch1:
    ...
case v:= <-ch2:
    ...
case <-ticker.C:
    logState(status) // call some logging function logState
default: // no value ready to be received
    ...
}
```

- 14.8. 惰性生成器的实现

通过巧妙地使用空接口、闭包和高阶函数，我们能实现一个通用的惰性生产器的工厂函数 `BuildLazyEvaluator`（这个应该放在一个工具包中实现）。工厂函数需要一个函数和一个初始状态作为输入参数，返回一个无参、返回值是生成序列的函数。传入的函数需要计算出下一个返回值以及下一个状态参数。在工厂函数中，创建一个通道和无限循环的 go 协程。返回值被放到了该通道中，返回函数稍后被调用时从该通道中取得该返回值。每当取得一个值时，下一个值即被计算。

- Futures
所谓 Futures 就是指：有时候在你使用某一个值之前需要先对其进行计算。这种情况下，你就可以在另一个处理器上进行该值的计算，到使用时，该值就已经计算完毕了。

例子：假设我们有一个矩阵类型，我们需要计算两个矩阵 A 和 B 乘积的逆，首先我们通过函数 Inverse(M) 分别对其进行求逆运算，在将结果相乘。如下函数 InverseProduct() 实现了如上过程：

```go
func InverseProduct(a Matrix, b Matrix) {
    a_inv := Inverse(a)
    b_inv := Inverse(b)
    return Product(a_inv, b_inv)
}
```

调用 Product 函数只需要等到 a_inv 和 b_inv 的计算完成。如下代码实现了并行计算方式：

```go
func InverseProduct(a Matrix, b Matrix) {
    a_inv_future := InverseFuture(a)   // start as a goroutine
    b_inv_future := InverseFuture(b)   // start as a goroutine
    a_inv := <-a_inv_future
    b_inv := <-b_inv_future
    return Product(a_inv, b_inv)
}
```

- 14.10.1 典型的客户端 - 服务端模式

客户端可以是任何一种运行在任何设备上的，且需要来自服务端信息的一种程序，所以它需要发送请求。 服务端接收请求，做一些处理，然后把给客户端发送响应信息。在通常情况下，就是多个客户端（很多请求）对一个（或几个）服务端。一个常见例子就是我们使用的发送网页请求的客户端浏览器。然后一个 web 服务器将响应网页发回给浏览器。

在 Go 中，服务端通常会在一个协程（goroutine）里操作对一个客户端的响应，所以协程和客户端请求是一一对应的。一种典型的做法就是客户端请求本身包含了一个频道（channel），服务端可以用它来发送响应。

在下面的例子中，我们发送 100 个请求，并在所有请求发送完毕后，再逐个检查其返回的结果：

```go
func main() {

    adder := startServer(func(a, b int) int { return a + b })

    const N = 100

    var reqs [N]Request

    for i := 0; i < N; i++ {

        req := &reqs[i]

        req.a = i

        req.b = i + N

        req.replyc = make(chan int)

        adder <- req

        // adder is a channel of requests

    }

    // checks:

    for i := N - 1; i >= 0; i-- { // doesn’t matter what order

        if <-reqs[i].replyc != N+2*i {

            fmt.Println(“fail at”, i)

            } else {

                fmt.Println(“Request “, i, “is ok!”)

        }

    }

    fmt.Println(“done”)

}
```

