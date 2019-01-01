// Modules to control application life and create native browser window
const {app, Menu, BrowserWindow, ipcMain} = require('electron')

const menuTemplate = [
    {
	label: 'File',
	submenu: [
	    {
		label: 'New Song',
		accelerator: 'CmdOrCtrl+N',
		click: function (menuItem, currentWindow) {
		    currentWindow.webContents.send('new');
		}
	    },
	    {
		label: 'Open Song',
		accelerator: 'CmdOrCtrl+O',
		click: function (menuItem, currentWindow) {
		    currentWindow.webContents.send('open');
		}
	    },
	    { type: 'separator' },
	    {
		label: 'Settings',
		click: function (menuItem, currentWindow) {
		    currentWindow.webContents.send('settings');
		}
	    },
	    {role: 'Quit'}
	]
    },
    {
	label: 'Song',
	submenu: [
	    {
		label: 'Title and details',
		id: 'brill-menu-title',
		enabled: false,
		click: function (menuItem, currentWindow) {
		    currentWindow.webContents.send('title');
		}
	    },
	    {
		label: 'Timing',
		id: 'brill-menu-timing',
		enabled: false,
		click: function (menuItem, currentWindow) {
		    currentWindow.webContents.send('timing');
		}
	    },
	    {
		label: 'Instruments',
		id: 'brill-menu-instruments',
		enabled: false,
		click: function (menuItem, currentWindow) {
		    currentWindow.webContents.send('instruments');
		}
	    }
	]
    },
    {
	label: 'Edit',
	submenu: [
	    { role: 'undo' },
	    { role: 'redo' },
	    { type: 'separator' },
	    { role: 'cut' },
	    { role: 'copy' },
	    { role: 'paste' },
	    { role: 'pasteandmatchstyle' },
	    { role: 'delete' },
	    { role: 'selectall' }
	]
    },
    {
	label: 'View',
	submenu: [
	    { role: 'reload' },
	    { role: 'forcereload' },
	    { role: 'toggledevtools' },
	    { type: 'separator' },
	    { role: 'resetzoom' },
	    { role: 'zoomin' },
	    { role: 'zoomout' },
	    { type: 'separator' },
	    { role: 'togglefullscreen' }
	]
    },
    {
	role: 'window',
	submenu: [
	    { role: 'minimize' },
	    { role: 'close' }
	]
    },
    {
	role: 'help',
	submenu: [
	    {
		label: 'Learn More',
		click () { require('electron').shell.openExternal('https://electronjs.org') }
	    }
	]
    }
];

if (process.platform === 'darwin') {
  menuTemplate.unshift({
    label: app.getName(),
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideothers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  })
    // Edit menu
    template[1].submenu.push(
	{ type: 'separator' },
	{
	    label: 'Speech',
	    submenu: [
		{ role: 'startspeaking' },
		{ role: 'stopspeaking' }
	    ]
	}
    )

    // Window menu
    template[3].submenu = [
	{ role: 'close' },
	{ role: 'minimize' },
	{ role: 'zoom' },
	{ type: 'separator' },
	{ role: 'front' }
    ]
}

// declare the main menu as a global so we can interogate it later
const mainMenu = Menu.buildFromTemplate(menuTemplate);

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
    // Create the browser window.
    mainWindow = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  mainWindow.loadFile('app/index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
    createWindow();
    Menu.setApplicationMenu(mainMenu);
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

ipcMain.on('asynchronous-message', function (event, payload) {
    if (payload.type === "enable menu") {
	var menuItem = mainMenu.getMenuItemById(payload.menu_id);
	menuItem.enabled = true;
    };
});
