---
title: "awk 指定规则显示内容"
date: "2019-08-21"
lastmod: "2019-08-21"
---

## awk 简介

1. awk 以记录和字段的方式来查看文本文件
2. 和其他编程语言一样， awk 包含变量、条件和循环
3. awk 能够进行运算和字符串操作
4. awk 能够生成格式化的报表数据

## awk 概述

awk 程序 awk 命令、括在括号（或写在文件）中的程序指令以及输入文件的文件名几个部分组成。如果没有输入文件，输入则来自于标准输入。

awk 指令由模式、操作或者模式与操作的组合组成。模式是由某种类型的表达式组成的语句。如果某个表达式中没有出现关键在 if ，但实际在计算时却暗含 if 这个词，那么这个表达式就是模式。操作由括在大括号中的一条或多条语句组成，语句之间用分号或者换行符隔开。模式不能括在大括号中，模式由包括在两个正斜杠之间的正则表达式、一个或多个 awk 操作符组成的表达式组成。

格式：
```bash
awk '/search pattern1/ {Actions}/search pattern2/ {Actions}' file
```

## 工作原理

awk 使用一行作为输入（通过文件或者管道），并将这一行赋给内部变量 $0

行被空格分解为字段（单词），每一个字段存储在已编号的变量中，从 $1 开始。（ awk 的内部变量 FS 用来确定字段的分隔符。初始时，为空格，包含制表符和空格符）

对于一行，按照给定的正则表达式的顺序进行匹配，如果匹配则执行对应的 Action ，如果没有匹配上则不执行任何动作 ， Search Pattern 和 Action 是可选的，但是必须提供其中一个 。如果 Search Pattern 未提供，则对所有的输入行执行 Action 操作。如果 Action 未提供，则默认打印出该行的数据 。 {} 这种 Action 不做任何事情，和未提供的 Action 的工作方式不一样

打印字段，用 print 、 printf 、 sprintf ，格式： { print $1, $3 } 内部变量 output field separator （ OFS ），默认为空格， $n 之间的逗号被 OFS 中的字符替换。

输出之后，从文件中另取一行，并将其复制到 $0 中，覆盖原来的内容。重复进行……



## 格式化输出

### print 函数

print 函数用于打印不需要特别编排格式的简单输出。更为复杂的格式编排则要使用 printf 和 sprintf 。若懂得 C 语言，则也一定懂得如何使用 printf 和 sprintf 。

print 函数的的转义序列
- `/b` 退格
- `/f` 换页
- `/n` 换行
- `/r` 回车
- `/t` 制表符
- `/047` 八进制值 47 ，即单引号
- `/c` c 代表任意其他字符

打印数字时，可能需要控制数字的格式。可以通过 printf 来实现，但是通过设置一个特殊的变量 OFMT ，是用 print 函数也可以控制数字打印格式。 OFMT 默认为“ %.6gd” ，表示只打印小数部分的前 6 位。

例 1 ：
```bash
long@long-Ubuntu:~$ awk 'BEGIN { OFMT="%.2f"; print 1.2456789, 12E-2 }'

1.25 0.12
```

### printf 函数

printf 函数返回一个带格式的字符串给标准输出，如同 C 语言中的 printf 语句。 printf 语句包括一个加引号的控制串，控制串中可能嵌套有若干格式说明和修饰符。控制串后面跟逗号，之后是一列由逗号分隔的表达式。与 print 函数不同的是， printf 函数不会在行尾自动换行。若要换行，在控制串中提供转义字符 /n 。每个百分号和格式说明都必须有一个对应的变量 。要打印百分号就必须在控制串中给出两个百分号。

printf 函数的转义字符
- `c` 字符
- `s` 字符串
- `d` 十进制整数
- `ld` 十进制长整数
- `u` 十进制无符号整数
- `lu` 十进制无符号长整数
- `x` 十六进制整数
- `lx` 十六进制长整数
- `o` 八进制整数
- `lo` 八进制长整数
- `e` 用科学计数法表示浮点数
- `f` 浮点数
- `g` 选用 e 或 f 中较短的一种形式

printf 函数的修饰符

- `-` 左对齐修饰符
- `#` 显示八进制整数时，前面加 0 ，显示十六进制整数时，前面加 0x
- `+` 显示使用 d 、 e 、 f 、 g 转换的整数时，加上正负号
- `0` 用 0 而不是空白符来填充所显示的值



printf 函数控制串里的管道符（竖杠）是文本的一部分，用于指示格式的起始与结束。

