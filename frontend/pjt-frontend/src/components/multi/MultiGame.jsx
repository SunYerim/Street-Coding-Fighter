import "../../index.css";
import "../../css/GameMain.css";
import "../../css/MultiGame.css";
import "../../css/Timer.css";
import InputField from "../game/InputField.jsx";
import MessageContainer from "../game/MessageContainer.jsx";
import MultiResultModal from "./MultiResultModal.jsx";
import newSocket from "../game/server.js";
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import multiStore from "../../stores/multiStore.jsx";
import store from "../../store/store.js";
import createAuthClient from "../sanghyeon/apis/createAuthClient.js";
import axios from "axios";

import SockJS from "sockjs-client/dist/sockjs";
import Stomp from "stompjs";

import FillInTheBlank from "../game/fillInTheBlank/FillInTheBlank";
import ShortAnswer from "../game/short_answer/MultiShortAnswer";
import MultipleChoice from "../game/MultipleChoice";

export default function MultiGame() {
  const navigate = useNavigate();
  const location = useLocation();
  const chatStompClient = useRef(null);
  const isSubmitRef = useRef(false);

  // 게임정보 불러오기
  const {
    roomId,
    playing,
    setPlaying,
    problemList,
    setProblemList,
    clearProblemList,
    roundRank,
    setRoundRank,
    clearRoundRank,
    gameRank,
    setGameRank,
    clearGameRank,
    // problemType,
    currentRound,
    setCurrentRound,
    setProblemType,
    clearProblemType,
    blankSolve,
    setBlankSolve,
    clearBlankSolve,
  } = multiStore((state) => ({
    roomId: state.roomId,
    playing: state.playing,
    setPlaying: state.setPlaying,
    setRoomId: state.setRoomId,
    problemList: state.problemList,
    setProblemList: state.setProblemList,
    roundRank: state.roundRank,
    setRoundRank: state.setRoundRank,
    gameRank: state.gameRank,
    setGameRank: state.setGameRank,
    // problemType: state.problemType,
    currentRound: state.currentRound,
    setCurrentRound: state.setCurrentRound,
    setProblemType: state.setProblemType,
    clearProblemList: state.clearProblemList,
    clearRoundRank: state.clearRoundRank,
    clearGameRank: state.clearGameRank,
    clearProblemType: state.clearProblemType,
    blankSolve: state.blankSolve,
    setBlankSolve: state.setBlankSolve,
    clearBlankSolve: state.clearBlankSolve,
  }));

  // 유저정보 받아오기
  const { accessToken, setAccessToken, memberId, userId, name, baseURL } =
    store((state) => ({
      memberId: state.memberId,
      accessToken: state.accessToken,
      setAccessToken: state.setAccessToken,
      userId: state.userId,
      name: state.name,
      baseURL: state.baseURL,
    }));

  // auth
  const authClient = createAuthClient(
    baseURL,
    () => accessToken,
    setAccessToken
  );

  const [socket, setSocket] = useState(null);
  const [hostId, setHostId] = useState(null);

  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [resultModalOpen, setResultModalOpen] = useState(false);



  // const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [timerEnded, setTimerEnded] = useState(false);
  const [problemLength, setProblemLength] = useState(problemList.length);

  const [count, setCount] = useState(30);

  const problemType = problemList[currentRound].problemType;

  // 방생성할때 방장의 memberId 가져오기
  useEffect(() => {
    setHostId(location.state?.hostId || null);
  }, [location.state]);

  // 게임시작
  const handleStart = async () => {
    setPlaying(true);
    const response = await axios.post(
      `${baseURL}/multi/game/${roomId}/start`,
      null,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  };

  const isJsonString = (str) => {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////
  // 마운트할 때
  useEffect(() => {
    const initializeConnections = async () => {
      try {
        await connect();
        await enterChat();
      } catch (error) {
        console.log("Connection error:", error);
        reconnectWebSocket();
      }
    };

    initializeConnections();

    // const roomId = multiStore.getState().roomId;
    // console.log(`Room ${roomId}, userId ${memberId}, username: ${name}`);

    const socketInstance = newSocket(roomId, memberId, name);
    setSocket(socketInstance);

    socketInstance.onmessage = (event) => {
      const messageData = event.data;
      if (isJsonString(messageData)) {
        const data = JSON.parse(messageData);

        // Multi socket 통신 타입별 정리
        if (data.type === "gameStart") {
          // 게임스타트
          setPlaying(true);
          console.log(data.payload);
          setProblemList(data.payload);
        } else if (data.type === "newHost") {
          // 방장바뀌는 타입
          console.log(data.payload);
          setHostId(data.payload);
        } else if (data.type === "attainScore") {
          console.log(`얻은 점수: ${data.payload}`);
        } else if (data.type === "gameRank") {
          setGameRank(data.payload);
          setTimerEnded(false);
          console.log("전체랭킹: ", data.payload);

          isSubmitRef.current = false;

          setCount(30);
          handleNextRound();

          setTimeout(() => {
            console.log('이건여기!',currentRound);
            if (currentRound < problemList.length - 1) {
              // 모달 열고 4초 대기
              // setModalOpen(true);
              // setTimeout(() => {
              //   setModalOpen(false);
              // }, 4000);

              // 문제번호++, 제출상태 초기화
              console.log("여기 들어오냐?");
              console.log(problemList.length);
              setCurrentProblemIndex(currentRound + 1);

              isSubmitRef.current = false;

              setCount(30);
            } else {
              // setResultModalOpen(true);
              // setTimeout(() => {
              //   setResultModalOpen(false);
              //   setPlaying(false);
              //   clearGameRank();
              //   clearRoundRank();
              //   clearProblemList();
              //   clearProblemType();
              // }, 4000);
              // setPlaying(false);
              // clearGameRank();
              // clearRoundRank();
              // clearProblemList();
              // clearProblemType();
            }
          }, 500);
        } else if (data.type === "roundRank") {
          setRoundRank(data.payload);
          console.log("라운드랭킹: ", data.payload);
        }
      } else {
        console.error("Received non-JSON message:", messageData);
      }
    };

    return () => {
      setPlaying(false);
      clearProblemList();
      clearBlankSolve();
      clearRoundRank();
      clearGameRank();
      clearProblemType();
      socketInstance.close();
      sendQuitMessage();
      if (chatStompClient.current) chatStompClient.current.disconnect();
    };
  }, []);
  ///////////////////////////////////////////////////////////////////////////////////////////////

  const handleNextRound = () => {
    setCurrentRound((prevRound) => prevRound + 1);
  };

  useEffect(() => {
    if (playing && currentRound < problemList.length - 1) {
      setTimeout(() => {
        console.log('저건저기!',currentRound);
      }, 500);
    }
  }, [currentRound, playing, problemList.length]);

  // 문제 타입 바꾸기
  // useEffect(() => {
  //   if (problemList.length > 0) {
  //     setProblemType(problemList[currentProblemIndex].problemType);
  //   }
  // }, [currentProblemIndex]);

  // 라운드 종료 후 랭킹 모달 표시
  // useEffect(() => {
  //   if (playing && !modalOpen && timerEnded) {
  //     if (currentProblemIndex < problemList.length - 1) {
  //       // 모달 열고 4초 대기
  //       setModalOpen(true);
  //       setTimeout(() => {
  //         setModalOpen(false);
  //       }, 4000);

  //       // 문제번호++, 제출상태 초기화
  //       setCurrentProblemIndex(currentProblemIndex + 1);
  //       setIsSubmit(false);
  //     } else {
  //       setResultModalOpen(true);
  //       setTimeout(() => {
  //         setResultModalOpen(false);
  //         setPlaying(false);
  //       }, 4000);
  //     }
  //   }
  // }, [roundRank]);

  // 객관식 답변제출
  const handleChoiceSelection = (choiceId) => {
    if (!isSubmitRef.current) {
      console.log("선택된 choice ID:", choiceId);
      if (socket) {
        const messageObj = {
          type: "solve",
          content: {
            problemType: "MULTIPLE_CHOICE",
            submitTime: 30 - count,
            solve: { 1: choiceId },
            solveText: null,
          },
        };
        socket.send(JSON.stringify(messageObj));

        isSubmitRef.current = true;

      }
    }
  };

  // 단답식 답변제출
  const handleShortAnswer = (answer) => {
    if (!isSubmitRef.current) {
      console.log("제출한 답:", answer);
      if (socket) {
        const messageObj = {
          type: "solve",
          content: {
            problemType: "SHORT_ANSWER_QUESTION",
            submitTime: 30 - count,
            solve: null,
            solveText: answer,
          },
        };
        socket.send(JSON.stringify(messageObj));

        isSubmitRef.current = true;
        
      }
    }
  };

  // 빈칸 답변제출
  const handleBlankAnswer = () => {
    if (!isSubmitRef.current) {
      console.log("제출한 답:", blankSolve);
      if (socket) {
        const messageObj = {
          type: "solve",
          content: {
            problemType: "FILL_IN_THE_BLANK",
            submitTime: 30 - count,
            solve: blankSolve,
            solveText: null,
          },
        };
        socket.send(JSON.stringify(messageObj));
        isSubmitRef.current = true;
      }
    } else {
      return 0;
    }
  };

  const renderProblem = () => {
    const problem = problemList[currentRound];
    return problem ? (
      <>
        {problem.problemType === "FILL_IN_THE_BLANK" && (
          <FillInTheBlank problem={problem} onFillBlank={handleBlankAnswer} />
        )}
        {problem.problemType === "SHORT_ANSWER_QUESTION" && (
          <ShortAnswer problem={problem} onShortAnswer={handleShortAnswer} />
        )}
        {problem.problemType === "MULTIPLE_CHOICE" && (
          <MultipleChoice
            problem={problem}
            onChoiceSelect={handleChoiceSelection}
          />
        )}
      </>
    ) : (
      <div>Unknown problem type</div>
    );
  };

  function Timer({ setTimerEnded }) {
    useEffect(() => {
      if (count <= 0) {
        setTimerEnded(true);
        return;
      }

      const id = setInterval(() => {
        setCount((prevCount) => {
          if (prevCount <= 1) {
            clearInterval(id);
            return 0;
          }
          return prevCount - 1;
        });
      }, 1000);

      return () => clearInterval(id);
    }, [count]);

    useEffect(() => {
      if (count === 0 && !isSubmitRef.current) {
        switch (problemType) {
          case "FILL_IN_THE_BLANK":
            setBlankSolve(null);
            handleBlankAnswer();
            isSubmitRef.current = true;
            break;
          case "SHORT_ANSWER_QUESTION":
            handleShortAnswer(null);
            isSubmitRef.current = true;
            break;
          case "MULTIPLE_CHOICE":
            handleChoiceSelection(null);
            isSubmitRef.current = true;
            break;
          default:
            console.log("Unknown problem type: " + problemType);
        }
      }
    }, [count, isSubmitRef]);

    return (
      <div>
        <span>{count}</span>
      </div>
    );
  }

  // ---------------------- 채팅 WebSocket ----------------------

  // 채팅 WebSocket 연결 및 초기화 함수
  const connect = async () => {
    const chatSocket = new SockJS(`https://www.ssafy11s.com/ws-chat`);
    chatStompClient.current = Stomp.over(chatSocket);

    return new Promise((resolve, reject) => {
      chatStompClient.current.connect(
        {},
        (frame) => {
          subscribeMessage();
          resolve();
        },
        (error) => {
          console.log(error);
          reject(error);
        }
      );
    });
  };

  const subscribeMessage = () => {
    const endpoint = `/room/${roomId}`;
    chatStompClient.current.subscribe(endpoint, (message) => {
      const body = JSON.parse(message.body);
      setChatMessages((prevMessages) => [
        ...prevMessages,
        body.type === "CHAT"
          ? { sender: body.sender, content: body.content }
          : body.type === "JOIN"
          ? { sender: "system", content: `${body.sender}님이 입장하셨습니다.` }
          : { sender: "system", content: `${body.sender}님이 퇴장하셨습니다.` },
      ]);
    });
  };

  const sendMessage = async (event) => {
    event.preventDefault();
    if (message.trim() === "") return;
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

  const sendQuitMessage = () => {
    const endpoint = `/send/chat/${roomId}/leave`;
    const chatMessage = {
      sender: "system",
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
      } catch (error) {
        console.error("Reconnection failed: ", error);
        reconnectWebSocket(); // 재연결 시도
      }
    }, 2000); // 3초 후 재연결 시도
  };

  // ---------------------- 채팅 WebSocket ----------------------

  return (
    <>
      <div className="game-container">
        <div className="multi-game-main">
          <div className="multi-game-left">
            <div className="multi-timer">
              {playing && !modalOpen && !timerEnded && (
                <Timer setTimerEnded={setTimerEnded} />
              )}
            </div>
            <div className="multi-rank-table">
              {gameRank.map((user, i) => {
                return (
                  <UserRank
                    rank={user.rank}
                    username={user.username}
                    score={user.score}
                    key={i}
                  />
                );
              })}
            </div>
          </div>
          <div className="multi-game-center">
            {!playing ? (
              <div className="before-start">
                <h1>. . . Waiting for start . . .</h1>
                {hostId == memberId ? (
                  <button className="game-start-button" onClick={handleStart}>
                    Start
                  </button>
                ) : (
                  <div>
                    <h2>방장만 시작가능!</h2>
                  </div>
                )}
              </div>
            ) : (
              <div className="after-start">
                {isSubmitRef.current ? (
                  <div>
                    <h2>Submitted!</h2>
                  </div>
                ) : (
                  <div>{problemList.length > 0 && renderProblem()}</div>
                )}
              </div>
            )}
          </div>
          <div className="multi-game-right">
            <div className="multi-round">
              {playing ? (
                <h1>
                  {currentRound + 1} / {problemList.length}
                </h1>
              ) : (
                <h1>Round</h1>
              )}
            </div>
            <div className="multi-message-room">
              <MessageContainer chatMessages={chatMessages} username={name} />
            </div>
            <InputField
              message={message}
              setMessage={setMessage}
              sendMessage={sendMessage}
            />
          </div>
        </div>
      </div>
      {/* {modalOpen && <MultiResultModal />}
      {resultModalOpen && <MultiResultModal />} */}
    </>
  );
}

function UserRank(props) {
  return (
    <>
      <div className="multi-rank-items">
        <h3>{props.rank}</h3>
        <h3>{props.username}</h3>
        <h4>{props.score}</h4>
      </div>
    </>
  );
}
