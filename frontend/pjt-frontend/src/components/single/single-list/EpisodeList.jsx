import React from "react";
import S from "./styled";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const courses = [
  { id: 0, content_type: "변수와 자료형", title: "변수" },
  { id: 1, content_type: "변수와 자료형", title: "자료형" },
  { id: 2, content_type: "연산자", title: "연산자" },
  { id: 3, content_type: "입출력", title: "표준입출력" },
  { id: 4, content_type: "입출력", title: "파일입출력" },
  { id: 5, content_type: "제어구조", title: "반복문" },
  { id: 6, content_type: "제어구조", title: "조건문" },
  { id: 7, content_type: "자료구조", title: "1차원 리스트" },
  { id: 8, content_type: "자료구조", title: "2차원 리스트" },
  { id: 9, content_type: "함수", title: "함수의 활용" },
  { id: 10, content_type: "알고리즘", title: "탐색" },
  { id: 11, content_type: "알고리즘", title: "정렬" },
];

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
  if (e & !completed[i + 1]) {
    nIdx = i + 1;
  }
});
const rowList = [0, 1, 2, 3];
export default function EpisodeList({ rownum }) {
  const navigate = useNavigate();
  const [nextIndex, setNextIndex] = useState(nIdx);
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
                    onClick={() => navigate("/single-play")}
                    key={`checkpoint-${e.id}`}
                    $completed={completed[e.id]}
                    $isNext={e.id === nextIndex}
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