例 2 ：
```bash
long@long-Ubuntu:~$ echo "UNIX" | awk ' { printf "|%-15s|/n", $1 }'
|UNIX |
long@long-Ubuntu:~$ echo "UNIX" | awk ' { printf "|%15s|/n", $1 }'
| UNIX|
```
（ %15s 表示占 15 个字符的字符串）


## 文件中的 awk 命令

如果 awk 命令写在文件里，用 -f 选项制定 awk 的文件名，后面加上要处理的输入文件的文件名。 awk 从缓冲区读入一条指令，接着测试 awk 文件中的每一条命令，然后对读入的记录执行命令。

例 3 ：
```bash
long@long-Ubuntu:~$ cat employees
Tom Jones	4424	5/12/66	543354
Mary Adams	5346	11/4/63	28765
Sally Chang	1654	7/22/54	650000
Billy Black	1683	9/23/44	336500
long@long-Ubuntu:~$ cat awkfile
/^Mary/ {print "Hello Mary!"}
{print $1, $2, $3}
long@long-Ubuntu:~$ awk -f awkfile employees
Tom Jones 4424
Hello Mary!
Mary Adams 5346
Sally Chang 1654
```

## 记录与字段

在 awk 看来，输入数据具有格式和结构。默认情况下，每一行称为一条记录，以换行符结束。

默认情况下，输入和输出记录的分隔符（行分隔符）都是回车符（换行符），分别保存在 awk 的内置变量 ORS 和 RS 中，其值可以修改，只能以特定方式进行修改。

每条记录的记录号都保存在 awk 的内置变量 NR 中，每处理完一条记录， NR 的值加 1 。



每条记录由字段（ field ）组成，用空白符（空格或制表符）分隔。内置变量 NF 保存记录的字符数。前面提到的 FS ，用来分隔字段，并且删除各字段前多余的空白或制表符。可以在 BEGIN 语句中或命令行上赋值来改变 FS 的值。也可以在命令行上通过 -F 选项来改变 FS 的值。

例 4 ：
```bash
long@long-Ubuntu:~$ cat employees2
Tom Jones:4424:5/12/66:543354
Mary Adams:5346:11/4/63:28765
Sally Chang:1654:7/22/54:650000
Billy Black:1683:9/23/44:336500
long@long-Ubuntu:~$ awk -F: '/Tom Jones/{print $1,$2}' employees2
Tom Jones 4424
```

也可以使用多个字段分隔符。此时 FS 对应的是一个正则表达式字符串，被括在方括号中。

例 5 ：
```bash
long@long-Ubuntu:~$ awk -F'[ :/t]' '{print $1,$2}' employees
Tom Jones
Mary Adams
Sally Chang
Billy Black
long@long-Ubuntu:~$ awk -F'[ :/t]' '{print $1,$2}' employees2
Tom Jones
Mary Adams
Sally Chang
Billy Black
```

前面提到的输出字段分隔符 OFS ，输出时如果没有用逗号来分隔字段，结果中字段将堆在一起。 OFS 的值也可以改变。


### 模式与操作

模式由正则表达式、判别条件真伪的表达式或者二者的组合构成。 awk 默认打印所有是表达式结果为真的文本行。模式表达式中暗含着 if 语句，如此，就不必用花括号将它括起来。当 if 是显式给出时，这个表达式就成了操作语句，语法将不一样

操作是花括号中以分号分隔的语句。若操作前有模式，则该模式控制执行操作的时机。



### 正则表达式

- `/` 取消字符的特殊含义
- `^` 在行首匹配。 ^ 不能用于匹配嵌套在一个字符串中的行首， if ("line1/nLINE 2" ~ /^L/) ... 不为真。
- `$` 在行尾匹配。 $ 不能用于匹配嵌套在一个字符串中的行尾， if ("line1/nLINE 2" ~ /1$/) ... 不为真
- `.` 匹配单个任意字符，包括换行符。
- `[...]` 匹配制定字符组中的任意一个。
- `[^ …]` 匹配任何一个不在制定字符组中的字符
- `|`  匹配 | 两侧的任意的字符（组），在所有的正则表达式中优先级最低。 The alternation applies to the largest possible regexps on either side.
- `(...)` Parentheses are used for grouping in regular expressions, as in arithmetic. They can be used to concatenate regular expressions containing the alternation operator.
- `*` 匹配零个或者多个前导字符
- `+` 匹配一个或者多个前导字符
- `?` 匹配零个或者多个前导字符
- `{n}`/ `{n,}` / `{n,m}` One or two numbers inside braces denote an interval expression. If there is one number in the braces, the preceding regexp is repeated n times. If there are two numbers separated by a comma, the preceding regexp is repeated n to m times. If there is one number followed by a comma, then the preceding regexp is repeated at least n times:
```txt
wh{3}y
Matches ‘whhhy’, but not ‘why’ or ‘whhhhy’.
wh{3,5}y
Matches ‘whhhy’, ‘whhhhy’, or ‘whhhhhy’, only.
wh{2,}y
Matches ‘whhy’ or ‘whhhy’, and so on.
```

