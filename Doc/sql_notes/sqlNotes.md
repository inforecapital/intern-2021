Source from <https://www.sqltutorial.org/>

## SQL AGGREGATE FUNCTIONS

SQL `AVG`
SQL `COUNT`
SQL `MAX`
SQL `MIN`
SQL `SUM`

SQL CONSTRAINTS
SQL `Primary Key`
SQL `Foreign Key`
SQL `UNIQUE Constraint`
SQL `CHECK Constraint`
SQL `NOT NULL Constraint`

## SQL Table management

### Create table syntax

```SQL
CREATE TABLE table_name(
    column_name_1 data_type default value column_constraint,
    column_name_2 data_type default value column_constraint,
    ...,
    table_constraint
);
```

### Alter table syntax

add column:
`ALTER TABLE table_name ADD new_colum data_type column_constraint [AFTER existing_column];`

### SQL ALTER TABLE MODIFY column

The MODIFY clause allows you to change some attributes of the existing column e.g., NOT NULL ,UNIQUE, and data type.

```SQL
ALTER TABLE table_name
MODIFY column_definition;

```

Drop colum: remove one or more columns:

```SQL
ALTER TABLE table_name
DROP column_name,
DROP colum_name,
...
```

## Drop table, truncate table

`DROP TABLE [IF EXISTS] table_name;`
Truncate one or more tables: `TRUNCATE TABLE table_name1, table_name2, ...;`

### SQL TRUNCATE TABLE vs. DELETE

Logically the TRUNCATE TABLE statement and the DELETE statement without the WHERE clause gives the same effect that removes all data from a table. However, they do have some differences:

When you use the DELETE statement, the database system logs the operations. And with some efforts, you can roll back the data that was deleted. However, when you use the TRUNCATE TABLE statement, you have no chance to roll back except you use it in a transaction that has not been committed.

To delete data from a table referenced by a foreign key constraint, you cannot use the TRUNCATE TABLE statement. In this case, you must use the DELETE statement instead.

The TRUNCATE TABLE statement does not fire the delete trigger if the table has the triggers associated with it.

Some database systems reset the value of an auto-increment column (or identity, sequence, etc.) to its starting value after you execute the TRUNCATE TABLE statement. It is not the case for the DELETE statement.

The DELETE statement with a WHERE clause deletes partial data from a table while the TRUNCATE TABLE statement always removes all data from the table.

## SQL column management

### SQL INSERT

SQL provides the INSERT statement that allows you to insert one or more rows into a table. The INSERT statement allows you to:

Insert a single row into a table
Insert multiple rows into a table
Copy rows from a table to another table.

To insert one row into a table, you use the following syntax of the INSERT statement.

The number of values must be the same as the number of columns.

Before adding a new row, the database system checks for all integrity constraints

```SQL
INSERT INTO table1 (column1, column2,...)
VALUES
 (value1, value2,...),
 (value1, value2,...),
 (value1, value2,...),
 ...;
```

You can use the INSERT statement to query data from one or more tables and insert it into another table as follows:

```SQL
INSERT INTO table1 (column1, column2)
SELECT
 column1,
 column2
FROM
 table2
WHERE
 condition1;
```

### SQL UPDATE

To change existing data in a table, you use the UPDATE statement. The following shows the syntax of the UPDATE statement:

UPDATE table_name

```SQL
SET column1 = value1,
 column2 = value2
WHERE
 condition;
```

In this syntax:

First, indicate the table that you want to update in the UPDATE clause.

Second, specify the columns that you want to modify in the SET clause. The columns that are not listed in the SET clause will retain their original values.

Third, specify which rows to update in the WHERE clause.

SQL UPDATE with subquery example:

```SQL
UPDATE dependents
SET last_name = (
 SELECT
  last_name
 FROM
  employees
 WHERE
  employee_id = dependents.employee_id
);
```

### SQL DELETE

To remove one or more rows from a table, you use the DELETE statement. The general syntax for the DELETE statement is as follows:

```SQL
DELETE
FROM
 table_name
WHERE
 condition;
```

### SQL SELECT

```SQL
SELECT
    select_list
FROM
    table_name;
```

Besides the SELECT and FROM clauses, the SELECT statement can contain many other clauses such as

`WHERE` – for filtering data based on a specified condition.
`ORDER BY` – for sorting the result set.
`LIMIT` – for limiting rows returned.
`JOIN` – for querying data from multiple related tables.
`GROUP BY` – for grouping data based on one or more columns.
`HAVING` – for filtering groups.

#### Clauses in SELECT

`ORDER BY` To specify exactly the order of rows in the result set, you add use an `ORDER BY` clause in the SELECT statement as follows:

```SQL
SELECT
    column1, column2
FROM
    table_name
ORDER BY column1 ASC ,
         column2 DESC;
```

`DISTINCT`: To remove duplicates from a result set, you use the DISTINCT operator in the SELECT clause as follows:

Note: `NULL` is distinct

```SQL
SELECT DISTINCT
    column1, column2, ...
FROM
    table1;
```

`LIMIT`: To retrieve a portion of rows returned by a query, you use the LIMIT and OFFSET clauses. The following illustrates the syntax of these clauses:

```SQL
SELECT
    column_list
FROM
    table1
ORDER BY column_list
LIMIT row_count OFFSET offset;
```

In this syntax:

The `row_count` determines the number of rows that will be returned.
The `OFFSET` clause skips the offset rows before beginning to return the rows. The `OFFSET` clause is optional so you can skip it. If you use both `LIMIT` and `OFFSET` clauses the `OFFSET` skips offset rows first before the `LIMIT` constrains the number of rows.
