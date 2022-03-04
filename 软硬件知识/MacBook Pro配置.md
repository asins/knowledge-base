+++
title = "MacBook Pro配置"
template = "page.html"
date = "2019-08-21"
updated = "2020-05-05"
+++




昨天收到了公司给新配的 MacBook Pro，频幕感觉很细腻，但触摸板前端边缘为啥那么割手啊！

别的不说了，记录下系统配置。

## 系统偏好配置

### 触控板

- ~~光标与点按 > **三指移动**  ：这样就可以三指拖动文件了~~。 新版的 Macbook 将这个功能移动到 辅助功能 > 鼠标与触控板 > 触控板选项... 中，勾选启动拖移三指拖移就可以了。
- 光标与点按 > **轻拍来点按**  ：习惯了轻点完成实际按击
- 光标与点按 > **跟踪速度**  ：默认的指针滑动速度有点慢，设置成刻度 7 差不多了

### 键盘

- 快捷键 > 服务 > **新建位于文件夹位置的终端标签**  ：勾选这设置并设置了快捷键（control+cmt+c），以后在 Finder 中选择一个目录按下快捷键就可以打开终端并来到当前当前目录，功能很实用啊。熟悉后这个功能已经很少用了。
  **注意**：在 Finder 中文件列表使用`分栏方式`显示时快捷键是无效的。

### 网络

```bash
# 查看 dns 解析情况
ding @223.5.5.5 +tcp google.com
```

- 高级... > DNS ：公共 DNS 是必须添加的
  - 223.5.5.5 阿里的
  - 8.8.8.8  google 的
  - 180.76.76.76 百度的

### 其它

- 显示 `系统偏好设置 -> 安全性与隐私 -> 任何来源` 选项：

  ```bash
  sudo spctl --master-disable
  ```

## 终端环境

**支持高亮：**

```sh
# ~/.bash_profile

# shell 高亮
export CLICOLOR=1
# 自定义提示符及高亮
export PS1="[[\e[0;31m\][u@\h\[\e[0;33m\]:[[\e[1;34m\][w \[\e[1;37m\]$ \[\e[m\]"
```

有更多人使用`Coreutils`来达到更炫的效果，我还是觉得够用就行就没有安装了，呵呵！

**Update 2014-06-25**: 今天试用了下 zsh 彻底喜欢上了，呵呵，安装方法同样简单

```sh
curl -L http://install.ohmyz.sh | sh
```

使用上默认加了很多快捷映射，如：

- `~`: 进入用户根目录，可以少打`cd `三个字符了
- `l`: 相当于`ls -lah`
- `..`: 返回上层目录
- `...`: 返回上上层目录
- `-`: 打开上次所在目录

zsh 还默认支持在 Git 目录下显示分支名、是否有修改等信息，很是强大啊！

我的`.zshrc`配置

```bash
ZSH_THEME="muse"
plugins=(git brew npm node osx sublime autojump)

export PATH="/usr/local/bin:/usr/bin:/bin"
export PATH="/usr/local/sbin:/usr/sbin:/sbin:$PATH"

# brew cask 安装的软件放入软件目录
export HOMEBREW_CASK_OPTS="--appdir=/Applications --caskroom=/usr/local/Caskroom"

# Node 全局目录
export NODE_Path=/usr/local/lib/node_modules

# Java/maven/tomcat 环境配置
export JAVA_HOME="/Library/Java/JavaVirtualMachines/jdk1.7.0_80.jdk/Contents/Home"
export M2_HOME="/usr/local/Cellar/maven/3.3.9/libexec"
export TOMCAT_HOME="/usr/local/Cellar/tomcat/7.0.70/libexec"
export PATH=$TOMCAT_HOME/bin:$M2_HOME/bin:$PATH
```

