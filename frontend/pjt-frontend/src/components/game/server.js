
import multiStore from '../../stores/multiStore.jsx';
import store from '../../store/store.js';
const baseUrl = "wss://www.ssafy11s.com";

const newSocket = () => {
  const roomId = multiStore.getState().roomId;
  
  const {
    userId,
    memberId,
    name,
  } = store((state) => ({
    userId: state.userId,
    name: state.name,
    memberId: state.memberId,
  }));

  const url = `${baseUrl}/multi?roomId=${roomId}&userId=${memberId}&username=${name}`;
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