Interval expressions were not traditionally available in awk. They were added as part of the POSIX standard to make awk and egrep consistent with each other.

However, because old programs may use ‘{’ and ‘}’ in regexp constants, by default gawk does not match interval expressions in regexps. If either --posix or --re-interval are specified, then interval expressions are allowed in regexps.

For new programs that use ‘{’ and ‘}’ in regexp constants, it is good practice to always escape them with a backslash. Then the regexp constants are valid and work the way you want them to.

正则表达式中 `*`，`+`，`?`以及`{` 和 `}` 有最高的优先级，解析来是连接操作符，最后是`|`. 算术中一样，括号可以用来改变顺序。

在 POSIX awk 和 gawk 中，如果正则表达式里 '*' ， '+' ， '?' 前面没有任何字符，那么这三个字符代表他们自己。很多其他版本的 awk 中，将把这视为错误。

gawk -Specific Regexp Operators
- `/Y` 匹配一个单词开头或者末尾的空字符串。
- `/B` 匹配单词内的空字符串。
- `/<` 匹配一个单词的开头的空字符串，锚定开始。
- `/>` 匹配一个单词的末尾的空字符串，锚定末尾。
- `/w` 匹配一个字母数字组成的单词。
- `/W` 匹配一个非字母数字组成的单词。
- `/‘` 匹配字符串开头的一个空字符串。
- `/'` 匹配字符串末尾的一个空字符串。



The various command-line options control how gawk interprets characters in regexps:

Nooptions ：

In the default case, gawk provides all the facilities of POSIX regexps and the previously described GNU regexp operators. GNU regexp operators described in Regexp Operators. However, interval expressions are not supported.

--posix ：

Only POSIX regexps are supported; the GNU operators are not special (e.g., ‘/w’ matches a literal ‘w’). Interval expressions are allowed.

--traditional ：

Traditional Unix awk regexps are matched. The GNU operators are not special, interval expressions are not available, nor are the POSIX character classes ([[:alnum:]], etc.). Characters described by octal and hexadecimal escape sequences are treated literally, even if they represent regexp metacharacters. Also, gawk silently skips directories named on the command line.

--re-interval ：

Allow interval expressions in regexps, even if --traditional has been provided. (--posix automatically enables interval expressions, so --re-interval is redundant when --posix is is used.)



POSIX 增加的括号字符类

Class Meaning

[:alnum:] Alphanumeric characters.

[:alpha:] Alphabetic characters.

[:blank:] Space and TAB characters.

[:cntrl:] Control characters.

[:digit:] Numeric characters.

[:graph:] Characters that are both printable and visible.

[:lower:] Lowercase alphabetic characters.

[:print:] Printable characters (characters that are not control characters).

[:punct:] Punctuation characters

[:space:] Space characters (such as space, TAB, and formfeed, to name a few).

[:upper:] Uppercase alphabetic characters.

[:xdigit:] Characters that are hexadecimal digits.



### 范围模板

范围模板匹配从第一个模板的第一次出现到第二个模板的第一次出现之间所有行。如果有一个模板没 出现，则匹配到开头或末尾。如 $ awk '/root/,/mysql/' test 将显示 root 第一次出现到 mysql 第 一次出现之间的所有行。



10. 关系运算符

< ， <= ， == ， != ， >= ， > ， ~ ， !~ （最后两个表示匹配和不匹配正则表达式）



11. 条件表达式

条件表达式 1 ? 条件表达式 2 : 条件表达式 3



12. 算术运算

可以在模式中进行计算， awk 都将按浮点方式执行运算。支持： + ， - ， * ， / ， % ， ^ （幂）



13. 逻辑操作符与复合模式

&& ， || ，！



例 6 ： 一个验证 passwd 文件有效性的例子

long@long-Ubuntu:~$ cat /etc/passwd | awk -F: '/

> NF != 7 {/

> printf("line %d, does not have 7 fields:%s/n",NR,$0)}/

> $1 !~ /[A-Za-z0-9]/{printf("line %d, non alpha and numeric user id:%d: %s/n",NR,$0)}/

> $2 == "*" {printf("line %d, no password: %s/n", NR,$0)}'



1 cat 把结果输出给 awk ， awk 把域之间的分隔符设为冒号。

2 如果域的数量 (NF) 不等于 7 ，就执行下面的程序。

