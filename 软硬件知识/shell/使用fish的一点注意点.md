[fish](http://fishshell.com/) 是一个对用户友好的 shell（相对其它 shell 而言），它提供内置的命令补全提示、基于浏览器的帮助和设置界面、更易于编写的脚本代码等等实用功能。

为了让脚本代码获得更好的可读性和可移植性，fish 去掉了很多其它 shell 的配置选项，并且不支持那些它认为晦涩的语法。

本文罗列一些 fish 使用中的一些注意要点，如果需要深入了解 fish，请在 fish shell 下面输入`help` 命令在浏览器内打开 fish 帮助文档（如果您还不了解 shell，推荐购买入门读物 [Unix & Linux 大学教程](http://www.amazon.cn/%E5%9B%BD%E5%A4%96%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%A7%91%E5%AD%A6%E7%BB%8F%E5%85%B8%E6%95%99%E6%9D%90%E2%80%A2Unix-Linux%E5%A4%A7%E5%AD%A6%E6%95%99%E7%A8%8B-%E5%93%88%E6%81%A9/dp/B00359FJUY)）

## fish 不支持的特性

由于设计、实现的种种原因，fish 并不支持某些其它 shell （例如 bash） 支持的特性，而这些特性并没有在 fish 的官方文档有所体现，所以如果你是从其它 shell 切换到 fish 的，请了解以下内容：

- 不支持 heredoc 特性，例如以下代码

```
cat << EOF > file.txt
# file content
...
EOF

```

是不能在 fish 下运行的，官方的解释是因为你可以用其它命令替代，例如：

```
printf "\
# file content
...
" > file.txt

```

使用`"` 有个额外好处就是可以使用 fish 变量，但是要留意里面的`\` 和 `$` 的转义效果。

- 不支持字符串替换语法，例如：

```
file=tmp.sh
echo ${file%.*}

```

是无法在 fish 使用的，fish 项目已经包含了 `string` 做为内置命令执行字符串转换操作， 但是目前的发行版： 2.2.0 版本并不包含该功能，需要使用 `sed` 命令或者重定向到 `bash`等方式来实现字符串替换。

- 不支持多命令后台执行，例如：

```
sleep 5;and echo 'done' &

```

但是对于单一命令 `sleep 5 &` 是可以后台执行的。换句话说，就是没办法用这种方式让 fish 并发执行任务。 主要原因是 fish 并不像其它 shell 一样使用 fork 执行子任务， 而是实现了一套作用域的机制， 而且 fish 使用内置了大量内置命令以及全局变量， 这就导致 fish 执行多进程的行为很难保证正确实现，（例如命令内包含 `cd` 子命令）。

好消息是 fish 将来（大概）会有一套自己的多进程实现, 你也可以借助 [parallel](https://chemzqm.me/www.gnu.org/software/parallel/) 来实现并发命令。

- 不支持特殊语法，例如 bash 里面执行上条命令的语法 `!!` 在 fish 里是不存在的， 如果你想使用 sudo 执行上条命令，可以使用创建一个函数 `sdl.fish`：

```
function sdl
eval command sudo $history[1]
end

```

执行 sdl 命令即可。

## fish 设置上的不同之处

fish 的设置在各个方面都与其它 shell 存在明显的区别。

- 配置文件: fish 首先会读取全局配置文件（如果是 brew 安装的话位于 /usr/local/etc/fish/config.fish), 然后读取你 home 下的 ~/.config/fish/config.fish (如果存在的话)。

就像 `.bashrc` `.zshrc`一样，这个文件会在 fish 每次初始化时读取， (包含 login 以及非 login)。

- 通过函数设置 fish 的行为： fish 完全使用函数定制行为，你可以通过添加一些特殊的函数定制 fish 的行为，例如 prompt，fish 没有 PS1 这类特殊变量，而是使用一个固定的函数。

prompt 函数保存在 ~/.config/fish/functions/fish_prompt.fish 文件内，你可以直接修改这个文件， 或者更简单一些通过命令 `fish_config` 打开设置界面，然后在 prompt 标签页下面选一个 （推荐使用 Informative Git Prompt）。

修改 ~/.config/fish/functions/fish_title.fish 可改变 shell 的显示标题，例如：

```
function fish_title
prompt_pwd
end

```

让标题显示为当前目录。

修改 ~/.config/fish/functions/fish_greeting.fish 让 fish 在开始交互时显示系统信息：

```
function fish_greeting
uptime
end

```

- 设置 alias: fish 出于兼容考虑提供了和其它 shell 一样语法的 alias，可以直接把原来的 alias 拷贝过来使用，fish 会在内部将 alias 转换为函数使用。

fish 提供了更实用的 `abbr` 内置命令可以替换大多数 alias 使用， 例如：

```
abbr -a l ls -lhS

```

即可添加 `l` 为 `ls -lhS` 的缩写（使用 `abbr -h` 查看完整说明）。 缩写命令会在使用 `<tab>` 和 回车时显示完整命令。因为 abbr 只能作为全局变量， 所以如果在 `config.fish`文件内定义多个 abbr 会很大程度影响 fish 脚本的启动效率， 解决办法就是只在命令行内使用 abbr 命令进行设置，而不是加在 config.fish 文件内。

abbr 相比于 alias，可以让你看到完整的命令，同时可以继续使用原来命令的补全功能。

- 设置环境变量: fish 没有 `export`, 而是通过 `set -x` 命令设置环境变量，例如

```
set -x VISUAL vim

```

只对当前 shell 设定环境变量，而

```
set -Ux VISUAL vim

```

则会让环境变量全局生效，即使 shell 重启也会保留。推荐使用 `set -Ux` 保存常用环境变量， (而不是写到 config.fish 文件) 这样你的 app 就算不是从 shell 启动，也会获得这些变量。

- 设置 path：fish 里面的 path 是一个路径数组（fish 独有的数组类型），而不是 `:` 分隔的路径字符串，你可以在 fish.config 里面设置：

```
set PATH /new/path $PATH

```

或者使用变量 `fish_user_paths`，结合 `set -u` 永久保存：

```
set -U fish_user_paths $fish_user_paths /usr/local/share/npm/bin/

```

fish 会自动添加 `fish_user_paths` 的内容到 PATH 变量前面，同时确保该变量内容不会重复。

## fish 脚本语法上的特别之处

尽管某些功能并没有支持，但总的来说 fish 的语法相比于 bash 之类的 shell 要易用一些。

- 变量赋值

fish 只支持 `set` 命令赋值，不支持 `=` 语法，例如：

```
> set name 'Mister Noodle'
> echo $name
Mister Noodle

```

`set` 命令同时支持设定变量作用域、设定数组、移除数组元素、删除变量、导出变量等功能， 是 fish 里面最基础，最重要的一个内置命令。

- 变量替换

fish 脚本在变量替换后不会进一步分裂：

```
> set name 'Mister Noodle'
> mkdir $name
> ls
Mister Noodle

```

如果你需要一个变量传递多个参数，可以使用数组：

```
> set name Mister Noodle
> mkdir $name

```

- 变量扩展

为了分离变量和正常文本，fish 支持使用 `{$variable}` 语法，例如：

```
echo The plural of $WORD is {$WORD}s

```

而其它 shell 使用的是 `${variable}` 语法。

- 退出状态

fish 使用 `$status` 获取上一个命令的退出状态，而不是 `$?`

```sh
> false
> echo $status
1
```

*这里的 false 是一个总返回失败状态码的内置命令，而不是变量*

- 命令替换

fish 不使用反引号 `，而是小括号 `()` 语法表示命令替换，例如：

```sh
> set os (uname)
> echo $os
Darwin
```

- 命令组合

fish 不使用 `&&` 以及 `||` 语法来组合命令，而是使用 `and` 和 `or` 命令：

```sh
> cp file1.txt file1_bak.txt; and echo "Backup successful"; or echo "Backup failed"
Backup failed
```

- 函数参数

fish 没有 `$1` 这类数字变量指向函数参数，而是使用一个数组变量 `$argv` 来保存全部参数。

```sh
> function say_hello
count $argv
echo $argv
end
> say_hello hello fish
```

- 重定向

你不能使用 sh 的语法 `&>` 或者 bash 的语法 `&2>1` 来重定向错误输出到正常输出，而只能用 `^` 语法， 例如：

```sh
> grep fish < /etc/shells > ~/output.txt ^ ~/errors.txt
```

*我也不太明白它为啥不支持 & 语法*

- 条件判定

fish 不支持常规的条件判定语法，例如：

```sh
[ -d $dir ] || mkdir $dir
```

在 fish 里你需要这样写：

```sh
set dir awesome
if not test -d $dir;mkdir $dir;end
```

这里的 `if` `not` `test` `end` 都是 fish 内置命令，可以通过 `man [command]` 或者 `[command] -h` 查看帮助手册。

## 其它注意点

- fish 并不支持传统的单一命令环境变量设置方法，例如

```sh
NODE_ENV=production node index.js
```

是无法在 fish 内使用的，解决办法是使用更通用的 `env` 命令：

```sh
env NODE_ENV=production node index.js
```

- 如果使用 fish 做为你的默认 shell， 你可能需要将 vim 的 shell 换为 sh 或者 bash：

```sh
if &shell =~# 'fish'
set shell=sh
endif
```

这是因为某些插件可能使用了 fish 没有的语法，例如 `&` 做为重定向标识，从而导致命令运行出错。

- fish 里面的数组计数是从 `1` 开始的，而不是大多数程序的 `0`, 所以以下命令会报错：

```sh
> set arr a b c
> echo $arr[0]
Array index out of bounds
fish: echo $arr[0]
            ^
```

- `funced` 用来编辑函数或者创建临时函数，`functions -e` 删除临时函数，`funcsave` 保存函数到 `~/.config/fish/functions/` 目录下。

```sh
# $TMPDIR 目录下创建一个临时文件并使用 $EDITOR 打开
funced l
# 文件保存后命令 `l` 会在当前 shell 下生效
# 删除临时函数，只是让这个函数失效而已
functions -e
```

如果文件已经通过 `funcsave` 保存到 functions 目录下，你需要手工 rm 生成的 fish 脚本（[函数名].fish）。

如果你想保留编辑的函数，建议直接在 ~/.config/fish/functions/ 目录内新建文件编写函数文件，不然如果忘记使用 `funcsave` 保存函数，shell 退出后这个函数就消失了😓

## 最后

fish 虽然看上去有些特立独行，但是总的来说它的设计理念很好的体现了设计上的简洁性和一致性，希望你也能喜欢它。