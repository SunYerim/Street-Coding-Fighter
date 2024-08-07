
// import multiStore from '../../stores/multiStore.jsx';
// import store from '../../store/store.js';

const newSocket = (roomId, memberId, name) => {
  // const roomId = multiStore.getState().roomId;

  // const {
  //   memberId,
  //   name,
  // } = store((state) => ({
  //   name: state.name,
  //   memberId: state.memberId,
  // }));
  const baseUrl = "wss://www.ssafy11s.com";

  const url = `${baseUrl}/ws-multi?roomId=${roomId}&userId=${memberId}&username=${name}`;
  console.log("Connecting to WebSocket URL:", url); 
  const socket = new WebSocket(url);

  socket.onopen = () => {
    console.log('WebSocket connection established');
    setInterval(() => {
      console.log('bufferedAmount:', socket.bufferedAmount);
    }, 1000);
  };

  socket.onmessage = (event) => {
    console.log('WebSocket message received:', event.data);
  };

  socket.onclose = (event) => {
    console.log('WebSocket connection closed:', event);
  };

  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  return socket;
};

export default newSocket;


