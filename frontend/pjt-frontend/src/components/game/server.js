// import {io} from "socket.io-client"
// const socket = io("http://localhost:5001")

// export default socket;

import {io} from "socket.io-client";

let socket;

const baseUrl = "192.168.30.171:8080";

const connectSocket = (roomId) => {
  socket = io(`http://${baseUrl}/${roomId}`);
  return socket;
};

export default connectSocket;
