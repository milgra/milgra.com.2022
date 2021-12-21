#WebGL Performance
_3D,C,WebGL_

I'm working on a multi-platform C and OpenGL based UI renderer and displaying things in 60 fps is essential. 

<p align="center">
<iframe width="560" height="315" src="https://www.youtube.com/embed/LEnWsJc9S-o" allow="fullscreen"></iframe>
</p>

It works well on desktop and mobile OS's and it looks good in WebGL on my non-retina Macbook Air but sadly on retina Macbook Pro's the framerate is dying in case of big browser windows ( ~more than 50% of the screen ).

After a few days of trial and research I figured out the following :

- Google Chrome's webGL implementation on OS X is much faster than Safari's
- enabling/disabling preserved drawing buffer makes no difference
- using scissor test to draw only a fragment of the screen makes no difference
- switching off antialiasing and the context's alpha channel makes difference
- disabling alpha blending speeds up frame rendering big time
- if frame rate is dying then every single javascript call inbetween makes everything slower ( thanks to single-threadedness )
- in os x's high and maximum display scaling mode the maximum framerate you can achieve with a full-size browser window with a full size canvas is 35-40 fps. In lower modes 60 fps is reachable.
- full texture upload at any time kills performance

So what did I learn?

- webGL will never be as fast as standard (windowed) openGL because the browser has to blend the webGL canvas into the web page with every frame and this slows down rendering big time 
- webGL is smart enough not to swap frame buffers if gl context is not changed 
- for a full-scale retina os x webGL UI renderer experience I have to wait for the next generations of MacBooks 

Anyway I rewrote my UI renderer to use as few function calls as possible, use as much glTexSubImage2D and glBufferSubData calls as possible instead of full uploads and now it uses bitmaps for text fields instead of individual textured quads for letters and I'm almost satisfied.