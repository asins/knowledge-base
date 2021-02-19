---
title: "trojan使用"
date: "2020-03-15"
lastmod: "2020-03-15"
---

记录一下在Centos8中安装trojan的过程，方便以后查询。

### 系统更新

```bash
# 先将系统更新到最新状态
yum update -y

# centos8默认是开启了防火墙的，需要手动允许http:80、https:443端口
sudo firewall-cmd --zone=public --add-service=http --permanent
sudo firewall-cmd --zone=public --add-service=https --permanent
sudo firewall-cmd --reload
```

### 开启BBR加速

```bash
# 使用BBR加速
# sudo bash -c "$(curl -fsSL https://raw.githubusercontent.com/chiakge/Linux-NetSpeed/master/tcp.sh)"
echo "net.core.default_qdisc=fq" >> /etc/sysctl.conf
echo "net.ipv4.tcp_congestion_control=bbr" >> /etc/sysctl.conf
sysctl -p
```

我的vps使用的是vultr中的centos 8系统，`BBR魔改版`、`BBRplus版`内核安装后都无法正常启动系统，就直接使用了系统自带的bbr，所以只用上面代码开启了BBR加速。

### 安装nginx

```bash
# 安装nginx
yum install nginx -y

# 允许开启自动启动
sudo systemctl enable nginx
# 重启服务
sudo systemctl restart nginx
# 查询服务状态
sudo systemctl status nginx
```

```conf
# /etc/nginx/nginx.conf
user nginx;
worker_processes auto;

error_log /var/log/nginx/error.log warn;
pid /run/nginx.pid;
include /etc/nginx/modules-enabled/*.conf;
events {
	worker_connections 51200;
	use epoll;
	multi_accept on;
}

http {
	aio threads;
	charset UTF-8;
	tcp_nodelay on;
	tcp_nopush on;
	server_tokens off;

	include /etc/nginx/mime.types;
	default_type application/octet-stream;

	access_log /var/log/nginx/access.log;

	log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
		'$status  "$http_referer" '
		'"$http_user_agent" "$http_x_forwarded_for"';

	sendfile on;
	gzip on;
	gzip_proxied any;
	gzip_types *;
	gzip_comp_level 9;

	include /etc/nginx/conf.d/*.conf;
	client_max_body_size 10G;
}

```





### 安装trojan

```bash
# 安装最新版本的trojan
# sudo bash -c "$(curl -fsSL https://raw.githubusercontent.com/trojan-gfw/trojan-quickstart/master/trojan-quickstart.sh)"

# 通过brew安装
brew tap trojan-gfw/trojan
brew cask install trojanx

# 一键安装脚本
sudo bash -c "$(curl -fsSL https://raw.githubusercontent.com/johnrosen1/trojan-gfw-script/master/vps.sh)"
# 注：若已有证书，请放置于/etc/trojan/

# 允许开启自动启动
sudo systemctl enable trojan
# 重启服务
sudo systemctl restart trojan
# 查询服务状态
sudo systemctl status trojan
```

安全好后配置文件在`/usr/local/etc/trojan/config.json`，修改一些配置内容

```bash
{
    "run_type": "server",
    "local_addr": "0.0.0.0",
    "local_port": 443,
    "remote_addr": "127.0.0.1",
    "remote_port": 80,
    "password": [
        "xxxx" // 设置一个密码
    ],
    "log_level": 1,
    "ssl": {
        "cert": "/etc/nginx/ssl/test.pem", // 指定到自己的证书文件
        "key": "/etc/nginx/ssl/test.key", // 指定到自己的证书文件
        "key_password": "",
        "cipher": "ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384",
        "cipher_tls13": "TLS_AES_128_GCM_SHA256:TLS_CHACHA20_POLY1305_SHA256:TLS_AES_256_GCM_SHA384",
        "prefer_server_cipher": true,
        "alpn": [
            "h2",
            "http/1.1"
        ],
        "reuse_session": true,
        "session_ticket": false,
        "session_timeout": 600,
        "plain_http_response": "",
        "curves": "",
        "dhparam": ""
    },
        "tcp": {
        "prefer_ipv4": false,
        "no_delay": true,
        "keep_alive": true,
        "reuse_port": false,
        "fast_open": false,
        "fast_open_qlen": 20
    },
    "mysql": {
        "enabled": false,
        "server_addr": "127.0.0.1",
        "server_port": 3306,
        "database": "trojan",
        "username": "trojan",
        "password": ""
    }
}
```



