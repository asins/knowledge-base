---
title: "H5页面viewport适配"
date: "2019-08-21"
lastmod: "2019-08-21"
---

前端圈真乱，这话一点不假。但乱也乱的好处，乱则生变，有变化才有进步。今天还是老调重谈，聊聊移动端页面的适配。因为对于一枚前端而言，天天和页面打交道（H5页面），那么布局的活总是少不了，这也将面临不同终端的适配问题。不知道你是否和我一样，页面布局总是或多或少会有一些蛋疼的事情发生。如果是的话，建议你花点时间阅读完下面我扯蛋的东东。

## Flexible承载的使命

Flexible到今天也有几年的历史了，解救了很多同学针对于H5页面布局的适配问题。而这套方案也相对而言是一个较为成熟的方案。简单的回忆一下，当初为了能让页面更好的适配各种不同的终端，通过Hack手段来根据设备的`dpr`值相应改变`<meta>`标签中`viewport`的值：

```html
<!-- dpr = 1-->
<meta name="viewport" content="initial-scale=scale,maximum-scale=scale,minimum-scale=scale,user-scalable=no"> 
<!-- dpr = 2-->
<meta name="viewport" content="initial-scale=0.5,maximum-scale=0.5,minimum-scale=0.5,user-scalable=no">
<!-- dpr = 3-->
<meta name="viewport" content="initial-scale=0.3333333333,maximum-scale=0.3333333333,minimum-scale=0.3333333333,user-scalable=no">

```

从而让页面达么缩放的效果，也变相的实现页面的适配功能。而其主要的思想有三点：

- 根据`dpr`的值来修改`viewport`实现`1px`的线
- 根据`dpr`的值来修改`html`的`font-size`，从而使用`rem`实现等比缩放
- 使用Hack手段用`rem`模拟`vw`特性

