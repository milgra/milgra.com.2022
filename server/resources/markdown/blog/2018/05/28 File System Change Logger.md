#File System Change Logger
_C,Coding_

Running a program or installing a dev environment pollutes the computer with a lot of visible/hidden/unknown of files. If you are as curious as me about file changes/additions/removals on the file system try my new tool called fschangelog. It creates lightweight file system snapshots using the file size and last modified date only and compares these snapshot files. It groups the results in three groups : added, removed and updated.
It is on github with a public domain license, just download the project and compile the *.c files and there you are.

[fschangelog on github](https://github.com/milgra/fschangelog)