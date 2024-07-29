const userController = require("../Controllers/user.controller.js")
const chatController = require("../Controllers/chat.controller.js")

module.exports = function (io) {
  io.on('connection', async(socket) => {
    console.log('New client connected',socket.id);

    socket.on("login", async(userName, cb) => {
      try {
        const user = await userController.saveUser(userName, socket.id);
        const welcomeMessage = {
          chat: `${user.name} is joined`,
          user: {
            id: null,
            name: "system"
          },
        };
        io.emit("message", welcomeMessage);
        cb({ok: true, data: user});
      } catch (err) {
        cb({ok: false, err: err.message});
      }
    });

    socket.on("sendMessage", async(message, cb) => {
      try {
        // 유저찾기 (socket id로)
        // async함수는 await
        const user = await userController.getUser(socket.id);

        // 메세지 저장
        const newMessage = await chatController.saveChat(message, user);
        io.emit("message", newMessage)
        cb({ok: true});
      } catch (err) {
        cb({ok:false, err: err.message});
      }
      
    });
    
    socket.on("disconnect", ()=> {
      console.log('Client disconnected',socket.id);
    });
  });
};