# 06/01-

## /bin/sh: curl: not found

[source](https://discuss.circleci.com/t/bin-sh-curl-not-found/16232/4)
the docker:17.06.1-ce-git is based on Alpine after serval times of failure and blind working.

So I use apk update && apk add curl curl-dev bash to get my curl, the problem solved.

todo:
docker 服务 for https://github.com/uw-labs/bloomrpc
check Dgraph 节点连接细节

docker compose for Dgraph with multiple zero and alpha
https://github.com/dgraph-io/dgraph/blob/master/contrib/config/docker/docker-compose-ha.yml
