+++
title = "bitwardenrs密码管理"
template = "page.html"
date = "2020-04-07"
updated = "2020-05-05"
+++



```sh
#安装 Docker
yum -y install docker
#启动 docker
systemctl start docker
#开机自启
systemctl enable docker
```

接下来使用 Docker 拉取 bitwarden_rs 镜像并运行
```sh
docker pull bitwardenrs/server:latest
docker run -d --name bitwarden -v /bw-data/:/data/ \
  -e SIGNUPS_ALLOWED=false \
  -e INVITATIONS_ALLOWED=false \
  -e ADMIN_TOKEN=step2_generated_token \
	-p 8880:80 bitwardenrs/server:latest
```

### 配置 nginx 代理

```sh
server {
  listen       443 ssl http2;
  server_name  pass.nootn.com;
  index        index.html index.htm;
  access_log   /var/log/nginx/pass.nootn.com-access.log;
  error_log    /var/log/nginx/pass.nootn.com-error.log;

  ssl_certificate        /etc/nginx/ssl/pass.nootn.com.pem;
  ssl_certificate_key    /etc/nginx/ssl/pass.nootn.com.key;

  ssl_session_timeout 1d;
  ssl_session_cache shared:SSL:50m;
  ssl_session_tickets off;

  # intermediate configuration. tweak to your needs.
  ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
  ssl_ciphers 'ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA:ECDHE-RSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA:ECDHE-ECDSA-DES-CBC3-SHA:ECDHE-RSA-DES-CBC3-SHA:EDH-RSA-DES-CBC3-SHA:AES128-GCM-SHA256:AES256-GCM-SHA384:AES128-SHA256:AES256-SHA256:AES128-SHA:AES256-SHA:DES-CBC3-SHA:!DSS';
  ssl_prefer_server_ciphers on;

  # HSTS (ngx_http_headers_module is required) (15768000 seconds = 6 months)
  add_header Strict-Transport-Security max-age=15768000;

  # OCSP Stapling ---
  # fetch OCSP records from URL in ssl_certificate and cache them
  ssl_stapling on;
  ssl_stapling_verify on;

  server_name     pass.nootn.com;
  client_max_body_size 128M;
  location / {
    proxy_set_header  Host  'pass.nootn.com';
    proxy_pass http://127.0.0.1:8880;
    proxy_redirect off;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  }
  # location /notifications/hub {
  #   proxy_pass http://127.0.0.1:3012;
  #   proxy_set_header Upgrade $http_upgrade;
  #   proxy_set_header Connection "upgrade";
  # }

  location /notifications/hub/negotiate {
    proxy_pass http://127.0.0.1:8880;
  }
}

server {
  listen 80;
  listen [::]:80;
  server_name pass.nootn.com;
  return 301 https://pass.nootn.com$request_uri;
}
```
