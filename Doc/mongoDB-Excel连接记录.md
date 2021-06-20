# mongoDB-Excel 连接记录

[instruction](https://docs.mongodb.com/bi-connector/current/connect/excel/)

1. 配置 DSN （data source name）

按照教程做就好了,有了 mongosqld server 可以直接填 localhost（因为我用 localhost connect 到 remote 的 server database 了）。配置完后点 test,如果 successful 就没问题。

1. 在本机上跑 mongosqld

这里我是在 BI Connector 下的 bin file 启动 cmd,通过
`mongosqld --config ..\example-mongosqld-config.yml --auth`
跑起来的。其中,--config 表示从后面的文件中进行配置。 --auth 表示配置中有 authorization,需要登录。

excel 中无法查找到 mongoDB 的驱动:
excel 调用的是 32 位的驱动,而我从网上下载的是 64 位的,因此查找不到
结合之前看到的现象(win8 64 位系统中的“设置 odbc 数据源”工具居然分为 32 位和 64 位两个程序),猜想原因:win8 64 位系统中的 odbc 驱动分为 32 位和 64 位分开管理,32 位方式运行的程序只会调用 32 位的 odbc 驱动,同理,64 位的程序只能调用 64 位的 odbc 驱动。
