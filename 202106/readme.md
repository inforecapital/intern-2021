# Week1 06/01-06/06

## 06/01

1. 写完了 Dgraph 的 docker-compose,加了对应注释
   - 如需修改 ports 或其它参数进.env 改
1. 更新了 postgres dockerfile 下的 bash 文件,create_user 的时候如果 input 是 empty string 结束执行并返回 exit code 1
1. 在 131 的 server 上跑了 omnidb 的 docker 服务。port 是 8090
1. 学习了微服务的知识。
   - protobuf 对应通讯
   - gRPC 对应
1. 学习了 dockerfile 的内容以及 basic instruction。[notes](../Doc/DockerNotes.md)

## 06/02

1. 学习了 dockerfile 的相关知识
1. 尝试写 bloomrpc 的 dockerfile
   - bloomrpc 目前不支持 web 版本,只能通过电脑桌面软件访问
   - 下载了 bloomrpc
1. 跟着网上教程写一个 react Dgraph 结合的前端 web

## 06/04

1. 写完了 react Dgraph 前端 web
   - delete 不起作用
   - source code 也不行...
1. connect mongoDB to excel

## /bin/sh: curl: not found

[source](https://discuss.circleci.com/t/bin-sh-curl-not-found/16232/4)
the docker:17.06.1-ce-git is based on Alpine after serval times of failure and blind working.

So I use apk update && apk add curl curl-dev bash to get my curl, the problem solved.

todo:
docker 服务 for https://github.com/uw-labs/bloomrpc
check Dgraph 节点连接细节

docker compose for Dgraph with multiple zero and alpha
https://github.com/dgraph-io/dgraph/blob/master/contrib/config/docker/docker-compose-ha.yml

## Week2 06/15-06/19

- 在 cyberbrick 仪表盘根据已有数据画了

  1. 招商银行
  1. 周黑鸭
  1. 腾讯

的图表，包括折线图，折线柱形图，气泡图，气泡折线图，以及纯 excel 图表

- 学习 GO 语言知识，看到了 the way to GO chapter 14
  [chapter 1-8 notes](./Doc/GO/go_notes_chapter1-8.md)
  [chapter 9-14 notes](./Doc/GO/go_notes_chapter9-.md)

- 学习 React
  [notes](./Doc/reactNotes.md)
