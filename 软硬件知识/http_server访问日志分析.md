

cat passport-login.txt |sort|uniq -c|sort -nr > ./passport-access.log

sort 排序

#### 一句话需求

排查线上所有使用者，推进业务方旧登录组件入口地址下线的工作。

## 现状

进入线上`passport-login`应用**单台**机器访问日志目录中，通过以下语言

```bash 
cat 2018/12/2018-12-16-taobao-access_log |grep 'http://account.youku.com/static-resources/js/loadFrame.js'|awk -F " " '{print $10}'|awk -F'?' '{gsub(/https?:\/\//,"http://",$1);gsub(/\/i\/[a-zA-Z0-9=]+/,"/i/xxx",$1);gsub(/\/u\/[a-zA-Z0-9=]+/,"/u/xxx",$1);gsub(/\/detail\/show\/[a-zA-Z0-9=]+/,"/detail/show/xxx",$1);gsub(/\/*\"?$/,"",$1);print $1}'|sort|uniq -c|sort -nr
```

从日志中搜索`loadFrame.js`文件引用的reffer，得到结果如下：

```
43160 http://www.youku.com
11508 http://www.youku.com/index/y404
 6046 http://movie.youku.com
 3896 http://tv.youku.com
```




```bash
cat cai/logs/cronolog/2019/07/2019-07-03-taobao-access_log |awk -F " " '{print $10}'|awk -F'?' '{gsub(/https?:\/\//,"http://",$1);gsub(/\/i\/[a-zA-Z0-9=]+/,"/i/xxx",$1);gsub(/\/u\/[a-zA-Z0-9=]+/,"/u/xxx",$1);gsub(/\/show\/id_.*?/,"/show/id_xxx",$1);print $1}'|sort|uniq -c|sort -nr
```

 