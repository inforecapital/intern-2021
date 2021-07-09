# Dgraph

[Dgraph 底层介绍](https://dbaplus.cn/news-160-3315-1.html)

[Dgraph 语法简介](https://blog.csdn.net/qq_24236769/article/details/84848913)

Dgraph cluster consists of different nodes (Zero, Alpha & Ratel), and each node serves a different purpose.

- Dgraph `Zero` controls the Dgraph cluster, assigns servers to a group, and re-balances data between server groups.

- Dgraph `Alpha` hosts predicates and indexes. Predicates are either the properties associated with a node or the relationship between two nodes. Indexes are the tokenizers that can be associated with the predicates to enable filtering using appropriate functions.

- `Ratel` serves the UI to run queries, mutations & altering schema.

You need at least one Dgraph Zero and one Dgraph Alpha to get started

Dgraph 支持单机部署和集群部署两种方式. 在 Dgraph 中有 zero, alpha,ratel 三类服务(也叫节点), 其中 zero 服务充当协调 alpha 的角色; alpha 则是对外提供数据写入和查询的服务, 外部的客户端主要都是和 alpha 交互; ratel 则是一个提供 UI 界面的服务, 方便用户写入/查询数据,查看/修改 schema.

![alt text](./dgraph_nodes.png)

ratel：提供用户界面来执行数据查询，数据修改及元数据管理。
alpha：用于管理数据（谓词和索引），外部用户主要都是和 alpha 进行数据交互。
group：多个 alpha 组成一个 group,group 中的多个 alpha 通过 raft 协议保证数据一致性。
zero：用于管理集群，并在 group 之间按照指定频率去均衡数据。

- raft 协议
分布式存储系统通常通过维护多个副本来进行容错，提高系统的可用性。要实现此目标，就必须要解决分布式存储系统的最核心问题：维护多个副本的一致性。

首先需要解释一下什么是一致性（consensus）,它是构建具有容错性（fault-tolerant）的分布式系统的基础。 在一个具有一致性的性质的集群里面，同一时刻所有的结点对存储在其中的某个值都有相同的结果，即对其共享的存储保持一致。集群具有自动恢复的性质，当少数结点失效的时候不影响集群的正常工作，当大多数集群中的结点失效的时候，集群则会停止服务（不会返回一个错误的结果）。

一致性协议就是用来干这事的，用来保证即使在部分(确切地说是小部分)副本宕机的情况下，系统仍然能正常对外提供服务。一致性协议通常基于replicated state machines，即所有结点都从同一个state出发，都经过同样的一些操作序列（log），最后到达同样的state。

## Ratel UI

ACL Account
The ACL Account login is necessary only when you have ACL features enabled.

The latest version (starting v.21), docker image for ratel is separated from docker image of alpha and zero.
For now we use an old image.

Note The default password for a cluster started from scratch is password and the user is groot.

## Client

Dgraph support python >=v2.7 and >=v3.5
need gRPC1.19.0

GO:
Depending on the version of Dgraph that you are connecting to, you will have to
use a different version of this client and their corresponding import paths.

| Dgraph version | dgo version  | dgo import path                 |
| -------------- | ------------ | ------------------------------- |
| dgraph 1.0.X   | dgo 1.X.Y    | "github.com/dgraph-io/dgo"      |
| dgraph 1.1.X   | dgo 2.X.Y    | "github.com/dgraph-io/dgo/v2"   |
| dgraph 20.03.0 | dgo 200.03.0 | "github.com/dgraph-io/dgo/v200" |
| dgraph 20.07.0 | dgo 200.03.0 | "github.com/dgraph-io/dgo/v200" |
| dgraph 20.11.0 | dgo 200.03.0 | "github.com/dgraph-io/dgo/v200" |
| dgraph 21.03.0 | dgo 210.03.0 | "github.com/dgraph-io/dgo/v210" |

Javascript (HTTP)
Dgraph version | dgraph-js-http version |
| :------------: | :--------------------: |
| >= 21.03.0 | >= _21.3.0_ |
| >= 20.03.0 | >= _20.3.0_ |
| >= 1.1 | >= _1.1.0_ |

## DQL

An edge represents the relationship between two nodes. The two nodes in the above graph represent people: `Karthic` and `Jessica`. You can also see that these nodes have two associated properties: `name` and `age`. These properties of the nodes are called `predicates` in Dgraph.

Karthic `follows` Jessica. The follows edge between them represents their relationship. The edge connecting two nodes is also called a `predicate` in Dgraph, although this one points to another node rather than a string or an integer.

```json
{
  "set": [
    {
      "name": "Karthic",
      "age": 28
    },
    {
      "name": "Jessica",
      "age": 31
    }
  ]
}
```

The query above creates two nodes, one corresponding to each of the JSON values associated with "set". However, it doesn’t create an edge between these nodes.
A small modification to the mutation will fix it, so it creates an edge in between them.

```json
{
  "set": [
    {
      "name": "Karthic",
      "age": 28,
      "follows": {
        "name": "Jessica",
        "age": 31
      }
    }
  ]
}
```

in the response that two `UIDs` (Universal IDentifiers) have been created. The two values in the "`uids`" field of the response correspond to the two nodes created for “Karthic” and “Jessica”.

![alt text](https://dgraph.io/docs//images/tutorials/1/explain-query-2.JPG)

![alt text](https://dgraph.io/docs//images/tutorials/2/j-explain.JPG)
Graph traversal

### deleting a predicate

Predicates of a node can be deleted using the `delete` mutation. Here’s the syntax of the delete mutation to delete any predicate of a node,

```DQL
{
    delete {
        <UID> <predicate_name> * .
    }
}
```

## BUG

working with todo-app but delete node not working:
[solution](https://discuss.dgraph.io/t/deletejson-to-delete-a-node-does-not-delete-it/12809/4)


