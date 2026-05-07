## 一、下载Window IOS文件

- 微软官方下载Window的[系统iso](https://www.microsoft.com/en-gb/software-download/windows10ISO)。

- 下载Tiny Win系统 [Tiny11 24H2](https://archive.org/details/tiny11-2409)

## 二、将U盘插入Mac

ISO 文件只有大约 5 GB，但我建议你使用至少有 16 GB 空间的 USB 驱动器，以防 Windows 在安装过程中需要更多空间。

## 系统文件写入U盘

打开终端，执行`diskutil list`找到U盘对应的硬符，如`/dev/dist2`等。



执行以下代码对U盘进行格式化：

```bash
diskutil eraseDisk MS-DOS "WIN11" GPT /dev/disk2
```

> 注意：注意：注意：请确保U盘中无必要保留的内容

当看到`Finished erase on disk2`信息就说明格式化完成了。

某些硬件可能需要改为 MBR 格式而不是 GPT 进行分区。

```bash
diskutil eraseDisk MS-DOS "WIN11" MBR /dev/disk2
```

假设IOS文件位于 `~/Downloads` 文件夹中，名称为：

`Win11_x64.iso`，那使用以下命令挂载ios文件。

```bash
hdiutil mount ~/Downloads/Win11_x64.iso
```

再执行`ll /Volumes`来查看ios文件挂载后的名称，如`tiny11_24H2`，那么ios的地址是`/Volumes/tiny11_24H2`。



接下执行以下命令可将Window11 ISO复制到U盘中：

```bash
rsync -vha --exclude=sources/install.wim /Volumes/tiny11_24H2/* /Volumes/WIN11
```

> 注意，有些系统盘的wim文件地址是sources/boot.wim



## 参考

- [如何使用 Mac 制作 Windows 10 U 盘启动盘](https://www.freecodecamp.org/chinese/news/how-make-a-windows-10-usb-using-your-mac-build-a-bootable-iso-from-your-macs-terminal/)
