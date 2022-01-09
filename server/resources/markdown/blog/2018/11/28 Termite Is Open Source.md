#Termite Is Open Source
_2018/11/28 C,Coding,Games_


The time has come, finally I was able to release the full multiplatform, multi-store-integrated code of Termite on github to help everyone who is in the same boat. I'm working on the multiplatformization of Termite for months now and I was struggling a lot of times. Then plan was to finish it up quickly but life ( and the systems created by programmers ) had other plans! I stucked a lot of times at issues that seemed so tiny at first glance and I had to spend hours figuring it out.

The code, compilation&deployment guide and tips&tricks can be found here :

<a href="https://github.com/milgra/termite">https://github.com/milgra/termite</a>

I did all development on an early 2016 12'' MacBook with a fanless intel core m7, 8GB RAM and 512GB SDD and it kicked ass! It runs Windows and Linux smoothly in VMWare, the game ran with 60 fps inside the virtual machine. XCode/CodeBlocks building is also superfast.

What kills it is Android Studio. I don't think CPU development will ever reach a state where Java desktop applications run smoothly. And it is not only slow because of Java, slowness is amplified by the gradle-scripts that run between the IDE and the project so there is a very loose connection between the IDE and the code. Actually my general feeling of Android development is that there is a very loose connection between everything and you don't know what is really happening and why is it happening. Learning curve is super steep. I can imagine developers who gave 5-6 years of their lives to android development and have a mostly clear picture on whats and whys but I'm not planning to be one :) Anyway, great respect to android developers, it seems to be the biggest suck factor in the industry nowadays.

To be a decent desktop operating system Linux needs a default GUI and a simple way to install binary/closed source applications. GNOME is okay but all developers should stand behind it and push it together towards perfection, and a bundle-based application structure would be awesome ( like on MacOS ) without dependence magic. For open-source programs apt-get install is fun until you have to add new sources to the sources list or older versions with removed dependencies, etc. Compiling from source is also fun, for sysadmins and time-millionares :)

iOS and it's API's became way too complicated. Doing autolayout in Interface Builder is a lifelong journey, doing things that were super simple back in 2010 are now super-complicated ( hiding the status bar, rotation, etc ), entitlements files are everywhere for increased security. The biggest pain was an fopen issue, it worked a few years earlier but now it only creates the file and then it cannot be read/written. It turned out that fopen on iOS creates files with 0000 permissions instead of 0666 which caused a 2-hour head scratching. Using open with explicit permissions solves the problem but why did fopen became obsolete?

Raspberry is a super cool little machine. It was super easy to port the game to it, runs well, I love it.

Steamworks is a mess. The API is a mess and the site is a mess. I spent days clicking through the site and I still have no idea how to go to the steamworks admin/store admin/the main page of the application with three clicks, I think it's impossible. Settings are scattered everywhere and the whole thing is backed by Perforce!!! You have to publish your changes every time to Perforce, it's insane. It's like a high school project. The documentation is not really talkative, I used the Steamworks sample project, the documentation and google together to fix issues but I wasn't prepared for random persistence errors which can be solved by disabling and re-enabling Inventory Service for example. But they are the biggest, have infinite money, they can do this :)

The best OS for multiplatform development is definitely MacOS. It puts everything under your ass out of the box and then gets out of your way. It has everything that linux has and everything that windows has and much much more.