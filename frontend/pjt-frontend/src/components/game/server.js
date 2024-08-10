const newSocket = (roomId, memberId, name) => {
  const baseUrl = "wss://www.ssafy11s.com";
  const url = `${baseUrl}/ws-multi?roomId=${roomId}&userId=${memberId}&username=${name}`;
  console.log(url);

  let socket;
  let reconnectInterval = 1000; // 1초 후 재연결 시도

  const connect = () => {
    socket = new WebSocket(url);

    socket.onopen = () => {
      console.log('WebSocket connection established');
    };

    socket.onmessage = (event) => {
      console.log('WebSocket message received:', event.data);
    };

    socket.onclose = (event) => {
      console.log('WebSocket connection closed');
      console.log(`Close code: ${event.code}, reason: ${event.reason}, wasClean: ${event.wasClean}`);
      if (!event.wasClean) {
        console.log('Reconnecting...');
        setTimeout(connect, reconnectInterval); // 재연결 시도
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  };

  connect(); // 초기 연결 시도

  return socket;
};

export default newSocket;
