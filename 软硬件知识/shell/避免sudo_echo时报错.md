---
title: "避免sudo_echo时报错"
date: "2019-08-21"
lastmod: "2019-08-21"
---

## 一、问题

’sudo echo x >’ 时报’Permission denied’错误

```sh
sudo echo a > 1.txt
#bash: 1.txt: Permission denied
```

## 二、分析：

bash 拒绝这么做，说是权限不够.
这是因为重定向符号 “>” 也是 bash 的命令。sudo 只是让 echo 命令具有了 root 权限，但是没有让 “>” 命令也具有root 权限，所以 bash 会认为这个命令没有写入信息的权限。

## 三、解决办法

### 3.1 利用 “sh -c” 命令

它可以让 bash 将一个字串作为完整的命令来执行，这样就可以将 sudo 的影响范围扩展到整条命令。具体用法如下：

```sh
sudo sh -c "echo a > 1.txt"
```

利用 `bash -c` 也是一样的，现在bash shell 流行。

### 3.2 利用管道和 tee 命令

该命令可以从标准输入中读入信息并将其写入标准输出或文件中，具体用法如下：

```sh
echo a |sudo tee 1.txt
# tee -a 是追加的意思，等同于 >>
echo a |sudo tee -a 1.txt
```

tee 命令很好用，它从管道接受信息，一边向屏幕输出一边向文件写入。linux 总是有一些小工具为我们考虑的很贴切！

### 3.3 提升shell 权限

```sh
# 提到 root 权限，这时提示符为#
sudo -s
```

当你觉得该退回到普通权限时，

```sh
# 退回到 username 权限，这时提示符为$
sudo su username
```

`exit` 退出当前用户，回到上一层目录.

centos 提升权限: `su  -`
ubuntu 提升权限: `sudu -s`,  `sudo su`