3 printf 打印字符串 "line ?? does not have 7 fields" ，并显示该条记录。

4 若第一个域没包含任何字母和数字， printf 打印“ no alpha and numeric user id" ，并显示记录数和记录。

5 如果第二个域是一个星号，就打印字符串“ no passwd” ，紧跟着显示记录数和记录本身。



例 7 ：几个示例：

$ awk '/^(no|so)/' filename----- 打印所有以模式 no 或 so 开头的行。

$ awk '/^[ns]/{print $1}' filename----- 如果记录以 n 或 s 开头，就打印这个记录。

$ awk '$1 ~/[0-9][0-9]$/(print $1}' filename----- 如果第一个域以两个数字结束就打印这个记录。

$ awk '$1 == 100 || $2 < 50' filename----- 如果第一个或等于 100 或者第二个域小于 50 ，则打印该行。

$ awk '$1 != 10' filename----- 如果第一个域不等于 10 就打印该行。

$ awk '/test/{print $1 + 10}' filename----- 如果记录包含正则表达式 test ，则第一个域加 10 并打印

$ awk '{print ($1 > 5 ? "ok "$1: "error"$1)}' filename—--- 如果第一个域大于 5 则打印问号后面 的表达式值，否则打印冒号后面的表达式值。

$ awk '/^root/,/^mysql/' filename---- 打印从以正则表达式 root 开头的记录到以正则表达式 mysql 开头 的记录范围内的所有记录。如果找到一个新的正则表达式 root 开头的记录，则继续打印直到下一个以正则 表达式 mysql 开头的记录为止，或到文件末尾。



14. 变量

在 awk 中，变量不需要定义就可以直接使用，变量类型可以是数字或字符串，由 awk 根据上下文推导，不用指定

变量名可以包括字母、数字和下划线，但不能以数字开头。

赋值格式： Variable = expression

变量被设置后，就变成与等号右边那个表达式相同的类型。

未经初始化的变量的值是 0 或者“”，具体是哪个取决于它们被使用时的上下文。

将一个字符串强制转换为数字，方法为： name+0

将数字转换成字符串的方法是： number “”

赋值运算符： = ， += ， -= ， *= ， /= ， %= ， ^=

递增递减运算符，也分为前置和后置两种，遵循的规则与 C 语言中一样



awk 可以在命令行中给变量赋值，然后将这个变量传输给 awk 脚本。如 $ awk -F: -f awkscript month=4 year=2004 filename ，上式的 month 和 year 都是自定义变量，分别被赋值为 4 和 2004 。在 awk 脚本中，这些变量使用起来就象是在脚本中建立的一样。注意，如果命令行中 filename 的位置在变量之前，那么在 BEGIN 语句中的变量就不能被使用（参见后面的 BEGIN 模式）。

-v 选项， awk 的 -v 选项允许在 BEGIN 语句中，处理命令行变量。从命令行传递的每一个变量前面都必须加 -v 选项



字段变量也可被赋值和修改。新的字段可以通过赋值来创建。字段变量引用的字段如果没有值，则被赋值为空串（即如果只有 4 个字段，但是对 $6 复制，那么不存在的 $5 被赋值为空串）。字段的值发生变化时， awk 会以 OFS 的值作为字段间隔符重新计算 $0 的值。字段数目通常在 100 以内。如 $ awk '{$2 = 100 + $1; print }' test, 上式表示，如果第二个域不存在， awk 将计算表达式 100 加 $1 的值，并将其赋值给 $2 ，如果第二个域存在，则用表达式的值覆盖 $2 原来的值。



内建变量

$n 当前记录的第 n 个字段，字段间由 FS 分隔。

$0 完整的输入记录。

ARGC 命令行参数的数目。

ARGIND 命令行中当前文件的位置 ( 从 0 开始算 ) 。

ARGV 包含命令行参数的数组。

CONVFMT 数字转换格式 ( 默认值为 %.6g)

ENVIRON 环境变量关联数组。

ERRNO 最后一个系统错误的描述。

FIELDWIDTHS 字段宽度列表 ( 用空格键分隔 ) 。

FILENAME 当前文件名。

FNR 同 NR ，但相对于当前文件。

FS 字段分隔符 ( 默认是任何空格 ) 。

IGNORECASE 如果为真（即非 0 值），则进行忽略大小写的匹配。

NF 当前记录中的字段数。

NR 当前记录数。

OFMT 数字的输出格式 ( 默认值是 %.6g) 。

OFS 输出字段分隔符 ( 默认值是一个空格 ) 。

ORS 输出记录分隔符 ( 默认值是一个换行符 ) 。

