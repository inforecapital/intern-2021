package main
//outout: GOG
var a = "G"

func main() {
   n() //print the value declared in line 3
   m() //print the value declared in line 14
   n() //print the value declared in line 3
}

func n() { print(a) }

func m() {
   a := "O"
   print(a)
}