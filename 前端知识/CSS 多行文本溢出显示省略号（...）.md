现在的浏览器都支持`text-overflow:ellipsis`属性，用来实现单行文本的溢出显示省略号，但是这个属性并不支持多行文本。那么有没有方法在多行文本上实现同样的效果呢？

## -webkit-line-clamp

Webkit支持一个名为`-webkit-line-clamp`的属性，他其实是一个[WebKit-Specific Unsupported Property](http://developer.apple.com/safari/library/documentation/AppleApplications/Reference/SafariCSSRef/Articles/StandardCSSProperties.html#//apple_ref/doc/uid/TP30001266-UnsupportedProperties)，也就是说这个属性并不是标准的一部分，可能是Webkit内部使用的，或者被弃用的属性。但是既然被人发现了，而且能用，为什么不试试呢~o(∩_∩)o

```css
p {
    overflow : hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}
```

Demo: <http://jsfiddle.net/Cople/maB8f/>

## -o-ellipsis-lastline

从 Opera 10.60 开始，text-overflow属性有了一个名为`-o-ellipsis-lastline`的值。应用后的效果就像名字一样，在文本的最后一行加上省略号。这个方法比楼上的方法简单多了，可惜也不在标准之内//(ㄒoㄒ)//

```css
p {
    overflow: hidden;
    white-space: normal;
    height: 3em;
    text-overflow: -o-ellipsis-lastline;
}
```

Demo: <http://jsfiddle.net/Cople/ash5v/>

## jQuery

除了各个浏览器私有的属性，有没有跨浏览器的解决方法呢？当然是通过js实现啦！（通过从后向前逐个删除末尾字符，直至元素的高度小于父元素高度）

```js
$(".figcaption").each(function(i){
    var divH = $(this).height();
    var $p = $("p", $(this)).eq(0);
    while ($p.outerHeight() > divH) {
        $p.text($p.text().replace(/(\s)*([a-zA-Z0-9]+|\W)(\.\.\.)?$/, "..."));
    };
});
```

Demo: <http://jsfiddle.net/Cople/DrML4/5/>

## 单行溢出显示省略号方法

也放下单行显示的方法，这个比较通用了。

```css
p {
    overflow : hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
```