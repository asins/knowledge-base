---
title: "Centos使用"
date: "2019-10-02"
lastmod: "2020-03-09"
---

```bash 
# 为用户添加到sudo用户组内
usermod -aG wheel newuser
```



### 更新语言

```bash
yum install langpacks-zh_CN.noarch
```



### Mac上挂载nfs硬盘

```sh
sudo mount -t nfs -o resvport,rw,nolock 192.168.1.180:/3T /Users/asins/3T
```



```sh
" 打开nfs 日志
rpcdebug -m nfsd all
" 输出在 /var/log/messages 文件中

" 清除记录日志
rpcdebug -m nfsd -c all
```



rpcdebug -m nfsd all" then /var/log/messages



----

```bash
# 对硬盘进行格式化
parted /dev/sdc
# 将磁盘格式转换为GPT（旧的MBR格式硬盘不支持2T以上硬盘，需要转换为GPT格式才支持）
(parted) mklabel gpt
# 将整块硬盘分一个区，分区使用使用xfs格式
(parted) mkpart primary xfs 0 -1
# 输入p查看配置情况
(parted) p
# 退出parted命令工具行
(parted) quite

# 开始格式化
mkfs.xfs /dev/sdc

# 设置开机自动挂载硬盘 
vim /etc/fstab
# 用blkid查看硬盘的UUID
blkid /dev/sdb
# 加入一行
UUID=xxxx /mnt/3T xfs defaults 1 2


```

