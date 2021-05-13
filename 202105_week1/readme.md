# 2021.05 week1

start date: 05.07
end date: 05.14

## 2021/05/07

1. 办理入职手续，初步熟悉公司

2. 在笔记本中安装并配置了开发所需的 Linux 环境，IDE，Docker（数据库），anaconda（python 软件包），git 等。

3. 了解了现有的公司数据库系统的使用方法以及背后的基础逻辑
   阅读了系统使用手册

4. 学习到了数据库背后的简单交互逻辑，以及了解了未来的开发方向是构造一个可客制化的非线性数据库

   - ETL:提取（extract）网页上上传的资料，向服务器请求数据，获得数据后进行处理（transform），处理完毕后返回给服务器在网页上更新内容（load）

   - 非线性/图像数据库是 web 状图，一个 node 里面存储多个 subitem，点进 subitem 可以查看详细信息。另有单向/双向箭头可以指代不同 node 间，同一个 node 的 items 间，以及不同 nodes 不同 items 间的关系。

   - 现有的非线性/图像数据库只可以读取，无法修改，因此无法对数据进行更新或者展示数据处理结果

   - 因此需要一个客制化的系统来允许修改数据库内容

## 2021/05/10

1. 配置并尝试了 docker 的 sample code

2. 尝试按照 readme 的指示在本机运行 cyberbrick

3. 了解并学习了 docker 的相关内容

4. 了解并讨论了现有以及将来需要实现的数据库数据模型

## 2021/05/12

1. 学习 docker 与 postgresql 的基本使用方法

   - 学习了docker基本概念：image，container，volumn
   - 学习postgresql 常用的command以及实验性的用command进行数据库的操作
   - 着重了解 postgresql 中如何创建用户，赋予用户对于 database 的不同权限，以及修改权限。
2. 写了一个create_user_and_grant.sh的bash file，可以通过键盘读入一个username，然后在数据库中创建对应的user，并给予该user目前存储的8个数据库的所有权限（读写修改创建删除）
   - push bash file to github repo
3. 新建了8个数据库，并按照中文对照翻译成对应的database name

## 2021/05/13

1. 为create_user_and_grant.sh的bash file增加了输入password的功能，如果input的password是empty string则使用默认password
   - 为测试password写了一个revoke and drop user的bash file，可以revoke user所有的权限并drop
2. 在系统平台上连接上了昨天新建的八个数据库

## Docker

Install and run demo of basic focker files

遇到的问题：when run docker command, got "Cannot connect to the Docker daemon at (unix:///var/run/docker.sock. Is the docker daemon running?)"

Solution: systemctl command doesn't work.
Then I found the following: "If you are using the SysV init system, then the systemctl command will not work for you. We will need to use the service command to start docker daemon."

So with the following command I fix the problem:

```BASH
sudo service --status-all
sudo service docker start
```

## Issues with executing cyberbrick

Error: pg_config executable not found.

Please add the directory containing pg_config to the PATH

or specify the full executable path with the option:

python setup.py build_ext --pg-config /path/to/pg_config build ...

Solution: `sudo apt-get install libpq-dev python-dev`

OSError: mysql_config not found
Solution: mySQLdb is a python interface for mysql, but it is not mysql itself. And apparently mySQLdb needs the command 'mysql_config', so you need to install that first.

Which linux distribution are you using? Mysql is pre-packaged for most linux distributions. For example, for debian / ubuntu, installing mysql is as easy as

`sudo apt-get install mysql-server`
mysql-config is in a different package, which can be installed from (again, assuming debian / ubuntu):

`sudo apt-get install libmysqlclient-dev`

Issue: Key ‘auto_activate_base’ is not a known primitive parameter.

Solution: 版本太低，# 升级 conda
`conda update -n base -c defaults conda`

Issue with executing `pip install -r requirements.txt`
Solution: `conda activate py39`

Issue with executing `yarn` in web folder:
Solution: got the wrong yarn. The yarn you're executing comes from the cmdtest package. Uninstalling cmdtest first should fix this:

`sudo apt remove cmdtest`

Once you've uninstalled it, run the commands below to install yarn properly:

```bash
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt update
sudo apt install yarn
```

Issue: error cyberbrick@0.0.0: The engine "node" is incompatible with this module. Expected version ">=10.0.0". Got "8.10.0"
Solution:got it to work by purging the old nodeJs then adding different repository source, and installing nodeJs normally with the new distribution as follows:

```bash
sudo apt-get purge --auto-remove nodejs
curl -fsSL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Issue: yarn outdated
Solution: `yarn upgrade`
Warning: still a lot of warnings in dependencies. See how the program work...
