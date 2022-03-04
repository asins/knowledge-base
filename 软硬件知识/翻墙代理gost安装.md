+++
title = "翻墙代理gost安装"
template = "page.html"
date = "2019-08-21"
updated = "2019-08-21"
+++


## 安装

1. 打开页面<https://github.com/ginuerzh/gost/releases>下载最新linux版本
2. 将二进制gost文件放到`/usr/local/bin/`目录中，并添加执行权限`chmod +x /usr/local/bin/gost`
3. 添加启动配置`/etc/gost/config.json`
```json
{
    "ServeNodes": [
        "ss://chacha20:Li123654@:443"
    ]
}
```
4. 创建自启动服务`/usr/lib/systemd/system/gost.service`
```bash
[Unit]
Description=GO Simple Tunnel
After=network.target

[Service]
Type=simple
User=root
ExecStart=/usr/local/bin/gost -C /etc/gost/config.json

[Install]
WantedBy=multi-user.target
```
5. 把gost加入服务列表中`systemctl enable gost.service`
6. `systemctl start gost.service`启动gost服务
7. 使用`systemctl list-unit-files|grep gost`可以查看服务是否已加入自启动队列
8. `systemctl status gost.service`可以查看当前服务状态

## 问题排查方法

`journalctl -xb >log` 命令可以将服务启动的日志输出到当前目录log文件中，从里面可以看到启动的详细信息。
上面的配置中在以服务形式执行时会失败，原因为没权限使用443端口，这