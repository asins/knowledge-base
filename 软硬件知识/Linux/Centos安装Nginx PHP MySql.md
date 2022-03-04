+++
title = "Centos安装Nginx PHP MySql"
template = "page.html"
date = "2019-08-21"
updated = "2020-04-21"
+++


```bash
# ls -alZ 可以查看到目录的状态
drwxrwxrwx. ec2-user root system_u:object_r:httpd_sys_content_t:s0 www

# 需要将上面的`httpd_sys_content_t` 更换为 `httpd_rw_content_t`
drwxrwxrwx. ec2-user root system_u:object_r:httpd_sys_rw_content_t:s0 www

# 可以使用下面的命令操作：
chcon -R -t httpd_sys_rw_content_t /www
```



### 为Nginx配置一级缓存

```nginx
http {
    ...
    proxy_cache_path /tmp/ngx_cache levels=1:2
                    keys_zone=ngx_cache:100m
                    max_size=40g inactive=1440m;
    server {
        ...
        proxy_cache ngx_cache;
        proxy_cache_key $host$uri$is_args$args;
        proxy_cache_background_update on;
        proxy_cache_lock on;
        proxy_cache_use_stale updating;
        proxy_cache_min_uses 1;
        proxy_cache_valid 200 304 5s; # 对状态为200和304的缓存文件缓存5秒
        proxy_ignore_headers Cache-Control;
        proxy_cache_bypass $cookie_nocache $arg_nocache $http_nocache;
        add_header X-Cache-Status $upstream_cache_status;
    }

}
```



# 请求头大小配置

nginx默认的header长度上限是4k，如果header头信息请求超过了，nginx会直接返回400错误
可以通过以下2个参数来调整nginx的header上限

```nginx 
client_header_buffer_size 16k;
large_client_header_buffers 4 16k;
```

nginx处理header时先根据client_header_buffer_size配置的值分配一个buffer；如果分配的buffer无法容纳 request_line/request_header，那么就会再次根据large_client_header_buffers配置的参数分配large_buffer；如果large_buffer还是无法容纳，那么就会返回414（处理request_line）/400（处理request_header）错误。

所以可以看出：

1. 如果你的请求中的header都很大，那么应该使用client_header_buffer_size，这样能减少一次内存分配。
2. 如果你的请求中只有少量请求header很大，那么应该使用large_client_header_buffers，因为这样就仅需在处理大header时才会分配更多的空间，从而减少无谓的内存空间浪费。



------

### Introduction

A LEMP software stack is a group of open source software that is typically installed together to enable a server to host dynamic websites and web apps. This term is actually an acronym which represents the **L**inux operating system, with the **E**Nginx web server (which replaces the Apache component of a LAMP stack). The site data is stored in a **M**ySQL database (using MariaDB), and dynamic content is processed by **P**HP.

In this guide, we'll get a LEMP stack installed on an CentOS 7 VPS. CentOS will fulfill our first requirement: a Linux operating system.

