# Linux Setup

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
3. Press the dropdown menu and choose **Linux x86_64 Executable**.

    {@img res/01-download-mongoose.png}

Your download should now start.


## Source Code

1. Navigate to the course **Moodle** page.
2. **Download** the source code provided.
3. **Extract** it to a folder.

    {@img res/02-extract-code.png}

4. **Move** the Mongoose standalone executable to the folder you have just extracted.

    {@img res/03-move-mongoose-inside-app-folder.png}

5. **Right-click** Mongoose, and select **Properties**.

6. Under the **Permissions** tab, make sure the *Execute* checkbox **is ticked** to enable file execution as a program.

    Press **close** to close the dialog and save changes.

    {@img res/04-enable-mongoose-execution.png}

7. Open a **terminal**. Keyboard shortcut: **Ctrl + Alt + T**.

8. **Run** Mongoose.

    **Note:** the name of the executable in the below image might be different than yours.

    **Tip:** Do *not* type everything *by hand*. Instead, type only a bit of the command - such as **./mong** - and then hit the **Tab** key on your keyboard.  
    Terminal should have *auto-completed* your command *automatically*, and now you just have to press **Enter** (the *return* key on your keyboard) to *execute* it.

    {@img res/05-run-mongoose.png}

9. **Open** your default web browser and navigate to [localhost:8080](localhost:8080).
    {@img res/06-chrome-after-running-mongoose.png}

10. **Click** on the **tp1/** link. You should be *redirected* to your very first WebGL test application.

    If your browser is displaying a **blank page**, you will not be able to click on any link. In order to navigate to the test application, append **/tp1** to the **URL**, or follow this link: [localhost:8080/tp1](localhost:8080/tp1).

    *Below* is a picture of what it should *look* like. Please note that the it may *not* be *exactly* like the one you see on your browser.
    {@img res/07-tp1-running.png}

    *Below* is yet another image of the test application from another *perspective*. You can **click and drag** inside the application to move the **camera** and therefore changing the scene's perspective.
    {@img res/08-tp1-moved-camera.png}


## Exit Mongoose

In order to **stop** Mongoose, press **Ctrl + C** on the terminal running Mongoose.

{@img res/09-exit-mongoose.png}

Afterwards you may **close** that terminal.


## Troubleshoot

*After* Mongoose has been stopped, if you try to access [localhost:8080](localhost:8080) your web browser will tell you the webpage is not available.

{@img res/10-chrome-localhost-without-mongoose.png}

If your browser displays that error message anytime before stopping Mongoose, you most likely skipped a step on this guide.  
In that case, *restart* the setup and follow the instructions given in each step *exactly* as they are.
