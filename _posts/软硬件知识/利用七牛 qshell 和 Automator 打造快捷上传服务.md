### 来源

早前订阅了一个图片上传工具 `iPic`，单单就图片上传这一功能来说它无疑是非常优秀的。无奈我有的时候要上传一些非图片小文件，虽然这个只是个小功能，一个小小的脚本就可以做到，但是想想用到这个功能的时候还要打开`terminal`，emmmm…（纵然本人身为程序员`terminal`一直不会关）。

然后某一天看到了七牛的SDK有命令行工具 [qshell](https://developer.qiniu.com/kodo/tools/1302/qshell) （七牛云有免费对象存储空间），而 macOS 的 `Automator` 又是支持运行 `shell`脚本的，再加上早前利用 `Automator` 做过一项彩色图转灰度图的功能，知道这些功能是可以做成系统服务的…...我有一个大胆的想法。

### 实践想法

打开 `Automator` 选择服务

![service](https://segmentfault.com/img/remote/1460000012625870?w=863&h=589)

然后选择 **运行 Shell 脚本** 拖拽到右边，程序可以选 **finder** 或者 **任何应用程序**

![run](https://segmentfault.com/img/remote/1460000012625871?w=866&h=593)

`shell` 类型务必选择 **/bin/bash** ！即使你安装了 `zsh` 也不要用！

> 之前在服务器上安装了`zsh` ，结果 `PM2` 部署项目死活不成功，找了一圈也没答案，大概没有我这么无聊的人，把服务器配置成 `zsh` 🙄

![shell](https://segmentfault.com/img/remote/1460000012625872?w=470&h=167)

### code

这里我们先查阅一下 `qshell` 上传文件的[文档](https://github.com/qiniu/qshell/blob/master/docs/fput.md)和使用示例：

```
# 上传本地文件/Users/jemy/Documents/qiniu.jpg到空间if-pbl里面
$ qshell fput if-pbl qiniu.jpg /Users/jemy/Documents/qiniu.jpg
```

这里主要是对 `Key` 的构造，即上传文件在七牛存储中的文件名，我选择的构造规则是*[日期]-[时间戳MD5值]-[文件名]*，可以有效规避文件名重复的问题，完整代码如下：

```
urlencode() {
  local length="${#1}"
  for (( i = 0; i < length; i++ )); do
    local c="${1:i:1}"
    case $c in
      [a-zA-Z0-9.~_-]) printf "$c" ;;
    *) printf "$c" | xxd -p -c1 | while read x;do printf "%%%s" "$x";done
  esac
done
}

for f in "$@"

do
    if [ -f $f ]; then
        Key=$(date +%F)-$(date +%s | md5 | head -c 8)-$(basename $f)
        /usr/local/bin/qshell fput static "$Key" $f
        link="//static.domain.me/$(urlencode $Key)"
        if [ "$links" == "" ]; then
            links=$link
        else
            links=$links"\n"$link
        fi
    fi
done

echo -ne $links | pbcopy
```

这里需要解释的几个点：

- `pbcopy` 命令会把 `echo` 中的内容放置到系统粘贴板中；
- 关于 `urlencode` ：在上传测试过程中，发现一旦选择的文件列表中含有中文命名的文件，就会导致文件链接构造异常，最后也到不了系统粘贴板中，具体原因不明，所以在构造链接时做一次编码就好，反正浏览器本身也会对编码的链接自行识别；
- `if [ -f $f ]` 是为了判断文件与文件夹；
- 考虑到MD5值太长，我只截取了8位；
- `echo` 的两个参数可以参考[该文](https://blog.csdn.net/lizhi200404520/article/details/8819762)；
- 请把资源链接的域名改成你对应的。

### test

写完脚本之后可以运行测试，`Automator` 界面右上角有一个运行，在运行之前我们先模拟选中了一些文件。

![select file](https://segmentfault.com/img/remote/1460000012625873?w=1000&h=596)

添加文件：

![select file](https://segmentfault.com/img/remote/1460000012625874?w=598&h=219)

测试的时候请把 `/usr/local/bin/qshell fput static "$Key" $f` 删除。

运行成功之后粘贴板中应该会有如下内容：

```
//static.domain.me/2017-10-16-9f26b83d-img2%e7%9a%84%e5%89%af%e6%9c%ac.jpg
//static.domain.me/2017-10-16-9f26b83d-image.png
```

到这里，只剩下[下载](https://developer.qiniu.com/kodo/tools/1302/qshell)安装 `qshell` 就大功告成：

```
$ mv ~/Downloads/qshell /usr/local/bin
$ chmod 755 /usr/local/bin/qshell
$ qshell account AccessKey SecretKey
```

这里还用到了修改权限命令，有兴趣的话可以查看我另一篇文章[服务器搭建—Linux基础知识](https://blog.bingqichen.me/view?id=11)。

### 完结

现在你可以刚才测试时添加的 `finder` 去掉，命名并保存，就可以像这样使用：

![example](https://segmentfault.com/img/remote/1460000012625875?w=567&h=501)

除此之外，你还可以在系统设置中为该服务添加快捷键，好了，我去取消订阅 `iPic` 了......

还有值得一提的是，七牛的对象存储免费额度还挺大的，拿来做私家图床还是很不错的，我还配置了CDN美滋滋😁。