const http = require("http");
const io = require("socket.io");
const {
  openlocation,
  saveToLocation,
  openMapFile,
  createMemoryGDB,
} = require("./file");
function socketServer() {
  const server = http.createServer();
  const socketServer = io(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  socketServer.on("connection", function (socket) {
    console.log("socket.io connection open");

    socket.on("getLocation", function (data) {
      openlocation(socketServer);
    });
    socket.on("createMemoryGDB", function (data) {
      createMemoryGDB(socketServer, data);
    });
    socket.on("saveToLocation", function (data) {
      saveToLocation(socketServer, data);
    });
    socket.on("openMapFile", function (data) {
      openMapFile(socketServer, data);
    });
    socket.on("disconnect", function () {
      console.log("socket.io connection closed");
    });
  });

  server.listen(8080, function () {
    console.log("Listening on port 8080");
  });
}
module.exports = socketServer;
