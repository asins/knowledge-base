# Iced框架介绍

Iced是一个简单的，易于理解的，高度模块化的GUI框架，其整个框架可以被简单的描述为4点

状态（State）
消息（Messages）
界面逻辑（View Logic）
更新逻辑（Update Logic）
根据本人自己的使用体验，这4者之间大概的关系如下

![在这里插入图片描述](/Users/asins/Documents/knowledge-base/Rust/iced_info.png)

其中 view()中的控件布局逻辑会绑定应用结构体里的控件状态，这样在交互时也会改变控件的状态。
可以发现其实是很好理解的，使用逻辑十分分明，接下来将用本人结合官方的例子来具体说明。



### 弹性盒子

- [Flexbox Froggy](https://flexboxfroggy.com/)。这是一个交互式教程/游戏，可让您以有趣的方式学习 Flexbox 的基本部分。
- [CSS Tricks 出品的Flexbox 完整指南](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)。这是一份详尽的指南，配有插图，并全面阐述了 Flexbox 的不同属性及其工作原理。

### CSS网格

- [CSS 网格花园](https://cssgridgarden.com/)。这是一个互动教程/游戏，让您以有趣的方式学习 CSS 网格的基本部分。
- [CSS Tricks 出品的CSS 网格完整指南](https://css-tricks.com/snippets/css/complete-guide-grid/)。本指南内容详尽，图文并茂，全面阐述了 CSS 网格的不同属性及其工作原理。