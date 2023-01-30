# Meme Generator

 ## Introduction
 This is a web application that enables the user to generate memes. The application has two main sections: Gallery and Edit. In the Gallery section, the user can view a collection of memes and select one to edit. In the Edit section, the user can customize the selected meme.
[Check it Out](https://ozzaken.github.io/meme-generator/)
<!-- <img src="assets/img/readme/desktop.jpg" alt="Desktop Preview">
<img src="assets/img/readme/tablet.jpg" alt="Tablet Preview">
<img src="assets/img/readme/mobile.jpg" alt="Mobile Preview"> -->

 ## Directory Structure
/controller
    gallery.controller.js
    meme.controller.js
/service
    gallery.service.js
    i18.service.js
    meme.service.js
    util.service.js

## Main Controller
The main controller (MAIN_CONTROLLER) sets up the window object with the necessary functions and sets up the state of the application.

## Features
- View and select memes from a gallery
- Edit the selected meme by adding text, changing text color, and uploading an image
- Translate the user interface to different languages
- Save the created meme