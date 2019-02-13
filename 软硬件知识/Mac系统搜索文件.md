## 通过Find命令搜索文件

find命令非常高效，并且使用简单。find命令来自unix，OS X和Linux系统同样支持该命令。find最基本的操作就是：
```sh
find 文件路径 参数
```

比如你可以通过以下命令在用户文件夹中搜索名字中包含screen的文件

```sh
find ~ -iname  "screen*"
```

你也可以在特定的文件夹中寻找特定的文件，比如

```sh
find ~/Library/ -iname "com.apple.syncedpreferences.plist"
```

这个命令可以在Library文件夹中寻找`com.apple.syncedpreferences.plist`文件

## 通过mdfind命令搜索文件

mdfind命令就是Spotlight功能的终端界面，这意味着如果Spotlight被禁用，mdfind命令也将无法工作。mdfind命令非常迅速、高效。最基本的使用方法是：

```sh
mdfind -name 文件名字
```

比如你可以通过下面的命令寻找Photo 1.PNG文件

```sh
mdfind -name "Photo 1.PNG"
```

因为mdfind就是Spotlight功能的终端界面，你还可以使用mdfind寻找文件和文件夹的内容，比如通过以下命令寻找所有包含Will Pearson文字的文件：

```sh
mdfind "Will Pearson"
```

mdfind命令还可以通过-onlyin参数搜索特定文件夹的内容，比如

```sh
mdfind -onlyin ~/Library plist
```

这条命令可以搜索Library文件夹中所有plist文件。