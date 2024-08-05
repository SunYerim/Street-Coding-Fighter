import Header from "../components/Header";
import "../../../css/BattleGamePage.css";
import store from "../../../store/store.js";
import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import createAuthClient from "../apis/createAuthClient.js";

import SockJS from "sockjs-client/dist/sockjs";
import Stomp from "stompjs";

import DragNDropQuiz from "../../../components/game/quiz_with_blank/DragNDropQuiz.jsx";
import ShortAnswer from "../../../components/game/short_answer/ShortAnswer";

import Modal from "react-modal";

Modal.setAppElement("#root");

const BattleGamePage = () => {
  const battleStompClient = useRef(null);
  const chatStompClient = useRef(null);
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
  const [ws, setWs] = useState(null);
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

  // WebSocket 연결 및 초기화 함수
  const connect = async () => {
    const battleSocket = new SockJS(`${baseURL}/ws-battle`);
    const chatSocket = new SockJS(`${baseURL}/ws-chat`);
    battleStompClient.current = Stomp.over(battleSocket);
    chatStompClient.current = Stomp.over(chatSocket);

    return new Promise((resolve, reject) => {
      battleStompClient.current.connect(
        {},
        (frame) => {
          console.log("Connected: " + frame);
          setIsBattleConnected(true);
          subscribeEnterRoom();
          subscribeEnemyProblem();
          subscribeMyProblem();
          subscribeRoundResult();
          subscribeTotalResult();
          console.log("배틀 서버 연결");

          chatStompClient.current.connect(
            {},
            (frame) => {
              console.log("Connected: " + frame);
              setIsChatConnected(true);
              subscribeMessage();
              console.log("채팅 서버 연결");
              resolve();
            },
            (error) => {
              console.log(error);
              reject(error);
            }
          );
        },
        (error) => {
          console.log(error);
          reject(error);
        }
      );
    });
  };

  const enterRoom = () => {
    const joinRoomDTO = {
      userId: userId,
      username: name,
      roomPassword: roomPassword,
    };
    battleStompClient.current.send(
      `/game/${roomId}/join`,
      {},
      JSON.stringify(joinRoomDTO)
    );
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
    const endpoint = `/game/${roomId}/selectProblem`;
    const headers = {
      memberId: memberId.toString(),
    };
    battleStompClient.current.send(
      endpoint,
      headers,
      JSON.stringify({ problemId: problemId })
    );
    setSelectOpponentProblem(true);
  };

  const subscribeMyProblem = () => {
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
    const endpoint = `/game/${roomId}/answer`;
    const submitAnswerDTO = {
      problemId: myProblem.problemId,
      userId: userId,
      solve: {},
      submitTime: count,
      roomId: roomId,
      round: currentRound,
    };
    battleStompClient.current.send(
      endpoint,
      {},
      JSON.stringify(submitAnswerDTO)
    );
  }, []);

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
    const endpoint = `/send/chat/${roomId}/enter`;
    const enterDTO = {
      sender: name,
      content: `${name}님이 입장하셨습니다.`,
      type: "JOIN",
      roomId: roomId,
    };
    chatStompClient.current.send(endpoint, {}, JSON.stringify(enterDTO));
  };

  // const subscribeEnterMessage = () => {
  //   const endpoint = `${baseURL}/${wsChat}/send/chat/${roomId}/enter`;
  //   stompClient.subscribe(endpoint, (message) => {
  //     const body = JSON.parse(message.body);
  //     setChatMessages((prevMessages) => [
  //       ...prevMessages,
  //       `${body.sender}님이 입장하셨습니다.`,
  //     ]);
  //   });
  // };

  const sendMessage = async () => {
    console.log("send message");
    const endpoint = `/send/chat/${roomId}`;
    const chatMessage = {
      sender: name,
      content: message,
      type: "CHAT",
      roomId: roomId,
    };
    chatStompClient.current.send(endpoint, {}, JSON.stringify(chatMessage));
    setMessage("");
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
    const endpoint = `/send/chat/${roomId}/leave`;
    const chatMessage = {
      sender: name,
      content: `${name}님이 퇴장하셨습니다.`,
      type: "LEAVE",
      roomId: roomId,
    };
    chatStompClient.current.send(endpoint, {}, JSON.stringify(chatMessage));
  };

  // const subscribeQuitMessage = () => {
  //   const endpoint = `${baseURL}/${wsChat}/room/${roomId}`;
  //   stompClient.subscribe(endpoint, (message) => {
  //     const body = JSON.parse(message.body);
  //     setChatMessages((prevMessages) => [
  //       ...prevMessages,
  //       `${body.sender}님이 퇴장하셨습니다.`,
  //     ]);
  //   });
  // };

  useEffect(() => {
    const initializeConnections = async () => {
      try {
        await connect();
        await enterRoom();
        await enterChat();
      } catch (error) {
        console.log("Connection error:", error);
      }
    };

    initializeConnections();

    return () => {
      sendQuitMessage();
      if (battleStompClient.current) battleStompClient.current.disconnect();
      if (chatStompClient.current) chatStompClient.current.disconnect();
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
    <>
      <div className="battle-game-entire-container">
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Example Modal"
          className="battle-game-select-problem-modal"
          overlayClassName="overlay"
        >
          {gameEnded ? (
            <div className="battle-game-result-container">
              <div className="battle-game-result-title">
                <div className="battle-game-result-title-container">
                  게임 결과
                </div>
              </div>
              <div className="battle-game-result-content">
                {winner === userId ? "승리했습니다!" : "패배했습니다."}
              </div>
              <div className="battle-game-result-footer">
                {count2}초 후 방 목록 화면으로 이동합니다.
              </div>
            </div>
          ) : selectOpponentProblem ? (
            <div className="battle-game-select-problem-title">
              상대방이 문제를 선택하는 중입니다.
            </div>
          ) : (
            <>
              <div className="battle-game-select-problem-title">
                상대방이 풀 문제를 선택 해주세요.
              </div>
              <div className="battle-game-select-problem-container">
                {Array.isArray(EnemyProblems) &&
                  EnemyProblems.map((data, index) => (
                    <div
                      className="battle-game-select-problem"
                      onClick={() => selectEnemyProblem(data.problemId)}
                      key={index}
                    >
                      <div className="battle-game-select-problem-sub-title">
                        {data.title}
                      </div>
                      <hr />
                      <div className="battle-game-select-problem-type">
                        {data.problemType}
                      </div>
                      <div className="battle-game-select-problem-category">
                        {data.category}
                      </div>
                      <div className="battle-game-select-problem-difficulty">
                        {data.difficulty}
                      </div>
                    </div>
                  ))}
              </div>
            </>
          )}
        </Modal>
        <Header />
        <div className="battle-game-outer-outer-container">
          <div className="battle-game-outer-container">
            <div className="battle-game-title-container">
              <div className="health-bar">
                <div
                  className="health-bar-inner"
                  style={{ width: `${player1Health}%` }}
                ></div>
              </div>
              <h2 className="battle-game-title">Round {currentRound}</h2>
              <div className="health-bar">
                <div
                  className="health-bar-inner"
                  style={{ width: `${player2Health}%` }}
                ></div>
              </div>
            </div>
            <div className="battle-game-sub-title-container">
              <div className="battle-game-sub-title-player">{name}</div>
              <div className="battle-game-sub-title-timer">{count}</div>
              <div className="battle-game-sub-title-player">{enemyName}</div>
            </div>
            <div className="battle-game-container">
              <div className="battle-game-left-container">
                <div className="battle-game-left-cam"></div>
                <div className="battle-game-history-container">
                  <div className="battle-game-history">
                    <div className="battle-game-history-title">전투 기록</div>
                    {battleHistory.map((data, index) => (
                      <div className="battle-game-history-message" key={index}>
                        {data.isAttack === true
                          ? `${data.userId}님이 플레이어 2님에게 ${data.power}만큼 데미지를 주었습니다.`
                          : `${data.userId}님이 ${data.power}만큼 체력을 회복하였습니다.`}
                      </div>
                    ))}
                    <div ref={battleHistoryEndRef} />
                  </div>
                </div>
              </div>
              <div className="battle-game-inner-container">
                {gameStart ? (
                  <>
                    {renderQuestion(myProblem)}
                    <button
                      onClick={handleSubmit}
                      className="battle-game-submit-answer"
                    >
                      답안 제출
                    </button>
                  </>
                ) : (
                  <div className="battle-game-game-start-container">
                    <div className="battle-game-game-start-title">
                      게임 시작 전입니다.
                    </div>
                    {hostId === "" ? (
                      <div className="battle-game-game-start-waiting">
                        대기 중...
                      </div>
                    ) : (
                      <button
                        onClick={handleStart}
                        className="battle-game-game-start-button"
                      >
                        게임 시작
                      </button>
                    )}
                  </div>
                )}
              </div>
              <div className="battle-game-right-container">
                <div className="battle-game-right-cam"></div>
                <div className="battle-game-chatting-container">
                  <div className="battle-game-chatting">
                    {chatMessages.map((msg, index) => (
                      <div className="battle-game-chatting-message" key={index}>
                        {msg}
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
                      onKeyUp={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                    />
                    <button type="button" onClick={sendMessage}>
                      전송
                    </button>
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
