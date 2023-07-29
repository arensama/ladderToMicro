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
const findAddress = (symbolName) => {
  return new Promise(async (resolve, reject) => {
    const mapFilePath =
      "/Users/aren/STM32CubeIDE/workspace_1.12.1/project1/Debug/project1.map";
    fs.readFile(mapFilePath, "utf8", function (err, data) {
      if (err) {
        console.log(err);
      } else {
        const lines = data.split("\n");
        let address = null;
        let match = false;
        for (let i = 0; i < lines.length; i++) {
          if (match) {
            let array = lines[i].split(" ");
            for (let j = 0; j < array.length; j++) {
              const element = array[j];
              if (element.includes("0x")) {
                resolve(element);
                break;
              }
            }
            address = parseInt(match[1], 16);
            break;
          }
          match = lines[i].includes(symbolName);
        }
        reject(`Could not find the address of ${symbolName}`);
      }
    });
  });
};

const openMapFile = async (socketServer, data) => {
  const inputAdress = await findAddress("RNinputInstance");
  const outputAdress = await findAddress("RNoutputInstance");
  socketServer.emit("memoryLocations", {
    inputAdress,
    outputAdress,
  });
};
module.exports = {
  openlocation,
  saveToLocation,
  openMapFile,
};
