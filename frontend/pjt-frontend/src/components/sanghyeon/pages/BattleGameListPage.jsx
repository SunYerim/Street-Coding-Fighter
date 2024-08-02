import Header from "../components/Header";
import "../../../css/BattleGameListPage.css";
import store from "../../../store/store.js";
import createAuthClient from "../apis/createAuthClient.js";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const BattleGameListPage = () => {
  const navigate = useNavigate();

  const { baseURL, accessToken, setAccessToken, memberId } = store((state) => ({
    baseURL: state.baseURL,
    accessToken: state.accessToken,
  }));

  const authClient = createAuthClient(
    baseURL,
    () => accessToken,
    setAccessToken
  );

  const searchKeyword = useRef(null);
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
    let password = null;

    if (isLock === true) {
      password = prompt("비밀번호를 입력하세요.");

      if (password === null) {
        alert("비밀번호를 입력해주세요.");
        return;
      }
    }

    try {
      const res = await authClient({
        method: "POST",
        url: `${baseURL}/battle/game/${roomId}`,
        data: password,
      });

      console.log(res.data);
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
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getRecord = async function () {
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

    getRecord();
  }, []);

  return (
    <>
      <div className="battle-list-entire-container">
        <Header />
        <div className="battle-list-outer-outer-container">
          <div className="battle-list-outer-container">
            <div className="battle-list-title-container">
              <h2 className="battle-list-title">방 목록</h2>
            </div>
            <div className="battle-list-side-container">
              <div className="battle-list-container">
                {currentBattleList.map((data, index) => (
                  <div
                    onClick={() => joinBattleRoom(data.roomId, data.isLock)}
                    className="battle-room"
                    key={index}
                  >
                    <p>{data.title}</p>
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
                  <button onClick={() => navigate("/battle-create")}>
                    방 만들기
                  </button>
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
