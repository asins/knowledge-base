+++
title = "MacBook Pro配置 2019"
template = "page.html"
date = "2022-03-04"
updated = "2022-03-04"
+++

## 系统配置

### 网络

```bash
# 查看 dns 解析情况
ding @223.5.5.5 +tcp google.com
```

- 高级... > DNS ：公共 DNS 是必须添加的
  - 223.5.5.5 阿里的
  - 8.8.8.8  google 的
  - 180.76.76.76 百度的

## 终端配置

### 创建 SSH 密钥

```sh
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

创建好后在登录`github`等平台时可以做到免登。

### 让系统支持任何来源的软件

```sh
sudo spctl --master-disable
```

### 更新软件内文件签名 

打开软件时会提示`“XX”将对您的电脑造成伤害。您应该将它移到废纸箱。` 

```sh
sudo codesign --force --deep --sign - /软件/路径/
```

### MacOS 10.15提示文件损坏

```sh
sudo xattr -rd com.apple.quarantine /Applications/xxxxxx.app
# 将上面的 xxxxxx.app 换成你的App名称
```


### 下载个人 dotfiles

```sh
mkdir ~/Code
git clone git@github.com:asins/dotfiles.git ~/Code/dotfiles
```

### 安装 brew

命令行包管理工具，安装方法也很简单，直接在终端中运行以下代码就行

```sh
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

| 命令                | 功能说明                                 |
| ------------------- | ---------------------------------------- |
| brew search wget    | 查找软件包                               |
| brew install wget   | 安装软件包                               |
| brew list           | 列出已安装的软件包                       |
| brew remove wget    | 删除软件包                               |
| brew info wget      | 查看软件包信息                           |
| brew deps wget      | 列出软件包的依赖关系                     |
| brew update         | 更新 brew                                 |
| brew outdated       | 列出过时的软件包（已安装但不是最新版本） |
| brew upgrade [wget] | 全部或指定更新过时的软件包               |

上面代码可能无法正常执行，我们生活在大陆的可能无法访问`raw.githubusercontent.com` 的情况，可将下面一行写入`/etc/hosts`文件中：

```bash
# 电脑解析不了域名时加入
199.232.68.133  raw.githubusercontent.com
```

####  brew services

使用 Homebrew 管理 Mac 的后台服务

```bash
brew tap homebrew/services
```

#### brew cask

通过 brew cask 安装软件，管理起来感觉更方便。

```sh
brew install cask

# 安装最新的 chrome 浏览器
brew install google-chrome
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



### git

系统自带的git软件执行`git status`时中文显示成八进制的字符编码，解决办法将git 配置文件 `core.quotepath`项设置为false。

```bash
git config --global core.quotepath false
```

git的一些设置：

```bash
ln -sfv ~/Code/dotfiles/.gitignore ~/.gitignore
ln -sfv ~/Code/dotfiles/.gitconfig ~/.gitconfig
```

### nginx

```sh
# 安装
brew install nginx

# 配置直接使用 Dotfiles 中定义的
ln -sfv ~/Code/dotfiles/nginx/nginx.conf /usr/local/etc/nginx/nginx.conf
sudo mkdir /var/log/nginx
sudo chmod 777 /var/log/nginx

# nginx出现403 forbidden的解决方法：nginx.conf头部的user改成 user root owner 
user root owner 

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

| 命令                           | 功能说明      |
| ------------------------------ | ------------- |
| sudo brew services start nginx | 启动 nginx 服务 |
| sudo brew services stop nginx  | 关闭 nginx 服务 |
| nginx -v                       | 查看 nginx 版本 |
| nginx -s reload                | 重新加载 nginx |
| nginx -s stop                  | 停止 nginx     |

### ~~polipo~~

polipo 是一个 Web proxy，用于将 sockets5 服务转换为 http 服务。

Update 2021-02-20: 因为使用了 

```sh
sudo mkdir /var/log/polipo
sudo chmod 777 /var/log/polipo

vim /usr/local/Cellar/polipo/1.1.1/homebrew.mxcl.polipo.plist
```

在文件中添加设置`socksParentProxy`，变成如下样子：

```xml 
# file: /usr/local/Cellar/polipo/1.1.1/homebrew.mxcl.polipo.plist
<array>
  <string>/usr/local/opt/polipo/bin/polipo</string>
  <string>socksParentProxy=localhost:1080</string>
</array>
```

### ripgrep

命令行快速搜索工具

```sh
# 安装
brew install ripgrep
```

### mariadb

Mysq 数据库的开源版本，不再受公司限制。

### Alacritty

**shell 快捷键 - 光标移动和编辑：**