**Update 2017-11-14**：改使用 [fish](https://fishshell.com/) 有一年了很省心，zsh 时常更新然后导致不能使用有些烦了。

```sh
# 安装 fish
brew install fish
# 安装 fish 包管理器
curl -sLo ~/.config/fish/functions/fisher.fish --create-dirs git.io/fisherman
# 将 fish 添加到 mac shell 列表中
sudo bash -c "echo '/usr/local/bin/fish' >> /etc/shells"
# 将 fish 设置为默认 shell（不推荐）
# chsh -s /usr/local/bin/fish
```

## 翻译软件

以及使用的是有道的工具，但还是觉得不方便，今天特意查了下 Mac 自带的词典程序（Dictionary）的使用方法，发现自带的中文词库不够强。

添加第三方语库需要使用工具 DictUnifier，将需要转换入 Dictionary 的词典包拖入窗口中，比如“stardict-langdao-ce-gb-2.4.2.tar.bz2”，请你用足够的耐心等待它转换吧。

附上 [词典转换工具][2] 以及[词典包][3] 的下载地址（2014-06-24 测试可用）。

配上系统的三指轻按查找功能真是很不错的感觉，呵呵。

**Update 2017-04-14**: 走淘宝入手了个欧路词典 Key，一切都那么自然了，投入也就 1.5 元，何苦要花几个小时生成字典，还要忍受翻译无结果的痛苦呢。

## 开发环境配置

### Xcode

  这是开发人员必装的，直接到 App Store 中就可以安装

### brew

命令行包管理工具，安装方法也很简单，直接在终端中运行以下代码就行

```sh
/usr/bin/ruby -e "$(curl -fsSL     https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

| 命令                  | 功能说明                 |
| ------------------- | -------------------- |
| brew search wget    | 查找软件包                |
| brew install wget   | 安装软件包                |
| brew list           | 列出已安装的软件包            |
| brew remove wget    | 删除软件包                |
| brew info wget      | 查看软件包信息              |
| brew deps wget      | 列出软件包的依赖关系           |
| brew update         | 更新 brew               |
| brew outdated       | 列出过时的软件包（已安装但不是最新版本） |
| brew upgrade [wget] | 全部或指定更新过时的软件包        |

> 定义快速更新所有软件的命令：
> alies bubu="brew update & brew outdated & brew upgrade & brew cleanup"

#### brew cask

通过 brew cask 安装软件，管理起来感觉更方便。

```sh
brew tap caskroom/cask
# 安装最新的 chrome 浏览器
brew cask install google-chrome
#安装 Java
brew install java
```

如果需要安装特定版本的软件刚需要加版本库

```sh
brew tap caskroom/versions
brew tap homebrew/versions
```

自动更新`brew cask`安装的软件

```sh
brew tap buo/cask-upgrade

# 以后执行以下命令就可以更新所有软件
brew cu -facy
```



### NodeJs

~~服务端 JS 运行环境，直接到[官网下载][4] 安装就成~~，通过 brew 安装了，以后安装软件再也不用 sudo 了，呵呵！

```sh
 brew install node
```

### nginx

| 命令                             | 功能说明      |
| ------------------------------ | --------- |
| sudo brew install nginx        | 安装 nginx   |
| sudo brew services start nginx | 启动 nginx 服务 |
| sudo brew services stop nginx  | 关闭 nginx 服务 |
| nginx -v                       | 查看 nginx 版本 |
| nginx -s reload                | 重新加载 nginx |
| nginx -s stop                  | 停止 nginx   |

```sh
# 修改配置，默认端口为 8080，改成 80
sudo vim /usr/local/etc/nginx/nginx.conf

# 加管理员权限
sudo chown root:wheel /usr/local/opt/nginx/bin/nginx
sudo chmod u+s /usr/local/opt/nginx/bin/nginx

# 加入 launchctl 启动控制
mkdir -p ~/Library/LaunchAgents
cp /usr/local/opt/nginx/homebrew.mxcl.nginx.plist ~/Library/LaunchAgents/
launchctl load -w ~/Library/LaunchAgents/homebrew.mxcl.nginx.plist

sudo nginx #打开 nginx
nginx -s reload|reopen|stop|quit  #重新加载配置|重启|停止|退出 nginx
nginx -t   #测试配置是否有语法错误
```

### ~~apache~~ 改使用`nginx`

这配置可以看[这里][5]，写得已经很细很好了，我简单的记录下：

```sh
## sudo vi /etc/apache2/httpd.conf

## 去掉这行前端的井号，用于支持 php
#LoadModule php5_module libexec/apache2/libphp5.so

## 在<IfModule alias_module></IfModule>里面加入形如以下代码
## 以支持另外目录，这样 localhost/work 就能访问其它目录了
Alias /work "/Users/asins/Work"
<Directory "/Users/asins/tudou">
  Options Indexes MultiViews
  AllowOverride All
  Order allow,deny
  Allow from all
</Directory>

## 然后重启 apache
## sudo apachectl restart
```

因为改用 nginx，所以删除掉，记录下删除方法：

```sh
sudo apachectl stop  #关闭 apache，如果事先没开启过，可以忽略报错信息

# 如果你的 apache 已经加入了 launchctl，使用下面的命令来关闭：
sudo launchctl unload -w /System/Library/LaunchDaemons/org.apache.httpd.plist
sudo rm /usr/sbin/apachectl
sudo rm /usr/sbin/httpd
sudo rm -r /etc/apache2/
# 删除自带的 PHP
sudo rm -r /usr/bin/php
```

### MySql

mysql 的安装直接通过`brew`更方便噢

```sh
brew install mysql

## 启动 mysql
mysql -v
或者
mysql.server start
使用 \q 可以退出 mysql 模式

## 登录 mysql
  mysql -uroot

# 加入到 launchd 后以服务的形式启动
ln -sfv /usr/local/opt/mysql/*.plist ~/Library/LaunchAgents

launchctl load ~/Library/LaunchAgents/homebrew.mxcl.mysql.plist
# 或者
mysql.server start

# 修复 2002 MySQL Socket 错误，[详细可看这里][6]
mysqld stop
touch /tmp/mysql.sock

```

这样`mysql -u root`就不会报错了

### 升级 svn 版本

#### 安装
brew install svn

#### 配置
因为安装默认是在`/usr/local/bin`目录下，所以一般使用时是无法使用到最新版本的，这需要修改下环 境变量
在 `~/.zshrc` 文件中修改 export 行，让 `/usr/local/bin` 目录在 `/usr/bin` 之前就可以了。

如果使用的不是 zsh shell，可打开 `~/.bash_prefile` 文件并加入
```
export PATH=/usr/local/bin:/usr/bin:$PATH
```

## 常用软件

### Vim

神一样的文本编辑工具

  通过 brew 安装遇到遇到总是详细[看这里][7]。

```sh
  brew install macvim --widthout-cscope --with-luajit --override-system-vim --custom-icons

  ## 安装时如果遇到问题执行下下面的命令基本上能解决
  brew update
  brew doctor
  brew gist-logs --config --doctor macvim

  ## 在终端中也使用 mvim，在`.zshrc`文件中加一行就成（如果没有使用 zsh shell，可以在`.bash_prefile`中加入）
  alias vim='mvim -v'
```

### Sublime Text

另一个文本编辑工具，开发绝不是一个人的事，呵呵！设置代理，大家都懂的：

```sh
# 打开 Preferences > Package Settings > Package Control > Settings - User 菜单
# 编辑 Package Control.sublime-settings，添加两行：
"http_proxy": "http://127.0.0.1:8123",
"https_proxy": "http://127.0.0.1:8123"
```

### ~~RapidSVN~~ 用回 Cornerstone

~~一个相当小巧的 SVN 图形工具，在 Win 时就使用它习惯了，不过官方的最后一个版本无法在在最新的系统中运行噢，但在 github 中还能找到更新的人，下载[点这里][8]。`Cornerstone`这 SVN 工具可能是很多人在 Mac 下的首选吧，但有不习惯，呵呵！~~

  ** 用回 Cornerstone **，省心

### Beyond Compare

文件比较工具，同样 Win 下就习惯了这工具，试用`Kaleidoscope`一周后还是没法忍受，功能弱爆了！好在 Beyond Compare for Mac 版本发布了，感觉很爽啊！

### ~~Transmit~~

ftp/sftp 工具，还是很不错的，UI 也很棒。不过也推荐下`FileZilla`，也是相当不错的，但 UI 是该颠覆下了。

  ** 改用 ExpanDrive **：像本地目录一样使用 FTP，体验更佳。

### Chrome

不解释

### Chrome Canary

开发用的浏览器，里面有很多最新的特性，版本每周更新所以不太稳定，但对于前端开发人员来说是需要的。

### BetterZip

压缩 / 解压缩工具，挺好用的。

### 有道云笔记

如名字，用于记录些笔记，同步也方便，但 UI 在 Mac 下融入度感觉不够噢！

### AppCleaner

功能如其名，删除运用时就靠它了！

### Synergy

共用鼠标 / 键盘工具，虽然转向 Mac 了，但一台 Windows 的电脑还是必备的，有了这软件不用移开双手就可以控制多台电脑了，还跨系统噢！

### ImageOptim

小东西，可以无损压缩图片，gif/jpg/png 格式都支持难得啊！

### ShadowsocksX

对现在 google 都打不开的时代，怎么可能少得了这种软件？使用`brew cask install shadowsocksx`安装方便

### polipo

将 Shadowsocks 的 socks5 协议转为 http，这样在不支持 socks5 的命令里也能方便的代理了。

```
polipo socksParentProxy=localhost:1080
# 推荐放到后台运行
nohup polipo socksParentProxy=localhost:1080 > /tmp/polipo.log &
```

### ~~iChm~~

自从使用 Dash 后，对 Chm 需求不大了
查看 chm 格式的小软件，毕竟我是从 Win 转过来的少不了 chm 格式的文档噢！听说 Mac 下有更好的方式，听说...。

### Dash

MacOs 下最好的文档查看软件了，文档也相当的多，但就是中文文档几乎没有。

### QQ

这个还能少吗？不能！

### Office 365

Mac 自带的 Pages/Numbers/Keynote 还行，但公司更多人用的是微软的，Microsoft 系列的不得不装！在淘宝上花 10 元加了个可用的邮箱。

### Adobe 系列

对我来说只会用到 Photoshop、Illustrator 这两个。

### 清歌五笔输入法

第一个让我甘愿捐钱的软件。各种输入法都尝试了，还是觉得这个好用些，字库相应速度飞快。

[1]: https://github.com/robbyrussell/oh-my-zsh/blob/master/lib/aliases.zsh
[2]: http://code.google.com/p/mac-dictionary-kit/downloads/list
[3]: http://abloz.com/huzheng/stardict-dic/zh_CN/
[4]: http://nodejs.org/	"node 官方网站"
[5]: http://note.rpsh.net/posts/2013/11/27/osx-10-9-apache-server-php-mysql
[6]: http://stackoverflow.com/questions/4788381/getting-cant-connect-through-socket-tmp-mysql-when-installing-mysql-on-m?answertab=votes#tab-top
[7]: https://github.com/Homebrew/homebrew/wiki/troubleshooting
[8]: https://github.com/hnakamur/RapidSVN-IntelMac/
