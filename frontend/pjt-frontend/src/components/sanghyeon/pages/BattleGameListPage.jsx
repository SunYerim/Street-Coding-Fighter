import Header from "../components/Header";
import "../../../css/BattleGameListPage.css";
import store from "../../../store/store.js";
import createAuthClient from "../apis/createAuthClient.js";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";

Modal.setAppElement("#root");

const BattleGameListPage = () => {
  const navigate = useNavigate();

  const {
    baseURL,
    accessToken,
    setAccessToken,
    memberId,
    roomId,
    setRoomId,
    setHostId,
    setRoomPassword,
  } = store((state) => ({
    baseURL: state.baseURL,
    accessToken: state.accessToken,
    memberId: state.memberId,
    roomId: state.roomId,
    setRoomId: state.setRoomId,
    setAccessToken: state.setAccessToken,
    setHostId: state.setHostId,
    setRoomPassword: state.setRoomPassword,
  }));

  const authClient = createAuthClient(
    baseURL,
    () => accessToken,
    setAccessToken
  );

  const searchKeyword = useRef(null);
  const battleRoomTitle = useRef(null);
  const battleRoomPassword = useRef("");
  const battleRoomRound = useRef(null);
  const [battleList, setBattleList] = useState([]);
  const [currentBattleList, setCurrentBattleList] = useState([]);

  const battleListSearch = (searchKeyword) => {
    setCurrentBattleList(
      battleList.filter((data) =>
        data.title.includes(searchKeyword.current.value)
      )
    );
  };

  const battleListRefresh = async () => {
    try {
      const res = await authClient({
        method: "GET",
        url: `${baseURL}/battle`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log(res.data);
    } catch (error) {
      console.error("Failed to fetch record", error);
    }
  };

  const joinBattleRoom = async (roomId, isLock) => {
    let password = "";

    if (isLock === true) {
      password = prompt("비밀번호를 입력하세요.");

      if (password === null || password === "") {
        alert("비밀번호를 입력해주세요.");
        return;
      }
    }

    try {
      const res = await authClient({
        method: "POST",
        url: `${baseURL}/battle/room/${roomId}`,
        data: password,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log(res.data);
      setRoomId(roomId);
      setRoomPassword(password);
      // [
      //   {
      //     "problemId": 1,
      //     "question": "문제 내용",
      //     "options": ["옵션1", "옵션2", "옵션3", "옵션4"]
      //   },
      //   {
      //     "problemId": 2,
      //     "question": "문제 내용",
      //     "options": ["옵션1", "옵션2", "옵션3", "옵션4"]
      //   }
      // ]
      // navigate() // 배틀 페이지로 이동
      setHostId("");
    } catch (error) {
      console.log(error);
    }
  };

  const createBattleRoom = async () => {
    try {
      const createRes = await authClient({
        method: "POST",
        url: `${baseURL}/battle/room`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        data: {
          title: battleRoomTitle.current.value,
          password: battleRoomPassword.current.value,
          round: battleRoomRound.current.value,
        },
      });

      console.log(createRes);
      setRoomId(createRes.data);
      setHostId(memberId);
      setRoomPassword(battleRoomPassword.current.value);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getBattleRoomList = async function () {
      try {
        // const res = await authClient({
        //   method: "GET",
        //   url: `${baseURL}/battle`,
        //   headers: {
        //     Authorization: `Bearer ${accessToken}`,
        //   },
        // });

        // console.log(res.data);

        const dummyData = [
          {
            roomId: "room1",
            hostId: 123,
            title: "파이썬 1대1 초보만",
            curPlayer: 1,
            maxPlayer: 2,
            isLock: false,
          },
          {
            roomId: "room2",
            hostId: 456,
            title: "파이썬 1대1 너만 오면 고",
            curPlayer: 1,
            maxPlayer: 2,
            isLock: false,
          },
          {
            roomId: "room3",
            hostId: 789,
            title: "파이썬 1대1 중수 이상만",
            curPlayer: 1,
            maxPlayer: 2,
            isLock: true,
          },
          {
            roomId: "room4",
            hostId: 101112,
            title: "파이썬 1대1 초보만",
            curPlayer: 1,
            maxPlayer: 2,
            isLock: false,
          },
          {
            roomId: "room5",
            hostId: 131415,
            title: "파이썬 1대1 초보만",
            curPlayer: 1,
            maxPlayer: 2,
            isLock: false,
          },
          {
            roomId: "room6",
            hostId: 161718,
            title: "파이썬 1대1 초보만",
            curPlayer: 1,
            maxPlayer: 2,
            isLock: false,
          },
          {
            roomId: "room7",
            hostId: 192021,
            title: "파이썬 1대1 초보만",
            curPlayer: 1,
            maxPlayer: 2,
            isLock: false,
          },
          {
            roomId: "room8",
            hostId: 222324,
            title: "파이썬 1대1 초보만",
            curPlayer: 1,
            maxPlayer: 2,
            isLock: false,
          },
          {
            roomId: "room9",
            hostId: 252627,
            title: "파이썬 1대1 초보만",
            curPlayer: 1,
            maxPlayer: 2,
            isLock: false,
          },
          {
            roomId: "room10",
            hostId: 282930,
            title: "파이썬 1대1 초보만",
            curPlayer: 1,
            maxPlayer: 2,
            isLock: false,
          },
        ];
        setBattleList(dummyData);
        setCurrentBattleList(dummyData);
      } catch (error) {
        console.error("Failed to fetch record", error);
      }
    };

    getBattleRoomList();
  }, []);

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <>
      <div className="battle-list-entire-container">
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Example Modal"
          className="battle-list-modal"
          overlayClassName="overlay"
        >
          <div className="battle-list-modal-inner-container">
            <h3>방 만들기</h3>
            <hr />
            <input
              ref={battleRoomTitle}
              type="text"
              placeholder="방 제목"
              required
            />
            <input
              ref={battleRoomPassword}
              type="text"
              placeholder="방 비밀번호"
            />
            <input
              ref={battleRoomRound}
              type="text"
              placeholder="게임 라운드"
              required
            />
            <button
              // onClick={createBattleRoom}
              onClick={() => {
                setHostId(memberId);
                navigate(`/battle-game`);
              }}
            >
              결정
            </button>
          </div>
        </Modal>
        <Header />
        <div className="battle-list-outer-outer-container">
          <div className="battle-list-outer-container">
            <div className="battle-list-title-container">
              <h2 className="battle-list-title">1 vs 1</h2>
            </div>
            <div className="battle-list-side-container">
              <div className="battle-list-container">
                <div className="battle-list-inner-title">
                  <p>No.</p>
                  <p>제목</p>
                  <p>호스트</p>
                  <p>인원</p>
                  <p>공개 여부</p>
                </div>
                <hr />
                {currentBattleList.map((data, index) => (
                  <div
                    // onClick={() => joinBattleRoom(data.roomId, data.isLock)}
                    onClick={() => navigate(`/battle-game`)}
                    className="battle-room"
                    key={index}
                  >
                    <p>{index + 1}</p>
                    <p>{data.title}</p>
                    <p>{data.hostId}</p>
                    <p>
                      {data.curPlayer} / {data.maxPlayer}
                    </p>
                    <p>{data.isLock ? "Private" : "Public"}</p>
                  </div>
                ))}
              </div>
              <div className="battle-side-container">
                <div className="battle-list-search-container">
                  <input
                    ref={searchKeyword}
                    type="text"
                    placeholder="검색어 입력"
                    onKeyDown={(e) =>
                      e.key === "Enter" && battleListSearch(searchKeyword)
                    }
                  />
                  <button onClick={battleListSearch}>검색</button>
                </div>
                <div className="battle-list-refresh-container">
                  <button onClick={battleListRefresh}>새로고침</button>
                </div>
                <div className="battle-list-create-container">
                  <button onClick={openModal}>방 만들기</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BattleGameListPage;
