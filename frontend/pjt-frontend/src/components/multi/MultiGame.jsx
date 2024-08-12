import "../../index.css";
import "../../css/GameMain.css";
import "../../css/MultiGame.css";
import '../../css/Container.css';
import MultiHeader from "../game/MultiHeader.jsx"
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

//음악 변경부분입니다. 아래 SoundStore import 해야됨
import SoundStore from "../../stores/SoundStore.jsx";


export default function MultiGame() {
  //-------------------게임페이지 들어왔을 때 음악변경-------------//
const { switchBackgroundMusic, playBackgroundMusic, playEffectSound } =
SoundStore();
useEffect(() => {
  switchBackgroundMusic("multi", (newBackgroundMusic) => {
    newBackgroundMusic.play();
  });
  return () => {
    switchBackgroundMusic("main", (newBackgroundMusic) => {
      newBackgroundMusic.play();
    });
  };
}, []);

// --------------------------페이지에서 나가면 다시 음악바뀝니다.-----------------------//
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
    playerList,
    setPlayerList,
    clearPlayerList,
    roundRank,
    setRoundRank,
    clearRoundRank,
    gameRank,
    setGameRank,
    clearGameRank,
    submitList,
    setSubmitList,
    clearSubmitList,
    type,
    setType,
    currentRound,
    setCurrentRound,
    clearType,
    blankSolve,
    setBlankSolve,
    clearBlankSolve,
    getScore,
    setGetScore,
  } = multiStore((state) => ({
    roomId: state.roomId,
    playing: state.playing,
    setPlaying: state.setPlaying,
    problemList: state.problemList,
    setProblemList: state.setProblemList,
    clearProblemList: state.clearProblemList,
    playerList: state.playerList,
    setPlayerList: state.setPlayerList,
    clearPlayerList: state.clearPlayerList,
    setRoomId: state.setRoomId,
    roundRank: state.roundRank,
    setRoundRank: state.setRoundRank,
    gameRank: state.gameRank,
    setGameRank: state.setGameRank,
    clearGameRank: state.clearGameRank,
    submitList: state.submitList,
    setSubmitList: state.setSubmitList,
    clearSubmitList: state.clearSubmitList,
    type: state.type,
    setType: state.setType,
    currentRound: state.currentRound,
    setCurrentRound: state.setCurrentRound,
    clearRoundRank: state.clearRoundRank,
    clearType: state.clearType,
    blankSolve: state.blankSolve,
    setBlankSolve: state.setBlankSolve,
    clearBlankSolve: state.clearBlankSolve,
    getScore: state.getScore,
    setGetScore: state.setGetScore,
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

  let cnt = 0;
  const [round, setRound] = useState(0);
  let problemLength = 0;

  const [timerEnded, setTimerEnded] = useState(false);
  
  const [count, setCount] = useState(30);
  

  // 방생성할때 방장의 memberId 가져오기
  useEffect(() => {
    setHostId(location.state?.hostId || null);
  }, [location.state]);

  // 게임시작
  const handleStart = async () => {
    setPlaying(true);
    clearGameRank();
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
          handleSetProblemList(data.payload);
          problemLength = data.payload.length;
        } else if (data.type === "newHost") {
          // 방장바뀌는 타입
          console.log(data.payload);
          setHostId(data.payload);
        } else if (data.type === "attainScore") {
          setGetScore(data.payload);
          console.log(`얻은 점수: ${data.payload}`);
        }else if (data.type === "player-list") {
          // 플레이어 리스트
          setPlayerList(data.payload);
          console.log(`플레이어 리스트: ${JSON.stringify(data.payload)}`);
        } else if (data.type === "submit-list") {
          // 제출자 리스트
          setSubmitList(data.payload);
          console.log(`제출자 리스트: ${data.payload}`);
        } else if (data.type === "gameRank") {
          setGameRank(data.payload);
          console.log("전체랭킹: ", data.payload);
          isSubmitRef.current = false;
          // setCount(30);
          setCurrentRound(cnt + 1);
          setRound((prevVal) => prevVal + 1);

          console.log('게임여기!', cnt);
          if (cnt == problemLength - 1) {
            setResultModalOpen(true);
            setTimeout(() => {
              setResultModalOpen(false);
              setPlaying(false);
              clearGameRank();
              clearRoundRank();
              clearProblemList();
              setTimerEnded(false);
            }, 4000);
          }

        } else if (data.type === "roundRank") {
          setRoundRank(data.payload);
          console.log("라운드랭킹: ", data.payload);

            console.log('라운드여기!', cnt);
            if (cnt < problemLength - 1) {
              // 모달 열고 4초 대기
              setModalOpen(true);
              setTimeout(() => {
                setModalOpen(false);
                setCount(30);
                setTimerEnded(false);
              }, 4000);
            }

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
      clearType();
      socketInstance.close();
      sendQuitMessage();
      problemLength = 0;
      if (chatStompClient.current) chatStompClient.current.disconnect();
    };
  }, []);
  ///////////////////////////////////////////////////////////////////////////////////////////////

  const handleSetProblemList = (data) => {
    setProblemList(data);
  };

  useEffect(() => {
    cnt = currentRound;
  }, [currentRound]);

  
  useEffect(() => {

    if (round >= problemList.length) {
      setPlaying(false);
      clearProblemList();
      clearBlankSolve();
      clearRoundRank();
      clearType();
      setRound(0);
    }
  }, [round]);


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
    }
  };

  const renderProblem = () => {
    // const problem = problemList[currentRound];
    return problemList[round] ? (
      <>
        {problemList[round].problemType === "FILL_IN_THE_BLANK" && (
          <FillInTheBlank problem={problemList[round]} onFillBlank={handleBlankAnswer} />
        )}
        {problemList[round].problemType === "SHORT_ANSWER_QUESTION" && (
          <ShortAnswer problem={problemList[round]} onShortAnswer={handleShortAnswer} />
        )}
        {problemList[round].problemType === "MULTIPLE_CHOICE" && (
          <MultipleChoice
            problem={problemList[round]}
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
        switch (problemList[round].problemType) {
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
            console.log("Unknown problem type: " + problemList[round].problemType);
        }
        setTimerEnded(true);
        return;
      }

      const id = setInterval(() => {
        setCount((prevCount) => {
          if (prevCount < 0) {
            clearInterval(id);
            return 0;
          }
          return prevCount - 1;
        });
      }, 1000);

      return () => clearInterval(id);
    }, [count]);

    return (
      <div>
        <span>{count}</span>
      </div>
    );
  }

  // useEffect(() => {
  //   if (count === 0 && !isSubmitRef.current) {
  //     switch (problemList[round].problemType) {
  //       case "FILL_IN_THE_BLANK":
  //         setBlankSolve(null);
  //         handleBlankAnswer();
  //         isSubmitRef.current = true;
  //         break;
  //       case "SHORT_ANSWER_QUESTION":
  //         handleShortAnswer(null);
  //         isSubmitRef.current = true;
  //         break;
  //       case "MULTIPLE_CHOICE":
  //         handleChoiceSelection(null);
  //         isSubmitRef.current = true;
  //         break;
  //       default:
  //         console.log("Unknown problem type: " + problemList[round].problemType);
  //     }
  //   }
  // }, [count]);



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
    }, 2000); // 2초 후 재연결 시도
  };

  // ---------------------- 채팅 WebSocket ----------------------

  // const exRank = [
  //   {rank: "1", username: "Hermes", score: "2000", userId: "1"},
  //   {rank: "2", username: "Bernie", score: "2000", userId: "23"},
  //   {rank: "3", username: "Jack", score: "2000", userId: "2"},
  //   {rank: "4", username: "Ethan", score: "2000", userId: "4"},
  //   {rank: "5", username: "Falcon", score: "2000", userId: "5"},
  //   {rank: "6", username: "Sophia", score: "2000", userId: "77"},
  //   {rank: "7", username: "SR", score: "2000", userId: "8"},
  // ]

  // const submitList = [
  //   {userId: "1", isSubmit: false},
  //   {userId: "23", isSubmit: true},
  //   {userId: "2", isSubmit: true},
  //   {userId: "4", isSubmit: false},
  //   {userId: "5", isSubmit: true},
  //   {userId: "77", isSubmit: false},
  //   {userId: "8", isSubmit: false},
  // ]

  let mergedList = (gameRank.length > 1 ? gameRank : playerList).map(rankItem => {
    const submitItem = submitList.find(submitItem => submitItem.userId === rankItem.userId);
    return {
      ...rankItem,
      isSubmit: submitItem ? submitItem.isSubmit : null 
    };
  });
  

  console.log("mergedList", mergedList);

  return (
    <>
      <MultiHeader />
      {/* <div className="container"> */}
      <div id="container">
        <div className="multi-game-main">
          <div className="multi-game-left">
            <div className="multi-timer">
              {playing && !modalOpen && !timerEnded && (
                <Timer setTimerEnded={setTimerEnded} />
              )}
            </div>
            <div className="multi-rank-table">
            {round > 0 ? (
              mergedList.map((user, i) => {
                return (
                  <UserRank
                    rank={user.rank}
                    username={user.username}
                    score={user.score}
                    key={i}
                  />
                );
              })
            ) : (
              mergedList.map((user, i) => {
                return (
                  <CurrentPlayer
                    username={user.username}
                    key={i}
                  />
                );
              })
            )}
              {/* {mergedList.map((user, i) => {
                return (
                  <UserRank
                    rank={user.rank}
                    username={user.username}
                    score={user.score}
                    isSubmit={user.isSubmit}
                    key={i}
                  />
                );
              })} */}

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
                  {round + 1} / {problemList.length}
                </h1>
              ) : (
                <>
                  <p>Round</p>
                </>
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
      {modalOpen && <MultiResultModal />}
      {resultModalOpen && <MultiResultModal />}
    </>
  );
}

