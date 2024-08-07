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
import MultipleChoice from "../../../components/game/multipleChoice/MultipleChoice.jsx";

import Modal from "react-modal";
//음악 변경부분입니다. 아래 SoundStore import 해야됨
import SoundStore from "../../../stores/SoundStore.jsx";

Modal.setAppElement("#root");

const BattleGamePage = () => {
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  //-------------------게임페이지 들어왔을 때 음악변경-------------//
  const { switchBackgroundMusic, playBackgroundMusic, playEffectSound } =
    SoundStore();
  useEffect(() => {
    switchBackgroundMusic("single", (newBackgroundMusic) => {
      newBackgroundMusic.play();
    });
    return () => {
      switchBackgroundMusic("main", (newBackgroundMusic) => {
        newBackgroundMusic.play();
      });
    };
  }, []);

  // --------------------------페이지에서 나가면 다시 음악바뀝니다.-----------------------//
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
    normalQuit,
    setNormalQuit,
    blankSolve,
    setMyBlankProblem,
    shortAnswerSolve,
    setMyShortAnswerProblem,
    multipleChoiceSolve,
    setMyMultipleChoiceProblem,
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
    normalQuit: state.normalQuit,
    setNormalQuit: state.setNormalQuit,
    blankSolve: state.blankSolve,
    setMyBlankProblem: state.setMyBlankProblem,
    shortAnswerSolve: state.shortAnswerSolve,
    setMyShortAnswerProblem: state.setMyShortAnswerProblem,
    multipleChoiceSolve: state.multipleChoiceSolve,
    setMyMultipleChoiceProblem: state.setMyMultipleChoiceProblem,
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
  const [myHealth, setMyHealth] = useState(100);
  const [enemyHealth, setEnemy2Health] = useState(100);

  const [currentRound, setCurrentRound] = useState(0);
  const [EnemyProblems, setEnemyProblems] = useState([]);
  const [count, setCount] = useState(30);
  const [gameStart, setGameStart] = useState(false);
  const [myProblem, setMyProblem] = useState({});
  const [selectMyProblem, setSelectMyProblem] = useState(false);
  const [selectOpponentProblem, setSelectOpponentProblem] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [winner, setWinner] = useState("");
  const [loser, setLoser] = useState("");
  const [count2, setCount2] = useState(5);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);

  // ---------------------- WebSocket ----------------------

  // WebSocket 연결 및 초기화 함수

  const connect = () => {
    return new Promise((resolve, reject) => {
      const battleSocket = new SockJS(`${baseURL}/ws-battle`);
      const chatSocket = new SockJS(`${baseURL}/ws-chat`);
      battleStompClient.current = Stomp.over(battleSocket);
      chatStompClient.current = Stomp.over(chatSocket);

      let battleConnected = false;
      let chatConnected = false;

      // 배틀 서버 연결
      battleStompClient.current.connect(
        {},
        (frame) => {
          console.log("Connected to Battle Server: " + frame);
          subscribeEnterRoom();
          subscribeEnemyProblem();
          subscribeMyProblem(); // Typo fixed: changed from subsribeMyProblem to subscribeMyProblem
          subscribeResult();

          battleConnected = true;
          if (battleConnected && chatConnected) {
            resolve(); // 두 서버가 모두 연결되면 Promise를 해결합니다.
          }
        },
        (error) => {
          console.log("Battle server connection error:", error);
          reject(error); // 연결 실패 시 Promise 거부
        }
      );

      console.log("배틀 서버 연결 시도");

      // 채팅 서버 연결
      chatStompClient.current.connect(
        {},
        (frame) => {
          console.log("Connected to Chat Server: " + frame);

          subscribeMessage();

          console.log("채팅 서버 연결");

          chatConnected = true;
          if (battleConnected && chatConnected) {
            resolve(); // 두 서버가 모두 연결되면 Promise를 해결합니다.
          }
        },
        (error) => {
          console.log("Chat server connection error:", error);
          reject(error); // 연결 실패 시 Promise 거부
        }
      );

      console.log("채팅 서버 연결 시도");
    });
  };

  const enterRoom = () => {
    const joinRoomDTO = {
      userId: memberId,
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

      if (body.memberId !== memberId) {
        setEnemyId(body.memberId);
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
    const endpoint = `/send/game/${roomId}/selectProblem`;
    const payload = {
      problemId: problemId,
      memberId: memberId, // payload에 memberId 추가
    };

    battleStompClient.current.send(endpoint, {}, JSON.stringify(payload));
    setSelectOpponentProblem(true);
  };

  const subscribeMyProblem = () => {
    const endpoint = `/room/${roomId}/${memberId}`;
    battleStompClient.current.subscribe(endpoint, (message) => {
      setMyProblem(JSON.parse(message.body));

      const responseProblem = JSON.parse(message.body);
      console.log(responseProblem);
      switch (responseProblem.problemType) {
        case "FILL_IN_THE_BLANK":
          setMyBlankProblem(responseProblem);
          break;
        case "SHORT_ANSWER_QUESTION":
          setMyShortAnswerProblem(responseProblem);
          break;
        default:
          setMyMultipleChoiceProblem(responseProblem);
      }
      setSelectMyProblem(true);
    });
  };

  useEffect(() => {
    if (selectOpponentProblem && selectMyProblem) {
      setSelectMyProblem(false);
      setSelectOpponentProblem(false);
      closeModal();
      setGameStart(true);
      setAnswerSubmitted(false);
      startTimer();
    }
  }, [selectOpponentProblem, selectMyProblem]); // 이 두 상태가 변경될 때마다 실행됩니다.

  // 답변 제출 미완성
  const submitAnswer = () => {
    const endpoint = `/send/game/${roomId}/answer`;
    let solveData = null;
    let solveText = null;

    switch (myProblem.problemType) {
      case "FILL_IN_THE_BLANK":
        solveData = blankSolve;
        solveText = null;
        break;
      case "SHORT_ANSWER_QUESTION":
        solveData = null;
        solveText = shortAnswerSolve === "" ? "ssafy" : shortAnswerSolve;
        break;
      default:
        solveData =
          multipleChoiceSolve[1] === "" ? { 1: "ssafy" } : multipleChoiceSolve;
        solveText = null;
        break;
    }

    const submitAnswerDTO = {
      problemType: myProblem.problemType,
      problemId: myProblem.problemId,
      userId: memberId,
      solve: solveData,
      submitTime: 30 - count,
      solveText: solveText,
      round: currentRound - 1,
    };
    battleStompClient.current.send(
      endpoint,
      {},
      JSON.stringify(submitAnswerDTO)
    );
    setAnswerSubmitted(true);
  };

  // 체력 반영 미완성
  const subscribeResult = () => {
    const endpoint = `/room/${roomId}`;
    battleStompClient.current.subscribe(endpoint, (message) => {
      const body = JSON.parse(message.body);

      console.log(body);

      if (body.result && typeof body.result === "object") {
        console.log("여기");
        setWinner(body.result.winner);
        setLoser(body.result.loser);
        setGameEnded(true);
        setNormalQuit(true);

        openModal();
        closeModal();

        setTimeout(() => {
          navigate("/battle-list");
        }, 5000);
      } else {
        console.log(body);
        // 체력 업데이트 반영
      }
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

  const sendMessage = async () => {
    if (message.trim() === "") return;
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

  const reconnectWebSocket = () => {
    console.log("Reconnecting WebSocket...");
    setTimeout(async () => {
      try {
        await connect();
        await enterRoom();
        await enterChat();
      } catch (error) {
        console.error("Reconnection failed: ", error);
        reconnectWebSocket(); // 재연결 시도
      }
    }, 3000); // 3초 후 재연결 시도
  };

  useEffect(() => {
    const initializeConnections = async () => {
      try {
        await connect();
        await enterRoom();
        await enterChat();
      } catch (error) {
        console.log("Connection error:", error);
        reconnectWebSocket();
      }
    };

    initializeConnections();

    // 클린업 함수는 비동기 함수로 직접 정의할 수 없으므로
    // 비동기 작업을 수행할 내부 함수를 정의하고 호출합니다.
    const cleanup = async () => {
      await delay(5000);

      if (normalQuit === false) {
        alert("호스트와의 연결이 끊겼습니다.");
      }

      await delay(5000);

      sendQuitMessage();
      if (battleStompClient.current) battleStompClient.current.disconnect();
      if (chatStompClient.current) chatStompClient.current.disconnect();
    };

    // return 내부에서 cleanup 함수를 호출
    return () => {
      cleanup();
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
    if (count === 0 && answerSubmitted === false) {
      submitAnswer();
    }
  }, [count]);

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
    switch (problem.problemType) {
      case "FILL_IN_THE_BLANK":
        return <DragNDropQuiz />;
      case "SHORT_ANSWER_QUESTION":
        return <ShortAnswer />;
      case "MULTIPLE_CHOICE":
        return <MultipleChoice />;
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
                {winner === memberId || winner === enemyId
                  ? winner === memberId
                    ? "승리했습니다!"
                    : "패배했습니다."
                  : "무승부입니다."}
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
        <Header type="Game" />
        <div className="battle-game-outer-outer-container">
          <div className="battle-game-outer-container">
            <div className="battle-game-title-container">
              <div className="health-bar">
                <div
                  className="health-bar-inner"
                  style={{ width: `${myHealth}%` }}
                ></div>
              </div>
              <h2 className="battle-game-title">Round {currentRound}</h2>
              <div className="health-bar">
                <div
                  className="health-bar-inner"
                  style={{ width: `${enemyHealth}%` }}
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
                          ? `${data.memberId}님이 플레이어 2님에게 ${data.power}만큼 데미지를 주었습니다.`
                          : `${data.memberId}님이 ${data.power}만큼 체력을 회복하였습니다.`}
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
                        if (e.key === "Enter" && message.trim() !== "") {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (message.trim() !== "") {
                          sendMessage();
                        }
                      }}
                    >
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
