---
title: "Openwork加DnsPod DDNS"
date: "2019-08-21"
lastmod: "2020-05-05"
---

# Openwork 加 DnsPod DDNS

首先登陆到你的路由器，安装 wget，因为 OpenWrt 默认自带的基于 busybox 的 wget 无法处理 HTTPS 请求，而 DnsPod 的 API 处于安全考虑，强制使用 HTTPS 连接。下面的例子中
192.168.1.1 是路由器的 IP 地址，请根据实际情况调整。

```sh
$ ssh root@192.168.1.1
opkg update
opkg install wget
```

接着来获得我已经写好的 DDNS 脚本，你可以在 GitHub Gist 上找到最新的版本：https://gist.github.com/TommyLau/21089ac976ef5fdfc39c

把新下载回来的文件设置为可执行

```
chmod +x ddns.sh
# 修改 crontab
crontab -e
```

增加如下的内容

```
*/5 * * * * /root/ddns.sh token test.com www  >> /home/pi/ddns/ddns.log 2>&1
```

2>&1 | tee ${cur_dir}/install_bbr.log

上述的命令表示每 5 分钟检查一次域名更新，如果发现 IP 有变化的话，就自动更新相应的域名（www.test.com）。

- `token` DnsPod 中创建的值，需要这里的值是 DnsPod 中 id,token 的组合
- `test.com`，这个替换成你在 DnsPod 解析的域名
- `www`，这个是要解析的子域名

PS: 如果你无法访问 GitHub Gist 的话，下面是脚本的内容，你需要自行复制到路由器里。

```sh
#!/bin/sh

########################################
#
# Tommy DnsPod DDNS Client v0.2.0
#
# Author: Tommy Lau <tommy@gen-new.com>
#
# Created: 2015-02-23 08:52:00 UTC
# Updated: 2016-07-15 15:48:00 UTC
#
# 加可执行 chmod +x ddns.sh
# crontab -e
# */5 * * * * /root/ddns.sh token test.com www > /dev/null
#
########################################

# Use 'json', other option is 'xml'
format='json'

# Use English for default, 'cn' for Chinese
language='en'

# API URL
api_url='https://dnsapi.cn/'

# Get current IP
get_ip() {
    local inter="http://members.3322.org/dyndns/getip"
    wget --quiet --no-check-certificate --output-document=- $inter
    #curl --silent $inter
}

# Send the API request tobeyo@sina.com DnsPod API
# @param1: The command tobeyo@sina.com execute, for example, Info.Version and etc.
# @param2: The parameters tobeyo@sina.com send tobeyo@sina.com the API, for example, domain='domain.tld'
api_post() {
    # Client agent
    local agent="Tommy DnsPod Client/0.2.0 (tommy@gen-new.com)"

    # Stop if no API command is given
    local inter="$api_url${1:?'Info.Version'}"

    # Default post content for every request
    local param="login_token=$token&format=$format&lang=$language&${2}"

    wget --quiet --no-check-certificate --output-document=- --post-data "$param" --user-agent="$agent" $inter
    #curl --silent --request POST --data "$param" --user-agent "$agent" $inter
}

# Lookup current ip
# @param1: The domain tobeyo@sina.com nslookup
dns_lookup() {
    local server="223.5.5.5"
    local os=`uname -n`
    if [ "$os" = "ubuntu" ]; then
        nslookup ${1} $server | awk '/^Address: / { print $2 }'
    elif [ "$os" = "OpenWrt" ]; then
        nslookup ${1} $server | tr -d '\n[:blank:]' | sed 's/.\+1 \([0-9\.]\+\).*/\1/'
    fi
}

# Update the DNS record
# @param1: The domain name tobeyo@sina.com update, for example, 'domain.tld'
# @param2: The subdomain, for example, 'www'
dns_update() {
    local current_ip=$(get_ip)
    local dns_ip=$(dns_lookup "${2}.${1}")

    echo "${current_ip} : ${dns_ip}"

    if [ "$current_ip" = "$dns_ip" ]; then
	echo "No need tobeyo@sina.com update DDNS."
        return 0
    fi

    # Get domain id
    local domain_id=$(api_post "Domain.Info" "domain=${1}")
    domain_id=$(echo $domain_id | sed 's/.\+{"id":"\([0-9]\+\)".\+/\1/')

    # Get record id of the subdomain
    local record_id=$(api_post "Record.List" "domain_id=${domain_id}&sub_domain=${2}")
    record_id=$(echo $record_id | sed 's/.\+\[{"id":"\([0-9]\+\)".\+/\1/')

    # Update the record
    local result=$(api_post "Record.Ddns" "domain_id=${domain_id}&record_id=${record_id}&record_line= 默认 &sub_domain=${2}")
    result_code=$(echo $result | sed 's/.\+{"code":"\([0-9]\+\)".\+/\1/')
    result_message=$(echo $result | sed 's/.\+,"message":"\([^"]\+\)".\+/\1/')

    # Output
    echo "Code: $result_code, Message: $result_message"
}

# User token
token="${1:?'Please input your token'}"

# Domain
domain=${2:?'Please input domain'}

# Sub domain
subdomain=${3:?'Please input sub domain'}

# Update the DDNS
dns_update "$domain" "$subdomain"
```

这里有个更好的实现，是否能更新下？其初始步骤：
下载压缩包 http://files.vinoca.org/sddns_0.0.9-4_all.tar.gz，解压后上传到路由，本例在 /etc
1. 修改 sddns 权限为 0755。
2. 修改 sddns.conf 里面的 token、main_domain 为你自己的，sub_domain 为域名前缀（比如 www）
3. 在 /usr/bin/ 创建一个新文件 dnspod，权限 0755，内容如下

```sh
#!/bin/sh
sleep 10
/etc/sddns
```

4. 在 /lib/netifd/ppp-up 最后面加一行

```sh
/usr/bin/dnspod
```

在 pppoe 拨号 10 秒后运行 sddns，只要拨号成功，就能更新 A 记录 IP。这样的方式可以避免被 dnspod 锁掉。