function UserRank(props) {  
  // 유저정보 받아오기
  const { memberId } =
  store((state) => ({
    memberId: state.memberId,
  }));

  const backgroundColor = props.isSubmit ? 'yellow' : '';
  const borderColor = props.userId == memberId ? 'pink' : 'white';

  console.log("유저랭크의 memberId: " + memberId)
  console.log("props.userId: " + props.userId)
  console.log("props" + props)

  return (
    <>
      {/* <div className="multi-rank-items"> */}
      <div 
        className="multi-current-player" 
        style={{ 
          backgroundColor: props.isSubmit ? 'yellow' : '', 
          border: `3px solid ${props.userId == memberId ? 'pink' : 'white'}`, 
          borderRadius: '10px' 
        }}
      >
        <h3>{props.rank}</h3>
        <h3>{props.username}</h3>
        <h4>{props.score}</h4>
      </div>
    </>
  );  
}

function CurrentPlayer(props) {  
  // 유저정보 받아오기
  const { memberId } =
  store((state) => ({
    memberId: state.memberId,
  }));


  const backgroundColor = props.isSubmit ? 'yellow' : '';
  const borderColor = props.userId == memberId ? 'pink' : 'white';

  console.log("현재플레이어의 memberId: " + memberId)
  console.log("props.userId: " + props.userId)
  console.log("props" + props)
  
  

  return (
    <>
      <div 
        className="multi-current-player" 
        style={{ 
          backgroundColor: props.isSubmit ? 'yellow' : '', 
          border: `3px solid ${props.userId == memberId ? 'pink' : 'white'}`, 
          borderRadius: '10px' 
        }}
      >
        <h3>{props.userId}</h3>
        <h3>{props.username}</h3>
      </div>
    </>
  );
}
