+++
title = "VirtualBox无GUI系统安装增强功能"
template = "page.html"
date = "2022-03-04"
updated = "2022-03-04"
+++

## 无GUI服务器系统内安装VirtualBox增强功能(Guest Additions)

1. Start VirtualBox.
2. Start the host in question.
3. Once the host has booted, click Devices | Insert Guest Additions CD Image.
4. Log in to your guest server.
5. Mount the CD-ROM with the command `sudo mount /dev/cdrom /media/cdrom`.
6. Change into the mounted directory with the command `cd /media/cdrom`.
7. Install the necessary dependencies with the command `sudo apt-get install -y dkms build-essential linux-headers-generic linux-headers-$(uname -r)`.
8. Change to the root user with the command `sudo su`.
9. Install the Guest Additions package with the command `./VBoxLinuxAdditions.run`.
10. Allow the installation to complete.

