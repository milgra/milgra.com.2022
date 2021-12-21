Mac Media Key Forwarder
2017-10-05T12:00:00
C,Coding,Music

![Icon](/images/mmkf_icon.png)

Forwards media keys to iTunes or Spotify directly.

You can prioritize which app you would like to control or you can go with the default behaviour which controls the running app. The app runs in the menu bar.

**Installation**

[Check installation steps here](https://github.com/milgra/macmediakeyforwarder)

**Issues you should know about**

The app listens on the event tap for key events. This causes problems in some rare cases, like 

- when changing search engine in Safari's preferences window

- when trying to allow third-party kernel extensions

In these cases simply pause Mac Media Key Forwarder from it's menu.

**I want it now!**

[Downloads](https://github.com/milgra/macmediakeyforwarder/releases)

[GitHub link](https://github.com/milgra/macmediakeyforwarder)

---

Apple just released High Sierra and it brought good things and annoying things : they changed the behaviour of the media controller keys, they no longer control itunes, they control the video playback in safari. This pissed off a lot of people including me, so I just created a menu bar app to proxy media key events to iTunes/Spotify while Apple fixes this. It doesn't support touchbar yet, only physical buttons.