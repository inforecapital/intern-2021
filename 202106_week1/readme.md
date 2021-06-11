# 06/01-06/06

## 06/01

1. 写完了Dgraph的docker-compose，加了对应注释
    - 如需修改ports或其它参数进.env改
1. 更新了postgres dockerfile下的bash文件，create_user的时候如果input是empty string结束执行并返回exit code 1
1. 在131的server上跑了omnidb的docker服务。port是8090
1. 学习了微服务的知识。
    - protobuf 对应通讯
    - gRPC 对应
1. 学习了dockerfile的内容以及basic instruction。[notes](../Doc/DockerNotes.md)

## 06/02

1. 学习了dockerfile的相关知识
1. 尝试写bloomrpc的dockerfile
    - bloomrpc目前不支持web版本，只能通过电脑桌面软件访问
    - 下载了bloomrpc
1. 跟着网上教程写一个react Dgraph结合的前端web

## 06/04

1. 写完了react Dgraph前端web
    - delete不起作用
    - source code也不行...
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
