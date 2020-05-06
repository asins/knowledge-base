---
title: "使用hugo生成自己的静态网站"
date: "2020-04-20"
lastmod: "2020-05-05"
---


## 背景

一直以来都想通过markdown语法来写些自己的blog网站，具有生成静态网站的工具也有很多，比如用go语法写的`hugo`、用Nodejs写的`okmarvin`、`typecho`、`hexo`等。

但一直以来都觉得在浏览器内写blog是个很费事的活儿，个人习惯了使用本地软件（`typora`）记录工作生活中的点滴，能忍受的是多一条命令将新加的文章同步到网上去。



## 选平台

经过很久的试用摸索，最终我选择使用`hugo`，主题我先试用着`hugo-lamp`，后面自己找时间修改一个自己的风格。



## 问题记录



### 1. 图片地址显示问题

hugo在构建时会默认为md文件构建一个文件名同名的文件夹，在文件夹中生成一个index.html文件。

生成后的目录结构如下：

```text
├── 代码片段
│   ├── 10进制与62进制相互转换
│   │   └── index.html
│   ├── array操作
│   │   └── index.html
│   ├── assets
│   │   ├── 02E997A0-EBC6-4463-B4D0-FD7E575E050E.png
│   │   ├── 161626pjle2b4jlpgij3l2.jpg
│   │   └── 36C6AED4-C7C6-4E2A-941D-91390E3A89D2.png
│   ├── cookie操作
│   │   └── index.html
```

在访问URL时应该是比较优雅的，如`https://blog.nootn.com/post/array操作/`，看官方的介绍也是出于看着优雅的原因使用了这种方式，但这种方式导致原来md文件中通过相对方式引用的图片都无法访问了，因为相对结构被破坏。

查了很多文章都没有人讲到这样的问题如何解决，最后只能慢慢的翻找官方文档（全英文看着那个费劲啊，想过英文不好的我嘛，^!^），最后在看`Permalinks`相关时看到 [ugly-urls](https://gohugo.io/content-management/urls/#ugly-urls) 终于解决了我的问题（在配置文件中加入`uglyurls = true`）。



### 2. 追加yaml头信息

以前我一直是使用`Typora`在本地记录些内容，虽然软件支持yaml头信息但我一直没有主动添加过，`hugo`没有yaml信息又无法正常的解析，所以写了个小工具为所有md文件添加yaml信息。

刚好看到`deno`这个新东西，就尝试着写了以下代码：

```typescript
import { resolve, extname, basename } from "https://deno.land/std@v0.42.0/path/mod.ts"

const { readDir, readFile, lstat } = Deno;

const entryPath = Deno.args[0] || './';

async function getFileTxt(path: string) {
  const decoder = new TextDecoder('utf-8');
  const text = decoder.decode(await readFile(path));
  return text;
}

async function setFileTxt(path: string, txt: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(txt);
  await Deno.writeFile(path, data);
}

async function formatFile(path: string, dirEntry: Deno.DirEntry) {
  const txt: string = await getFileTxt(path);

  if (/^---\n/g.test(txt)) {
    console.log('[已存在YAML信息]', path);
    return;
  }


  const fileInfo = await lstat(path);
  const ext = extname(dirEntry.name);
  const title = basename(dirEntry.name, ext);

  // console.log(Object.keys(fileInfo));
  const creatDate = formatDate(fileInfo.birthtime); // 文件创建时间
  const modified = formatDate(fileInfo.mtime); // 文件修改时间

  const yamlTxt = `---
title: "${title}"
date: "${creatDate}"
lastmod: "${modified}"
---

${txt}`;

  await setFileTxt(path, yamlTxt);

  console.log('[更新成功]', path);
}

async function formatMdFileInDir(dirPath: string) {
  for await (const dirEntry of readDir(dirPath)) {
    const fileName = dirEntry.name;

    const path: string = resolve(dirPath, dirEntry.name);
    // console.log('dirEntry path->', path, extname(dirEntry.name).toLocaleLowerCase());

    if (dirEntry.isDirectory) {
      if(dirEntry.name === '.git') return;

      await formatMdFileInDir(path);
    } else if (dirEntry.isFile && extname(dirEntry.name).toLocaleLowerCase() === '.md') {
      formatFile(path, dirEntry);
    }
  }
}

type Formatter = (val: number, pattern: string) => string;
type Formatters = { [ token: string ]: Formatter; };
type FormattersNumber = { [ token: string ]: number; };

/**
 * 格式化日期
 * @method format
 * @static
 * @param {Date} date 日期对象
 * @param {string} pattern 日期格式(y年M月d天h时m分s秒)，默认为'yyyy-MM-dd'
 * @return {string}  返回format后的字符串
 * @example
 var d = new Date(2017, 8, 27, 15, 9, 12, 345);
 console.log(format(d, 'yyyy-MM-d/q hh:mm:ss.S, e')); // 2017-09-27/No.3 15:09:12.345, 3
 console.log(format(d, 'M/d/yy')); // 9/27/17
 console.log(format(d, 'yyyy-MM-dd hh:mm:ss.S')); // 2017-09-27 15:09:12.345

 var t = format(d, 'yyyy年M月dd日 e (第q季)', {
 e: (val, pattern) => {return (pattern.length > 1 ? '星期': '周') + '日一二三四五六'[val];},
 q: '一二三四',
 });
 console.log(t); // 2017年9月27日 周三 (第四季)
 */
function formatDate(date: Date | null, fmt = 'yyyy-MM-dd', opt: Formatters = {}) {
  // if (typeof date === 'string') {
  //   date = date.replace(/-/g, '/');
  // }

  date = date === null ? new Date() : new Date(date);

  const formatters = {
    y: date.getFullYear(), // 年份
    M: date.getMonth() + 1, //月份
    d: date.getDate(), //日
    h: date.getHours(), //小时
    m: date.getMinutes(), //分
    s: date.getSeconds(), //秒
    S: date.getMilliseconds(), //毫秒
    q: Math.floor((date.getMonth() + 3) / 3), //季度
    e: date.getDay(), // 星期（0-6）
  } as FormattersNumber;

  // type IRegArg2 = keyof typeof formatters;

  return fmt.replace(
    new RegExp(/([yMdhmsSqe])\1*/, 'g')
    ,function($0: string, $1: string) {
      if (!$1) $1 = $0;

      const extend = opt[$1];
      if (extend) {
        return typeof extend === 'function'
          ? extend(formatters[$1], $0)
          : extend[formatters[$1]];
      } else {
        return $0.length === 1
          ? String(formatters[$1])
          : ('0' + formatters[$1]).substr(-$0.length);
      }
    }
  );
}

formatMdFileInDir(entryPath);
```

使用下面命令为我写的脚本创建了一个本地命令：

```shell 
deno install addmd --allow-read='/Users/asins/Documents/asinsDoc' --allow-write ~/bin/create.ts
```

以后要再次加上yaml头信息时只要执行`addmd ~/mydoc`就可以加上了。



## hogo配置文件

```toml
baseURL = "https://blog.nootn.com/"
languageCode = "zh-cn"
title = "简单其实不简单"
theme = "hugo-lamp"
# googleAnalytics = "UA-22926366-1"       # Google Analytics UA number
uglyurls = true

[params]
  mainSections = ["posts"]
  subtitle = "Actually, simplicity is not simple."
  author = "Asins"
  logo = "/img/avatar.jpg"
  description = "想做到简单，真心不易"
  paginate = 10

  github = "asins"
  twitter = "asinsimple"

[taxonomies]
  tag = "tags"
  category = "categories"

```



## hugo扉页定义

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

