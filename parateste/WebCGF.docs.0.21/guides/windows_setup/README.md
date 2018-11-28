# Windows Setup

In order to test your first *WebGL application* you will need the following:

- a **web browser**;
- an **HTTP server**;
- a couple of lines of **code**;


## Web Browser

Install [Google Chrome](http://www.google.com/chrome/), if you have not done it already.

You probably want to set it as your *default* web browser as well.


## Server

**Mongoose** is a simple standalone HTTP server.  
The simplest way to develop WebGL applications during the course is by making use of it.

1. Navigate to [Cesanta's website](http://cesanta.com/mongoose.shtml).
2. Scroll down a bit and **tick** the *I accept Mongoose EULA* checkbox.
3. Press the dropdown menu and choose **Windows Executable**.

	{@img res/01-download-mongoose.png}

Your download should now start.


## Source Code

1. Navigate to the course **Moodle** page.
2. **Download** the source code provided.
3. **Extract** it to a folder.
  {@img res/02-extract-code.png}

4. **Move** the Mongoose standalone executable to the folder you have just extracted.
  {@img res/03-move-mongoose-inside-app-folder.png}

5. **Double-click** Mongoose.

	You *may* be prompted with the dialog below. In that case, **do not press OK**.
	{@img res/04-windows-protected-your-pc.png}

	Instead, press **More info**. A **Run anyway** button should now be visible.
	{@img res/05-run-anyway.png}

	**Press it**, and Mongoose should now start to run.
	{@img res/06-mongoose-tray-icon.PNG}

6. **Right after starting Mongoose**, your default web browser should open by itself.

	*Below* is an image of what is **expected** to be shown. If your browser *did* open but the page is **blank**, do not worry.

	If your browser did *not* open automatically, open it now by yourself and navigate to [localhost:8080](localhost:8080).
	{@img res/07-chrome-after-running-mongoose.png}

7. **Click** on the **tp1/** link. You should be *redirected* to your very first WebGL test application.

	If your browser is displaying a **blank page**, you will not be able to click on any link. In order to navigate to the test application, append **/tp1** to the **URL**, or follow this link: [localhost:8080/tp1](localhost:8080/tp1).

	*Below* is a picture of what it should *look* like. Please note that the it may *not* be *exactly* like the one you see on your browser.
	{@img res/08-tp1-running.png}

	*Below* is yet another image of the test application from another *perspective*. You can **click and drag** inside the application to move the **camera** and therefore changing the scene's perspective.
	{@img res/09-tp1-moved-camera.png}


## Exit Mongoose

In order to stop Mongoose, **click** on its *tray icon* and select **Exit**.

{@img res/10-mongoose-hidden.png}

{@img res/11-exit-mongoose.png}


## Troubleshoot

*After* Mongoose has been stopped, if you try to access [localhost:8080](localhost:8080) your web browser will tell you the webpage is not available.

{@img res/12-chrome-localhost-without-mongoose.png}

If your browser displays that error message anytime before stopping Mongoose, you most likely skipped a step on this guide.  
In that case, *restart* the setup and follow the instructions given in each step *exactly* as they are.