RLENGTH 由 match 函数所匹配的字符串的长度。

RS 记录分隔符 ( 默认是一个换行符 ) 。

RSTART 由 match 函数所匹配的字符串的第一个位置。

SUBSEP 数组下标分隔符 ( 默认值是 /034) 。



15. BEGIN 模式

BEGIN 模式后面跟一个操作块。 awk 必须在对输入文件进行任何处理之前，先执行该操作块。常被用于修改内置变量的值，为用户自定义变量赋初值和打印输出的页眉或者标题。。

例 8 ：

$ awk 'BEGIN{FS=":"; OFS="/t"; ORS="/n/n"}{print $1,$2,$3} filename 。上式表示，在 处理输入 文件以前，域分隔符 (FS) 被设为冒号，输出文件分隔符 (OFS) 被设置为制表符，输出记录分隔符 (ORS) 被设 置为两个换行符。 $ awk 'BEGIN{print "TITLE TEST"} 只打印标题。



编写 awk 脚本时，可以先测试好 BEGIN 块操作，再写程序的其他部分。



16. END 模式

END 模式不匹配任何输入行，而是执行任何与之关联的操作。 Awk 处理完所有输入行之后才处理 END 模式。

例 9 ：

$ awk 'END{print "The number of records is" NR}' test ，上式将打印所有被处理的记录数。



17. 重定向和管道

awk 可使用 shell 的重定向符进行重定向输出

输入重定向需用到 getline 函数。 getline 从标准输入、管道或者当前正在处理的文件之外的其他输入文件获得输入。它负责从输入获得下一行的内容，并给 NF,NR 和 FNR 等内建变量赋值。如果得到一条记录， getline 函数返回 1 ，如果到达文件的末尾就返回 0 ，如果出现错误，例如打开文件失败，就返回 -1 。

例 10 ：

$ awk 'BEGIN{ "date" | getline d; print d}' filename

执行 linux 的 date 命令，并通过管道输出给 getline ，然后再把输出赋值给自定义变量 d ，并打印它。

$ awk 'BEGIN{"date" | getline d; split(d,mon); print mon[2]}' filename

执行 shell 的 date 命令，并通过管道输出给 getline ，然后 getline 从管道中读取并将输入赋值给 d ， split 函 数把变量 d 转化成数组 mon ，然后打印数组 mon 的第二个元素。

$ awk 'BEGIN{while( "ls" | getline) print}'

命令 ls 的输出传递给 getline 作为输入，循环使 getline 从 ls 的输出中读取一行，并把它打印到屏幕。这里没有 输入文件，因为 BEGIN 块在打开输入文件前执行，所以可以忽略输入文件。

$ awk 'BEGIN{while (getline < "/etc/passwd" > 0) lc++; print lc}'

awk 将逐行读取文件 /etc/passwd 的内容，在到达文件末尾前，计数器 lc 一直增加，当到末尾时，打印 lc 的值。 注意，如果文件不存在， getline 返回 -1 ，如果到达文件的末尾就返回 0 ，如果读到一行，就返回 1 ，所以命令 while (getline < "/etc/passwd") 在文件不存在的情况下将陷入无限循环，因为返回 -1 表示逻辑真。



如果在 awk 程序中打开了管道 ，就必须先关闭它才能打开另一个管道。管道符右边的命令被括在双引号之间。每次只能打开一个管道。如果打算再次在 awk 程序中使用某个文件或管道进行读写，则可能要先关闭程序，因为其中的管道会保持打开状态直至脚本运行结束。注意：管道一旦被打开，就会保持打开状态直至 awk 退出。 END 块中的语句也会受到管道影响。通过 close() 可关闭管道

例 11 ：

（脚本）

{ print $1,$2,$3 | “sort -r +1 -2 +0 -1” }

END{

close(“sort -r +1 -2 +0 -1”)

<rest of statements> }



awk 内置函数 system 以 Linux 系统命令作为参数，执行该命令并将命令的退出状态返回给 awk 程序。作为参数的命令必须加双引号。



18. 条件语句

awk 条件语句源于 C 语言，可以用他们对包含判断语句的程序进行控制。

if 语句

格式 : {if (expression){

statement; statement; ...

}

}

例 12 ：

$ awk '{if ($1 <$2) print $2 "too high"}' test

如果第一个域小于第二个域则打印。

$ awk '{if ($1 < $2) {count++; print "ok"}}' test

如果第一个域小于第二个域，则 count 加 1 ，并打印 ok 。



if/else 语句

格式： {if (expression){

statement; statement; ...

}

else{

statement; statement; ...

}

}

例 13 ：

