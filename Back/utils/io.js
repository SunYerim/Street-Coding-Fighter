const userController = require("../Controllers/user.controller.js")
const chatController = require("../Controllers/chat.controller.js")
const problemController = require("../Controllers/problem.controller.js")

let headerUser = null;

module.exports = function (io) {
  io.on('connection', async(socket) => {
    console.log('New client connected',socket.id);
    io.emit("headerUser", headerUser);

    // 유저가 입장했다는 메시지를 생성
    socket.on("login", async(userName, cb) => {
      try {
        const user = await userController.saveUser(userName, socket.id);

        // 첫 번째 사용자일 경우 방장으로 설정
        if (!headerUser) {
          headerUser = user.name;
          io.emit("headerUser", headerUser);
          console.log(headerUser);
        }

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

    socket.on("requestProblems", async (gameRound, cb) => {
      try {
        const problems = await problemController.getProblems(gameRound);
        // io.emit("problems", problems)
        // console.log(problems);
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

          // 방장이 나갔을 경우 새로운 방장 설정
          if (headerUser === user.name) {
            headerUser = onlineUsers.length > 0 ? onlineUsers[0].name : null;
            io.emit("headerUser", headerUser);
          }

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