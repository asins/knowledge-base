---
title: "mysql操作"
date: "2019-10-17"
lastmod: "2020-05-05"
---

```sh
# 登录 mysql
mysql -u root -p

# 创建数据库
CREATE DATABASE nextcloud DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

# 创建用户
CREATE USER nextclouduser@localhost IDENTIFIED BY 'your-password';

# 为数据库添加可访问用户
GRANT ALL PRIVILEGES ON nextcloud.* TO nextclouduser@localhost;

# 刷新权限配置
flush privileges;

```

