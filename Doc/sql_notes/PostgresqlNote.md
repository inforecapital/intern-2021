# POSTGRESQL NOTES

[Source](https://blog.csdn.net/u010856284/article/details/70142810)
连接数据库, 默认的用户和数据库是 postgres
psql -U user -d dbname

切换数据库,相当于 mysql 的 use dbname
\c dbname
列举数据库，相当于 mysql 的 show databases
\l
列举表，相当于 mysql 的 show tables
\dt
查看表结构，相当于 desc tblname,show columns from tbname
\d tblname

\di 查看索引

创建数据库：
create database [数据库名];
删除数据库：
drop database [数据库名];  
*重命名一个表：
alter table [表名 A] rename to [表名 B];
*删除一个表：
drop table [表名];

*在已有的表里添加字段：
alter table [表名] add column [字段名] [类型];
*删除表中的字段：
alter table [表名] drop column [字段名];
*重命名一个字段：  
alter table [表名] rename column [字段名 A] to [字段名 B];
*给一个字段设置缺省值：  
alter table [表名] alter column [字段名] set default [新的默认值];
\_去除缺省值：  
alter table [表名] alter column [字段名] drop default;
在表中插入数据：
insert into 表名 ([字段名 m],[字段名 n],......) values ([列 m 的值],[列 n 的值],......);
修改表中的某行某列的数据：
update [表名] set [目标字段名]=[目标值] where [该行特征];
删除表中某行数据：
delete from [表名] where [该行特征];
delete from [表名];--删空整个表
创建表：
create table ([字段名 1] [类型 1] ;,[字段名 2] [类型 2],......<,primary key (字段名 m,字段名 n,...)>;);
\copyright 显示 PostgreSQL 的使用和发行条款
\encoding [字元编码名称]
显示或设定用户端字元编码
\h [名称] SQL 命令语法上的说明，用\* 显示全部命令
\prompt [文本] 名称
提示用户设定内部变数
\password [USERNAME]
securely change the password for a user
\q 退出 psql

创建用户
方式 1:在 PostgresSQL 命令行中使用 CREATE ROLE 指令创建
CREATE ROLE rolename;
`CREATE ROLE rolename;`
方式 2:在 PostgresSQL 命令行中使用 CREATE USER 指令创建
`CREATE USER username;`
CREATE USER 和 CREATE ROLE 的区别在于，CREATE USER 指令创建的用户默认是有登录权限的，而 CREATE ROLE 没有。

\du 指令显示用户和用户的用户属性
创建用户时设定用户属性
基本语法格式
`CREATE ROLE role_name WITH optional_permissions;`

示例:在创建用户时设定登录权限。
`CREATE ROLE username WITH LOGIN;`

可以通过\h CREATE ROLE 指令查看全部可设置的管理权限
修改用户属性
修改权限的命令格式
`ALTER ROLE username WITH attribute_options;`

例如:可通过以下方式禁止用户登录
`ALTER ROLE username WITH NOLOGIN;`

设置访问权限
语法格式如下:
`GRANT permission_type ON table_name TO role_name;`

实例:
`GRANT UPDATE ON demo TO demo_role;` --赋予 demo_role demo 表的 update 权限
`GRANT SELECT ON ALL TABLES IN SCHEMA PUBLIC to demo_role;` --赋予 demo_role 所有表的 SELECT 权限

特殊符号:ALL 代表所访问权限，PUBLIC 代表所有用户
`GRANT ALL ON demo TO demo_role`; --赋给用户所有权限
`GRANT SELECT ON demo TO PUBLIC`; --将 SELECT 权限赋给所有用户

\z 或\dp 指令显示用户访问权限。
\h GRANT 显示所有可设置的访问权限
撤销用户访问权限
语法格式如下:
`REVOKE permission_type ON table_name FROM user_name;`

其中 permission_type 和 table_name 含义与 GRANT 指令中相同。

用户组
在 postgres 中用户实际上是 role，同时组也是 role。 包含其他 role 的 role 就是组。

创建组示例:

```SQL
CREATE ROLE temporary_users;
GRANT temporary_users TO demo_role;
GRANT temporary_users TO test_user;
```

切换 ROLE
`SET ROLE role_name;` --切换到 role_name 用户
`RESET ROLE;` --切换回最初的 role

INHERIT 权限：该属性使组成员拥有组的所有权限
`ALTER ROLE test_user INHERIT;`

删除用户和组
删除用户和组很简单:

`DROP ROLE role_name;`
`DROP ROLE IF EXISTS role_name;`

删除组 role 只会删除组的 role 本身，组的成员并不会被删除

修改用户秘密：
`ALTER ROLE username WITH PASSWORD 'password';`

创建带有默认密码的用户
`CREATE ROLE rolename PASSWORD 'securePass1';`

## BASH with psql

[run single command without bash vairable](https://stackoverflow.com/questions/18223665/postgresql-query-from-bash-script-as-database-user-postgres)

```bash
#!/bin/bash
psql -U postgres -d database_name -c "SELECT c_defaults  FROM user_info WHERE c_uid = 'testuser'"
```

[run single or multiple command with bash variable](https://askubuntu.com/questions/1064648/using-bash-in-combination-with-psql-passing-variable-between-them)

You can pass single commands as strings using -c, or pass more complex command sequences via standard input for example using a here document:

```bash
sudo -u postgres psql << EOF
SELECT COUNT(*) FROM (
  SELECT datname FROM pg_catalog.pg_database 
  WHERE lower(datname)=lower($DATABASE)
)
EOF
```
