const electron = require("electron");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
const socketServer = require("./socket");
let stutil;
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
const findAddress = (symbolName, MapAddress) => {
  return new Promise(async (resolve, reject) => {
    const mapFilePath = MapAddress;
    // "/Users/aren/STM32CubeIDE/workspace_1.12.1/project1/Debug/project1.map";
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
  const inputAddress = await findAddress("RNinputInstance", data.location);
  const outputAddress = await findAddress("RNoutputInstance", data.location);
  socketServer.emit("memoryLocations", {
    inputAddress,
    outputAddress,
  });
};
const createMemoryGDB = async (socketServer, data) => {
  fs.writeFileSync("read_memory.gdb", data.script);
  console.log(`GDB script written to read_memory.gdb`);

  // Start st-util in a child process

  // When st-util has started, start arm-none-eabi-gdb in another child process
  // stutil.stdout.once("data", () => {
  const gdb = spawn("arm-none-eabi-gdb", ["-x", "read_memory.gdb"]);

  // Read and parse the output of gdb
  let output = "";
  gdb.stdout.on("data", (data) => {
    output += data.toString();
  });
  gdb.on("exit", (code) => {
    if (code === 0) {
      const outputArr = output.split("\n");
      // console.log("outputArr", outputArr);
      const values = [];
      // const regex = /\b0x[\dabcdef]+\b:\s+\b0x[\dabcdef]+\b/i;
      const regex = /^0x([\dabcdef]{8}):[\s]*0x([\dabcdef]{8})$/i;
      // let match;
      for (let i = 0; i < outputArr.length; i++) {
        const line = outputArr[i];
        const match = line.match(regex);
        if (match) {
          values.push({
            adr: "0x" + match[1],
            val: "0x" + match[2],
          });
        }
      }
      socketServer.emit("memoryValues", values);
      console.log("Memory values:", values);
      // stutil.kill();
    } else {
      console.error(`arm-none-eabi-gdb exited with code ${code}`);
      // stutil.kill();
    }
  });
  // });
};
const openStUtil = async () => {
  stutil = spawn("st-util");
};
const closeStUtil = async () => {
  if (stutil) stutil.kill();
};

module.exports = {
  openlocation,
  saveToLocation,
  openMapFile,
  createMemoryGDB,
  openStUtil,
  closeStUtil,
};
