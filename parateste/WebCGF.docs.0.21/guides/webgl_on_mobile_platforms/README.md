# WebGL on Mobile Platforms

Since the only requirement to run WebGL applications is a browser which supports WebGL, running WebGL applications on mobile devices is totally feasable.

## WebGL on Chrome for Android

You can host the applications developed during the course online, and run them in various devices, anywhere.

Below is an image of an example WebGL application using WebCGF running on Chrome for android.

	{@img res/1-example-app.png}

## Touch screen controls

Following is a list of the multitouch gestures available to control the camera on touch screen devices:

- **Rotate:** one finger
- **Zoom:** two fingers (pinch to zoom)
- **Pan:** three fingers

## Troubleshooting

If you get the error message shown in the image below, it does not necessarily mean your device is not capable of running WebGL.

	{@img res/2-webgl-error.png}

Go to [chrome://flags/](chrome://flags/). Enable the experiment **Override software rendering list** and then press the **Relaunch Now** button on the bottom of the screen.

	{@img res/3-override-software-rendering-list.png}
