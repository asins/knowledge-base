## Centos中安装

安装方法来源于：https://www.wireguard.com/install/

```bash
$ sudo curl -Lo /etc/yum.repos.d/wireguard.repo https://copr.fedorainfracloud.org/coprs/jdoss/wireguard/repo/epel-7/jdoss-wireguard-epel-7.repo
$ sudo yum install epel-release
$ sudo yum install wireguard-dkms wireguard-tools
```

上面的安装在centos7中报错：

```bash
RTNETLINK answers: Operation not supported
Unable to access interface: Protocol not supported
```

按这[文章](http://www.cloudy.pub/2018/07/06/centos-7-da-jian-wireguard/)安装重启后正常：

```bash
yum install epel-release
yum install dkms gcc-c++ gcc-gfortran glibc-headers glibc-devel libquadmath-devel libtool systemtap systemtap-devel  wireguard-dkms wireguard-tools
echo "net.ipv4.ip_forward = 1" >> /usr/lib/sysctl.d/default.conf
sysctl -p
```

### 配置

```bash
mkdir /etc/wireguard
cd /etc/wireguard
wg genkey | tee privatekey | wg pubkey > publickey
chmod 777 -R /etc/wireguard
vim /etc/wireguard/wg0.conf
```

`/etc/wireguard/wg0.conf`配置内容：

```xaml
[Interface]
PrivateKey = <Private Key>
Address = 10.200.200.1/24
ListenPort = 56660
SaveConfig = true

[Peer]
PublicKey = <Client Public Key>
AllowedIPs = 0.0.0.0/0
```

`<Private Key>`值为本机器上面生成的privatekey文件中的内容。

### 开机启动

```
systemctl enable wg-quick@wg0
```

## MacOs中安装

在macos中直接使用brew安装就好：

```bash
$ brew install wireguard-tools
$ mkdir /usr/local/etc/wireguard
$ cd /usr/local/etc/wireguard
$ wg genkey | tee privatekey | wg pubkey > publickey
$ vim wg0.conf
```

`/usr/local/etc/wireguard/wg0.conf`配置内容：

```xaml
[Interface]
PrivateKey = <Private Key>
Address = 10.200.200.3/24
DNS = 8.8.8.8

[Peer]
PublicKey = <Server Public Key>
Endpoint = <Server Public IP>:<Server Listen Port>
AllowedIPs = 0.0.0.0/0
```

`<Private Key>`值为本机器上面生成的privatekey文件中的内容；`<Server Public IP>`对应的是服务端公网可访问的IP地址。



## 阿里云安全规则

wireguard使用的是UDP协议，所以阿里云ECS安全规则的入口方、出口方都需要添加UDP对应的端口，如上面的配置端口为56660。

- 协议类型: 自定义UDP	
- 端口范围: 56660/56660
- 授权对象: 0.0.0.0/0 (对所有访问方开放，使用时IP不确定)