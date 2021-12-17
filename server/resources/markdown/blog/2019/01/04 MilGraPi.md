MilGraPi
2019-01-04T18:03:00
Coding,Raspberry

Preparing a Raspberry Pi for OpenCV development is really time consuming, OpenCV takes hours to compile and a lot of other things have to be set up, so I just share my SD Card image here to speed up Raspberry OpenCV development for others. 

**For Raspberry Pi 3 Model B :**

I shrank the root partition to 7GB to make it suitable for smaller SD cards. It has 300MB free space only so you better expand it to fit on the target SD card. You can do this right on your raspberry with an additional USB-SD card stick and gparted. User/pass is pi/raspberry.
After startup it autologins directly to OpenBox. Right click -> Terminal emulator to open a terminal. To test and run the OpenCV examples type "workon cv" to activate the python virtual environment, go into "/home/pi/Desktop/OpenCV-Face-Recognition-master/FacialRecognition" and type "python 03_face_recognition.py" . If you have a raspberry camera installed and enabled with raspi-config, a camera window should pop up and face detection should start. For a usb camera you have to modify the scripts a little.

**For Raspberry Pi 3 Model B+ :**

It is a 16 Gbyte SD image file in Mac dmg format, balenaEtcher can handle it.
User/pass is pi/raspberry.
After login you can start the GUI by typing startx. Right click -> Terminal emulator to open a terminal. To test and run the OpenCV examples type "workon cv" to activate the python virtual environment, go into "/home/pi/Desktop/OpenCV-Face-Recognition-master/FacialRecognition" and type "python 03_face_recognition.py" . If you have a raspberry camera installed and enabled with raspi-config, a camera window should pop up and face detection should start. For a usb camera you have to modify the scripts a little.

If you find this image useful please donate at the top of the page.

**What does it contain**

*Base System*

* Raspbian Lite

*GUI*

* openbox for window manager  
* tint2 for taskbar  
* slim for autologin  - Model B image only
* pcmanfm for file manager - Model B image only
* chromium for stack overflow

*Dev Tools*

* lxterminal for terminal
* vim/nano for python
* codeblocks for c/c++ development  - Model B image only
* python for opencv development  
* opencv 4.0 for computer vision  
* picamera python module for the raspberry camera  
* opencv face recognition examples - Model B image only
* steamberry face and motion recognition - Desktop/SteamBerryMotionDetector and SteamBerryFaceDetector  

*Games*

* Scratch, Termite, Cortex, Brawl for short rests ( enable full KMS OpenGL support in raspi-config to play them )  - Model B only

**<a href="downloads/milgrapi" target="_blank">Download</a>**