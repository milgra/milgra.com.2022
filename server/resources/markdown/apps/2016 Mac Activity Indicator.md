Mac Activity Indicator
2016-12-21T12:00:00
C,Mac

![Icon](/images/mai_icon.png)

Do you have a super silent MacBook and sometimes you have no idea whether it is working or not? Or you just interested what tasks MacOS does in the background? Or you are a developer and you need to see what your application is doing in the background?
Mac Activity Indicator puts an icon in your menubar that switches it's led between green and red when activity happens. If you click on the icon a window appears where you can see the last 100 files touched by the operating system.

**I want it now!**

[Downloads](https://github.com/milgra/macactivityindicator/releases/tag/1.0)

[GitHub link](https://github.com/milgra/macactivityindicator)

In addition to the Mac Audio Keepalive update I have released a new mac app called MacOS Activity Indicator.

It started with fswatch. It's a super handy command line utility installable with brew ( brew install fswatch ), you simply type "fswatch /" into the terminal and no file activity remains hidden on your computer. You can see what nasty things MacOS and any other app are doing in the background. I use it to generate header files for my c files automagically no matter where they are.

Then I realized that I can create a menu bar activity indicator for slow and silent machines - like the new MacBook - because sometimes they seem to be unresponsive and you don't know what is happening. As a plus, I've added an observation window - you can open/close it by clicking on the menu bar icon - that shows the last 100 changed files.

I've decided to add no filtering or external app option - it's just a comfy indicator/quick check app - if you want to do serious work then use fswatch instead.

The app is open source in the pulbic domain as always .