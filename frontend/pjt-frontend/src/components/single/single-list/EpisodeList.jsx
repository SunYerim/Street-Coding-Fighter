import React from "react";
import S from "./styled";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SingleInfoStore from "../../../stores/SingleInfoStore";

const completed = [
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  false,
  false,
  false,
  false,
  false,
];
let nIdx = 0;
completed.forEach((e, i) => {
  if (e && !completed[i + 1]) {
    nIdx = i + 1;
  }
});
const rowList = [0, 1, 2, 3];

export default function EpisodeList({ rownum }) {
  const navigate = useNavigate();
  const [nextIndex, setNextIndex] = useState(nIdx);
  const { completed: completedStatus, courses, setCompleted } = SingleInfoStore();

  const handleClick = (id) => () => {
    // 클릭한 에피소드의 completed 상태
    const isCompleted = completedStatus[id];
    console.log(isCompleted);
    // 첫 번째 false가 아닌 경우는 예외로 허용
    const firstFalseIndex = completedStatus.indexOf(false);
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
                    $completed={completedStatus[e.id]}
                    $isNext={e.id === nextIndex}
                    onClick={handleClick(e.id)}
                  >
                    {e.id + 1}. {e.title}
                    {index === array.length - 1 && r < 3 ? (
                      <S.VerticalPath
                        key={`verticalpath-${e.id}`}
                        $completed={completedStatus[3 * (r + 1)]}
                      ></S.VerticalPath>
                    ) : null}
                  </S.CheckPoint>
                  {index < array.length - 1 ? (
                    <S.Path
                      key={`path-${e.id}`}
                      $completed={completedStatus[e.id + 1]}
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
