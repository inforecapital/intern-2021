# notes for July 2021

## 07/05 - 07/11

1. 在cyberbrick的仪表盘上完成了牧原股份和茅台的作图
2. 重构了reactFlow-Dgraph的demo：
    - 只在用户完成更新操作后一次性与数据库交互
    - 将JavaScript重写为typescript
    - nodes支持点击内部的×来删除
    - 使用ant design pro作为主要的layout和form UI
3. 发现问题：
    - 只有从Dgraph获取到了uid才可以存edge
    - 这样就无法一次性加新的node和edge
    - 这种情况需要server发起一个transaction，与数据库交互两次，一次存node，一次获取uid后存edge。若中途失败则rollback
4. 写完了ua-viz-server的selection的interface
5. 完成公司搬家，now base in科技园

[docker网关冲突导致启动docker容器时服务器网络断开](https://blog.csdn.net/HYESC/article/details/88688884)

[Ubuntu 18.04 server unable to ping websites but can ping IP addresses](https://askubuntu.com/questions/1108607/ubuntu-18-04-server-unable-to-ping-websites-but-can-ping-ip-addresses)

maybe is a problem of /etc/resolv.conf
```bash
$ sudo mv /etc/resolv.conf /etc/resolv.conf.bak
$ echo nameserver 8.8.8.8 > temp
$ sudo cp temp /etc/resolv.conf
```

[react hooks组件间的传值方式(使用ts)](https://blog.csdn.net/qq_34775038/article/details/106213225?spm=1001.2014.3001.5501)
父传子
    通过props传值，使用useState来控制state的状态值
子传父
    跟react的方式一样，像子组件传入回调函数，通过接收子组件的返回值，再去更新父组件的state. 优化：使用useCallback存放处理事件的函数
跨级组件(父传后代)
    使用useContext传值，跟React的Context类似
    使用步骤：
    创建context
    使用context.provider关联需要传值的组件
    引入context，和useContext并获取值

[声明子组件属性的问题](https://blog.csdn.net/youlinhuanyan/article/details/103547861)