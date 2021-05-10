Source from https://www.sqltutorial.org/
SQL AGGREGATE FUNCTIONS:
    SQL AVG
    SQL COUNT
    SQL MAX
    SQL MIN
    SQL SUM

SQL CONSTRAINTS
    SQL Primary Key
    SQL Foreign Key
    SQL UNIQUE Constraint
    SQL CHECK Constraint
    SQL NOT NULL Constraint

SQL Table management:
    Create table syntax: 

    ``` SQL
    CREATE TABLE table_name(
     column_name_1 data_type default value column_constraint,
     column_name_2 data_type default value column_constraint,
     ...,
     table_constraint
    );```

    Alter table syntax:
        add column:
        ```SQL
        ALTER TABLE table_name
        ADD new_colum data_type column_constraint [AFTER existing_column];```

        SQL ALTER TABLE MODIFY column
            The MODIFY clause allows you to change some attributes of the existing column e.g., NOT NULL ,UNIQUE, and data type.

            ```SQL
            ALTER TABLE table_name
            MODIFY column_definition;```

        Drop colum: remove one or more columns:
        ```SQL
        ALTER TABLE table_name
        DROP column_name,
        DROP colum_name,
        ...```
    
    Drop table, truncate table:
        `DROP TABLE [IF EXISTS] table_name;`
        Truncate one or more tables: `TRUNCATE TABLE table_name1, table_name2, ...;`
        
        ###SQL TRUNCATE TABLE vs. DELETE

        Logically the TRUNCATE TABLE statement and the DELETE statement without the WHERE clause gives the same effect that removes all data from a table. However, they do have some differences:

        When you use the DELETE statement, the database system logs the operations. And with some efforts, you can roll back the data that was deleted. However, when you use the TRUNCATE TABLE statement, you have no chance to roll back except you use it in a transaction that has not been committed.
        To delete data from a table referenced by a foreign key constraint, you cannot use the TRUNCATE TABLE statement. In this case, you must use the DELETE statement instead.
        The TRUNCATE TABLE statement does not fire the delete trigger if the table has the triggers associated with it.
        Some database systems reset the value of an auto-increment column (or identity, sequence, etc.) to its starting value after you execute the TRUNCATE TABLE statement. It is not the case for the DELETE statement.
        The DELETE statement with a WHERE clause deletes partial data from a table while the TRUNCATE TABLE statement always removes all data from the table.
