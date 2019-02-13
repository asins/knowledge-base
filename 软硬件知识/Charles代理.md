## 使用背景

怎样查看完整的小程序请求信息，快速排查和定位问题？
目前的现状，IDE中虽然有network面板，但是使用了代理，所以看到的request、response、headers等信息都做了处理，无法追踪到更多的信息。
解决方案，通过模拟器或者真机中模拟请求，借助Charles抓包工具，可以详细看到小程序请求的核心信息。注意，Charles是收费软件，试用版本每隔半小时需要restart，启动存在延时，最好在阿里郎上申请正式版本使用，方便后续调试。

## 详细设置步骤

### 安装Charles证书

charles在抓取https请求时，可能会出现乱码现象，导致有些https页面打不开，所以需要安装三个证书，详细如下图所示。

- 证书一：安装Charles的信任证书
- 证书二：模拟器的信任证书
- 证书三：手机和远程连接的信任证书

![img](assets/68ce88fc-e123-4ce5-a3ce-acb8743c5688.png)

### 手机抓包配置

#### 第一步：添加手机的HTTP代理

1、查看PC的IP地址

![img](assets/ec3d024b-036e-4b3f-841e-c0446bd4679c.png)

2、设置手机HTTP代理

![image](assets/afb773b0-132d-4824-822c-362251ed1bb0.png)

#### 设置Charles代理

1、Proxy-Proxy Setting

![image](assets/a8e5d392-0488-4aa9-80a4-d9d704f72a4a.png)

2、Proxy->SSL Proxying Setting->add 一个代理

![image](assets/ec9717c2-e4e8-4cfc-87d1-e7f46efc3bbd.png)

#### 手机证书安装

- 使用手机浏览器打开chls.pro/ssl，会跳转到证书安装，完成手机证书安装。
  注：需要使用手机自带浏览器：IOS手机是Safari，安卓手机也有自带的浏览器

#### 关闭支付宝安全代理

- 使用支付宝扫描链接：<https://ds.alipay.com/fd-ipddfamm/index.html>，点击“关闭安全代理“按钮，关闭安全代理。

## RPC抓包调试

由于RPC使用的是自己定义的spdy协议，charles无法抓包，但是可以在开发及测试环境关闭mmtp开关将spdy进行降级为http协议。具体操作如下：

- 从伙伴下载开发包：具体可以参考环境配置的文档，下载可切环境的钱包。
- 安卓手机配置：支付宝设置里面 “网络链路配置” 不要勾选 “是否使用新链路” 和 “是否使用spdy链路”
- IOS手机配置：支付宝设置进入设置关闭mmtp开关

![mmtp.png](assets/0e8c28f2-5fad-4834-9df1-b5d8887472ff.png)

- 此时，rpc接口已是https接口，可以使用charles进行抓包调试。

## Charles抓包问题汇总

### **怎样关闭Mac端包的抓取**

将maxOS Proxy取消选中。

![image](assets/3b4c6f33-1e3d-4e1a-8eb2-374af3203cce.png)

### 接口乱码问题

场景：安装完手机证书后，当时接口没有乱码，等过段时间使用，重又乱码
解决办法：手机->设置->通用->关于本机->证书信任设置->将Charles对应的证书的switch开启

![image](assets/810c9e4a-b6e8-4989-991e-76d3c95314c9.png)

### IOS11系统无法抓包

解决方案：参照问题二的解决方式。