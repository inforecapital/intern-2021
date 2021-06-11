package main
// 下面这个例子展示了如何通过 runtime 包在运行时获取所在的操作系统类型，
// 以及如何通过 os 包中的函数 os.Getenv() 来获取环境变量中的值，并保存到 string 类型的局部变量 path 中。

import (
    "fmt"
   "runtime"
    "os"
)

func main() {
    var goos string = runtime.GOOS
    fmt.Printf("The operating system is: %s\n", goos)
    path := os.Getenv("PATH")
    fmt.Printf("Path is %s\n", path)
}