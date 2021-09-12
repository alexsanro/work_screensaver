<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/othneildrew/Best-README-Template">
    <img src="src/favicon.ico" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">workscreen-saver</h3>

  <p align="center">
    An awesome workscreen that you can customize as you wish.
    <br />
    <a href="https://github.com/alexsanro/work_screensaver/issues">Report Bug</a>
    ·
    <a href="https://github.com/alexsanro/work_screensaver/issues">Request Feature</a>
  </p>
</p>

<!-- ABOUT THE PROJECT -->
## About The Project

The project arises from the fact that whenever one left the computer unlocked at work, colleagues changed the wallpaper, changed the computer settings or any other joke you can imagine.

As a result of all this arises the idea of creating a configurable screensaver with any type of image or HTML file to "lock" the PC screen and say that you are going to do or where you are. 

### Built With

This section should list any major frameworks that you built your project using. Leave any add-ons/plugins for the acknowledgements section. Here are a few examples.
* [Bootstrap](https://ng-bootstrap.github.io/#/home)
* [Angular](https://angular.io/)
* [Electron](https://www.electronjs.org/)
* [Electron-Angular](https://github.com/maximegris/angular-electron)


<!-- GETTING STARTED -->
### Prerequisites

This application is prepared for use with Docker, is most easly for use. But if you want make more easy you need Vscode for work with remote containers method that microsoft have implementated.

This are prerrequisites for use only with Docker, and test the application only with a build of this (App for windows (.exe))
- **Docker desktop for windows**
- **Vscode**
- **Plugin 'remote containers' for Vscode**

If you want use the APP like dev mode for windows or linux you need install some prerequisites into the OS:

- **NPM** 

### Installation and usage

1. Clone the repo
     ```sh
     https://github.com/alexsanro/work_screensaver
     ```
2. Open the project into Vscode use 'reopen in container'
3. Install NPM packages
     ```sh
     npm install
     ```
4. Run test's 
     ```sh
     npm run test
     ```
5. Build application
    ```sh
    npm run electron:windows
    ```


**For use into the OS system:**

6. Install NPM packages into OS system. 
    ```sh
    npm install
    ```
7. Run application in dev mode:
    ```sh
    npm run build:dev
    ```


<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.


<!-- ACKNOWLEDGEMENTS -->
## Acknowledgements
* [Choose an Open Source License](https://choosealicense.com)
* [Icon](https://www.flaticon.com/free-icon/computer_4472719)
