// import {io} from "socket.io-client"
// const socket = io("http://localhost:5001")

// export default socket;

// import {io} from "socket.io-client";

// const baseUrl = "localhost:8080";

// // const socket = io("ws://localhost:8080/multi?roomId=57a121ab-cb36-4a53-8b88-b38ad91154ee&userId=24&username=Ethan");

// const socket = (roomId, userId, username) => {
//   socket = io(`ws://${baseUrl}/multi?roomId=${roomId}&userId=${userId},username=${username}`);
//   return socket;
// };

// export default socket;


// import { io } from "socket.io-client";

// const baseUrl = "localhost:8080";

// const newSocket = (roomId, userId, username) => {
//   const socket = io(`ws://${baseUrl}/multi`, {
//     query: {
//       roomId: roomId,
//       userId: userId,
//       username: username
//     },
//     transports: ['websocket'] // WebSocket을 사용하도록 설정
//   });

//   socket.on('connect', () => {
//     console.log('WebSocket connection established');
//   });

//   socket.on('message', (message) => {
//     console.log('WebSocket message received:', message);
//   });

//   socket.on('disconnect', () => {
//     console.log('WebSocket connection closed');
//   });

//   socket.on('error', (error) => {
//     console.error('WebSocket error:', error);
//   });

//   return socket;
// };

// export default newSocket;

const baseUrl = "localhost:8080";

const newSocket = (roomId, userId, username) => {
  const url = `ws://${baseUrl}/multi?roomId=${roomId}&userId=${userId}&username=${username}`;
  console.log(url);
  const socket = new WebSocket(url);

  socket.onopen = () => {
    console.log('WebSocket connection established');
  };

  socket.onmessage = (event) => {
    console.log('WebSocket message received:', event.data);
  };

  socket.onclose = () => {
    console.log('WebSocket connection closed');
  };

  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  return socket;
};

export default newSocket;


