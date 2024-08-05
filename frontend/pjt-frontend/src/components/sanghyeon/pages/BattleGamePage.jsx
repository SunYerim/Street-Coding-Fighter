import Header from "../components/Header";
import "../../../css/BattleGamePage.css";
import store from "../../../store/store.js";
import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import createAuthClient from "../apis/createAuthClient.js";

import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

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
    setEnemyId,
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
    setEnemyId: state.setEnemyId,
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
  const [enemyProblems, setEnemyProblems] = useState([]);
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

  let battleClient = null;
  let chatClient = null;

  const connect = async () => {
    const battleSocket = new SockJS(`${baseURL}/ws-battle`);
    const chatSocket = new SockJS(`${baseURL}/ws-chat`);

    battleClient = new Client({
      webSocketFactory: () => battleSocket,
      connectHeaders: {},
      debug: (str) => console.log("STOMP debug:", str),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: (frame) => {
        console.log("Connected to battle server:", frame);
        setIsBattleConnected(true);
        subscribeEnterRoom();
        subscribeEnemyProblem();
        subscribeMyProblem();
        subscribeRoundResult();
        subscribeTotalResult();
      },
      onDisconnect: () => setIsBattleConnected(false),
      onStompError: (frame) => console.error("STOMP Error:", frame),
    });

    chatClient = new Client({
      webSocketFactory: () => chatSocket,
      connectHeaders: {},
      debug: (str) => console.log("STOMP debug:", str),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: (frame) => {
        console.log("Connected to chat server:", frame);
        setIsChatConnected(true);
        subscribeMessage();
        enterChat();
      },
      onDisconnect: () => setIsChatConnected(false),
      onStompError: (frame) => console.error("STOMP Error:", frame),
    });

    battleClient.activate();
    chatClient.activate();
  };

  const enterRoom = () => {
    const joinRoomDTO = {
      userId: userId,
      username: name,
      roomPassword: roomPassword,
    };
    battleClient.publish({
      destination: `/game/${roomId}/join`,
      body: JSON.stringify(joinRoomDTO),
    });
  };

  const subscribeEnterRoom = () => {
    battleClient.subscribe(`/game/${roomId}/join`, (message) => {
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
    battleClient.subscribe(`/room/${roomId}/RoundChoiceProblem`, (message) => {
      const body = JSON.parse(message.body);
      setEnemyProblems(body);
      openModal();
      setCurrentRound((prevRound) => prevRound + 1);
    });
  };

  const selectEnemyProblem = (problemId) => {
    battleClient.publish({
      destination: `/game/${roomId}/selectProblem`,
      body: JSON.stringify({ problemId: problemId }),
    });
    setSelectOpponentProblem(true);
  };

  const subscribeMyProblem = () => {
    battleClient.subscribe(`/room/${roomId}/${userId}`, (message) => {
      const body = JSON.parse(message.body);
      setMyProblem(body);
      closeModal();
      setSelectOpponentProblem(false);
      setGameStart(true);
      startTimer();
    });
  };

  const submitAnswer = useCallback(async () => {
    if (isBattleConnected) {
      const endpoint = `/game/${roomId}/answer`;
      const submitAnswerDTO = {
        problemId: myProblem.problemId,
        userId: userId,
        solve: {},
        submitTime: count,
        roomId: roomId,
        round: currentRound,
      };
      battleClient.publish({
        destination: endpoint,
        body: JSON.stringify(submitAnswerDTO),
      });
    } else {
      console.log("Not connected yet");
    }
  }, [isBattleConnected, myProblem, userId, count, roomId, currentRound]);

  const subscribeRoundResult = () => {
    battleClient.subscribe(`/room/${roomId}`, (message) => {
      const body = JSON.parse(message.body);
      console.log(body);
    });
  };

  const subscribeTotalResult = () => {
    battleClient.subscribe(`/room/${roomId}`, (message) => {
      const body = JSON.parse(message.body);
      setGameEnded(true);
      setWinner(body.winner);
      setLoser(body.loser);

      setTimeout(() => {
        navigate("/battle-list");
      }, 5000); // Adjusted to 5000 ms for proper delay
    });
  };

  const enterChat = () => {
    const enterDTO = {
      sender: name,
      content: `${name}님이 입장하셨습니다.`,
      type: "JOIN",
      roomId: roomId,
    };
    chatClient.publish({
      destination: `/send/chat/${roomId}/enter`,
      body: JSON.stringify(enterDTO),
    });
  };

  const sendMessage = () => {
    const chatMessage = {
      sender: name,
      content: message,
      type: "CHAT",
      roomId: roomId,
    };
    chatClient.publish({
      destination: `/send/chat/${roomId}`,
      body: JSON.stringify(chatMessage),
    });
  };

  const subscribeMessage = () => {
    chatClient.subscribe(`/room/${roomId}`, (message) => {
      const body = JSON.parse(message.body);
      setChatMessages((prevMessages) => [
        ...prevMessages,
        body.type === "CHAT"
          ? `${body.sender}: ${body.content}`
          : `${body.content}`,
      ]);
    });
  };

  const sendQuitMessage = async () => {
    if (isChatConnected) {
      const chatMessage = {
        sender: name,
        content: `${name}님이 퇴장하셨습니다.`,
        type: "LEAVE",
        roomId: roomId,
      };
      chatClient.publish({
        destination: `/send/chat/${roomId}/leave`,
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
        await enterRoom();
      } catch (error) {
        console.error("Error connecting:", error);
      }
    };

    initializeConnections();

    return () => {
      if (battleClient) {
        battleClient.deactivate();
      }
      if (chatClient) {
        chatClient.deactivate();
      }
      sendQuitMessage();
    };
  }, [connect, enterRoom, sendQuitMessage]);

  useEffect(() => {
    if (answerSubmitted) {
      setAnswerSubmitted(false);
    }
  }, [answerSubmitted]);

  const openModal = () => {
    document.getElementById("problemModal").style.display = "block";
  };

  const closeModal = () => {
    document.getElementById("problemModal").style.display = "none";
  };

  const handleAnswer = () => {
    submitAnswer();
    setAnswerSubmitted(true);
    setTimerEnded(true);
  };

  const startTimer = () => {
    setCount(30);
    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setTimerEnded(true);
          handleAnswer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (count === 0) {
      setTimerEnded(true);
    }
  }, [count]);

  useEffect(() => {
    if (count2 === 0) {
      setGameStart(false);
    }
  }, [count2]);

  useEffect(() => {
    if (gameStart && !timerEnded) {
      setCount2((prev) => prev - 1);
    }
  }, [gameStart, timerEnded]);

  useEffect(() => {
    if (count2 === 0) {
      setGameStart(false);
    }
  }, [count2]);

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
