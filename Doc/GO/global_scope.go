package main
//output GOO
var a = "G"

func main() {
   n()
   m() //make the value of a to "O"
   n()
}

func n() {
   print(a)
}

func m() {
   a = "O"
   print(a)
}