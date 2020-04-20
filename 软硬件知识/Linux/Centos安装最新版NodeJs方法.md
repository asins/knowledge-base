---
title: "Centos安装最新版NodeJs方法"
lastmod: "2017-03-05"
date: "2013-11-18"
---

在Centos系统中NodeJs官方源内的版本还是`0.x.x`版本，所以要安装最新版需要自己想办法了。

在Centos 7版上可以自己编译方式完成，但在Centos5/6上由于编译器版本问题，想安装上可着实不简单。还好网上有提供完整的安装方法。

### 静态网络IP设置

```sh
# 查看当前网络设置
ip addr show
```



### Nodejs 安装

安装时需要注意，这里<https://github.com/nodesource/distributions> 中有全面的安装方式。 如 CentOS 6 系统

```
curl -sL https://rpm.nodesource.com/setup\_6.x | bash -
yum install -y nodejs
```