+++
title = "ssh高级玩法"
template = "page.html"
date = "2019-08-21"
updated = "2020-05-05"
+++


## ssh user@host 直接登录远程主机

先生成 ssh 的密钥：

  ```sh
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
  ```
2. 将自己机器中`~/.ssh/id_rsa.pub`文件中对应 ssh 密钥复制到远程主机的 `~/.ssh/authorized_keys` 文件中。
3. 并将远程主机中.ssh 目录权限为 700 `.ssh/authorized_keys` 文件权限为 600，如：
  ```sh
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
    # drwx------ 2 asins  staff 4096 Sep 25 17:26 .ssh
    # -rw------- 1 asins  staff 399 Sep 25 17:26 authorized_keys
  ```
> 注：上面 2、3 两步可使用 `ssh-copy-id -i summer@10.0.5.198` 一步完成。

## 添加别名并免密码登录
编辑`~/.ssh/ssh_config` 或者 `/etc/ssh/ssh_config`
```conf
Host esc-dev
    hostname 11.239.175.49
    user asins
    IdentityFile  ~/.ssh/id_rsa.pub
```

如果发现无法自动登录，请修改
```sh
$ vi /etc/ssh/sshd_config
    RSAAuthentication yes
    PubkeyAuthentication yes
    AuthorizedKeysFile .ssh/authorized_keys
把以上的最前面的＃去掉 。
$ service ssh restart
$ exit
```

