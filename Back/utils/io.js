const userController = require("../Controllers/user.controller.js")
const chatController = require("../Controllers/chat.controller.js")


module.exports = function (io) {
  io.on('connection', async(socket) => {
    console.log('New client connected',socket.id);
    
    // 유저가 입장했다는 메시지를 생성
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
        // 모든 클라이언트에게 메시지를 전송
        io.emit("message", welcomeMessage);

        // 현재 온라인 유저 목록을 업데이트하여 전송
        io.emit("userList", await userController.getOnlineUsers());
        
        // 콜백 함수로 로그인 확인
        cb({ok: true, data: user});
      } catch (err) {
        // 에러가 발생하면 콜백 함수로 에러 띄움
        cb({ok: false, err: err.message});
      }
    });

    // 유저가 메시지를 보낼 때 처리하는 이벤트
    socket.on("sendMessage", async(message, cb) => {
      try {
        // 유저찾기 (socket id로)
        const user = await userController.getUser(socket.id);

        // 메세지 저장
        const newMessage = await chatController.saveChat(message, user);
        
        // 모든 클라이언트에게 새로운 메시지를 전송
        io.emit("message", newMessage)
        cb({ok: true});
      } catch (err) {
        cb({ok:false, err: err.message});
      }
      
    });

    // 방장으로부터 "start" 수신하면 브로드캐스트
    socket.on("start", () => {
      io.emit("gameStart");
    });

    socket.on("requestProblems", async(limit, cb) => {
      try {
        const problems = await problemController.getProblems(limit);
        cb({ ok: true, problems });
      } catch (err) {
        cb({ ok: false, err: err.message });
      }
    });
    
    // 유저가 연결을 끊으면
    socket.on("disconnect", async ()=> {
      console.log('Client disconnected',socket.id);

      try {
        // 유저를 오프라인 상태로 설정
        const user = await userController.setUserOffline(socket.id);
        if (user) {
          // 유저가 퇴장했다는 메시지를 생성
          const goodbyeMessage = {
            chat: `${user.name} has left`,
            user: {
              id: null,
              name: "system"
            },
          };
          // 모든 클라이언트에게 메시지를 전송
          io.emit("message", goodbyeMessage);
          
          // 현재 온라인 유저 목록을 업데이트하여 전송
          io.emit("userList", await userController.getOnlineUsers());
        }
      } catch (err) {
        console.error(err.message);
      }
    });
  });
};