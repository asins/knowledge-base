+++
title = "Chrome Dev Tool 请求时间说明"
template = "page.html"
date = "2019-11-13"
updated = "2019-11-13"
+++


## Chrome Dev Tool 中时间线各阶段代表的意义

另附注一下Chrome Dev Tool 中请求的时间线各阶段代表的意义。 以下内容扒自[Chrome 开发者文档页](https://developer.chrome.com/devtools/docs/network#resource-network-timing)，然后我将它本地化了一下下。

![img](assets/timing.png)

### Stalled/Blocking

在请求能够被发出去前的等等时间。包含了用于处理代理的时间。另外，如果有已经建立好的连接，那么这个时间还包括等待已建立连接被复用的时间，这个遵循Chrome对同一源最大6个TCP连接的规则。

「拿我们的情况来说，上面出错所有的耗时也是算在了这部分里面。网络面板中显示的其余时间比如DNS查找，连接建立等都是属于最后那次成功请求的了」

### Proxy Negotiation

处理代理的时间。

### DNS Lookup

查找DNS的时间。页面上每个新的域都需要一次完整的寻路来完成DNS查找。

### Initial Connection / Connecting

用于建立链接的时间，包括TCP握手及多次尝试握手，还有处理SSL。

### SSL

完成SSL握手的时间。

### Request Sent / Sending

发起请求的时间，通常小到可以忽略。

### Waiting (TTFB)

等待响应的时间，具体来说是等待返回首个字节的时间。包含了与服务器之间一个来回响应的时间和等待首个字节被返回的时间。

### Content Download / Downloading

用于下载响应的时间