- `C-a` 光标回到行首, `C-e` 光标回到行尾
- `C-f` 光标向前移动一个字符，`C-b` 光标向后移动一个字符
- `Alt-f` 光标向前移动一个单词, `Alt-b` 光标向后移动一个单词
- `C-k` 清掉光标后面的部分, `C-d` 删掉光标后的一个字符 或 退出
- `C-l` 相当于 `clear` 命令，清屏

**shell 快捷键 - 回翻历史命令：**

- `C-p` 向上翻历史命令， `C-n` 向下翻历史命令
- `C-r` 向上搜索历史命令 (顺手推荐搜索命令历史的增强工具 [fzf](https://github.com/junegunn/fzf))

**shell 快捷键 - 进程挂起：**

- `C-z` 挂起当前进程到后台
- `fg` 以恢复到前台

### fish

fish 是个全新的 shell 工具，比 bash 之类有更好的交互提示，比 zsh 有更好的性能，缺点是语法不是标准的 sh，但 shell 脚本用的不多，我愿意接受这个。

```sh
# 安装 fish
brew install fish
# 将 fish 添加到 mac shell 列表中
sudo bash -c "echo '/usr/local/bin/fish' >> /etc/shells"
# 将 fish 设置为默认 shell
chsh -s /usr/local/bin/fish
# 安装极简命令行提示符
brew install starship
bash -c "starship init fish | source" >> ~/.config/fish/config.fish

# 安装 fish 包管理器
curl -sL https://git.io/fisher | source && fisher install jorgebucaran/fisher

# 快速跳转到其它目录
fisher install jethrokuan/z
# 很不错的主题（2022-10-22：改用starship）
# fisher install IlanCosman/tide@v5
```

### google-chrome
google 浏览器

```bash
# 因为软件更新交给 brew cask 了，所以 chrome 的更新检测不需要了，也避免恶意数据收集风险，所以关掉
defaults write com.google.Keystone.Agent checkInterval 0

#  google 从什么时候开始就强制要请求服务器更新软件了，
sudo touch /Library/Google/GoogleSoftwareUpdate && sudo chown -R root:wheel /Library/Google/GoogleSoftwareUpdate
sudo touch ~/Library/Google/GoogleSoftwareUpdate && sudo chown -R root:wheel ~/Library/Google/GoogleSoftwareUpdate
```

### google-chrome-canary
google 开发者浏览器，新特性首发地

### firefox-developer-edition
Firefox 开发者浏览器，chrome 一家独大也是危险的

### enpass
密码管理工具

### clipy
剪贴板扩展工具

### charles
Http 代理工具

### java
java 运行环境，因为项目要求只能安装 java8 的版本，需要以下面的方式安装：

** jdk8 **

```sh
brew install homebrew/cask-versions/adoptopenjdk8
# java运行环境变量
set -gx JAVA_HOME (/usr/libexec/java_home -F)
set -gx TOMCAT_HOME "/usr/local/opt/tomcat@7/libexec"
set -gx PATH $PATH $TOMCAT_HOME/bin
```

** java最新 **

```bash
set -g fish_user_paths "/usr/local/opt/openjdk/bin" $fish_user_paths
set -gx CPPFLAGS "-I/usr/local/opt/openjdk/include"
```


### qingg
五笔输入法

### typora
MarkDown 语法的免费笔记记录工具

### shadowsocksx
这个不能说

### sublime-text
编辑器

### iterm2
shell 客户端，以下是分屏常用快捷键：

- `command + t`：新建窗口
- `command + d`：垂直分屏，
- `command + shift + d`：水平分屏。
- `command + ]` 和 `command + [` : 在最近使用的分屏直接切换.
- `command + alt + 方向键`：切换到指定位置的分屏。
- `command + 数字`：切换标签页。
- `command + 方向键`：按方向切换标签页。
- `command + shift + s`：保存当前窗口快照。
- `command + alt + b`：快照回放。很有意思的功能，你可以对你的操作根据时间轴进行回放。可以拖动下方的时间轴，也可以按左右方向键
- `Command + Shift + h` 呼出粘贴历史

### ~~yyets~~
人人影视客户端，已经不玩了。

### imageoptim
图片无损压缩工具

### nodejs

服务端 JS 运行环境

### macvim

### vscode

这个软件更新频率挺高，brew 安装反而慢了，直接安装了。



通过 brew 安装的命令行软件：

```bash
fish  mariadb  node  polipo  macvim  nginx  ripgrep
```



通过`brew cask`安装的软件

```bash
adoptopenjdk8              google-chrome              pomotodo
appcleaner                 google-chrome-canary       qingg
charles                    handbrake                  qq
clipy                      iina                       shadowsocksx
enpass                     imageoptim                 sublime-text
eudic                      iterm2                     switchhosts
firefox-developer-edition  neteasemusic               typora
```

