---
title: "crontab 定时任务"
date: "2019-08-21"
lastmod: "2019-08-21"
---

## 安装

```sh
yum install crontabs
```

说明：
```sh
# 启动/关闭/重启服务
/sbin/service crond start
/sbin/service crond stop
/sbin/service crond restart
# 重新载入配置
/sbin/service crond reload
# 查看crontab服务状态
service crond status
# 手动启动crontab服务
service crond start
sudo systemctl restart crond.service

# 加入开机自动启动
chkconfig –level 35 crond on
```

## 基本格式

```sh
*   *   *  *   *  command
分  时  日  月  周  命令
```

- 1列表示分钟0～59 每分钟用*或者 */1表示
- 2列表示小时0～23（0表示0点）
- 3列表示日期1～31
- 4列 表示月份1～12
- 5列标识号星期0～6（0表示星期天）
- 6列要运行的命令

crontab命令用于设置计时器

## 语法

```sh
crontab [-u <用户名称>][配置文件] 或 crontab [-u <用户名称>][-elr]
```

## 补充说明

cron是一个常驻服务，它提供计时器的功能，让用户在特定的时间得以执行预设的指令或程序。只要用户会编辑计时器的配置文件，就可以使 用计时器的功能。其配置文件格式如下：
  Minute Hour Day Month DayOFWeek Command

## 参数

  - -e 　编辑该用户的计时器设置。
  - -l 　列出该用户的计时器设置。
  - -r 　删除该用户的计时器设置。
  - -u<用户名称> 　指定要设定计时器的用户名称。

## 编辑及测试

root用户的配置文件在`/etc/crontab`文件中，当前登录用户可执行`crontab -e`添加。

cron的centos系统日志在`/var/log/cron`文件中。

```sh
# 编辑Root用户的cron任务
vim /etc/cron

# 查看cron执行日志
tail -f /var/log/cron
```




## 一些配置例子

```sh
30 21 * * * /etc/init.d/nginx restart
# 每晚的21:30重启 nginx。

45 4 1,10,22 * * /etc/init.d/nginx restart
# 每月1、 10、22日的4:45重启nginx。

10 1 * * 6,0 /etc/init.d/nginx restart
# 每周六、周日的1:10重启nginx。

0,30 18-23 * * * /etc/init.d/nginx restart
# 每天18:00至23:00之间每隔30分钟重启nginx。

0 23 * * 6 /etc/init.d/nginx restart
# 每星期六的23:00重启nginx。

* */1 * * * /etc/init.d/nginx restart
# 每一小时重启nginx

* 23-7/1 * * * /etc/init.d/nginx restart
# 晚上11点到早上7点之间，每隔一小时重启nginx

0 11 4 * mon-wed /etc/init.d/nginx restart
# 每月的4号与每周一到周三 的11点重启nginx

0 4 1 jan * /etc/init.d/nginx restart
# 一月一号的4点重启nginx

*/30 * * * * /usr/sbin/ntpdate 210.72.145.20
# 每半小时同步一下时间

# 每周4下午2:10发消息
10 14 *  *  4 wkli /home/wkli/zhoubao.sh . $'\n' >> /home/wkli/zhoubao.log 2>&1

```

