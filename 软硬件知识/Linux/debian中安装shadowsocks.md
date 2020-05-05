---
title: "debian中安装shadowsocks"
date: "2019-12-28"
lastmod: "2019-12-29"
---

安装 `shadowsocks-libev`：

```
sudo apt -t buster-backports install shadowsocks-libev -y
```



## 配置

编辑配置文件：

```bash 
sudo apt install shadowsocks-libev -y
sudo vim /etc/shadowsocks-libev/config.json
```

```js
{
    "server":"服务器地址",
    "server_port":端口,
    "local_port":1080,
    "password":"密码",
    "timeout":60,
    "method":"aes-256-gcm",
    "mode":"tcp_and_udp",
    "fast_open":false
}
```



## 启动并检查

激活服务，以便开机自动启动：

```
sudo systemctl enable shadowsocks-libev-local@config
```

启动服务：

```
sudo systemctl start shadowsocks-libev-local@config
```

查看服务状态：

```
sudo systemctl status shadowsocks-libev-local@config
```

------

至此，对客户端的配置完成，代理服务在 `localhost:1080` 上。