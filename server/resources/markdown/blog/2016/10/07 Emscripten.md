_3D,C,Coding,Emscripten,WebGL_

Emscripten compiles C code to javascript. Not any kind of C code, just carefully, platform-independently written C code. Not to plain javascript, but to superfast asm.js javascript. It converts OpenGL3/ES2 calls to WebGL calls, it converts BSD sockets to Websockets, it puts MEMFS/IDBFS file systems under your file I/O and you don't have to deal with anything! ( Okay, you can't use POSIX threads but if you really need them you can work it around with webworkers ).

![emscripten](/images/20161007_emscripten.png)

So you just take previously written C/OPENGL games/prototypes and you compile them for the BROWSER!!! It's madness!

I don't have the nerve for web programming, for tons of DOM elements and css, for different js vm implementations, for debugging hell and everything else modern web "gave" me as a developer. And now I don't have to deal with all these things, and still I can deploy for the browser!!! ( okay, I have to deal with them a little because it still is web development, but hey, I only need hours now to fix something strange, not days!!! )

I already compiled a lot of my stuff to javascript with this fantastic technology :

The ultimate fighting experience, [Mass Brawl](/downloads/brawl/index.html)  
The ambient-reflex game, [Cortex](/downloads/cortex/index.html)  
The conference prototype, [Control Room](/downloads/controlroom/index.html)  
Laser trinagulation prototype, [Laserscan](/downloads/laserscan/index.html)  

IMHO Emscripten is the best technology of the 2010's so far.