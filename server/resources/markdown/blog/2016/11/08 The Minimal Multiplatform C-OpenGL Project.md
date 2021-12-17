The Minimal Multiplatform C/OpenGL Project
2016-11-08T23:59:00
3D,C,OpenGL,WebGL

In the past year I've created a few very nice wrappers for different platforms and operating systems that wrap the same controller file to simplify multi-platform C development for my stuff. For your edification and pleasure they are now yours on github!

TMMCP is a wrapper/project collection for C programmers who like it quick & simple & with total control. A TMMCP wrapper provides:

- an OpenGL context
- device input events
- native audio/video playback
- native video to texture rendering
- some other functions I found userful during game development

The wrappers are very simple, after a little reading you can easily extend them if you need some special functionality.

### Current list of wrappers and projects

- iOS - Xcode
- MacOS - Xcode
- Android - Android Studio
- asmjs/html5 ( emscripten ) - bash script

### What is the license?

Everything in this repo is in the public domain. Take it use it learn from it.

### How to use it

Open "template/sources/controller.c" in your favorite editor and start coding. After you finished open the wanted platform's project file and build/compile/run/deploy. You may have to add newly created source files / include paths to the project settings.

### Cool, do you have any documentation?

The documentation is in-line in controller.c. If you don't get it check out the demo projects. demo_dragbox shows a draggable white box over a purple background - it shows off basic OpenGL/input handling and audio playing. demo_conference is an advanced demo, it creates a 3D conference room with video avatars using the wrapper's render video-to-texture functionality - even in html5!. But not on android, I'm still in the middle of the implementation, it will show blank avatars.

## Contributors Wanted

Windows and Linux wrappers/projects would be awesome for start but any platform is welcomed warmly!

### Credits

I'm using some stuff in the demos from these beautiful people :
  
- Sean Barret - [nothings.org](http://nothings.org) - (png and ttf rendering libs)  
- Per Ola Kristennson - [pokristensson.com](http://pokristensson.com/software.html) - (hashmap basics)  
- Alon Zakai - [https://github.com/kripken](https://github.com/kripken) - (the creator of emscripten)  

Check it out under [https://github.com/milgra/tmmcp](https://github.com/milgra/tmmcp)