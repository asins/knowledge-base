---
title: "rg 搜索工具"
date: "2019-08-21"
lastmod: "2019-08-21"
---

ripgrep 命令行快速搜索工具

## 一、常用参数

- `--files`: 只显示结果文件的路径
- `-u`: 忽略所有忽略文件
- `-uu`: 额外搜索隐藏文件及目录（类似于`grep -r`）
- `-uuu`: 额外搜索二进制文件（类似于`grep -a -r`）
- `-i`: 搜索时忽略大小写
- `-v`: 反转搜索结果
- `-C`: 如-C2 显示每个搜索结果前后2行内容
- `-w`: 全字符匹配，如`rg 'plugin' -w` 则`plugins`字符不会被匹配
- `--replace`: 搜索并替换
- `-H` `--with-filename`: 使用匹配的行输出文件路径

## 二、常用举例



#### 只搜索文件名

```sh
rg -g 'gulpfile.js' --files

# 搜索路径中包含特定内容的所有子文件
rg --files -g '**/css/**' 
# 搜索路径中包含特定内容的直属目录文件
rg --files -g '**/css/*'
```

#### 搜索所有JS文件，但跳过node_modules中的内容

```sh
rg 'postcss' -g !'node_modules' -g '*.js'
```

#### 只显示搜索到的文件名

```sh
rg -H -g 'gulpfile.js' --files
```

#### 搜索并替换


```sh
# 查找姓、名，并做交换处理
rg '([A-Z][a-z]+)\s+([A-Z][a-z]+)' --replace '$2, $1'
```

支持正则的命名组

```sh
rg '(?P<first>[A-Z][a-z]+)\s+(?P<last>[A-Z][a-z]+)' --replace '$last, $first'
```

提供完整的Unicode字符集支持，通过匹配任何大写的Unicode字母，然后匹配任何小写Unicode字母序列：

```sh
rg '(\p{Lu}\p{Ll}+)\s+(\p{Lu}\p{Ll}+)' --replace '$2, $1'
```

### Regex syntax

The syntax supported is [documented as part of Rust’s regex library](https://doc.rust-lang.org/regex/regex/index.html#syntax).

#### 其它

Search only files matching a particular glob:

```sh
rg foo -g 'README.*'
```

Or exclude files matching a particular glob:

```sh
rg foo -g '!*.min.js'
```

只搜索HTML、CSS文件：
```sh
rg -thtml -tcss foobar
```

搜索除Javascript文件以外的所有内容：
```sh
rg -Tjs foobar
```

To see a list of types supported, run `rg --type-list`. To add a new type, use `--type-add`, which must be accompanied by a pattern for searching (`rg` won’t persist your type settings):

```sh
rg --type-add 'foo:*.{foo,foobar}' -tfoo bar
```

The type `foo` will now match any file ending with the `.foo` or `.foobar` extensions.