import React from "react";
import S from "./styled";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SingleInfoStore from "../../../stores/SingleInfoStore";

const rowList = [0, 1, 2, 3];

export default function EpisodeList({ rownum }) {
  const navigate = useNavigate();
  const [nextIndex, setNextIndex] = useState(0);
  const { completed, courses } = SingleInfoStore();
  useEffect(() =>{
    const nidx = completed.findIndex((e, i, a)=>{
      console.log(e)
      return (e.complete === 0)
    })
    // console.log(nidx);
    setNextIndex(nidx);
  })
  
  const handleClick = (id) => () => {
    // 클릭한 에피소드의 completed 상태
    const isCompleted = completed[id];
    console.log(isCompleted);
    // 첫 번째 false가 아닌 경우는 예외로 허용
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