$ awk '{if ($1 > 100) print $1 "bad" ; else print "ok"}' test

如果 $1 大 100 则打印 $1 bad, 否则打印 ok 。

$ awk '{if ($1 > 100){ count++; print $1} else {count--; print $2}' test

如果 $1 大于 100 ，则 count 加一，并打印 $1 ，否则 count 减一，并打印 $1 。



if/else else if 语句

格式： {if (expression){

statement; statement; ...

}

else if (expression){

statement; statement; ...

}

else if (expression){

statement; statement; ...

}

else {

statement; statement; ...

}

}



19. 循环语句

常常用来对记录中的每个字段重复执行某些操作 ，或者在 END 块中用来循环处理某个数组中的所有元素。三种类型的循环： while 循环， for 循环，特殊 for 循环

while 循环

第一步给一个变量赋初值，在 while 中测试该变量，若值为真（非 0 ），则进入循环执行语句。 do while 循环与 while 类似，唯一的区别是 do while 至少执行一次循环体，然后才测试表达式。

例 14 ：

$ awk '{ i = 1; while ( i <= NF ) { print NF,$i; i++}}' test

变量的初始值为 1 ，若 i 小于可等于 NF( 记录中域的个数 ), 则执行打印语句，且 i 增加 1 。直到 i 的值大于 NF.



for 循环

for 循环的圆括号中需要 3 个表达式，前两个分别是初始化和测试表达式，第 3 个用于更新测试表达式所用的变量。注意， for 循环中，第一条语句只能初始化一个变量（这与 C 语言不同）

例 15 ：

$ awk '{for (i = 1; i<NF; i++) print NF,$i}' test 。作用同上。



循环控制

break 语句用于在满足条件的情况下跳出循环

continue 语句用于在满足条件的情况下忽略后面的语句，直接返回循环的顶端。

例 16 ：

1.	{for ( x=3; x<=NF; x++)

if ($x<0){print "Bottomed out!"; break}}

2.	{for ( x=3; x<=NF; x++)

if ($x==0){print "Get next item"; continue}}



20. 程序控制语句

next 语句，从输入文件中取出下一行输入，然后从 awk 脚本的顶部重新开始执行。

exit 语句，用于终止 awk 程序。它只能中断对记录的处理，不能跳过 END 语句。若 exit 语句的参数是一个 0~255 之间的值，这个值会被打印在命令行上，以表明程序是否执行成功 ，并指出失败类型。



21. 数组

数组在 awk 中被称为关联数组 （ associative arrays ），其下表既可以是字符串也可以是数字。数组的键和值都存储在 awk 程序内部的一个表中，该表采用的是 散列算法，所以数组元素不是顺序存储的。数组也是被用到时才被创建。 awk 还能判定数组用于保存数字还是字符串，根据上下文被初始化为 0 或者空字符串。数组大小不需要声明。

用变量作为数组下标。

例 17 ：

$ awk {name[x++]=$2};END{for(i=0;i<NR;i++) print i,name[i]}' test

数组 name 中的下标是一个自定义变量 x ， awk 初始化 x 的值为 0 ，在每次使用后增加 1 。第二个域的值被赋给 name 数组的各个元素。在 END 模块中， for 循环被用于循环整个数组，从下标为 0 的元素开始，打印那些存储在数组中的值。因为下标是关健字，所以它不一定从 0 开始，可以从任何值开始。



特殊 for 循环

当下标为字符串或者非连续的数字时，不能用 for 循环来遍历数组。这是就要使用特殊的 for 循环。

格式： （ for （ item in arrayname) {

print arrayname[item]

}

}



用字符串作为数组下标

数组下表可以由包含单个字符或字符串的变量组成，如果是字符串，就必须用双引号括起来。



用字段的值作为数组下标

例 18 ：

long@long-Ubuntu:~$ cat datafile1

4234 Tom	43

4567 Arch	45

2008 Eliza	65

4571 Tom	22

3298 Eliza	21

4622 Tom	53

2345 Mary	24

long@long-Ubuntu:~$ awk '{count[$2]++}END{for(name in count)print name, / count[name]}' dataf ile1

Arch 1

Tom 3

Eliza 2

Mary 1

统计文件中某个字段出现的次数



数组与函数

awk 的内置函数 split 能够将字符串拆分为 词，然后保存在数组中。

格式： split （字符串，数组，字段分隔符）

split （字符串，数组）

awk 的内置函数 delete 用于删除数组元素



多维数组

awk 定义多为数组 的方法是把多个下标串成字符串，下标之间用内置变量 SUBSEP 的值分隔。变量 SUBSEP 的值默认为“ /034” ，这是个不可打印的字符，不太可能用作下标中的字符。

