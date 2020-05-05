---
title: "Centos中安装v2ray"
date: "2020-04-18"
lastmod: "2020-04-20"
---

## Nginx安装及配置

安装参考了https://tlanyan.me/v2ray-traffic-mask/



#### 安装`nginx`：

```sh
yum install nginx -y
```

#### 配置nginx：

```nginx
server {
  listen 80;
  listen [::]:80;
  server_name blog.nootn.com;  # 改成你的域名
  return 301 https://blog.nootn.com$request_uri;
}

server {
  listen       443 ssl;
  listen       [::]:443 ssl;
  server_name blog.nootn.com;
  charset utf-8;

  # ssl配置
  ssl on;
  ssl_certificate /etc/nginx/ssl/3554369_blog.nootn.com.pem; # 改成你的证书地址
  ssl_certificate_key /etc/nginx/ssl/3554369_blog.nootn.com.key; # 改成证书密钥文件地址
  ssl_session_cache shared:SSL:10m;
  ssl_ciphers           HIGH:!aNULL:!MD5;

  ssl_session_timeout 10m;
  ssl_session_tickets off;

  ssl_protocols TLSv1.2 TLSv1.3; # tls 1.3要求nginx 1.13.0及以上版本

  access_log  /var/log/nginx/blog.nootn.com.access.log;
  error_log /var/log/nginx/blog.nootn.com.error.log;

  root /usr/share/nginx/html;
  location / {
    index  index.html;
  }

  location /caniuse {
    if ($http_upgrade != "websocket") { # WebSocket协商失败时返回404
        return 404;
    }
    proxy_redirect off;
    proxy_pass http://127.0.0.1:29396;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    # Show real IP in v2ray access.log
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

  }
}
```

#### 防火墙端口放行

```sh
firewall-cmd --zone=public --permanent --add-service=http
firewall-cmd --zone=public --permanent --add-service=https
firewall-cmd --reload

# 查看防火墙开启情况
firewall-cmd --list-all
```



## v2ray安装配置

#### 安装 `v2ray`：

```sh 
bash <(curl -L -s https://install.direct/go.sh)

# 设置开机启动
systemctl enable v2ray
# 运行v2ray
systemctl start v2ray

# 命令可以查看v2ray是否正在运行
ss -ntlp | grep v2ray
```



#### 配置`v2ray`: 

打开`/etc/v2ray/config.json`文件并配置，这样就完成服务端的设置

```json
{
  "log": {
    "access": "/var/log/v2ray/access.log",
    "error": "/var/log/v2ray/error.log",
    "loglevel": "warning"
  },
  "inbounds": [{
    "port": 29396,
    "protocol": "vmess",
    "listen": "127.0.0.1",
    "settings": {
      "udp": true,
      "clients": [
	{
	  "id": "9cc05d09-8e79-4ba5-ad00-8945b0a882a5",
	  "alterId": 64
	}
      ]
    },
    "streamSettings": {
      "network": "ws",
      "kcpSettings": null,
      "wsSettings": {
	"connectionReuse": true,
	"path": "/caniuse"
      },
      "tcpSettings": null,
      "tlsSettings": {},
      "security": ""
    }
  }],
  "outbounds": [{
    "protocol": "freedom",
    "settings": {}
  },{
  "protocol": "blackhole",
  "settings": {},
  "tag": "blocked"
  }],
  "routing": {
    "rules": [
      {
	"type": "field",
	"ip": ["geoip:private"],
	"outboundTag": "blocked"
      }
    ]
  }
}
```



客户端的配置：

```json
{
  "log": {
    "error": "",
    "loglevel": "info",
    "access": ""
  },
  "inbounds": [
    {
      "listen": "127.0.0.1",
      "protocol": "socks",
      "settings": {
        "udp": false,
        "auth": "noauth"
      },
      "port": "1080"
    },
    {
      "listen": "127.0.0.1",
      "protocol": "http",
      "settings": {
        "timeout": 360
      },
      "port": "8118"
    }
  ],
  "outbounds": [
    {
      "mux": {
        "enabled": false
      },
      "protocol": "vmess",
      "streamSettings": {
        "wsSettings": {
          "path": "/caniuse",
          "headers": {
            "host": "blog.nootn.com"
          }
        },
        "tlsSettings": {
          "allowInsecure": true
        },
        "security": "tls",
        "network": "ws"
      },
      "tag": "proxy",
      "settings": {
        "vnext": [
          {
            "address": "blog.nootn.com",
            "users": [
              {
                "id": "xxx-uuid",
                "alterId": 64,
                "level": 0,
                "security": "auto"
              }
            ],
            "port": 443
          }
        ]
      }
    }
  ],
  "dns": {},
  "routing": {
    "settings": {
      "rules": []
    }
  },
  "transport": {}
}
```



#### 防火墙端口放行

```sh
# firewalld放行端口（适用于CentOS7/8）
firewall-cmd --permanent --add-port=28581/tcp # 28581改成你配置文件中的端口号
firewall-cmd --reload
```


