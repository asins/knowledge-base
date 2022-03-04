+++
title = "Mac系统搜索文件"
template = "page.html"
date = "2019-08-21"
updated = "2020-05-05"
+++


## 通过 Find 命令搜索文件

find 命令非常高效，并且使用简单。find 命令来自 unix，OS X 和 Linux 系统同样支持该命令。find 最基本的操作就是：
```sh
find 文件路径 参数
```

比如你可以通过以下命令在用户文件夹中搜索名字中包含 screen 的文件

```sh
find ~ -iname  "screen*"
```

你也可以在特定的文件夹中寻找特定的文件，比如

```sh
find ~/Library/ -iname "com.apple.syncedpreferences.plist"
```

这个命令可以在 Library 文件夹中寻找`com.apple.syncedpreferences.plist`文件

## 通过 mdfind 命令搜索文件

mdfind 命令就是 Spotlight 功能的终端界面，这意味着如果 Spotlight 被禁用，mdfind 命令也将无法工作。mdfind 命令非常迅速、高效。最基本的使用方法是：

```sh
mdfind -name 文件名字
```

比如你可以通过下面的命令寻找 Photo 1.PNG 文件

```sh
mdfind -name "Photo 1.PNG"
```

因为 mdfind 就是 Spotlight 功能的终端界面，你还可以使用 mdfind 寻找文件和文件夹的内容，比如通过以下命令寻找所有包含 Will Pearson 文字的文件：

```sh
mdfind "Will Pearson"
```

mdfind 命令还可以通过 -onlyin 参数搜索特定文件夹的内容，比如

```sh
mdfind -onlyin ~/Library plist
```

这条命令可以搜索 Library 文件夹中所有 plist 文件。