例 19 ：

long@long-Ubuntu:~$ cat datafile2

1 2 3 4 5

2 3 4 5 6

3 4 5 6 7

6 7 8 9 10

long@long-Ubuntu:~$ awk '{nf=NF

for(x=1; x<=NF; x++){

matrix[NR,x] = $x

}

}END{

for(x=1;x<=NR;x++){

for(y=1;y<=nf;y++)

printf "%d/t", matrix[x,y]

printf "/n"

}

}' datafile2

1	2	3	4	5

2	3	4	5	6

3	4	5	6	7

6	7	8	9	10



22. 处理命令行参数

awk 可以从内置数组 ARGV 中得到命令行参数，其中包括命令 awk 。但所有传递给 awk 的选项不再其中。 ARGV 数组下标从 0 开始。 ARGC 是一个包含命令行参数个数的内置变量。



23.awk 的内置函数

字符串函数

sub 函数匹配记录中最大、最靠左边的子字符串的正则表达式，并用替换字符串替换这些字符串。如果没有指定目标字符串就默认使用整个记录。替换只发生在第一次匹配的时候。

格式： sub (regular expression, substitution string):

sub (regular expression, substitution string, target string)

例 20 ：

$ awk '{ sub(/test/, "mytest"); print }' testfile

$ awk '{ sub(/test/, "mytest"); $1}; print }' testfile

第一个例子在整个记录中匹配，替换只发生在第一次匹配发生的时候

第二个例子在整个记录的第一个域中进行匹配，替换只发生在第一次匹配发生的时候。

gsub 函数作用如 sub ，但它在整个文档中进行匹配。

格式： gsub (regular expression, substitution string)

gsub (regular expression, substitution string, target string)



index 函数返回子字符串第一次被匹配的位置，偏移量从位置 1 开始。

格式： index(string, substring)



length 函数返回记录的字符数，若未指定参数，则 length 函数返回记录中的字符个数

格式： length( string )

length



substr 函数返回从字符串指定位置开始的子字符串，如果指定长度超过实际长度，就返回其实际内容。

格式： substr( string, starting position )

substr( string, starting position, 子串长度 )



match 函数返回在字符串中正则表达式位置的索引，如果找不到指定的正则表达式则返回 0 。 match 函数把内置变量 RSTART 设为子串在字符串中的起始位置， RLENGTH 为则设为子串的长度。这些变量可以被 substr 函数用来提取相应模式的子串。

格式： match( string, regular expression )

例 21 ：

$ awk '{start=match("this is a test",/[a-z]+$/); print start}' filename

$ awk '{start=match("this is a test",/[a-z]+$/); print start, RSTART, RLENGTH }'/ filename

第一个实例打印以连续小写字符结尾的开始位置，这里是 11 。

第二个实例还打印 RSTART 和 RLENGTH 变量，这里是 11(start) ， 11(RSTART) ， 4(RLENGTH) 。



toupper 和 tolower 函数可用于字符串大小间的转换，该功能只在 gawk 中有效。

格式： toupper( string )

tolower( string )



split 函数可按给定的分隔符把字符串分割为一个数组。如果分隔符没提供，则按当前 FS 值进行分割。

格式： split( string, array, field separator )

split( string, array )

例 22 ：

$ awk '{ split( "20:18:00", time, ":" ); print time[2] }' filename

把时间按冒号分割到 time 数组内，并显示第二个数组元素 18 。



sprintf 函数 返回一个指定格式的表达式。可以在 sprintf 函数中使用 printf 函数的格式规范

格式： variable=sprintf(“ 含有格式说明的字符串” , 表达式 1, 表达式 2 ， .., 表达式 n)





内置算术函数

int(x)

returns nearest integer to x, located between x and zero and truncated toward zero.

sqrt(x)

returns the positive square root of x. gawk reports an error if x is negative.

exp(x)

returns the exponential of x (e ^ x) or reports an error if x is out of range.

log(x)

returns the natural logarithm of x, if x is positive; otherwise, it reports an error.

sin(x)

returns the sine of x, with x in radians.

cos(x)

returns the cosine of x, with x in radians.

atan2(y, x)

returns the arctangent of y / x in radians.

rand()

returns a random number ， uniformly distributed between zero and one （ 0<=value<1 ）

srand （ x)

function srand sets the seed, for generating random numbers to the value x



时间函数

systime 函数返回从 1970 年 1 月 1 日开始到当前时间 ( 不计闰年 ) 的整秒数。

格式： systime()



strftime 函数使用 C 库中的 strftime 函数格式化时间。

日期和时间格式说明符

格式 描述

