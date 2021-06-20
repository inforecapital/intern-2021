# 2021.05 week2

start date: 05.17
end date: 05.23

## 05/17

1. 学习 pandas
   - 看完了 10 minutes to pandas
   - 学习了 dataframe,series 这两个数据结构
   - 了解了基本 create,access, edit, delete dataframe 操作
2. 简单试用了 python 与 prosgresql 的交互
   - 尝试用 python 写一个 adaptor function 来来处理 column name
   - 如果指定 user 无法顺利连接数据库,但是直接用 postgres 这个 superhost 却可以
   - 发现问题:
     - 对 python 语法以及数据结构不够熟悉 :(
   - 当时以及将来准备的解决办法:
     - 补习了 python string 的相关知识
     - 还需要加强对 dictionary 的了解

## 05/19

1. 学习了 cyberbrick 的项目结构
   - 主要由后端(server)（与 postgresql 数据库的交互,python）
   - 网页(web folder)前端 （UI,交互,Nodejs）
   - 网页(web folder)后端 （向 HTTP 发请求,get HTTP 给的 package,处理得到的数据/信息）
2. 观摩从提出需求到 cyberbrick 中不同地方修改代码,compile,测试,debug,最后 deploy 的全过程
3. 尝试录入 excel 数据进系统
   - column name 不可以带有%, 因为 sqlAlchemy 会把%当成 pattern matching 的 command
   - column name 也不可带有"", '';
     - temporary solution:暂时用中文字符下的 %以及“”,‘’替代
     - 潜在问题:使用查找时会出现因为符号不同而无法查找的情况
     - future solution:rewrite interaction with sql,不再使用 sqlAlchemy
   - column name 不可重复
     - solution:为重复名字的 column 添加后缀如:\_1,\_2,...
     - 潜在问题:即使添加后缀也不能还原该 column 在 excel 中对应的含义（如 yoy 指的是哪项指标的 yoy）
     - future solution:
       1. 人工处理 column name；
       2. 新增一个记录不同 column 关系的表,然后录入后系统可以通过表中记录的关系把 columns 联系起来
       3. 使用非关系型数据库
   - column name 不可超过 128 characters
     - solution:capped to 50 characters
     - 潜在问题:可能丢失部分信息。不过鉴于 column name 本身不宜过长,这个处理本身不会有太大问题。
