---
layout: post
title:  Building London Traveller app
date:   2015-09-13 17:00:12 +0000
permalink: /projects/mvc-4-bundling-css-and-js-files
category: projects
redirect_from: /web-development/building-london-traveller-app
meta_description: >
 I talk about publishing the London Traveller app to the world and what it's like to use the Ionic Framework.
---

[London Traveller][1] on Android play store, built using&nbsp;[Ionic framework][2].

![Oyster balance][3]&nbsp;![Distruptions][4]&nbsp;![Line Status][5]

I built the London Traveller mostly to see what it was like to get a mobile application out to the world. The steps to preparing the app for release was a little fiddly but not difficult. Ionic, the framework I chose to use provided good instruction to get an app [published][6]. I'm on a Windows machine so had to ensure certain tools were added to the path. What was needed is jarsigner, this is part of the JDK and zipalign in the Android sdk.

After completing the steps in the Ionic post, uploading the APK to the store is simple. Even though there is a surprising amount of admin work before you can publish it.

Overall it's pretty straight forward and the command line steps to create a release apk could be automated for next iterations.

## What is it like to use Ionic?

From the beginning Ionic is fast to setup and to start developing. It only took a couple hours to get the core features of the app working with a pleasing UI out the box. They provide so much support of the developer out of box, it's one of the really strong benefits. Ionic uses AngularJS as its core framework, so if you are familiar with it then it's even easier to get going.

I find that it works so well when developing that it more fun than normal and I would be happy to build prototypes with it.

## Development on a device

The more painful part is setting up your environment to build and test an app on a Android device especially using Windows. To help users [get started with Ionic for Android][7] I did a presentation to help reduce the pain of setup. In Google Chrome it's possible to remote debug an app on a device using chrome://inspect/#devices. Then as I mentioned before a little more fiddling to get your app published.

## It's hybrid

Ionic uses core web technologies for development putting it in the hybrid class which has equal benefits and negatives. Benefits are mostly the tech is common and reusable in web apps making development extremely fast. The other is it allows reuse of the code base to deliver to both Android and iOS.

The main issue is the UI renders in a webview similar to a browser and so is not truly native. In certain scenarios there is noticeable delay in response and gittery transitions. I find this more noticeable on Android than iOS, not sure why but maybe iOS has a better webview or Ionic is more optimised for it.

Another downside is you can't take advantage of all the native features of the OS. For instance in Android, widgets can be built to extend the app but this can't be achieved in using webview. A widget is an extension of a native screen and the webview is the only screen in a hybrid.

## Plugins

To access the native APIs you can use [Cordova plugins][8] and with such a strong community there are plenty to choose from. To help make them work better in an AngularJS environment [ngCordova][9] extension library was built. All the plugins I used had an ngCordova wrapper and made it simple to access the native features. One annoying part of this is you can only access the API when 'device is ready' and you need to check the Cordova plugin is available. Mostly to avoid your app breaking during development in a desktop browser. This does add an annoying amount of boiler code.

## Should you use Ionic?

It's a tricky question to answer now simply because there are a few more competitors emerging in the hybrid class. You have [React Native][10], [Native Script][11] and [Xamarin][12] to name some of them, each with their own pros and cons. To me this is a sign of a clear future in hybrid app development and it's more about which one to use. If you know you will need to take advantage of unique native features then you should probably go native.

The great thing about Ionic is it's so fast to develop with, it might be the tool to get your great app idea out there quickly to test the market.

[1]: https://play.google.com/store/apps/details?id=com.ionicframework.oysterbalance749927
[2]: http://ionicframework.com/
[3]: /images/london-traveller-oyster-balance.png
[4]: /images/london-traveller-disruptions.png
[5]: /images/london-traveller-line-status.png
[6]: http://ionicframework.com/docs/guide/publishing.html
[7]: http://slides.com/rkotze/deck#/
[8]: http://plugins.cordova.io/npm/index.html
[9]: http://ngcordova.com/
[10]: https://facebook.github.io/react-native/
[11]: https://www.nativescript.org/
[12]: http://xamarin.com/
  