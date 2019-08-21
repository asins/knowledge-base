### 1. 安装

```
brew install httrack
```

### 2. 运行(以下命令行操作)

```
#httrack
```

> Welcome to HTTrack Website Copier (Offline Browser) 3.48-21
> Copyright (C) 1998-2015 Xavier Roche and other contributors
> To see the option list, enter a blank line or try httrack –help
> Enter project name :

**//输入项目名称，程序会自动生成一个项目名称的目录**

> Base path (return=/root/websites/) :

**//本地保存路径及目录，请输入一个本地的路径.ps保存在当前路径下**

> Enter URLs (separated by commas or blank spaces) :

**//欲抓取的网站地址**

> Action:
> (enter) 1 Mirror Web Site(s)
> 2 Mirror Web Site(s) with Wizard
> 3 Just Get Files Indicated
> 4 Mirror ALL links in URLs (Multiple Mirror)
> 5 Test Links In URLs (Bookmark Test)
> 0 Quit

**//抓取模式选项，选项汉化过来的意思是**

> 行动：
> (进入)1镜像网站(的) 
> 2镜像网站(S)与向导 
> 3把文件显示
> 4镜在URL中所有的链接(多镜)
> 5在URL链接(书签测试)的测试
> 0退出

**//这里我选择2**

> Proxy (return=none) :

**//是否使用代理,我没有用代理，直接回车.**

> You can define wildcards, like: -*.gif www.*.com/*.zip -*img_*.zip
> Wildcards (return=none) :

**//使用通配符下载，我直接回车**

> You can define additional options, such as recurse level (-r), separed by blank spaces
> To see the option list, type help
> Additional options (return=none) :

**//抓取选项，输入help可以查阅详细参数，这里我直接回车**

> —> Wizard command line: httrack https://www.dnspod.cn/ -W -O “/home/RucLinux/DNSPod” -%v
> Ready to launch the mirror? (Y/n) :

**//输入 Y 回车**

> WARNING! You are running this program as root!
> It might be a good idea to use the -%U option to change the userid:
> Example: -%U smith
> Mirror launched on Mon, 04 Mar 2013 02:35:02 by HTTrack Website Copier/3.46 libhtsjava.so.2 [XR&CO’2010]
> mirroring https://www.dnspod.cn/ with the wizard help..
> Done.
> Thanks for using HTTrack!

**//完成！**