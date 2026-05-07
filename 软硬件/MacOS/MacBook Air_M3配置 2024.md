## 系统配置

### DNS

```bash
# 查看 dns 解析情况
ding @223.5.5.5 +tcp google.com
```

高级... > DNS ：公共 DNS 是必须添加的
- 223.5.5.5 阿里的
- 8.8.8.8  google 的
- 180.76.76.76 百度的
  
### 翻墙
我是花百来块使用着一个飞机场，本机使用`ClashX` 珍藏版，通过订阅来更新机器信息，不细说了，各显神通吧～。

### 创建 SSH 密钥

```sh
# 优先推荐采用 Ed25519 算法生成Key
ssh-keygen -t ed25519 -C "your_email@example.com"

# 不再推荐
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

创建好后在登录`github`等平台时可以做到免登，[参考文档](https://docs.github.com/zh/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)。

### 更新软件签名 

打开软件时会提示`“XX”将对您的电脑造成伤害。您应该将它移到废纸箱。` 

```sh
sudo codesign --force --deep --sign - /软件/路径/
```

### 提示文件损坏

```sh
sudo xattr -rd com.apple.quarantine /Applications/xxxxxx.app
# 将上面的 xxxxxx.app 换成你的App名称
```

## 软件安装及配置

为了方便安装与管理终端中使用的软件和配置信息，在github中创建了自己的 [dotfiles]( https://github.com/asins/dotfiles) 项目，克隆项目后执行项目中的`install.sh`脚本就可以开始安装。

```sh
git clone git@github.com:asins/dotfiles.git ~/Development/dotfiles
# 进入项目目录，并为文件做软连接
cd ~/Development/dotfiles/
./install.sh
```

### 终端软件

#### brew

这软件没啥说的，用MacOS的都知道是什么。需要说明的是我追加了一个tap：`  brew tap buo/cask-upgrade`让brew可以通过命令更新已安装软件版本。

再在`fish`中追加了一个命令`~/.config/fish/functions/bubu.fish`文件，这样在fish的终端环境中执行`bubu`命令就可以快速更新brew以及已安装的所有软件了。

```fish
function bubu --description '更新brew及所有已安装软件'
    brew update
    brew outdated

    brew upgrade
    brew cleanup

    # brew cu -acy --cleanup # 不强制安装latest的软件
    brew cu -facy
end
```



| 软件名称 | 作用                           | 备注 |
| -------- | ------------------------------ | ---- |
| volta    | 管理NodeJs版本，可快速切换版本 |      |
| git      |                                |      |
| lazygit  | Git命令的简单终端用户界面      |      |
| macvim   |                                |      |
| nginx    | Http服务器                     |      |
| ripgrep  |                                |      |

### 系统软件

#### 清歌输入法

``` sh
brew install qingg
```

#### 鼠须管输入法

鼠须管 (squirrel)这输入法以前也接触过，总觉得是个半成本，配置啥的都不方便，这次就花了一些时间完成配置。按`Control + 0`可打开输入法选择面板。

```bash
brew install --cask squirrel

# 删除旧输入法配置
rm -rf ~/Library/Rime

# 克隆五笔配置放到 ~/Library/Rime
git clone https://github.com/asins/rime-wubi86-jidian ~/Code/rime-wubi86-jidian
ln -sfv ~/Code/rime-wubi86-jidian /Users/asins/Library/Rime
```
