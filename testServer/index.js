const express = require("express");
const expressWs = require("express-ws");
const cors = require("cors");

const app = express();
expressWs(app);

const port = 3000;

app.use(express.json());

const rooms = {};

// WebSocket 채팅 경로
app.ws("/ws-chat", (ws, req) => {
  ws.on("message", (msg) => {
    const message = JSON.parse(msg);
    const { roomId, type, content, sender } = message;

    if (type === "JOIN") {
      if (!rooms[roomId]) {
        rooms[roomId] = { users: [], chatHistory: [] };
      }
      rooms[roomId].users.push({ ws, sender });
      rooms[roomId].chatHistory.push(`${sender}님이 입장하셨습니다.`);

      broadcast(roomId, {
        type: "CHAT",
        content: `${sender}님이 입장하셨습니다.`,
      });
    } else if (type === "CHAT") {
      rooms[roomId].chatHistory.push(`${sender}: ${content}`);
      broadcast(roomId, { type: "CHAT", content: `${sender}: ${content}` });
    } else if (type === "LEAVE") {
      rooms[roomId].users = rooms[roomId].users.filter(
        (user) => user.ws !== ws
      );
      rooms[roomId].chatHistory.push(`${sender}님이 퇴장하셨습니다.`);

      broadcast(roomId, {
        type: "CHAT",
        content: `${sender}님이 퇴장하셨습니다.`,
      });
    }
  });

  ws.on("close", () => {
    for (const roomId in rooms) {
      rooms[roomId].users = rooms[roomId].users.filter(
        (user) => user.ws !== ws
      );
    }
  });
});

// WebSocket 배틀 경로
app.ws("/ws-battle", (ws, req) => {
  ws.on("message", (msg) => {
    const message = JSON.parse(msg);
    const { roomId, type, userId, problemId, answer } = message;

    if (type === "ENTER") {
      if (!rooms[roomId]) {
        rooms[roomId] = { users: [], battleHistory: [] };
      }
      rooms[roomId].users.push({ ws, userId });
      rooms[roomId].battleHistory.push(`${userId}님이 입장하셨습니다.`);

      broadcast(roomId, {
        type: "JOIN",
        userId,
        message: `${userId}님이 입장하셨습니다.`,
      });
    } else if (type === "SELECT_PROBLEM") {
      rooms[roomId].battleHistory.push(`${userId}님이 문제를 선택했습니다.`);
      broadcast(roomId, { type: "PROBLEM", userId, problemId });
    } else if (type === "ANSWER") {
      rooms[roomId].battleHistory.push(`${userId}님이 답을 제출했습니다.`);
      broadcast(roomId, { type: "ANSWER", userId, answer });
    }
  });

  ws.on("close", () => {
    for (const roomId in rooms) {
      rooms[roomId].users = rooms[roomId].users.filter(
        (user) => user.ws !== ws
      );
    }
  });
});

function broadcast(roomId, message) {
  rooms[roomId].users.forEach((user) => {
    user.ws.send(JSON.stringify(message));
  });
}

app.use(
  cors({
    origin: "http://localhost:5173", // 여기에 클라이언트의 주소를 입력하세요.
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
