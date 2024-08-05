import React from "react";
import S from "./styled";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SingleInfoStore from "../../../stores/SingleInfoStore";
import store from "../../../store/store";

const rowList = [0, 1, 2, 3];

export default function EpisodeList({ rownum }) {
  const navigate = useNavigate();
  const [nextIndex, setNextIndex] = useState(0);
  const { completed, courses, setCompleted } = SingleInfoStore();

  // useEffect를 사용하여 컴포넌트가 처음 렌더링될 때 데이터 요청
  useEffect(() => {
    // 비동기 함수 정의
    const fetchData = async () => {
      try {
        const response = await axios.get(`${store.baseUrl}}/edu`);
        const data = response.data;
        console.log(data)
        // 받아온 데이터를 상태로 설정
        setCompleted(data.completed);
        
        const nidx = data.completed.findIndex((e) => e.complete === 0);
        setNextIndex(nidx);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    // 비동기 함수, 호출 연결하면 이부분 주석해제 해야됩니다!!!!
    // fetchData();
  }, []);

  const handleClick = (id) => () => {
    const isCompleted = completed[id];
    console.log(isCompleted);
    const firstFalseIndex = completed.indexOf(false);
    if (firstFalseIndex === -1 || id <= firstFalseIndex || isCompleted) {
      console.log(id);
      navigate(`/single-play/${id}`);
    } else {
      // alert("이전 에피소드를 먼저 클리어해주세요.");
    }
  };

  return (
    <>
      {rowList.map((r) => (
        <React.Fragment key={r}>
          <S.Row key={2 * r} $rowidx={r}>
            {courses
              .slice(rownum * r, rownum * r + rownum)
              .map((e, index, array) => (
                <React.Fragment key={e.id}>
                  <S.CheckPoint
                    key={`checkpoint-${e.id}`}
                    $completed={completed[e.id].complete}
                    $isNext={e.id === nextIndex}
                    onClick={handleClick(e.id)}
                  >
                    {e.id + 1}. {e.title}
                    {index === array.length - 1 && r < 3 ? (
                      <S.VerticalPath
                        key={`verticalpath-${e.id}`}
                        $completed={completed[3 * (r + 1)]}
                      ></S.VerticalPath>
                    ) : null}
                  </S.CheckPoint>
                  {index < array.length - 1 ? (
                    <S.Path
                      key={`path-${e.id}`}
                      $completed={completed[e.id + 1]}
                    />
                  ) : null}
                </React.Fragment>
              ))}
          </S.Row>
          {r < rowList.length - 1 && (
            <S.RowBeetween key={2 * r + 1}></S.RowBeetween>
          )}
        </React.Fragment>
      ))}
    </>
  );
}
