// import { app, BrowserWindow, screen } from "electron";
// import path from "path";
// import { isDev } from "./utils.js";

// app.on("ready", () => {
//   const { width, height } = screen.getPrimaryDisplay().workAreaSize;

//   const mainWindow = new BrowserWindow({
//     width: width,
//     height: height,
//     webPreferences: {
//       nodeIntegration: true,
//       contextIsolation: false,
//     },
//   });

//   if (isDev()) {
//     mainWindow.loadURL("http://localhost:5173");
//   } else {
//     mainWindow.loadFile(path.join(app.getAppPath(), "dist-vue", "index.html"));
//   }
// });

import { app, BrowserWindow, screen } from "electron";
import path from "path";
import { isDev } from "./utils.js";

app.on("ready", () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  const mainWindow = new BrowserWindow({
    width,
    height,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    autoHideMenuBar: true, // Hide the menu bar
  });

  if (isDev()) {
    mainWindow.loadURL("http://localhost:5173");

    // Removed the line that opens DevTools automatically
    // mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(app.getAppPath(), "dist-vue", "index.html"));

    // Disable DevTools in production
    mainWindow.webContents.on("devtools-opened", () => {
      mainWindow.webContents.closeDevTools();
    });

    mainWindow.webContents.on("before-input-event", (event, input) => {
      const isDevToolsShortcut =
        ((input.control || input.meta) &&
          input.shift &&
          input.key.toLowerCase() === "i") ||
        input.key === "F12";

      if (isDevToolsShortcut) {
        event.preventDefault();
      }
    });
  }
});
