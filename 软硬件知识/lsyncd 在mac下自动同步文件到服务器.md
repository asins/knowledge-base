---
title: "lsyncd 在mac下自动同步文件到服务器"
date: "2019-08-21"
lastmod: "2020-05-05"
---

## 一、lsyncd 介绍

略

## 二、安装

使用`brew`安装简单方便

```sh
brew install lsyncd
```



## 三、配置

```lua

-- install :
-- lsyncd for osx
-- local dir -> ssh
-- brew install lsyncd
-- brew install rsync ; /usr/local/bin/rsync instead of local rsync
-- start up : sudo lsyncd ~/a.config


-- file ~/a.config
settings {
    logfile      = "/var/log/lysncd/lsyncd.log",
    statusFile   = "/var/log/lysncd/lsyncd.status",
    inotifyMode  = "CloseWrite", -- 系统 inotify 指定监听的变化，可以是"Modify"、"CloseWrite" （默认） 或"CloseWrite or Modify".
    maxProcesses = 7,
    -- nodaemon =true,
}

sync {
    default.rsync,
    source    = "/data1/htdocs/fanxing.kugou.git/",
    target    = "www@10.16.6.91:/data1/htdocs/kfwlf.kugou.com/",
	exclude = {"/data1/htdocs/fanxing.kugou.git/.git"},
    -- excludeFrom = "/etc/rsyncd.d/rsync_exclude.lst",
    maxDelays = 1,
    delay = 3,
    delete = true,
    -- init = true,
    rsync     = {
        binary = "/usr/local/bin/rsync",
        archive = true,
        compress = true,
        bwlimit   = 2000,
        rsh = "/usr/bin/ssh -l www -i /Users/mmfei/.ssh/id_rsa -p 32200 -o StrictHostKeyChecking=no"
        -- 如果要指定其它端口，请用上面的 rsh
    }
}
```



### 3.1 配置说明

#### settings

里面是全局设置，`--`开头表示注释，下面是几个常用选项说明：

- `logfile` 定义日志文件
- `stausFile` 定义状态文件
- `nodaemon=true` 表示不启用守护模式，默认
- `statusInterval` 将 lsyncd 的状态写入上面的 statusFile 的间隔，默认 10 秒
- `inotifyMode` 指定 inotify 监控的事件，默认是`CloseWrite`，还可以是`Modify`或`CloseWrite or Modify`
- `maxProcesses` 同步进程的最大个数。假如同时有 20 个文件需要同步，而`maxProcesses = 8`，则最大能看到有 8 个 rysnc 进程
- `maxDelays` 累计到多少所监控的事件激活一次同步，即使后面的`delay`延迟时间还未到

#### sync

里面是定义同步参数，可以继续使用`maxDelays`来重写 settings 的全局变量。一般第一个参数指定`lsyncd`以什么模式运行：`rsync`、`rsyncssh`、`direct`三种模式：

- `default.rsync` ：本地目录间同步，使用 rsync，也可以达到使用 ssh 形式的远程 rsync 效果，或 daemon 方式连接远程 rsyncd 进程；
  `default.direct` ：本地目录间同步，使用`cp`、`rm`等命令完成差异文件备份；
  `default.rsyncssh` ：同步到远程主机目录，rsync 的 ssh 模式，需要使用 key 来认证

- `source` 同步的源目录，使用绝对路径。

- `target` 定义目的地址。对应不同的模式有几种写法：
  `/tmp/dest` ：本地目录同步，可用于`direct`和`rsync`模式
  `172.29.88.223:/tmp/dest` ：同步到远程服务器目录，可用于`rsync`和`rsyncssh`模式，拼接的命令类似于`/usr/bin/rsync -ltsd --delete --include-from=- --exclude=* SOURCE TARGET`，剩下的就是 rsync 的内容了，比如指定 username，免密码同步
  `172.29.88.223::module` ：同步到远程服务器目录，用于`rsync`模式
  三种模式的示例会在后面给出。

- `init` 这是一个优化选项，当`init = false`，只同步进程启动以后发生改动事件的文件，原有的目录即使有差异也不会同步。默认是`true`

- `delay` 累计事件，等待 rsync 同步延时时间，默认 15 秒（最大累计到 1000 个不可合并的事件）。也就是 15s 内监控目录下发生的改动，会累积到一次 rsync 同步，避免过于频繁的同步。（可合并的意思是，15s 内两次修改了同一文件，最后只同步最新的文件）

- `excludeFrom` 排除选项，后面指定排除的列表文件，如`excludeFrom = "/etc/lsyncd.exclude"`，如果是简单的排除，可以使用`exclude = LIST`。

  这里的排除规则写法与原生 rsync 有点不同，更为简单：

  - 监控路径里的任何部分匹配到一个文本，都会被排除，例如`/bin/foo/bar`可以匹配规则`foo`
  - 如果规则以斜线`/`开头，则从头开始要匹配全部
  - 如果规则以`/`结尾，则要匹配监控路径的末尾
  - `?`匹配任何字符，但不包括`/`
  - `*`匹配 0 或多个字符，但不包括`/`
  - `**`匹配 0 或多个字符，可以是`/`


