# 2021.05 week2

start date: 05.17
end date: 05.23

## 05/17

1. 学习pandas
    - 看完了10 minutes to pandas
    - 学习了dataframe，series这两个数据结构
    - 了解了基本create，access, edit, delete dataframe操作
2. 简单试用了python与prosgresql的交互
    - 尝试用python写一个adaptor function来来处理column name
    - 如果指定user无法顺利连接数据库，但是直接用postgres这个superhost却可以
    - 发现问题：
        - 对python语法以及数据结构不够熟悉 :(
    - 当时以及将来准备的解决办法：
        - 补习了python string的相关知识
        - 还需要加强对dictionary的了解

## 05/19

1. 学习了cyberbrick的项目结构
    - 主要由后端(server)（与postgresql数据库的交互，python）
    - 网页(web folder)前端 （UI，交互，Nodejs）
    - 网页(web folder)后端 （向HTTP发请求，get HTTP给的package，处理得到的数据/信息）
2. 观摩从提出需求到cyberbrick中不同地方修改代码，compile，测试，debug，最后deploy的全过程
3. 尝试录入excel数据进系统
    - column name不可以带有%， 因为sqlAlchemy会把%当成pattern matching的command
    - column name也不可带有"", '';
        - temporary solution：暂时用中文字符下的 %以及“”，‘’替代
        - 潜在问题：使用查找时会出现因为符号不同而无法查找的情况
        - future solution：rewrite interaction with sql，不再使用sqlAlchemy
    - column name不可重复
        - solution：为重复名字的column添加后缀如：_1，_2，...
        - 潜在问题：即使添加后缀也不能还原该column在excel中对应的含义（如yoy指的是哪项指标的yoy）
        - future solution：
            1. 人工处理column name；
            2. 新增一个记录不同column关系的表，然后录入后系统可以通过表中记录的关系把columns联系起来
            3. 使用非关系型数据库
    - column name不可超过128 characters
        - solution：capped to 50 characters
        - 潜在问题：可能丢失部分信息。不过鉴于column name本身不宜过长，这个处理本身不会有太大问题。
