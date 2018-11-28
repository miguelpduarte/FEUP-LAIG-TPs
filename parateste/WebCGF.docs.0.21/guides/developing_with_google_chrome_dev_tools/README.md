# Developing with Google Chrome Developer Tools

Now the setup is complete, you can start playing around and write some code!

You should make use of **Google Chrome Developer Tools** during the course, it is everything you need to develop *WebGL* applications.

## Mapping network resources

If you already tried to edit any code using the *Developer Tools*, you may have noticed that your changes do not persist. Even if you *save* those changes, they will *reset* once you refresh the application. That is because the files you are trying to edit are the ones being run in the mongoose server, **not the ones on your local drive**.

However, you can **map** each of the mongoose server *network resources* to the corresponding local file you are trying to edit. That way, you will be able to *directly* **modify** and **write** code within *Google Chrome Developer Tools*. The following video shows how to do it.

{@video vimeo 121398533 How to map network resources in Google Chrome}

## Disabling cache

It is *advised* to disable cache while using *DevTools*. If you do not disable it, some syncing issues may arise when you edit source files.

1. Open *Google Chrome Developer Tools* **Settings**.

	{@img res/1-open-dev-tools-settings.png}

2. Make sure to check the **Disable cache (while DevTools is open)** option.

	{@img res/2-disable-cache.png}

## Additional Debugging Tools

There are useful tools for debugging WebGL in Chrome. One of them is the [WebGL Inspector Chrome extension](https://chrome.google.com/webstore/detail/webgl-inspector/ogkcjmbhnfmlnielkjhedpcjomeaghda?hl=en), which allows you to capture and analyse the WebGL calls, shaders and textures used when rendering a frame.

