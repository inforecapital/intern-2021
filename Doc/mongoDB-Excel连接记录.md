# mongoDB-Excel连接记录

[instruction](https://docs.mongodb.com/bi-connector/current/connect/excel/)

1. 配置DSN （data source name）

按照教程做就好了，有了mongosqld server可以直接填localhost（因为我用localhost connect到remote的server database了）。配置完后点test，如果successful就没问题。

1. 在本机上跑mongosqld

这里我是在BI Connector下的bin file启动cmd，通过
`mongosqld --config ..\example-mongosqld-config.yml --auth`
跑起来的。其中，--config表示从后面的文件中进行配置。 --auth表示配置中有authorization，需要登录。

excel中无法查找到mongoDB的驱动：
excel调用的是32位的驱动，而我从网上下载的是64位的，因此查找不到
结合之前看到的现象(win8 64位系统中的“设置odbc数据源”工具居然分为32位和64位两个程序)，猜想原因：win8 64位系统中的odbc驱动分为32位和64位分开管理，32位方式运行的程序只会调用32位的odbc驱动，同理，64位的程序只能调用64位的odbc驱动。
