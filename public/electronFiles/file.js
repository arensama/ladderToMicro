const electron = require("electron");
const fs = require("fs");
const path = require("path");
const openlocation = async (socketServer) => {
  const dialogResult = await electron.dialog.showOpenDialog({
    properties: ["openDirectory", "multiSelections"],
  });
  if (dialogResult?.canceled === false) {
    socketServer.emit("location", dialogResult.filePaths?.[0]);
  }
};
const saveToLocation = async (socketServer, data) => {
  console.log("data", data);
  const dir = path.dirname(data?.location);
  fs.mkdir(dir, { recursive: true }, function (err) {
    if (err) {
      console.log(err);
    } else {
      fs.writeFile(data?.location, data?.data, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("File saved successfully");
        }
      });
    }
  });
};
const openMapFile = async (socketServer, data) => {
  const mapFilePath =
    "/Users/aren/STM32CubeIDE/workspace_1.12.1/project1/Debug/project1.map";
  const symbolName = "RNinputInstance";

  fs.readFile(mapFilePath, "utf8", function (err, data) {
    if (err) {
      console.log(err);
    } else {
      const lines = data.split("\n");
      let address = null;
      for (let i = 0; i < lines.length; i++) {
        const match = lines[i].match(
          /^ +0x([0-9A-Fa-f]+) +(T|D|B) +(RNinputInstance)$/
        );
        if (match) {
          address = parseInt(match[1], 16);
          break;
        }
      }
      if (address !== null) {
        console.log(
          `The address of ${symbolName} is 0x${address.toString(16)}`
        );
      } else {
        console.log(`Could not find the address of ${symbolName}`);
      }
    }
  });
};
module.exports = {
  openlocation,
  saveToLocation,
  openMapFile,
};
