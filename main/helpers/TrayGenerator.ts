import { app, Tray, BrowserWindow, nativeImage, Menu } from 'electron';

class TrayGenerator {
  tray: Tray;

  constructor(public mainWindow: BrowserWindow, public iconPath: string) {
    this.createTray();
  }

  private createTray = () => {
    this.tray = new Tray(this.createNativeImage());
    this.tray.setIgnoreDoubleClickEvents(true);
    this.tray.on('click', this.toggleWindow);
  };

  private createNativeImage() {
    // Since we never know where the app is installed,
    // we need to add the app base path to it.
    // on dev env, the build app is dist, once packaged electron-builder package it as dist/assets, but app path is not in dist so append dist for pacaking
    let appPath = app.getAppPath();
    appPath = appPath.endsWith('dist') ? appPath : `${appPath}/dist`;
    const path = this.iconPath;
    const image = nativeImage.createFromPath(path);
    // Marks the image as a template image.
    image.setTemplateImage(true);
    return image;
  }

  private toggleWindow = () => {
    const isVisible = this.mainWindow.isVisible();
    const isFocused = this.mainWindow.isFocused();

    if (isVisible && isFocused) {
      this.mainWindow.hide();
    } else if (isVisible && !isFocused) {
      this.mainWindow.show();
      this.mainWindow.focus();
    } else {
      this.showWindow();
    }
  };

  private showWindow = () => {
    this.mainWindow.setPosition(this.tray.getBounds().x, 0, false);
    this.mainWindow.show();
    this.mainWindow.setVisibleOnAllWorkspaces(true); // put the window on all screens
    this.mainWindow.focus(); // focus the window up front on the active screen
    this.mainWindow.setVisibleOnAllWorkspaces(false); // disable all screen behavior
  };
}

export default TrayGenerator;