有关于Flexible方案实现适配，在2015年双十一之后做过这方面的技术文档分享，感兴趣的同学可以移步阅读《[使用Flexible实现手淘H5页面的终端适配](https://www.w3cplus.com/mobile/lib-flexible-for-html5-layout.html)》一文。虽然Flexible解决了适配终端很多问题，但它并不是万能的，也不是最优秀的，他还是存在一些问题的，比如`iframe`的引用，有时候就把我们自己给埋进去了。针对其中的一些不足之处，有些同学对其进行过相关的改造，在网上搜索能找到相关的方案。

那么时代在变化，前端技术在不断的变化，试问：**Flexible还是最佳方案？Flexible还有存在的必要吗？** 最近一直在探讨这方面，这里先告诉大家**Flexible已经完成了他自身的历史使命，我们可以放下Flexible，拥抱新的变化**。接下来的内容，我将分享一下我最近自己探讨的新的适配方案，或许很多团队同学已经开始使用了，如果有不对之处，希望能得到大婶们的指正；如果您有更好的方案，希望能一起分享一起探讨。

## 先上菜，再唠嗑

先上个二维码：

![img](https://www.w3cplus.com/sites/default/files/blogs/2017/1707/vw-layout-1.png)

你可以使用手淘App、优酷APP、各终端自带的浏览器、UC浏览器、QQ浏览器、Safari浏览器和Chrome浏览器扫描上面的二维码，您看到相应的效果：

![img](https://www.w3cplus.com/sites/default/files/blogs/2017/1707/vw-layout-2.png)

*iPhone系列效果*

![img](https://www.w3cplus.com/sites/default/files/blogs/2017/1707/vw-layout-3.png)

*部分Android效果*

> **注：**如果扫上面的二维码没有任何效果，你[可以点击这里](https://huodong.m.taobao.com/act/layouttestvw.html)，打开在线页面，重新生成你的设备能识别的二维码号 。

上面的Demo，测试了Top30的机型。目前未得到支持的：

| 品牌   | 型号                   | 系统版本         | 分辨率         | 屏幕尺寸   | 手淘APP | 优酷APP | 原生浏览器 | QQ浏览器 | UC浏览器 | Chrome浏览器 |
| ---- | -------------------- | ------------ | ----------- | ------ | ----- | ----- | ----- | ----- | ----- | --------- |
| 华为   | Mate9                | Android7.0   | 1080 x 1920 | 5英寸    | Yes   | Yes   | No    | Yes   | Yes   | Yes       |
| 华为   | Mate7                | Android4.2   | 1080 x 1920 | 5.2英寸  | Yes   | Yes   | No    | Yes   | Yes   | Yes       |
| 魅族   | Mx4 (M460 移动4G)      | Android4.4.2 | 1152 x 1920 | 5.36英寸 | Yes   | No    | No    | Yes   | Yes   | Yes       |
| Oppo | R7007                | Android4.3   | 1280 x 720  | 5英寸    | Yes   | No    | No    | Yes   | Yes   | No        |
| 三星   | N9008 (Galaxy Note3) | Android4.4.2 | 1080 x 1920 | 5.7英寸  | Yes   | No    | Yes   | Yes   | Yes   | Yes       |
| 华硕   | ZenFone5(x86)        | Android4.3   | 720 x 280   | 5英寸    | No    | No    | No    | Yes   | No    | No        |

Top30机型中不在列表中的，将看到的效果如上图所示。至于敢不敢用，这就得看亲了。必竟第一个吃螃蟹的人是需要一定的勇气！(^_^)

## 适配方案

前面给大家介绍了这个方案目前得到的支持情况以及效果。也扯了不少废话，接下来进入正题吧。

在移动端布局，我们需要面对两个最为重要的问题：

- 各终端下的适配问题
- Retina屏的细节处理

不同的终端，我们面对的屏幕分辨率、DPR、`1px`、`2x`图等一系列的问题。那么这个布局方案也是针对性的解决这些问题，只不过解决这些问题不再是使用Hack手段来处理，而是直接使用原生的CSS技术来处理的。

### 适配终端

首要解决的是适配终端。回想一下，以前的Flexible方案是通过JavaScript来模拟`vw`的特性，那么到今天为止，`vw`已经得到了众多浏览器的支持，也就是说，可以直接考虑将`vw`单位运用于我们的适配布局中。

众所周知，`vw`是基于Viewport视窗的长度单位，这里的视窗（Viewport）指的就是浏览器可视化的区域，而这个可视区域是`window.innerWidth/window.innerHeight`的大小。用下图简单的来示意一下：

![img](https://www.w3cplus.com/sites/default/files/blogs/2017/1707/vw-layout-4.png)

> 因为Viewport涉及到的知识点很多，要介绍清楚这方面的知识，都需要几篇文章来进行阐述。@PPK大神有[两篇](https://www.quirksmode.org/mobile/viewports.html)[文章](https://www.quirksmode.org/mobile/viewports2.html)详细介绍了这方面的知识。中文可以移步[这里](https://www.w3cplus.com/css/viewports.html)进行阅读。

在[CSS Values and Units Module Level 3](https://www.w3.org/TR/css3-values/)中和Viewport相关的单位有四个，分别为`vw`、`vh`、`vmin`和`vmax`。

- `vw`：是Viewport's width的简写,`1vw`等于`window.innerWidth`的`1%`
- `vh`：和`vw`类似，是Viewport's height的简写，`1vh`等于`window.innerHeihgt`的`1%`
- `vmin`：`vmin`的值是当前`vw`和`vh`中较小的值
- `vmax`：`vmax`的值是当前`vw`和`vh`中较大的值

> `vmin`和`vmax`是根据Viewport中长度偏大的那个维度值计算出来的，如果`window.innerHeight > window.innerWidth`则`vmin`取百分之一的`window.innerWidth`，`vmax`取百分之一的`window.innerHeight`计算。

还是用一张图来示意吧，一图胜于千言万语：

![img](https://www.w3cplus.com/sites/default/files/blogs/2017/1707/vw-layout-5.png)

所以在这个方案中大胆的使用`vw`来替代以前Flexible中的`rem`缩放方案。先来回归到我们的实际业务中来。目前出视觉设计稿，我们都是使用`750px`宽度的，从上面的原理来看，那么`100vw = 750px`，即`1vw = 7.5px`。那么我们可以根据设计图上的`px`值直接转换成对应的`vw`值。看到这里，很多同学开始感到崩溃，又要计算，能不能简便一点，能不能再简单一点，其实是可以的，我们可以使用PostCSS的插件[postcss-px-to-viewport](https://github.com/evrone/postcss-px-to-viewport)，让我们可以直接在代码中写`px`，比如：

```
[w-369]{
    width: 369px;
}

[w-369] h2 span {
    background: #FF5000;
    color: #fff;
    display: inline-block;
    border-radius: 4px;
    font-size: 20px;
    text-shadow: 0 2px 2px #FF5000;
    padding: 2px 5px;
    margin-right: 5px;
}

```

PostCSS编译之后就是我们所需要的带`vw`代码：

```
[w-369] {
    width: 49.2vw;
}
[w-369] h2 span {
    background: #ff5000;
    color: #fff;
    display: inline-block;
    border-radius: .53333vw;
    text-shadow: 0 0.26667vw 0.26667vw #ff5000;
    padding: .26667vw .66667vw;
}
[w-369] h2 span,
[w-369] i {
    font-size: 2.66667vw;
    margin-right: .66667vw;
}

```

在实际使用的时候，你可以对该插件进行相关的参数配置：

```
"postcss-px-to-viewport": {
    viewportWidth: 750,
    viewportHeight: 1334,
    unitPrecision: 5,
    viewportUnit: 'vw',
    selectorBlackList: [],
    minPixelValue: 1,
    mediaQuery: false
}

```

假设你的设计稿不是`750px`而是`1125px`，那么你就可以修改`vewportWidth`的值。有关于该插件的详细介绍，[可以阅读其官方使用文档](https://github.com/evrone/postcss-px-to-viewport)。

上面解决了`px`到`vw`的转换计算。那么在哪些地方可以使用`vw`来适配我们的页面。根据相关的测试：

- 容器适配，可以使用`vw`
- 文本的适配，可以使用`vw`
- 大于`1px`的边框、圆角、阴影都可以使用`vw`
- 内距和外距，可以使用`vw`

另外有一个细节需要特别的提出，比如我们有一个这样的设计：

![img](https://www.w3cplus.com/sites/default/files/blogs/2017/1707/vw-layout-6.png)

如果我们直接使用：

```
[w-188-246] {
    width: 188px;
}
[w-187-246]{
    width: 187px
}

```

最终的效果会造成`[w-187-246]`容器的高度小于`[w-188-246]`容器的高度。这个时候我们就需要考虑到[容器的长宽比缩放](https://www.w3cplus.com/css/aspect-ratio.html)。这方面的方案很多，但我还是推荐工具化来处理，这里推荐@一丝 姐姐写的一个PostCSS插件[postcss-aspect-ratio-mini](https://github.com/yisibl/postcss-aspect-ratio-mini)。这个插件使用很简单，不需要做任何的配置，你只需要本地安装一下就OK。使用的时候如下：

```
[aspectratio] {
    position: relative;
}
[aspectratio]::before {
    content: '';
    display: block;
    width: 1px;
    margin-left: -1px;
    height: 0;
}

[aspectratio-content] {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
}
[aspectratio][aspect-ratio="188/246"]{
    aspect-ratio: '188:246';
}

```

编译出来：

```
[aspectratio][aspect-ratio="188/246"]:before {
    padding-top: 130.85106382978725%;
}

```

这样就可以完美的实现长宽比的效果。有关于这方面的原理在这里不做过多阐述，感兴趣的话可以阅读早前整理的文章:

- [CSS实现长宽比的几种方案](https://www.w3cplus.com/css/aspect-ratio.html)
- [容器长宽比](https://www.w3cplus.com/css/aspect-ratio-boxes.html)
- [Web中如何实现纵横比](https://www.w3cplus.com/css/experiments-in-fixed-aspect-ratios.html)
- [实现精准的流体排版原理](https://www.w3cplus.com/css/css-polyfluidsizing-using-calc-vw-breakpoints-and-linear-equations.html)

> 目前采用PostCSS插件只是一个过渡阶段，在将来我们可以直接在CSS中使用`aspect-ratio`属性来实现长宽比。

### 解决`1px`方案

前面提到过，对于`1px`是不建议将其转换成对应的`vw`单位的，但在Retina下，我们始终是需要面对如何解决`1px`的问题。在《[再谈Retina下`1px`的解决方案](https://www.w3cplus.com/css/fix-1px-for-retina.html)》文章中提供了多种解决`1px`的方案。在这里的话，个人推荐另外一种解决`1px`的方案。依旧是使用PostCSS插件，解决`1px`可以使用[postcss-write-svg](https://github.com/jonathantneal/postcss-write-svg)。

使用postcss-write-svg你可以通过`border-image`或者`background-image`两种方式来处理。比如：

```
@svg 1px-border {
    height: 2px;
    @rect {
        fill: var(--color, black);
        width: 100%;
        height: 50%;
    }
}
.example {
    border: 1px solid transparent;
    border-image: svg(1px-border param(--color #00b1ff)) 2 2 stretch;
}

```

这样PostCSS会自动帮你把CSS编译出来：

```
.example {
    border: 1px solid transparent;
    border-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' height='2px'%3E%3Crect fill='%2300b1ff' width='100%25' height='50%25'/%3E%3C/svg%3E") 2 2 stretch;
}

```

使用PostCSS的插件是不是比我们修改图片要来得简单与方便。

上面演示的是使用`border-image`方式，除此之外还可以使用`background-image`来实现。比如：

```
@svg square {
    @rect {
        fill: var(--color, black);
        width: 100%;
        height: 100%;
    }
}

#example {
    background: white svg(square param(--color #00b1ff));
}

```

编译出来就是：

```
#example {
    background: white url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Crect fill='%2300b1ff' width='100%25' height='100%25'/%3E%3C/svg%3E");
}

```

这个方案简单易用，是我所需要的。目前测试下来，基本能达到我所需要的需求。但有一点千万别忘了，记得在`<head>`中添加：

```
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,minimum-scale=1,user-scalable=no" />

```

上面阐述的是这个适配方案中所用到的技术点，简单的总结一下：

- 使用`vw`来实现页面的适配，并且通过PostCSS的插件[postcss-px-to-viewport](https://github.com/evrone/postcss-px-to-viewport)把`px`转换成`vw`。这样的好处是，我们在撸码的时候，不需要进行任何的计算，你只需要根据设计图写`px`单位
- 为了更好的实现长宽比，特别是针对于`img`、`vedio`和`iframe`元素，通过PostCSS插件[postcss-aspect-ratio-mini](https://github.com/yisibl/postcss-aspect-ratio-mini)来实现，在实际使用中，只需要把对应的宽和高写进去即可
- 为了解决`1px`的问题，使用PostCSS插件[postcss-write-svg](https://github.com/jonathantneal/postcss-write-svg),自动生成`border-image`或者`background-image`的图片

这里使用了多个PostCSS的插件，其实现在有很多优秀的PostCSS插件能帮助我们解决很多问题。哪果你从未接触过有关于PostCSS相关的知识，建议你可以花点时间去学习一下，在W3cplus提供了一些有[关于PostCSS相关的文章](https://www.w3cplus.com/blog/tags/516.html)。如果你想系统的学习PostCSS相关的知识，推荐你购买《[深入PostCSS Web设计](https://www.w3cplus.com/preprocessor/postcss-book.html)》一书：

![img](https://www.w3cplus.com/sites/default/files/blogs/2017/1707/postcss.jpg)

## 降级处理

最开始提到过，到目前为止，T30的机型中还有几款机型是不支持`vw`的适配方案。那么如果业务需要，应该怎么处理呢？有两种方式可以进行降级处理：

- **CSS Houdini**：通过[CSS Houdini](https://github.com/w3c/css-houdini-drafts/wiki)针对`vw`做处理，调用[CSS Typed OM Level1](https://www.w3.org/TR/css-typed-om-1) 提供的[`CSSUnitValue` API](https://www.w3.org/TR/css-typed-om-1/#numericvalue-serialization)。
- **CSS Polyfill**：通过相应的Polyfill做相应的处理，目前针对于`vw`单位的Polyfill主要有：[vminpoly](https://github.com/saabi/vminpoly)、[Viewport Units Buggyfill](https://github.com/rodneyrehm/viewport-units-buggyfill)、[vunits.js](https://gist.github.com/LeaVerou/1347501)和[Modernizr](https://github.com/Modernizr/Modernizr/wiki/HTML5-Cross-Browser-Polyfills)。个人推荐采用[Viewport Units Buggyfill](https://github.com/rodneyrehm/viewport-units-buggyfill)

## Viewport不足之处

采用`vw`来做适配处理并不是只有好处没有任何缺点。有一些细节之处还是存在一定的缺陷的。比如当容器使用`vw`单位，`margin`采用`px`单位时，很容易造成整体宽度超过`100vw`，从而影响布局效果。对于类似这样的现象，我们可以采用相关的技术进行规避。比如将`margin`换成`padding`，并且配合`box-sizing`。只不过这不是最佳方案，随着将来浏览器或者应用自身的Webview对`calc()`函数的支持之后，碰到`vw`和`px`混合使用的时候，可以结合`calc()`函数一起使用，这样就可以完美的解决。

另外一点，`px`转换成`vw`单位，多少还会存在一定的像素差，毕竟很多时候无法完全整除。

到目前为止，我发现的两个不足之处。或许在后面的使用当中，还会碰到一些其他不为人之的坑。事实也是如此，不管任何方案，踩得坑越多，该方案也越来越强大。希望喜欢这个适配方案的同学和我一起踩坑，让其更为完善。

## 如何判断自己的应用是否支持

虽然该文的示例，进行了多方面的测试。但很多同学还是会担忧自己的APP应用是否支持该方案，而不敢大胆尝试或者使用。其实不必要这么担心，你可以拿自己的设备，或者应用扫描下面的二维码：

![img](https://www.w3cplus.com/sites/default/files/blogs/2017/1707/vw-layout-7.png)

当页面跑完测试之后，找到对应的**Values and Units**列表项：

![img](https://www.w3cplus.com/sites/default/files/blogs/2017/1707/vw-layout-8.png)

如果`vw`栏是绿色代表你的设备或应用支持该方案；反之则不支持。另外你也可以经常关注[css3test](https://github.com/airen/css3test)相关的更新，后面将会根据相关的规范更新测试代码，让你能快速掌握哪些属性可以大胆使用。

## 总结

H5页面的适配方案总是令人蛋疼的，事实上页面的布局总是令人蛋疼的。但技术是不断革新的，我们可以随着保持对新技术的关注，尝试这些新特性运用到实际项目中，只有这样，我们解决问题的方案才会越来越完善。

到写这篇文章为止，虽然还有那么一两款机型不支持`vw`，但并不影响我们去使用。只有不断去尝试，才会有进步。在此，希望大家大胆尝试，一起让该方案变得更完美。如果你有更好的建议，或者你踩到任何坑，欢迎在下面的评论中与我分享，或者发邮件给我一起讨论。

著作权归作者所有。

商业转载请联系作者获得授权,非商业转载请注明出处。

原文: 

https://www.w3cplus.com/css/vw-for-layout.html

 © 

w3cplus.com