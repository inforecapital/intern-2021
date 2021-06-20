# makefile

[notes](https://blog.csdn.net/weixin_38391755/article/details/80380786)

[to read](https://www.cnblogs.com/mfryf/p/3305778.html)

通配符:
"~": 波浪号（“~”）字符在文件名中也有比较特殊的用途。如果是“~/test”,这就表示当前用户的$HOME 目录下的 test 目录。而“~hchen/test”则表示用户 hchen 的宿主目录下的 test 目录。（这些都是 Unix 下的小知识了,make 也支持）而在 Windows 或是 MS-DOS 下,用户没有宿主目录,那么波浪号所指的目录则根据环境变量“HOME”而定。

"_":通配符代替了你一系列的文件,如“_.c”表示所以后缀为 c 的文件。一个需要我们注意的是,如果我们的文件名中有通配符,如:“_”,那么可以用转义字符“\”,如“\*”来表示真实的“_”字符,而不是任意长度的字符串。

.ONESHELL on the start of makefile allows people to execute a series of command (different line withtout &&) in the same shell
