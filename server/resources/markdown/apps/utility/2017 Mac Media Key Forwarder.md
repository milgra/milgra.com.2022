#Mac Media Key Forwarder
_C,Coding,Music_

![Icon](/images/mmkf_icon.png)

Forwards media keys to iTunes or Spotify directly.

You can prioritize which app you would like to control or you can go with the default behaviour which controls the running app. The app runs in the menu bar.

_Installation_

[Check installation steps here](https://github.com/milgra/macmediakeyforwarder)

_Issues you should know about_

The app listens on the event tap for key events. This causes problems in some rare cases, like 

- when changing search engine in Safari's preferences window

- when trying to allow third-party kernel extensions

In these cases simply pause Mac Media Key Forwarder from it's menu.

_I want it now!_

[Downloads](https://github.com/milgra/macmediakeyforwarder/releases)

[GitHub link](https://github.com/milgra/macmediakeyforwarder)

---

Apple just released High Sierra and it brought good things and annoying things : they changed the behaviour of the media controller keys, they no longer control itunes, they control the video playback in safari. This pissed off a lot of people including me, so I just created a menu bar app to proxy media key events to iTunes/Spotify while Apple fixes this. It doesn't support touchbar yet, only physical buttons.