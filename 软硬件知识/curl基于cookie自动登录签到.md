+++
title = "curl基于cookie自动登录签到"
template = "page.html"
date = "2019-08-21"
updated = "2020-05-05"
+++


在 iamtxt.com 网站上下载电子书需要积分，只好做每日签到这种事。在服务器上写了个 qiandao_iamtxt.com.sh 文件：

```sh
#!/bin/bash
BASEDIR=$(pwd)

USERNAME=ooo
PASSWORD=xxx
LOGFILE="$BASEDIR/iamtxt.com.log"
# cookie temp file
COOKIEFILE="$BASEDIR/cookie_iamtxt_tmp.txt"

# login
# -d 登录参数
# -c 保存 cookie 到临时文件中
# -s silence mode
LOGINURL=https://www.iamtxt.com/e/member/doaction.php
LOGINPARAM="username=$USERNAME&password=$PASSWORD&enews=login&tobind=0&lifetime=315360000&ecmsfrom=https://www.iamtxt.com/"
RESPONSE=`curl $LOGINURL -d$LOGINPARAM -c $COOKIEFILE -s | grep "<strong>"`
TIME=`date +'%Y-%m-%d %H:%M:%S'`
echo "$TIME | $RESPONSE" >> $LOGFILE

# update
# -b use the cookie file
UPDATEURL=https://www.iamtxt.com/e/extend/signin.php
RESPONSE=`curl $UPDATEURL -d"userid=310975" -s -b $COOKIEFILE`
TIME=`date +'%Y-%m-%d %H:%M:%S'`
# write the response to log file
echo "$TIME | $RESPONSE" >> $LOGFILE

# delete cookie temp file
if [ -d $COOKIEFILE ]; then
  rm $COOKIEFILE
fi
```

添加可执行权限

```sh
# 新建的文件默认是没有执行权限的，手动添加下
chmod +x iamtxt.com.sh
```

添加 cron 任务

```bash
# 每天早上 9 点执行一次
 *  9  *  *  * root /root/qiandao/iamtxt.com.sh > /dev/null
```

