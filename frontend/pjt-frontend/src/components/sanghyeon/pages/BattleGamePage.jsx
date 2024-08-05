import Header from "../components/Header";
import "../../../css/BattleGamePage.css";
import store from "../../../store/store.js";
import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import createAuthClient from "../apis/createAuthClient.js";

import SockJS from "sockjs-client";
import * as StompJs from "@stomp/stompjs";

import DragNDropQuiz from "../../../components/game/quiz_with_blank/DragNDropQuiz.jsx";
import ShortAnswer from "../../../components/game/short_answer/ShortAnswer";

import Modal from "react-modal";

Modal.setAppElement("#root");

const BattleGamePage = () => {
  const navigate = useNavigate();

  const {
    memberId,
    accessToken,
    setAccessToken,
    hostId,
    userId,
    name,
    roomId,
    roomPassword,
    baseURL,
    wsBattle,
    wsChat,
    enemyId,
    setEnemyId,
    enemyName,
    setEnemyName,
  } = store((state) => ({
    memberId: state.memberId,
    accessToken: state.accessToken,
    setAccessToken: state.setAccessToken,
    hostId: state.hostId,
    userId: state.userId,
    name: state.name,
    roomId: state.roomId,
    roomPassword: state.roomPassword,
    baseURL: state.baseURL,
    wsBattle: state.wsBattle,
    wsChat: state.wsChat,
    enemyId: state.enemyId,
    setEnemyId: state.setEnemyId,
    enemyName: state.enemyName,
    setEnemyName: state.setEnemyName,
  }));

  const authClient = createAuthClient(
    baseURL,
    () => accessToken,
    setAccessToken
  );

  const [chatMessages, setChatMessages] = useState([]);
  const [battleHistory, setBattleHistory] = useState([]);
  const [message, setMessage] = useState("");
  const chatEndRef = useRef(null);
  const battleHistoryEndRef = useRef(null);
  const [player1Health, setPlayer1Health] = useState(100);
  const [player2Health, setPlayer2Health] = useState(100);

  const [currentRound, setCurrentRound] = useState(0);
  const [EnemyProblems, setEnemyProblems] = useState([]);
  const [count, setCount] = useState(30);
  const [timerEnded, setTimerEnded] = useState(false);
  const [gameStart, setGameStart] = useState(false);
  const [myProblem, setMyProblem] = useState(null);
  const [selectOpponentProblem, setSelectOpponentProblem] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [winner, setWinner] = useState("");
  const [loser, setLoser] = useState("");
  const [count2, setCount2] = useState(5);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);

  const [isBattleConnected, setIsBattleConnected] = useState(false);
  const [isChatConnected, setIsChatConnected] = useState(false);

  // ---------------------- WebSocket ----------------------

  let battleStompClient = useRef(null);
  let chatStompClient = useRef(null);

  const connect = () => {
    battleStompClient.current = new StompJs.Client({
      brokerURL: `${baseURL}/ws-battle`,
      connectHeaders: {},
      debug: function (str) {
        console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: (frame) => {
        console.log("Connected: " + frame);
        setIsBattleConnected(true);

        subscribeEnterRoom();
        subscribeEnemyProblem();
        subsribeMyProblem();
        subscribeRoundResult();
        subscribeTotalResult();
        enterRoom(); // battle websocket 연결 후 방 입장
      },
      onStompError: (frame) => {
        console.log("Broker reported error: " + frame.headers["message"]);
        console.log("Additional details: " + frame.body);
      },
    });

    chatStompClient.current = new StompJs.Client({
      brokerURL: `${baseURL}/ws-chat`,
      connectHeaders: {},
      debug: function (str) {
        console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: (frame) => {
        console.log("Connected: " + frame);

        setIsChatConnected(true);
        subscribeMessage();
        enterChat(); // chat websocket 연결 후 방 입장
        console.log("채팅 서버 연결");
      },
      onStompError: (frame) => {
        console.log("Broker reported error: " + frame.headers["message"]);
        console.log("Additional details: " + frame.body);
      },
    });

    battleStompClient.current.activate();
    chatStompClient.current.activate();
  };

  const enterRoom = () => {
    if (isBattleConnected && battleStompClient.current) {
      const joinRoomDTO = {
        userId: userId,
        username: name,
        roomPassword: roomPassword,
      };
      battleStompClient.current.publish({
        destination: `/game/${roomId}/join`,
        body: JSON.stringify(joinRoomDTO),
      });
    } else {
      console.log("Not connected yet");
    }
  };

  const subscribeEnterRoom = () => {
    const endpoint = `/game/${roomId}/join`;
    battleStompClient.current.subscribe(endpoint, (message) => {
      const body = JSON.parse(message.body);
      setChatMessages((prevMessages) => [
        ...prevMessages,
        `${body.username}님이 입장하셨습니다.`,
      ]);

      if (body.userId !== userId) {
        setEnemyId(body.userId);
        setEnemyName(body.username);
      }
    });
  };

  const subscribeEnemyProblem = () => {
    const endpoint = `/room/${roomId}/RoundChoiceProblem`;
    battleStompClient.current.subscribe(endpoint, (message) => {
      const body = JSON.parse(message.body);
      setEnemyProblems(body);
      openModal();
      setCurrentRound((prevRound) => prevRound + 1);
    });
  };

  const selectEnemyProblem = (problemId) => {
    if (isBattleConnected && battleStompClient.current) {
      const endpoint = `/game/${roomId}/selectProblem`;
      battleStompClient.current.publish({
        destination: endpoint,
        body: JSON.stringify({ problemId: problemId }),
      });
      setSelectOpponentProblem(true);
    } else {
      console.log("Not connected yet");
    }
  };

  const subsribeMyProblem = () => {
    const endpoint = `/room/${roomId}/${userId}`;
    battleStompClient.current.subscribe(endpoint, (message) => {
      console.log(message);
      const body = JSON.parse(message.body);
      setMyProblem(body);
      closeModal();
      setSelectOpponentProblem(false);
      setGameStart(true);
      startTimer();
    });
  };

  // 답변 제출 미완성
  const submitAnswer = useCallback(() => {
    if (isBattleConnected && battleStompClient.current) {
      const endpoint = `/game/${roomId}/answer`;
      const submitAnswerDTO = {
        problemId: myProblem.problemId,
        userId: userId,
        solve: {},
        submitTime: count,
        roomId: roomId,
        round: currentRound,
      };
      battleStompClient.current.publish({
        destination: endpoint,
        body: JSON.stringify(submitAnswerDTO),
      });
    } else {
      console.log("Not connected yet");
    }
  }, [isBattleConnected, myProblem, userId, count, roomId, currentRound]);

  // 체력 반영 미완성
  const subscribeRoundResult = () => {
    const endpoint = `/room/${roomId}`;
    battleStompClient.current.subscribe(endpoint, (message) => {
      const body = JSON.parse(message.body);
      console.log(body);
    });
  };

  const subscribeTotalResult = () => {
    const endpoint = `/room/${roomId}`;
    battleStompClient.current.subscribe(endpoint, (message) => {
      const body = JSON.parse(message.body);
      setGameEnded(true);
      setWinner(body.winner);
      setLoser(body.loser);

      setTimeout(() => {
        navigate("/battle-list");
      }, 5);
    });
  };

  const enterChat = () => {
    if (isChatConnected && chatStompClient.current) {
      const endpoint = `/send/chat/${roomId}/enter`;
      const enterDTO = {
        sender: name,
        content: `${name}님이 입장하셨습니다.`,
        type: "JOIN",
        roomId: roomId,
      };
      chatStompClient.current.publish({
        destination: endpoint,
        body: JSON.stringify(enterDTO),
      });
    } else {
      console.log("Not connected yet");
    }
  };

  const sendMessage = () => {
    if (isChatConnected && chatStompClient.current) {
      const endpoint = `/send/chat/${roomId}`;
      const chatMessage = {
        sender: name,
        content: message,
        type: "CHAT",
        roomId: roomId,
      };
      chatStompClient.current.publish({
        destination: endpoint,
        body: JSON.stringify(chatMessage),
      });
    } else {
      console.log("Not connected yet");
    }
  };

  const subscribeMessage = () => {
    const endpoint = `/room/${roomId}`;
    chatStompClient.current.subscribe(endpoint, (message) => {
      const body = JSON.parse(message.body);
      setChatMessages((prevMessages) => [
        ...prevMessages,
        body.type === "CHAT"
          ? `${body.sender}: ${body.content}`
          : `${body.content}`,
      ]);
    });
  };

  const sendQuitMessage = () => {
    if (isChatConnected && chatStompClient.current) {
      const endpoint = `/send/chat/${roomId}/leave`;
      const chatMessage = {
        sender: name,
        content: `${name}님이 퇴장하셨습니다.`,
        type: "LEAVE",
        roomId: roomId,
      };
      chatStompClient.current.publish({
        destination: endpoint,
        body: JSON.stringify(chatMessage),
      });
    } else {
      console.log("Not connected yet");
    }
  };

  useEffect(() => {
    const initializeConnections = async () => {
      try {
        await connect();
      } catch (error) {
        console.log("Connection error:", error);
      }
    };

    initializeConnections();

    return () => {
      sendQuitMessage();
      if (battleStompClient.current) battleStompClient.current.deactivate();
      if (chatStompClient.current) chatStompClient.current.deactivate();
    };
  }, []);

  // ---------------------- WebSocket ----------------------

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  useEffect(() => {
    battleHistoryEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [battleHistory]);

  useEffect(() => {
    if (count === 0) {
      submitAnswer();
    }
  }, [count]);

  useEffect(() => {
    if (gameEnded && count2 === 0) {
      navigate("/battle-list");
    } else if (gameEnded === true) {
      const timer = setInterval(() => {
        setCount2((prevCount) => prevCount - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [count2, navigate]);

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleStart = async () => {
    try {
      const handleStartRes = await authClient({
        method: "POST",
        url: `${baseURL}/battle/room/${roomId}/start`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log("game start!");
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = () => {
    if (answerSubmitted === true) {
      alert("이미 답안을 제출하셨습니다.");
    } else {
      submitAnswer();
    }
  };

  const startTimer = () => {
    setCount(30);
    const timerInterval = setInterval(() => {
      setCount((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(timerInterval);
          // endRound();
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);
  };

  const renderQuestion = (problem) => {
    switch (problem.type) {
      case "빈 칸 채우기":
        return <DragNDropQuiz problem={problem} />;
      case "주관식":
        return <ShortAnswer problem={problem} />;
      default:
        return <div>Unknown problem type</div>;
    }
  };

  return (
    <div>
      <Header />
      <div className="battle-game-container">
        <div className="chat-box">
          <div className="messages">
            {chatMessages.map((msg, index) => (
              <div key={index}>{msg}</div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
        </div>

        <div className="battle-box">
          <div className="battle-history">
            <h2>Battle History</h2>
            {battleHistory.map((entry, index) => (
              <div key={index}>{entry}</div>
            ))}
            <div ref={battleHistoryEndRef} />
          </div>

          <div className="health-box">
            <div className="health-bar">
              <span>Player 1: {player1Health}</span>
              <div
                className="health-fill"
                style={{ width: `${player1Health}%` }}
              />
            </div>
            <div className="health-bar">
              <span>Player 2: {player2Health}</span>
              <div
                className="health-fill"
                style={{ width: `${player2Health}%` }}
              />
            </div>
          </div>

          {gameStart && !timerEnded && (
            <div className="timer">Time Left: {count2}s</div>
          )}

          {!gameEnded && !gameStart && (
            <div className="problem-selection">
              <h2>Select Your Problem</h2>
              <div className="problem-list">
                {enemyProblems.map((problem) => (
                  <button
                    key={problem.problemId}
                    onClick={() => selectEnemyProblem(problem.problemId)}
                  >
                    {problem.problemTitle}
                  </button>
                ))}
              </div>
            </div>
          )}

          {gameStart && myProblem && (
            <div className="problem-area">
              {myProblem.type === "drag_and_drop" ? (
                <DragNDropQuiz problem={myProblem} />
              ) : (
                <ShortAnswer problem={myProblem} />
              )}
              <button onClick={handleAnswer}>Submit Answer</button>
            </div>
          )}

          {gameEnded && (
            <div className="result">
              <h2>{winner} wins!</h2>
              <h3>{loser} loses!</h3>
            </div>
          )}
        </div>
      </div>

      <Modal
        id="problemModal"
        isOpen={true}
        onRequestClose={closeModal}
        contentLabel="Select Problem"
      >
        <h2>Select a Problem</h2>
        <div className="modal-content">
          {enemyProblems.map((problem) => (
            <button
              key={problem.problemId}
              onClick={() => {
                selectEnemyProblem(problem.problemId);
                closeModal();
              }}
            >
              {problem.problemTitle}
            </button>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default BattleGamePage;
