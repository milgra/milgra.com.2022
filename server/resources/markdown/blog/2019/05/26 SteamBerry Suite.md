#SteamBerry Suite
_2020/05/26 C,Coding,OpenCV_

![steamberry](/images/blog/2019/05/20190516_steamberry.png)

This year I opened the café of my dreams : it is half café, half co-working space, half geeky-nerdy community space with raspberry pi's, musical instruments, japanese kimono and live cat and puppy streams. 
I use raspberrys for everything : for cat/puppy streaming, for synthetizing sound for the MIDI keyboard, for playing music from youtube, for scratch for kids and for motion/face detection.
Motion/face detection is mainly for educational purposes : you can check out how it works on the upper level, and you can store your face/name if you want to save it for eternity! :)

The code is python based and uses openCV, for a pre-installed raspberry image check out this post :

[http://milgra.com/milgrapi.html](http://milgra.com/milgrapi.html)

It is also prepared for both raspberry and usb cameras. 

The main function grabs the camera image in an infinite loop and sends the image to the motion and the face detector functions. The motion detector checks the differences between the previous and the actual image, the face detection uses openCV's face detection. If space is pressed it starts to save the actual face into the data model, and writes out the training images and the id-name pair under dataset folder. If you want to give a specific name to a face, you have to edit idtoname.txt. After restart it checks for a model file and an idtoname file and loads them if they exist.

[check it out on github](https://github.com/milgra/steamberrysuite)