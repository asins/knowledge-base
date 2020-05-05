---
title: "使用hugo生成自己的静态网站"
date: "2020-04-20"
lastmod: "2020-05-05"
---

## 扉页

扉页（ front matter）用来配置文章的标题、时间、链接、分类等元信息，提供给模板调用。可使用的格式有：yaml 格式（默认格式，使用 3 个减号 -）、toml 格式（使用 3 个加号 +）、json 格式（使用大括号{}）。除了网站主页外，其它内容文件都需要扉页来识别文件类型和编译文件。



```yaml
---
title: "xxx"                  # 文章标题
menuTitle: "xxx"              # 文章标题在菜单栏中显示的名称
description: "xxx"            # 文章描述
keywords: ["Hugo","keyword"]  # 关键字描述
date: "2018-08-20"            # 文章创建日期
tags: [ "tag1", "tag2"]       # 自定义标签
categories: ["cat1","cat2"]   # 自定义分类
weight: 20                    # 自定义此页面在章节中的排序优先级（按照数字的正序排序）
disableToc: "false"           # 若值为 false（缺省值）时，此页面启用 TOC
pre: ""                       # 自定义 menu 标题的前缀
post: ""                      # 自定义 menu 标题的后缀
chapter: false                # 若值为 true（缺省值）时，将此页面设置为章节（chapter）
hidden: false                 # 若值为 true（缺省值）时，此页面在 menu 中隐藏
LastModifierDisplayName: ""   # 自定义修改者的名称，显示在页脚中
LastModifierEmail: ""         # 自定义修改者的 Email，显示在页脚中
draft: false                  # true，表示草稿，Hugo 将不渲染草稿
url:                          # 重置 permalink，默认使用文件名
type:                         # type 与 layout 参数将改变 Hugo 寻找该文章模板的顺序
layout:
---
```

