Living and Developing on a Raspberry Pi
2018-09-25T18:00:00
C,Coding,Raspberry

My new game will run on all platforms possible but the first supported platform will be the Raspberry Pi because of 80's nostalgia. I love the fact that there is a super cheap home computer again that ages well - they don't double the cpu speed every year, they still sell the first version so you can optimise for the hardware and you also have to because it's not that strong - and I love this fact.

For a week I used my Raspberry Pi 3 as my main computer. And it was surprisingly usable, it is like a machine from the early 2000's. Overall desktop experience is okay, the terminal and file manager works well, LibreOffice and normal applications run fast enough, I used Code::Blocks for programming, the current raspbian apt version ( 16.04 ) is terribly buggy, I had to compile the latest one ( 17.12 ) on the raspberry which needed a few hours but it worked flawlessly after. Chromium, the now-default browser is the weakest point, it is a monstrous software and it had to run modern javascript which is also a monstrous task. Javascript intensive pages ( facebook and modern "portals" ) kill the board in two tabs, youtube can be in 6-7 tabs and it handles simple sites well. But it is advised to use only 1-2 tabs whatever you do.

Since my game doesn't use any framework and it's quite simple the board compiled it in a few seconds so development was rapid.

To summarise my experience : modern web is not for the raspberry pi but it is good for everything else, it is a super cheap and capable home computer.