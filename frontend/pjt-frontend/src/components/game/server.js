
const newSocket = (roomId, memberId, name) => {

  const baseUrl = "wss://www.ssafy11s.com";

  const url = `${baseUrl}/ws-multi?roomId=${roomId}&userId=${memberId}&username=${name}`;
  console.log(url);
  const socket = new WebSocket(url);

  socket.onopen = () => {
    console.log('WebSocket connection established');
  };

  socket.onmessage = (event) => {
    console.log('WebSocket message received:', event.data);
  };

  socket.onclose = (event) => {
    console.log('WebSocket connection closed');
    console.log(`Close code: ${event.code}, reason: ${event.reason}, wasClean: ${event.wasClean}`);
  };

  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  return socket;
};

export default newSocket;


