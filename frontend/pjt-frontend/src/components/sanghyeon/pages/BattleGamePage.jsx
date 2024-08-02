import Header from "../components/Header";
import "../../../css/BattleGamePage.css";
import store from "../../../store/store.js";
import { useEffect, useState, useRef } from "react";

const BattleGamePage = () => {
  const { memberId } = store((state) => ({
    memberId: state.memberId,
  }));

  // 상태 변수 및 웹소켓 변수
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [ws, setWs] = useState(null);
  const chatEndRef = useRef(null); // 채팅 끝부분을 참조하기 위한 ref

  useEffect(() => {
    // 웹소켓 연결 설정
    const socket = new WebSocket("ws://localhost:8080");
    setWs(socket);

    socket.onmessage = (event) => {
      const receivedMessage = JSON.parse(event.data);
      setChatMessages((prevMessages) => [...prevMessages, receivedMessage]);
    };

    socket.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      socket.close();
    };
  }, []); // 빈 배열을 의존성으로 설정하여 초기 렌더링 시 한 번만 실행

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]); // chatMessages가 변경될 때마다 실행

  // 메시지 전송 함수
  const sendMessage = () => {
    if (ws && message.trim() !== "") {
      const msg = {
        memberId: memberId,
        text: message,
      };
      ws.send(JSON.stringify(msg));
      setMessage("");
    }
  };

  // 더미 데이터
  useEffect(() => {
    const dummyMessages = Array.from({ length: 10 }, (_, i) => ({
      memberId: `user${i + 1}`,
      text: `This is a dummy message ${i + 1}`,
    }));
    setChatMessages(dummyMessages);
  }, []);

  return (
    <>
      <div className="battle-game-entire-container">
        <Header />
        <div className="battle-game-outer-outer-container">
          <div className="battle-game-outer-container">
            <div className="battle-game-title-container">
              <h2 className="battle-game-title">타이머: 30</h2>
            </div>
            <div className="battle-game-container">
              <div className="battle-game-left-container">
                <div className="battle-game-left-cam"></div>
                <div className="battle-game-history-container">
                  <div className="battle-game-ranking-title">전투 기록</div>
                  <div className="battle-game-ranking">-10</div>
                  <div className="battle-game-ranking">+20</div>
                  <div className="battle-game-ranking">-5</div>
                  <div className="battle-game-ranking">-10</div>
                </div>
              </div>
              <div className="battle-game-inner-container"></div>
              <div className="battle-game-right-container">
                <div className="battle-game-right-cam"></div>
                <div className="battle-game-chatting-container">
                  <div className="battle-game-chatting">
                    {chatMessages.map((msg, index) => (
                      <div className="battle-game-chatting-message" key={index}>
                        {msg.memberId}: {msg.text}
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>
                  <div className="battle-game-chat-input">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="메시지를 입력하세요"
                    />
                    <button onClick={sendMessage}>전송</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BattleGamePage;
