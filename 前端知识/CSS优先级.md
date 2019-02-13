# CSS优先级

不如到 W3C 的网站上看一个究竟。相关的标准在 [这个页面](http://www.w3.org/TR/CSS/ "W3C 的 CSS 标准") 可以看到，目前为止的 CSS 标准有三个: CSS1, CSS2, 以及 CSS3。

CSS1 是最早的标准，其中关于层叠顺序的描述在 [这里](http://www.w3.org/TR/REC-CSS1/#cascading-order)，还提供了一个简单的示例进行说明。

```css
LI            {...}  /* a=0 b=0 c=1 -> specificity =   1 */
UL LI         {...}  /* a=0 b=0 c=2 -> specificity =   2 */
UL OL LI      {...}  /* a=0 b=0 c=3 -> specificity =   3 */
LI.red        {...}  /* a=0 b=1 c=1 -> specificity =  11 */
UL OL LI.red  {...}  /* a=0 b=1 c=3 -> specificity =  13 */ 
#x34y         {...}  /* a=1 b=0 c=0 -> specificity = 100 */ 
```

在 CSS1 中将优先级分为三组，将 id 选择器作为 a 组，类选择器作为 b 组，元素名作为 c 组，每组中出现一次，计数一次，按照先 a 组进行比较，相同的情况下，使用 b 组进行比较，最后是 c 组。什么选择器的优先级别高，什么选择器提供的样式有效。比如在上面的例子中，第 5 组使用 id 的级别最高，所以，这组的样式设置生效，而其他的设置将会被忽略掉。

[CSS21 标准](http://www.w3.org/TR/CSS21/cascade.html#specificity)

在 CSS2 中，又增加了关于行内说明 style 的组，所以参与比较的组成为了 4 组，其中 style 的优先级别最高。同样，在 CSS2 的标准说明中也提供了样例。

```css
*             {}  /* a=0 b=0 c=0 d=0 -> specificity = 0,0,0,0 */
li            {}  /* a=0 b=0 c=0 d=1 -> specificity = 0,0,0,1 */
li:first-line {}  /* a=0 b=0 c=0 d=2 -> specificity = 0,0,0,2 */
ul li         {}  /* a=0 b=0 c=0 d=2 -> specificity = 0,0,0,2 */
ul ol+li      {}  /* a=0 b=0 c=0 d=3 -> specificity = 0,0,0,3 */
h1 + *[rel=up]{}  /* a=0 b=0 c=1 d=1 -> specificity = 0,0,1,1 */
ul ol li.red  {}  /* a=0 b=0 c=1 d=3 -> specificity = 0,0,1,3 */
li.red.level  {}  /* a=0 b=0 c=2 d=1 -> specificity = 0,0,2,1 */
#x34y         {}  /* a=0 b=1 c=0 d=0 -> specificity = 0,1,0,0 */
style=""          /* a=1 b=0 c=0 d=0 -> specificity = 1,0,0,0 */
```

在这个示例中，style 的优先级别最高，所以将会覆盖掉通过 id 进行的设置，颜色为绿色。


当在一个样式声明中使用一个`!important` 规则时，此声明将覆盖任何其他声明。当两条相互冲突的带有 !important 规则的声明被应用到相同的元素上时，拥有更大优先级的声明将会被采用。
使用 `!important` 是一个坏习惯，应该尽量避免，因为这破坏了样式表中固有的级联规则，使得调试找bug变得更加困难了。
