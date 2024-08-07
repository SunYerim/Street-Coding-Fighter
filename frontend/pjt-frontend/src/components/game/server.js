import multiStore from '../../stores/multiStore.jsx';

const newSocket = async (roomId, memberId, name) => {

  const {
    problems,
    start,
  } = multiStore((state) => ({
    setProblems: state.setProblems,
    setStart: state.setStart,
  }));

  const baseUrl = "wss://www.ssafy11s.com";

  const url = `${baseUrl}/ws-multi?roomId=${roomId}&userId=${memberId}&username=${name}`;
  console.log("Connecting to WebSocket URL:", url); 
  const socket = new WebSocket(url);

  socket.onopen = () => {
    console.log('WebSocket connection established');
  };

  socket.onmessage = (event) => {
    console.log('WebSocket message received:', event.data);
    if (data.type === 'gameStart') { // 게임스타트
      console.log("Game started 신호는 왔음");
      setStart(1);
      console.log(data.payload);
      const parsedPayload = JSON.parse(data.payload);
      setProblems(parsedPayload);
      console.log('parsedPayload: ', parsedPayload)
      console.log('parsedPayload.data: ', parsedPayload.data)
    }
  };

  socket.onclose = (event) => {
    console.log('WebSocket connection closed:', event);
  }

  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  return socket;
};

export default newSocket;


