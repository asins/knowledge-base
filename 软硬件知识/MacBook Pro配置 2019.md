---
title: "MackBack Pro配置2019"
date: "2020-04-07 20:51:21"
---

## 系统配置

### 网络

```bash
# 查看dns解析情况
ding @223.5.5.5 +tcp google.com
```

- 高级... > DNS ：公共DNS是必须添加的
  - 223.5.5.5 阿里的
  - 8.8.8.8  google的
  - 180.76.76.76 百度的

## 终端配置

### 创建SSH密钥

```sh
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

创建好后在登录`github`等平台时可以做到免登。

### 让系统支持任何来源的软件

```sh
sudo spctl --master-disable
```

### 更新软件内文件签名

```sh
sudo codesign --force --deep --sign - /软件/路径/
```

### 下载个人dotfiles

```sh
mkdir ~/Code
git clone git@github.com:asins/dotfiles.git ~/Code/dotfiles
```

### 安装brew

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
| brew update         | 更新brew                                 |
| brew outdated       | 列出过时的软件包（已安装但不是最新版本） |
| brew upgrade [wget] | 全部或指定更新过时的软件包               |



### 使用 Homebrew 管理 Mac 的后台服务

```bash
brew tap gapple/services
```





#### nginx

```sh
# 安装
brew install nginx

# 配置直接使用Dotfiles中定义的
ln -sfv /Users/asins/Code/dotfiles/nginx/nginx.conf /usr/local/etc/nginx/nginx.conf
sudo mkdir /var/log/nginx
sudo chmod 777 /var/log/nginx

# 加管理员权限
sudo chown root:wheel /usr/local/opt/nginx/bin/nginx
sudo chmod u+s /usr/local/opt/nginx/bin/nginx

# 加入launchctl启动控制
mkdir -p ~/Library/LaunchAgents
cp /usr/local/opt/nginx/homebrew.mxcl.nginx.plist ~/Library/LaunchAgents/
launchctl load -w ~/Library/LaunchAgents/homebrew.mxcl.nginx.plist

sudo nginx #打开 nginx
nginx -s reload|reopen|stop|quit  #重新加载配置|重启|停止|退出 nginx
nginx -t   #测试配置是否有语法错误
```


| 命令                           | 功能说明      |
| ------------------------------ | ------------- |
| sudo brew services start nginx | 启动nginx服务 |
| sudo brew services stop nginx  | 关闭nginx服务 |
| nginx -v                       | 查看nginx版本 |
| nginx -s reload                | 重新加载nginx |
| nginx -s stop                  | 停止nginx     |

#### polipo

polipo是一个Web proxy，用于将sockets5服务转换为http服务。

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

#### ripgrep

命令行快速搜索工具

```sh
# 安装
brew install ripgrep
```



#### mariadb

Mysq数据库的开源版本，不再受公司限制。

### brew cask

通过 brew cask 安装软件，管理起来感觉更方便。

```sh
brew tap caskroom/cask
# 安装最新的chrome浏览器
brew cask install google-chrome
#安装Java
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

#### fish

fish是个全新的shell工具，比bash之类有更好的交互提示，比zsh有更好的性能，缺点是语法不是标准的sh，但shell脚本用的不多，我愿意接受这个。

```sh
# 安装fish
brew install fish
# 将fish添加到mac shell列表中
sudo bash -c "echo '/usr/local/bin/fish' >> /etc/shells"
# 将fish设置为默认shell(不推荐)
# chsh -s /usr/local/bin/fish

# 安装fish包管理器
curl -Lo ~/.config/fish/functions/fisher.fish --create-dirs git.io/fisherman
# 安装fish的z插件
fisher install z
fisher install rafaelrinaldi/pure
```

#### google-chrome
google浏览器

```bash
# 因为软件更新交给brew cask了，所以chrome的更新检测不需要了，也避免恶意数据收集风险，所以关掉
defaults write com.google.Keystone.Agent checkInterval 0

#  google从什么时候开始就强制要请求服务器更新软件了，
sudo touch /Library/Google/GoogleSoftwareUpdate && sudo chown -R root:wheel /Library/Google/GoogleSoftwareUpdate
sudo touch ~/Library/Google/GoogleSoftwareUpdate && sudo chown -R root:wheel ~/Library/Google/GoogleSoftwareUpdate
```

#### google-chrome-canary
google开发者浏览器，新特性首发地

#### firefox-developer-edition
Firefox开发者浏览器，chrome一家独大也是危险的

#### enpass
密码管理工具

#### clipy
剪贴板扩展工具

#### charles
Http代理工具

#### java
java运行环境，因为项目要求只能安装java8的版本，需要以下面的方式安装：

```sh
brew cask install homebrew/cask-versions/adoptopenjdk8
```



#### qingg
五笔输入法

#### typora
MarkDown语法的免费笔记记录工具

#### shadowsocksx
这个不能说

#### sublime-text
编辑器

#### iterm2
shell客户端

#### yyets
人人影视客户端

#### imageoptim
图片无损压缩工具

#### nodejs

服务端JS运行环境

#### macvim

#### vscode

这个软件更新频率挺高，brew安装反而慢了，直接安装了。



通过brew安装的命令行软件：

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

