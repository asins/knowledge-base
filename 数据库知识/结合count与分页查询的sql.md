+++
title = "结合count与分页查询的sql"
template = "page.html"
date = "2022-03-04"
updated = "2022-03-04"
+++

有个需求要从数据库中查询出用户名称及地址，并显示总行数，一般情况下分页数据及总行数需要写成两条sql。

查询分页数据：

```sql
SELECT Name, Address FROM Databas.Tabl WHERE Status='URGENT';
```

查询总行数：

```sql
SELECT COUNT(*) FROM Databas.Tabl WHERE Status='URGENT' AND TimeLogged='Noon';
```



下面的方式中可以写在一条语句中完成，执行效率可以比较下。

```sql
SELECT Tabl.Name, Tabl.Address, Results.Totals
FROM Databas.Tabl
LEFT JOIN (SELECT COUNT(*) AS Totals, 0 AS Bonus
           FROM Databas.Tabl
           WHERE TimeLogged='Noon'
           GROUP BY NULL) Results
     ON 0 = Results.Bonus
WHERE Status='URGENT';
```

