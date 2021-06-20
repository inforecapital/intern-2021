# 2021.05 week3

start date: 05.25
end date: 05.30

## 05/25

1. 学习 makefile 相关知识
   - 基本语法
   - 定义 variable,引用 variable
   - .PHONY, .VERBOSE 对应用法
   - make 中的 function
2. 尝试写了 cyberbrick 在 docker 上运行的 makefile
   - testing needed

## 05/26

1. 继续学习 makefile, [notes](../Doc/makefileNotes.md)
2. 完善 cyberbrick 的 makefile,加入了在 local environment 中 run with debug and run w/o debug targets
   - 仍需要研究如何在一个新的 shell execute commmand
   - 不然要配置 makefile 自动读取 environment,然后设置 python 执行版本为 python3
3. 处理了海康威视的 excel 数据

## 05/28

1. 处理并上传了海康威视,茅台,周黑鸭的 excel 数据
1. 学习了如何写 docker-compose
1. 写了一个 run Dgraph 的 docker compose demo
   - 仍需确认 Dgraph 的执行版本
1. 学习了 Dgraph 的部分语法知识,了解 Dgraph 底层原理。[notes](../Doc/dgraphNotes.md)
1. 尝试在 192.161.50.131 的 server 上跑了 omni

### gRPC

[gRPC 介绍](https://blog.csdn.net/qq_40133108/article/details/110000930)
A high-performance, open-source universal RPC framework

所谓 RPC(remote procedure call 远程过程调用)框架实际是提供了一套机制,使得应用程序之间可以进行通信,而且也遵从 server/client 模型。使用的时候客户端调用 server 端提供的接口就像是调用本地的函数一样。

### ubuntu 无法连接到 github.com

第一步 :
通过 Ping 检测最快的节点
http://ping.chinaz.com/github.com

第二步 :
选择最快节点添加到 hosts 文件
sudo vim /etc/hosts
在文件中添加“140.82.112.3 github.com”

### no space on device

[possible reasons](https://blog.csdn.net/youmatterhsp/article/details/80382552)

1. 首先介绍两个命令

df -h 查看磁盘使用情况
df -i 查看 inode 使用情况

1. block 满了

通常解决方法是删除大文件,不要直接删除,先确认数据是否重要,否则就掉坑里了。

1. inode 用光了

出现这种情况,是小文件占用较多的 inode,创建文件或目录占用一个 inode,通常这些小文件是定时任务引起的,删除需慎重。

[root@linuxidclogs]# df -h

Reason for my problem: Deleted File Reserved by Process
Occasionally, a file will be deleted, but a process is still using it. Linux won’t release the storage associated with the file while the process is still running, but you can find the process and restart it.
Try to locate the process.

`sudo lsof / | grep deleted`
`sudo lsof -b / | grep deleted` (this works to delete some large process but i don't know why)

### ubuntu 网络一直连接不上

当时为了把 root 改成 c 盘的时候, 修改了/etc/wsl.conf 这个文件
它中间有一段关于 network 的 config,也被覆盖了。将 network 下的两个 property 改成 true 成功连接上了网络

### pip 默认调用 python2.7

conda activate py39 进入 python 环境后再跑 pip 即可

### omni

[dockerfile source](https://github.com/taivokasper/docker-omnidb#running)

[备用:OmniDB 的使用和容器之间连接的小坑](https://blog.csdn.net/weixin_43870742/article/details/102277204)
