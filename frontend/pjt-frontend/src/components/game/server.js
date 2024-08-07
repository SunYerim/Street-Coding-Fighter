
const newSocket = async (roomId, memberId, name) => {

  const baseUrl = "wss://www.ssafy11s.com";

  const url = `${baseUrl}/ws-multi?roomId=${roomId}&userId=${memberId}&username=${name}`;
  console.log("Connecting to WebSocket URL:", url); 
  const socket = new WebSocket(url);

  socket.onopen = () => {
    console.log('WebSocket connection established');
  };

  socket.onmessage = (event) => {
    console.log('WebSocket message received:', event.data);
  };

  socket.onclose = (event) => {
    console.log('WebSocket connection closed:', event);
    setTimeout(() => {
      newSocket(roomId, memberId, name);
    }, 2000);
  }

  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  return socket;
};

export default newSocket;


