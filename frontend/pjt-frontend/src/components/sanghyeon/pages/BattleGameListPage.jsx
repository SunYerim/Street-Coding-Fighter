import Header from "../components/Header";
import "../../../css/BattleGameListPage.css";
import store from "../../../store/store.js";
import createAuthClient from "../apis/createAuthClient.js";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import Swal from "sweetalert2";

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
    setNormalQuit,
    setEnemyId,
    setEnemyName,
  } = store((state) => ({
    baseURL: state.baseURL,
    accessToken: state.accessToken,
    memberId: state.memberId,
    roomId: state.roomId,
    setRoomId: state.setRoomId,
    setAccessToken: state.setAccessToken,
    setHostId: state.setHostId,
    setRoomPassword: state.setRoomPassword,
    setNormalQuit: state.setNormalQuit,
    setEnemyId: state.setEnemyId,
    setEnemyName: state.setEnemyName,
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
        url: `${baseURL}/battle/room`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.status === 204) {
        setBattleList([]);
        setCurrentBattleList([]);
      } else {
        setBattleList(res.data);
        setCurrentBattleList(res.data);
      }
    } catch (error) {
      Swal.fire({
        text: "방 목록을 불러오는데 실패했습니다.",
        icon: "error",
        timer: 3000,
      });
    }
  };

  const joinBattleRoom = async (roomId, curPlayer, isLock) => {
    if (curPlayer === 2) {
      Swal.fire({
        text: "방이 꽉 찼습니다.",
        icon: "error",
        timer: 3000,
      });
      return;
    }

    let inputPassword = "ssafy";
    // 비밀번호가 없는 경우 초기화

    if (isLock === true) {
      inputPassword = prompt("비밀번호를 입력하세요.");

      if (inputPassword === null || inputPassword === "") {
        Swal.fire({
          text: "비밀번호를 입력해주세요.",
          icon: "error",
          timer: 3000,
        });
        return;
      }
    }

    try {
      const res = await authClient({
        method: "POST",
        url: `${baseURL}/battle/room/${roomId}`,
        data: {
          password: inputPassword,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setRoomId(roomId);
      setRoomPassword(inputPassword);
      setHostId(res.data.memberId);
      setEnemyId(res.data.memberId);
      setEnemyName(res.data.username);
      navigate("/battle-game");
    } catch (error) {
      Swal.fire({
        text: "방 입장에 실패했습니다.",
        icon: "error",
        timer: 3000,
      });
      console.log(error);
    }
  };

  const createBattleRoom = async () => {
    let data = null;

    if (battleRoomPassword.current.value === "") {
      data = {
        title: battleRoomTitle.current.value,
        round: battleRoomRound.current.value,
      };
    } else {
      data = {
        title: battleRoomTitle.current.value,
        password: battleRoomPassword.current.value,
        round: battleRoomRound.current.value,
      };
    }
    try {
      const createRes = await authClient({
        method: "POST",
        url: `${baseURL}/battle/room`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        data: data,
      });

      setEnemyId(null);
      setEnemyName(null);
      console.log(createRes.data);
      setRoomId(createRes.data);
      setHostId(memberId);
      setRoomPassword(battleRoomPassword.current.value);
      setNormalQuit(false);
      navigate("/battle-game");
    } catch (error) {
      Swal.fire({
        text: "방 생성에 실패했습니다.",
        icon: "error",
        timer: 3000,
      });
      console.log(error);
    }
  };

  useEffect(() => {
    const getBattleRoomList = async function () {
      try {
        const res = await authClient({
          method: "GET",
          url: `${baseURL}/battle/room`,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (res.status === 204) {
          setBattleList([]);
          setCurrentBattleList([]);
        } else {
          setBattleList(res.data);
          setCurrentBattleList(res.data);
        }
      } catch (error) {
        Swal.fire({
          text: "방 목록을 불러오는데 실패했습니다.",
          icon: "error",
          timer: 3000,
        });
        console.log(error);
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
            <button onClick={createBattleRoom}>결정</button>
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
                    onClick={() =>
                      joinBattleRoom(data.roomId, data.curPlayer, data.isLock)
                    }
                    className="battle-room"
                    key={index}
                  >
                    <p>{index + 1}</p>
                    <p>{data.title}</p>
                    <p>{data.hostId}</p>
                    <p>
                      {data.curPlayer} / {data.maxPlayer}
                    </p>
                    <p>{data.isLock === true ? "Private" : "Public"}</p>
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
