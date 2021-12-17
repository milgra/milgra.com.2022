What did I learn from porting my game to Clojurescript / WebGL
2020-04-29T18:22:57
Clojure,Coding

I ported Brawl written in C/OpenGL to Cljs/WebGL to see how is it possible to write real-time / heavily stateful apps in a lisp/with pure functions.

So what did I experience?

Speed of coding. Writing different parts of the game in clojure  took about the same amount of time as writing them in C. The difference is in line numbers. While modules are ten times smaller in clojure / need ten times less functions, you have to think out every function in clojure very carefully that's why writing one line in clojure takes the same amount of time as writing ten lines in C. The main reason for this is purity : you have to always pass back a new state from the tail position(s) of a function and you have to re-insert that state fragment into the main state. You cannot just modify objects in memory and hit'n'run. And that's awesome! Clojure forces you to think carefully and responsibly.

Syntax. It's almost non existing. It's such a joy to see only letters and parentheses.

Destructuring. Most of the time you can extract 90 percent of the needed values right in the parameter list of the function. It's so bizarre and awesome at the same time.

Ease of modifying/refactoring. After 80 percent of the game was ready adding new features usually took three-four lines of code. This "many functions on few datasets" approach really makes modifying/refactoring very simple. Very simple.

Error free functions. Since you can test/evaluate the function you work on inline in the editor functions are pretty error free. I was amazed very often at myself that dropping in three lines of code blindly results in a flawless function and it's already running in the browser. Somehow it's possible in clojure.

Performance. If you stay in clojurescript land it is pretty fast. But as soon as the code involves conversion to javascript types ( cljs float vectors to javascript arraybuffers for WebGL) it kills performance immediately. The solution is to use a js arraybuffer from the beginning for vertexes and add vertexes to it in js arrays. This is stepping out from the pure paradigm but that's the other thing why clojure rocks - if you need performance you can reach down to the host language/vm. Clojure is like a mushroom on a dead tree : It's beautiful and elegant unlike the tree and it can reach out for resources in it's host if needed. 

Debugging. This was the only annoying thing. Functions are usually error free but in case of a game the main state goes through extreme amount of functions every second and if a value turns bad somewhere it results in an exception at a totally different part of the code. In emacs it's impossible to stand in a function and pause running when the program reaches there. Solution for this is being more careful, maybe test returning collections with some spec, etc.

So it was a journey! It is such a pleasure to code in clojure that I don't want to go back to any other language any more.