%a	星期几的缩写 (Sun)

%A	星期几的完整写法 (Sunday)

%b	月名的缩写 (Oct)

%B	月名的完整写法 (October)

%c	本地日期和时间

%d	十进制日期

%D	日期 08/20/99

%e	日期，如果只有一位会补上一个空格

%H	用十进制表示 24 小时格式的小时

%I	用十进制表示 12 小时格式的小时

%j	从 1 月 1 日起一年中的第几天

%m	十进制表示的月份

%M	十进制表示的分钟

%p	12 小时表示法 (AM/PM)

%S	十进制表示的秒

%U	十进制表示的一年中的第几个星期 ( 星期天作为一个星期的开始 )

%w	十进制表示的星期几 ( 星期天是 0)

%W	十进制表示的一年中的第几个星期 ( 星期一作为一个星期的开始 )

%x	重新设置本地日期 (08/20/99)

%X	重新设置本地时间 (12 ： 00 ： 00)

%y	两位数字表示的年 (99)

%Y	当前月份

%Z	时区 (PDT)

%%	百分号 (%)

格式： strftime( [format specification][,timestamp] )



24. 用户自定义函数

脚本中凡是可以出现模式操作规则的位置都可以放置用户自定义的函数。

格式： 函数名 ( 参数 , 参数 , 参数 , ...){

语句

return 表达式

( 注： return 语句和表达式都是可选项 )

}

变量以参数值的方式传递，且仅在使用它的函数中局部有效。函数使用的只是变量的副本。数组则通过地址或引用被传递，因此，可以在函数中直接修改数组的元素。函数中的变量只要不是从参数列表传来的，都视为全局变量。调用函数时，如果没有指定某个形参的值，该参数被初始化为空。

例 23 ：

long@long-Ubuntu:~$ cat grades

44 55 66 22 77 99

100 22 77 99 33 66

55 66 100 99 88 45

long@long-Ubuntu:~$ cat sorter.sc

#Scriptname: sorter

#It sorts numbers in ascending order

function sort(scores, num_elements, temp, i, j){

#temp,i,j will be local and private

#with an initial value of null

for(i=2; i<=num_elements; ++i){

for(j=i; scores[j-1]>scores[j]; --j){

temp = scores[j]

scores[j] = scores[j-1]

scores[j-1] = temp

}

}

}

{for (i=1; i<=NF; i++)

grades[i] = $i


sort(grades,NF)

for(j=1;j<NF;++j)

printf("%d ", grades[j])

printf("/n")

}

long@long-Ubuntu:~$ awk -f sorter.sc grades

22 44 55 66 77

22 33 66 77 99

45 55 66 88 99



25. 杂项

固定字段

有些数据没有明显的字段分隔符，却有固定宽度的列。预处理这些数据时， substr 很有用

空字段

用固定长度的字段来存储数据，就可能出现一些空字段， substr 可以被用来保存字段，而不考虑它们是否包含数据





26.awk 命令选项

-F fs or --field-separator fs

指定输入文件折分隔符， fs 是一个字符串或者是一个正则表达式，如 -F: 。

-v var=value or --asign var=value

赋值一个用户定义变量。

-f scripfile or --file scriptfile

从脚本文件中读取 awk 命令。

-mf nnn and -mr nnn

对 nnn 值设置内在限制， -mf 选项限制分配给 nnn 的最大块数目； -mr 选项限制记录的最大数目。这两个功能是 Bell 实验室版 awk 的扩展功能，在标准 awk 中不适用。

-W compact or --compat, -W traditional or --traditional

在兼容模式下运行 awk 。所以 gawk 的行为和标准的 awk 完全一样，所有的 awk 扩展都被忽略。

-W copyleft or --copyleft, -W copyright or --copyright

打印简短的版权信息。

-W help or --help, -W usage or --usage

打印全部 awk 选项和每个选项的简短说明。

-W lint or --lint

打印不能向传统 unix 平台移植的结构的警告。

-W lint-old or --lint-old

打印关于不能向传统 unix 平台移植的结构的警告。

-W posix

打开兼容模式。但有以下限制，不识别： /x 、函数关键字、 func 、换码序列以及当 fs 是一个空格时，将新行作为一个域分隔符；操作符 ** 和 **= 不能代替 ^ 和 ^= ； fflush 无效。

-W re-interval or --re-inerval

允许间隔正则表达式的使用，参考 (grep 中的 Posix 字符类 ) ，如括号表达式 [[:alpha:]] 。

-W source program-text or --source program-text

使用 program-text 作为源代码，可与 -f 命令混用。

-W version or --version

打印 bug 报告信息的版本。