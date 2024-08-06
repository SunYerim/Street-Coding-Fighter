
import multiStore from '../../stores/multiStore.jsx';
const baseUrl = "www.ssafy11s.com";

const newSocket = () => {
  const roomId = multiStore.getState().roomId;
  const userId = multiStore.getState().userId;
  const username = multiStore.getState().username;

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


