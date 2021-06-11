# notes for GO

## install

1. wgets the latest version 1.16.5

1. Extract the archive you downloaded into /usr/local, creating a Go tree in /usr/local/go.
   Important: This step will remove a previous installation at /usr/local/go, if any, prior to extracting. Please back up any data before proceeding.

For example, run the following as root or through sudo:

`rm -rf /usr/local/go && tar -C /usr/local -xzf go1.16.5.linux-amd64.tar.gz`

1. Add /usr/local/go/bin to the PATH environment variable.
   You can do this by adding the following line to your $HOME/.profile or /etc/profile (for a system-wide installation):

`export PATH=$PATH:/usr/local/go/bin`
Note: Changes made to a profile file may not apply until the next time you log into your computer. To apply the changes immediately, just run the shell commands directly or execute them from the profile using a command such as source $HOME/.profile.

1. Verify that you've installed Go by opening a command prompt and typing the following command:
   $ `go version`
   sudo sanitizes environment, you need to either pass -E option or add GOROOT_BOOTSTRAP to env_keep in /etc/sudoers:

1. set up environment variable
   `export GOROOT=/usr/local/go`
   为了确保相关文件在文件系统的任何地方都能被调用，你还需要添加以下内容：

   `export PATH=$PATH:$GOROOT/bin`

   在开发 Go 项目时，你还需要一个环境变量来保存你的工作目录。

   `export GOPATH=$HOME/Applications/Go`

1. 构建 Go

在终端使用以下指令来进行编译工作。

cd $GOROOT/src
./all.bash

Error: Set $GOROOT_BOOTSTRAP to a working Go tree >= Go 1.4.
Reason: Go is written in Go (starting from version 1.5) so you have to install Go1.4 first.
Solution: downloaded Go 1.4 binaries and moved it to `/usr/local/go1.4/go`.
Also I defined GOROOT_BOOTSTRAP variable as `export GOROOT_BOOTSTRAP=/usr/local/go1.4/go`
Rerun ./all.bash

Error2: user doesn't have write privileges in folder with go1.4, but sudo ./all.bash cannot detect environment variable
Reason: sudo sanitizes environment, you need to either pass -E option or add GOROOT_BOOTSTRAP to env_keep in /etc/sudoers
Solution: run `sudo -E ./all.bash`.

## Go 程序的基本结构和要素

- 可见性规则

当标识符（包括常量、变量、类型、函数名、结构字段等等）以一个大写字母开头，如：Group1，那么使用这种形式的标识符的对象就可以被外部包的代码所使用（客户端程序需要先导入这个包），这被称为导出（像面向对象语言中的 public）；标识符如果以小写字母开头，则对包外是不可见的，但是他们在整个包的内部是可见并且可用的（像面向对象语言中的 private ）。

· 在完成包的 import 之后，开始对常量、变量和类型的定义或声明。
· 如果存在 init 函数的话，则对该函数进行定义（这是一个特殊的函数，每个含有该函数的包都会首先执行这个函数）。
· 如果当前包是 main 包，则定义 main 函数。
· 然后定义其余的函数，首先是类型的方法，接着是按照 main 函数中先后调用的顺序来定义相关函数，如果有很多函数，则可以按照字母顺序来进行排序。

Go 程序的执行（程序启动）顺序如下：

· 按顺序导入所有被 main 包引用的其它包，然后在每个包中执行如下流程：
· 如果该包又导入了其它的包，则从第一步开始递归执行，但是每个包只会被导入一次。
· 然后以相反的顺序在每个包中初始化常量和变量，如果该包含有 init 函数的话，则调用该函数。
· 在完成这一切之后，main 也执行同样的过程，最后调用 main 函数开始执行程序

· Go 语言不存在隐式类型转换，因此所有的转换都必须显式说明
`valueOfTypeB = typeB(valueOfTypeA)`

- 常量使用关键字 const 定义，用于存储不会改变的数据。`const identifier [type] = value`
  常量的值必须是能够在编译时就能够确定的；你可以在其赋值表达式中涉及计算过程，但是所有用于计算的值必须在编译期间就能获得。
  在编译期间自定义函数均属于未知，因此无法用于常量的赋值，但内置函数可以使用，如：len ()。
  反斜杠 `\` 可以在常量表达式中作为多行的连接符使用。
  常量还可以用作枚举：

```go
const (
    Unknown = 0
    Female = 1
    Male = 2
)
```

- 变量

声明变量的一般形式是使用 var 关键字：var identifier type。

```go
var (
    a int
    b bool
    str string
)

```

- 当一个变量被声明之后，系统自动赋予它该类型的零值：int 为 0，float 为 0.0，bool 为 false，string 为空字符串，指针为 nil。记住，所有的内存在 Go 中都是经过初始化的。
- Variables etc. declared outside of any function (in other words at the top level) have global (or
  package) scope: they are visible and available in all source files of the package.
  Variables declared in a function have local scope: they are only known in that function, the same
  goes for parameters and return-variables.

- `:=` 可用于初始化 variable。 `a:=50`， 但是该符号只可用一次，初始化后不可重复使用
  只能被用在函数体内，而不可以用于全局变量的声明与赋值
  当你在函数体内声明局部变量时，应使用简短声明语法 `:=`

- 空白标识符 `_` 也被用于抛弃值，如值 5 在：`_, b = 5, 7` 中被抛弃。

`_` 实际上是一个只写变量，你不能得到它的值。这样做是因为 Go 语言中你必须使用所有被声明的变量，但有时你并不需要使用从一个函数得到的所有返回值。

并行赋值也被用于当一个函数返回多个返回值时，比如这里的 val 和错误 err 是通过调用 Func1 函数同时得到：val, err = Func1(var1)