- `delete` 为了保持 target 与 souce 完全同步，Lsyncd 默认会`delete = true`来允许同步删除。它除了`false`，还有`startup`、`running`值，请参考 [Lsyncd 2.1.x ‖ Layer 4 Config ‖ Default Behavior](https://github.com/axkibe/lsyncd/wiki/Lsyncd%202.1.x%20%E2%80%96%20Layer%204%20Config%20%E2%80%96%20Default%20Behavior)。

#### rsync

（提示一下，`delete`和`exclude`本来都是**rsync**的选项，上面是配置在**sync**中的，我想这样做的原因是为了减少 rsync 的开销）

- `bwlimit` 限速，单位 kb/s，与 rsync 相同（这么重要的选项在文档里竟然没有标出）
- `compress` 压缩传输默认为`true`。在带宽与 cpu 负载之间权衡，本地目录同步可以考虑把它设为`false`
- `perms` 默认保留文件权限。
- 其它 rsync 的选项

其它还有 rsyncssh 模式独有的配置项，如`host`、`targetdir`、`rsync_path`、`password_file`，见后文示例。`rsyncOps={"-avz","--delete"}`这样的写法在 2.1.*版本已经不支持。

`lsyncd.conf`可以有多个`sync`，各自的 source，各自的 target，各自的模式，互不影响。

### 3.2 其它模式示例

以下配置本人都已经过验证可行，必须根据实际需要裁剪配置：

```lua
settings {
    logfile ="/usr/local/lsyncd-2.1.5/var/lsyncd.log",
    statusFile ="/usr/local/lsyncd-2.1.5/var/lsyncd.status",
    inotifyMode = "CloseWrite",
    maxProcesses = 8,
    }


-- I. 本地目录同步，direct：cp/rm/mv。 适用：500+ 万文件，变动不大
sync {
    default.direct,
    source    = "/tmp/src",
    target    = "/tmp/dest",
    delay = 1
    maxProcesses = 1
    }

-- II. 本地目录同步，rsync 模式：rsync
sync {
    default.rsync,
    source    = "/tmp/src",
    target    = "/tmp/dest1",
    excludeFrom = "/etc/rsyncd.d/rsync_exclude.lst",
    rsync     = {
        binary = "/usr/bin/rsync",
        archive = true,
        compress = true,
        bwlimit   = 2000
        }
    }

-- III. 远程目录同步，rsync 模式 + rsyncd daemon
sync {
    default.rsync,
    source    = "/tmp/src",
    target    = "syncuser@172.29.88.223::module1",
    delete="running",
    exclude = { ".*", ".tmp" },
    delay = 30,
    init = false,
    rsync     = {
        binary = "/usr/bin/rsync",
        archive = true,
        compress = true,
        verbose   = true,
        password_file = "/etc/rsyncd.d/rsync.pwd",
        _extra    = {"--bwlimit=200"}
        }
    }

-- IV. 远程目录同步，rsync 模式 + ssh shell
sync {
    default.rsync,
    source    = "/tmp/src",
    target    = "172.29.88.223:/tmp/dest",
    -- target    = "root@172.29.88.223:/remote/dest",
    -- 上面 target，注意如果是普通用户，必须拥有写权限
    maxDelays = 5,
    delay = 30,
    -- init = true,
    rsync     = {
        binary = "/usr/bin/rsync",
        archive = true,
        compress = true,
        bwlimit   = 2000
        -- rsh = "/usr/bin/ssh -p 22 -o StrictHostKeyChecking=no"
        -- 如果要指定其它端口，请用上面的 rsh
        }
    }

-- V. 远程目录同步，rsync 模式 + rsyncssh，效果与上面相同
sync {
    default.rsyncssh,
    source    = "/tmp/src2",
    host      = "172.29.88.223",
    targetdir = "/remote/dir",
    excludeFrom = "/etc/rsyncd.d/rsync_exclude.lst",
    -- maxDelays = 5,
    delay = 0,
    -- init = false,
    rsync    = {
        binary = "/usr/bin/rsync",
        archive = true,
        compress = true,
        verbose   = true,
        _extra = {"--bwlimit=2000"},
        },
    ssh      = {
        port  =  1234
        }
    }
```

上面的内容几乎涵盖了所有同步的模式，其中第`III`个要求像 rsync 一样配置 rsyncd 服务端，见本文开头。第`IV`、`V`配置 ssh 方式同步，达到的效果相同，但实际同步时你会发现每次同步都会提示输入 ssh 的密码，可以通过以下方法解决：

在远端被同步的服务器上开启 ssh 无密码登录，请注意用户身份：

```sh
user$ ssh-keygen -t rsa
一路回车...
user$ cd ~/.ssh
user$ cat id_rsa.pub >> authorized_keys
```

把`id_rsa`私钥拷贝到执行 lsyncd 的机器上

```sh
user$ chmod 600 ~/.ssh/id_rsa
测试能否无密码登录
user$ ssh user@172.29.88.223
```