**Note:** The LEMP stack can be installed automatically on your Droplet by adding [this script](http://do.co/1R2FrQC) to its User Data when launching it. Check out [this tutorial](https://www.digitalocean.com/community/tutorials/an-introduction-to-droplet-metadata) to learn more about Droplet User Data.

## Prerequisites

Before you begin with this guide, you should have a separate, non-root user account set up on your server. You can learn how to do this by completing steps 1-4 in the [initial server setup for CentOS 7](https://www.digitalocean.com/community/articles/initial-server-setup-with-centos-7).

**Note about SELinux:** If you run into issues with Nginx not running, make sure the SELinux context of your Nginx configuration files is correct or change the SELinux mode to `permissive` or `disabled`.

## Step One — Install Nginx

In order to display web pages to our site visitors, we are going to employ Nginx, a modern, efficient web server.

To add the CentOS 7 EPEL repository, open terminal and use the following command:

```
sudo yum install epel-release
```

Since we are using a `sudo` command, these operations get executed with root privileges. It will ask you for your regular user's password to verify that you have permission to run commands with root privileges.

Now that the Nginx repository is installed on your server, install Nginx using the following `yum` command:

```
sudo yum install nginx
```

Afterwards, your web server is installed.

Once it is installed, you can start Nginx on your VPS:

```
sudo systemctl start nginx
```

You can do a spot check right away to verify that everything went as planned by visiting your server's public IP address in your web browser (see the note under the next heading to find out what your public IP address is if you do not have this information already):

```
Open in a web browser:http://server_domain_name_or_IP/
```

You will see the default CentOS 7 Nginx web page, which is there for informational and testing purposes. It should look something like this:

![CentOS 7 Nginx Default](assets/nginx_default.png)

If you see this page, then your web server is now correctly installed.

Before continuing, you will want to do is enable Nginx to start on boot. Use the following command to do so:

```
sudo systemctl enable nginx
```

### How To Find Your Server's Public IP Address

If you do not know what your server's public IP address is, there are a number of ways you can find it. Usually, this is the address you use to connect to your server through SSH.

From the command line, you can find this a few ways. First, you can use the `iproute2` tools to get your address by typing this:

```
ip addr show eth0 | grep inet | awk '{ print $2; }' | sed 's/\/.*$//'
```

This will give you one or two lines back. They are both correct addresses, but your computer may only be able to use one of them, so feel free to try each one.

An alternative method is to use an outside party to tell you how *it* sees your server. You can do this by asking a specific server what your IP address is:

```
curl http://icanhazip.com
```

Regardless of the method you use to get your IP address, you can type it into your web browser's address bar to get to your server.

## Step Two — Install MySQL (MariaDB)

Now that we have our web server up and running, it is time to install MariaDB, a MySQL drop-in replacement. MariaDB is a community-developed fork of the MySQL relational database management system. Basically, it will organize and provide access to databases where our site can store information.

Again, we can use `yum` to acquire and install our software. This time, we'll also install some other "helper" packages that will assist us in getting our components to communicate with each other:

```
sudo yum install mariadb-server mariadb
```

When the installation is complete, we need to start MariaDB with the following command:

```
sudo systemctl start mariadb
```

Now that our MySQL database is running, we want to run a simple security script that will remove some dangerous defaults and lock down access to our database system a little bit. Start the interactive script by running:

```
sudo mysql_secure_installation
```

The prompt will ask you for your current root password. Since you just installed MySQL, you most likely won’t have one, so leave it blank by pressing enter. Then the prompt will ask you if you want to set a root password. Go ahead and enter `Y`, and follow the instuctions:

```
mysql_secure_installation prompts:Enter current password for root (enter for none):
OK, successfully used password, moving on...

Setting the root password ensures that nobody can log into the MariaDB
root user without the proper authorisation.

New password: password
Re-enter new password: password
Password updated successfully!
Reloading privilege tables..
 ... Success!
```

For the rest of the questions, you should simply hit the "ENTER" key through each prompt to accept the default values. This will remove some sample users and databases, disable remote root logins, and load these new rules so that MySQL immediately respects the changes we have made.

The last thing you will want to do is enable MariaDB to start on boot. Use the following command to do so:

```
sudo systemctl enable mariadb
```

At this point, your database system is now set up and we can move on.

## Step Three — Install PHP

PHP is the component of our setup that will process code to display dynamic content. It can run scripts, connect to our MySQL databases to get information, and hand the processed content over to our web server to display.

We can once again leverage the `yum` system to install our components. We're going to include the php-mysql and php-fpm packages as well:

```
sudo yum install php php-mysql php-fpm
```

### Configure the PHP Processor

We now have our PHP components installed, but we need to make a slight configuration change to make our setup more secure.

Open the main php-fpm configuration file with root privileges:

```
sudo vi /etc/php.ini
```

What we are looking for in this file is the parameter that sets cgi.fix_pathinfo. This will be commented out with a semi-colon (;) and set to "1" by default.

This is an extremely insecure setting because it tells PHP to attempt to execute the closest file it can find if a PHP file does not match exactly. This basically would allow users to craft PHP requests in a way that would allow them to execute scripts that they shouldn't be allowed to execute.

We will change both of these conditions by uncommenting the line and setting it to "0" like this:

/etc/php.ini excerpt

```
cgi.fix_pathinfo=0
```

Save and close the file when you are finished.

Next, open the php-fpm configuration file `www.conf`:

```
sudo vi /etc/php-fpm.d/www.conf
```

Find the line that specifies the `listen` parameter, and change it so it looks like the following:

/etc/php-php.d/www.conf — 1 of 3

```
listen = /var/run/php-fpm/php-fpm.sock
```

Next, find the lines that set the `listen.owner` and `listen.group` and uncomment them. They should look like this:

/etc/php-php.d/www.conf — 2 of 3

```
listen.owner = nobody
listen.group = nobody
```

Lastly, find the lines that set the `user` and `group` and change their values from "apache" to "nginx":

/etc/php-php.d/www.conf — 3 of 3

```
user = nginx
group = nginx
```

Then save and quit.

Now, we just need to start our PHP processor by typing:

```
sudo systemctl start php-fpm
```

This will implement the change that we made.

Next, enable php-fpm to start on boot:

```
sudo systemctl enable php-fpm
```

## Step Four — Configure Nginx to Process PHP Pages

Now, we have all of the required components installed. The only configuration change we still need to do is tell Nginx to use our PHP processor for dynamic content.

We do this on the server block level (server blocks are similar to Apache's virtual hosts). Open the default Nginx server block configuration file by typing:

```
sudo vi /etc/nginx/conf.d/default.conf
```

Currently, with the comments removed, the Nginx default server block looks like this:

/etc/nginx/conf.d/default.conf — original

```
server {
    listen       80;
    server_name  localhost;

    location / {
        root   /usr/share/nginx/html;
        index  index.html index.htm;
    }
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }
}
```

We need to make some changes to this file for our site.

- First, we need to add an index.php option as the first value of our index directive to allow PHP index files to be served when a directory is requested
- We also need to modify the server_name directive to point to our server's domain name or public IP address
- The actual configuration file includes some commented out lines that define error processing routines. We will uncomment those to include that functionality
- For the actual PHP processing, we will need to uncomment a portion of another section. We will also need to add a try_files directive to make sure Nginx doesn't pass bad requests to our PHP processor

The changes that you need to make are in red in the text below. If you prefer, you may just copy and paste everything, then replace the value of `server_name` with the appropriate domain name or IP address:

/etc/nginx/conf.d/default.conf — updated

```
server {
    listen       80;
    server_name  server_domain_name_or_IP;

    # note that these lines are originally from the "location /" block
    root   /usr/share/nginx/html;
    index index.php index.html index.htm;

    location / {
        try_files $uri $uri/ =404;
    }
    error_page 404 /404.html;
    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }

    location ~ \.php$ {
        try_files $uri =404;
        fastcgi_pass unix:/var/run/php-fpm/php-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

When you've made the above changes, you can save and close the file.

Restart Nginx to make the necessary changes:

```
sudo systemctl restart nginx
```

## Step Five — Test PHP Processing on your Web Server

In order to test that our system is configured properly for PHP, we can create a very basic PHP script.

We will call this script `info.php`. In order for Apache to find the file and serve it correctly, it must be saved to a very specific directory, which is called the "web root".

In CentOS 7, this directory is located at `/usr/share/nginx/html/`. We can create the file at that location by typing:

```
sudo vi /usr/share/nginx/html/info.php
```

This will open a blank file. We want to put the following text, which is valid PHP code, inside the file:

Test PHP Script

```
<?php phpinfo(); ?>
```

When you are finished, save and close the file.

Now we can test whether our web server can correctly display content generated by a PHP script. To try this out, we just have to visit this page in our web browser. You'll need your server's public IP address again.

The address you want to visit will be:

```
Open in a web browser:http://your_server_IP_address/info.php
```

The page that you come to should look something like this:

![CentOS 7 default PHP info](https://assets.digitalocean.com/articles/lamp_c7/default_php_fpm.png)

This page basically gives you information about your server from the perspective of PHP. It is useful for debugging and to ensure that your settings are being applied correctly.

If this was successful, then your PHP is working as expected.

You probably want to remove this file after this test because it could actually give information about your server to unauthorized users. To do this, you can type this:

```
sudo rm /usr/share/nginx/html/info.php
```

You can always recreate this page if you need to access the information again later.







