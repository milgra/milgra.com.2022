#Renewed MilGra.Com
_2021/12/22 javascript,clojure_  

New year, new homepage!

My last homepage was based on clojurescript on the client side and clojure/datomic on the server side. It was okay because I wanted to learn those technologies. But now I wanted to return to minimalism.
First of all I don't like migrating data from old databases to new, upgrading databases and I don't like if I cannot access my blog entries simply on the file system. I want to be able to "touch" and "backup" them easily. So this year I returned to file based storage. I store my entries in markdown in a year/month directory structure and I generate html versions of them in case of modification. I also store comments in files and the best thing that this content is quite static so I can cache it and it will be faster than any database. The other awesome thing is searching in files : I can use the command line tools find and grep and they return the wanted files immediately.

The server-side is still clojure/compojure but it's quite simple, around 60 lines currently.

And on the frontend I fed up with 6 Megabyte big lib-heavy transcompiled javascript blobs so I decided to go with pure javascript. The other thing I wanted to achieve is an infinite-scrolling list view that loads items on demand and removes and frees items when they roll offscreen, so memory footprint and dom elements remain minimal and I get a responsive homepage. I also wanted this list to be able to expand items and show my entries in place. The design is also responsive since I wanted to use my infinite-scroller list to show my guitar tabs for me on mobile when doing campfire playing.

The so-called zenlist component is around 450 lines, the main logic is around 400 lines of code, the page and scrolling is fast and light, I'm satisfied!

Check out the source at
[github](https://github.com/milgra/milgra.com)