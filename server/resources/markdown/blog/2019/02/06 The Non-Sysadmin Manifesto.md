#The Non-Sysadmin Manifesto
_Coding_

I’m a computer user. 90 percent of the developed countries is a computer user in some way.

Every second spent fighting the computer instead of just using it is a waste of time.

I’m a software engineer. Every second spent fighting the computer instead of just coding is a waste of time.

Software industry is pretty much a mess no matter what architecture and operating system you use because you have to waste a lot of time and energy.

But we can make it better!

_We need absolute standalone applications independent from the OS version and the shared library versions the OS have_

Problems : App doesn’t start, quits or hangs immediately or during runtime, installation fails because of missing software or dependency hell

Apps should contain EVERY dependency that is needed to run the app on the specific architecture. App size is not a problem anymore in, we have terabyte SSD’s and gigabyte/s networks now.

Apps should run out of the box on the target architecture regardless the OS version. Of course it can be tricky with hardware drivers that are manufacturer-dependent but OS’s should use industry-standard API’s to let programs communicate with hardware and should hide drivers to make this possible.

Of course this can raise security concerns — what if somebody replaces libs and hacks your memory management? Well, it is possible on current OS’s already. You should know where your app is coming from.

What OS’s can do to make using a computer safer is provide total transparency! It should log and show you in a human readable way where the app is connecting to ( TCP/IP requests ), it’s actual connection, what hardware it is using, it should ask for permissions to use specific hardware if the user asks it to, it should ask for permissions to connect to remote hosts if the user asks it to. Apps should report their actual progress to the OS and to the user if they are doing something CPU consuming.

With these rules computers can be perfect, safe and stable production instruments.

_We need absolute standalone development projects_

Modern software projects are a hell to set up. Dependencies, dependencies of dependencies, parameters, settings scattered between a thousand config files, makefiles, old project files using old IDE versions, old scripts using old script language versions and old dependencies…

Why programming have to be like this? Why don’t we make self-contained development projects containing everything? The closest thing to this maintaining a virtual machine image with everything installed, the proper OS version, IDE version, all downloaded libraries but it’s a drag.

We should make dev projects download/install/move in one package with everything that is needed for immediate development/deployment.

In addition, if Apps become first class citizens on the OS, Code should be the first class citizen in development projects, we should do more setup/environment checking/etc in the code itself and make less setup scripts/config files.

I’m dreaming of a world where everything is out-of-the-box, straightforward and just working. Let’s do this!