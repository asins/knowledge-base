
ripgrep 命令行快速搜索工具

## 一、参数

这里我们把一些常用选项做下介绍。

| 选项 | 说明 | 备注 |
| ---- | ---- | ----- |
|-A, --after-context | 显示匹配内容后的  行。 | 会覆盖 --context 选项。 |
| -B, --before-context  | 显示匹配内容前的  行。 | 会覆盖 --context 选项。 |
| -b, --byte-offset | 显示匹配内容在文件中的字节偏移。 | 和 -o 一起使用时只打印偏移。 |
| -s, --case-sensitive | 启用大小写敏感。 | 会覆盖 -i(--ignore case) 和 -S(--smart case) 选项。 |
| --color  | 什么时候使用颜色，默认值为：auto。可选值有：never、auto、always、ansi。 | 如果 --vimgre 选项被使用，那么默认值是 never。 |
| --column | 显示匹配所在列数 (从 1 开始)。 | 如果不显示列号可用 --no-column 取消掉。 |
| -C, --context  | 显示匹配内容的前面和后面的  行。 | 该选项会覆盖 -B 和 -A 选项。 |
| --context-separator  | 在输出结果中分隔非连续的输出行 。 | 可以使用\x7F 或 \t，默认是 --。 |
| -c, --count | 只显示匹配结果的总行数。 | 如果只有一个文件给 Ripgrep，那么只打印匹配结果的总行数。可以用 --with-filename来强制打印文件名，该选项会覆盖 --count-matches 选项。 |
| --count-matches | 只显示匹配结果的总次数。 | 可以用 --with-filename来强制在只有一个文件时也输出文件名。 |
| --debug | 显示调试信息。 |   |
| --dfa-size-limit  | 指定正则表达式 DFA 的上限，默认为 10M。 | 该选项允许接受与 --max-filesize相同大小的后缀标志。 |
| -E, --encoding  | 指定文本编码格式, 默认是 auto。 | 更多编码格式参考：https://encoding.spec.whatwg.org/#concept-encoding-get |
| -f, --file ... | 从文件中读入搜索模式, 一行一个模式。 | 结合 -e/--regexp参数可多个文件一起组合使用，所有组合会被匹配。 |
| --files | 打印所有将被搜索的文件路径。 | 以 rg --files [PATH...]方式使用，不能增加搜索模式。 |
| -l, --files-with-matches | 只打印有匹配的文件名。 | 该选项会覆盖 --files-without-match。 |
| --files-without-match | 只打印无匹配的文件名。 | 该选项会覆盖 --file-with-matches。 |
| -F, --fixed-strings | 把搜索模式当成常规文字而非正则表达式。 | 该选项可以用--no-fixed-strings 来禁止。 |
| -L, --follow | 该选项会递归搜索符号链接，默认是关闭的。 | 该选项可以用 --no-follow 选项来手动关闭。 |
| -g, --glob ... | 包含或排除用于搜索匹配给定的文件和目录，可以用 ! 来取反。 | 该选项可以多次使用，会匹配 .gitignore 中的规则。 |
| -h, --help | 打印帮助信息。 |   |
| --heading | 打印文件名到匹配内容的上方而不是在同一行。 | 该选项是默认启用的，可以用 --no-heading来关闭。 |
| --hidden | 启用搜索隐藏文件和文件夹。 | 默认情况下是忽略搜索隐藏文件和文件夹的, 可用 --no-hidden 来关闭。 |
| --iglob ... | 作用同 --glob, 但这个选项大小写不敏感。 |   |
| -i, --ignore-case | 指定搜索模式中的大小写不敏感。 | 该选项会被 -s/--case-sensitive 或 -S/--smart-case 覆盖。 |
| --ignore-file ... | 指定搜索时需忽略的路径，格式同 .gitignore, 可同时指定多个。 | 如果存在多个 --ignore-file标记时，后面优先级会更高。 |
| -v, --invert-match | 反向匹配，显示与给定模式不匹配的行。 |   |
| -n, --line-number | 显示匹配内容所在文件的行数，该选项默认是打开的。 |   |
| -x, --line-regexp | 只显示整行都匹配搜索模式的行。 | 该选项会覆盖 --word-regexp。 |
| -M, --max-columns  | 不打印长于  中指定节字大小的匹配行内容，只显示该行的匹配数。 |   |
| -m, --max-count  | 限制一个文件中最多  行被匹配。 |   |
| --max-depth  | 限制文件夹递归搜索深度。 | 如：`rg --max-depth 0 dir/`则表示不执行任何搜索。 |
| --max-filesize  | 搜索时忽略大于  byte 的文件。 | SUFFIX 的单位可以是：K、M、G，默认是：byte。 |
| --mmap | 尽量使用 Memory Maps 进行搜索，这样速度会更快。该选项是默认行为。 | 如果使用 --mmap 搜索文件时 Ripgrep 发生意外中止，可使用 --no-mmap 选项关闭它。 |
| --no-config | 不读取 configuration 文件, 并忽略 RIPGREP_CONFIG_PATH 变量。 |   |
| --no-filename | 不要打印匹配文件的文件名。 |   |
| --no-heading | 不在每个匹配行上方打印文件名，而是在匹配行的同一行上打印。 |   |
| --no-ignore | 不读取忽略文件，如：.gitignore、.ignore 等。 | 该选项可以用 --ignore 关闭。 |
| --no-ignore-global | 不读取全局的 ignore 文件，比如: $HOME/.config/git/ignore。 | 该选项可以用 --ignore-global 关闭。 |
| --no-ignore-messages | 取消解析 .ignroe、.gitignore 文件中相关错误信息。 | 该选项可通过 --ignore-messages 关闭。 |
| --no-ignore-parent | 不读取父文件夹里的 .gitignore、.ignore 文件。 | 该选项可通过 --ignore-parent 关闭。 |
| --no-ignore-vcs | 不读取版本控制器中的 .ignore 文件。 | 该选项可通过 --ignore-vcs 关闭。 |
| -N, --no-line-number | 不打印匹配行数。 |   |
| --no-messages | 不打印打开和读取文件时相关错误信息。 |   |
| -0, --null | 在打印的文件路径后加一个 NUL 字符。 | 这对于结合 Xargs 使用时是非常有用的。 |
| -o, --only-matching | 只打印匹配的内容，而不是整行。 |   |
| --passthru | 同时打印文件中匹配和不匹配的行。 |   |
| --path-separator  | 路径分隔符，在 Linux 上默认是 /，Windows 上默认是 \ 。 |   |
| --pre  | 用  处理文件后，并将结果传递给 Ripgrep。 | 该选项存在一定的性能损耗。 |
| -p, --pretty | 该选项是 --color always --heading --line-number 的别名。 |   |
| -q, --quiet | 该选项不会打印到标准输出, 如果匹配发现时就停止搜索。 | 当 RipGrep 用于 exit 代码时该选项非常有用。 |
| --regex-size-limit  | 设置已编译正则表达式的上限，默认限制为10M。 |   |
| -e, --regexp ... | 使用正则来匹配搜索条件。 | 该选项可以多次使用，可打印匹配任何模式的行。 |
| -r, --replace  | 用相应文件内容代替匹配内容打印出来。 |   |
| -z, --search-zip | 在 gz、bz2、xz、lzma、lz4 文件类型中搜索。 | 该选项可通过 --no-search-zip 关闭。 |
| -S, --smart-case | 如果全小写，则大小写不敏感，否则大小写敏感。 | 该选项可通过 -s/--case-sensitive 和 -i/--ignore-case 来关闭。 |
| --sort  | 将输出结果按升序进行排序，可排序类型有：path、modified、accessed、created 。 |   |
| --sortr  | 将输出结果按降序进行排序，可排序类型有：path、modified、accessed、created 。 |   |
| --stats | 打印出统计结果。 |   |
| -a, --text | 搜索二进制文件。 | 该选项可通过 --no-text 关闭。 |
| -j, --threads  | 搜索时要使用的线程数。 |   |
| -t, --type ... | 只搜索指定的文件类型。 | 可以通过 --type-list 来列出支持的文件类型。 |
| --type-add ... | 添加一种文件类型。 |   |
| --type-clear ... | 清除默认的文件类型。 |   |
| --type-list | 列出所有内置文件类型。 |   |
| -T, --type-not ... | 不要搜索某种文件类型。 |   |
| -u, --unrestricted | -u 搜索.gitignore 里的文件, -uu 搜索隐藏文件，-uuu 搜索二进制文件。 |   |
| -V, --version | 打印版本信息。 |   |
| --vimgrep | 每一次匹配都单独打印一行，如果一行有多次匹配会打印成多行。 |   |
| -H, --with-filename | 打印匹配的文件路径，该选项默认打开。 | 该选项可通过 --no-filename 关闭。 |
| -w, --word-regexp | 把搜索参数作为单独单词匹配。 | 该选项会覆盖 --line-regexp 选项。 |


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
rg -l -g 'gulpfile.js'
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

仅搜索与特定 glob 匹配的文件：

```sh
rg foo -g 'README.*'
```

或者排除与特定 glob 匹配的文件：

```sh
rg foo -g !'*.min.js'
```

只搜索HTML、CSS文件：
```sh
rg -thtml -tcss foobar
```

搜索除Javascript文件以外的所有内容：
```sh
rg -Tjs foobar
```

