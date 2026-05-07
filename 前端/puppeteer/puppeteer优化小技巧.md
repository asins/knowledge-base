+++
title = "puppeteer优化小技巧"
template = "page.html"
date = "2019-12-19"
updated = "2019-12-19"
+++


> Puppeteer是一个Node库，它提供了高级API来通过DevTools协议控制Chromium或Chrome。

通过[puppeteer](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md)我们可以编写脚本模拟浏览器的相关行为，实现以下功能：

- 网页截图并保存为图片或 pdf 。
- 模拟表单提交，键盘输入，按钮点击，滑块移动等dom操作。
- 实现UI的自动化测试。
- 作为抓包工区对网页性能进行调试和分析。
- 编写定制化爬虫，解决传统HTTP抓取SPA页面难以处理异步请求的问题。

在使用puppeteer实现以上功能，我们通过几个小技巧提升pupeteer程序的效率。

## 过滤请求

当我们使用`puppeteer`对页面异步渲染的`dom结构`进行解析时，往往需要等待页面完成渲染完成之后，才能使用脚本进行操作。但页面渲染过程中也包含了许多静态资源如：图片/音频/视频/样式文件等。此时我们可以通过`page.setRequestInterception`方法，对网页请求进行过滤，拦截静态资源的请求，加快页面渲染速度。代码示例如下：

```js 
// 开启请求拦截功能
page.setRequestInterception(true);

page.on('request', async req => {
  // 根据请求类型过滤
  const resourceType = req.resourceType();
  if (resourceType === 'image') {
    req.abort();
    else {
      req.continue();
    }
  });
```

推荐拦截的请求类型：

```js 
const blockedResourceTypes = [
  'image',
  'media',
  'font',
  'texttrack',
  'object',
  'beacon',
  'csp_report',
  'imageset',
];

const skippedResources = [
  'quantserve',
  'adzerk',
  'doubleclick',
  'adition',
  'exelator',
  'sharethrough',
  'cdn.api.twitter',
  'google-analytics',
  'googletagmanager',
  'google',
  'fontawesome',
  'facebook',
  'analytics',
  'optimizely',
  'clicktale',
  'mixpanel',
  'zedo',
  'clicksor',
  'tiqcdn',
];
```

## 代理请求

除了过滤请求之外，我们也可用代理网页渲染过程中发出的请求。在某些爬虫项目达到不被发爬的目的，代码示例如下：

```js 
page.on('request', async req => {
  // 代理请求
  const response = await fetch({
    url: req.url(),
    method: req.method(),
    headers: req.headers(),
    body: req.postData(),
    proxy: getProxyIp(),
    resolveWithFullResponse: true,
  });
  // 响应请求
  req.respond({
    status: response.statusCode,
    contentType: response.headers['content-type'],
    headers: response.headers || req.headers(),
    body: response.body,
  });
});
```

## 复用browser

使用`puppeteer.connect`比`puppeteer.launch`启动一个浏览器实例要快很多（[参考](https://stackoverflow.com/questions/52431775/whats-the-performance-difference-of-puppeteer-launch-versus-puppeteer-connect)）,所以当我们需要开启多个`broswer`实例时，可以通过缓存`wsEndpoint`来达到复用的目的，代码实例如下：

```js 
let wsEndpoint = await cache.get(Parser.WS_KEY);
let broswer;
try {
  browser = !wsEndpoint
    ? await puppeteer.launch(config)
  : await puppeteer.connect({
    browserWSEndpoint: this.wsEndpoint,
  });
} catch (err) {
  browser = await puppeteer.launch(config);
} finally {
  wsEndpoint = this.browser.wsEndpoint();
  await cache.set(Parser.WS_KEY, 60 * 60 * 1000, this.wsEndpoint);
}
```

## 禁用浏览器多余功能

puppeteer为我们提供了完善浏览器环境，但实际开发中，有很多默认开启的功能是项目本身不需要的，此时我们可以设置浏览器启动参数来禁用额外的功能：

```js 
puppeteer.launch({
  args: [
    '--no-sandbox',                    // 沙盒模式
    '--disable-setuid-sandbox',        // uid沙盒
    '--disable-dev-shm-usage',         // 创建临时文件共享内存
    '--disable-accelerated-2d-canvas', // canvas渲染
    '--disable-gpu',                   // GPU硬件加速
  ]
});
```

