import React from 'react';
import S from './styled';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SingleInfoStore from '../../../stores/SingleInfoStore';
import store from '../../../store/store';
import SoundStore from '../../../stores/SoundStore';
import { MdFlag } from 'react-icons/md';

const rowList = [0, 1, 2, 3];

export default function EpisodeList({ rownum }) {
  const navigate = useNavigate();
  const { completed, courses, setCompleted } = SingleInfoStore();
  const { playEffectSound } = SoundStore();
  // useEffect를 사용하여 컴포넌트가 처음 렌더링될 때 데이터 요청
  const nextIndex = completed?.findIndex((e) => {
    console.log(e);
    return e.complete === 0;
  });
  const characterSource = [
    '/characters/movingGreenSlime.gif',
    '/characters/movingIceSlime.gif',
    '/characters/movingFireSlime.gif',
    '/characters/movingThunderSlime.gif',
    '/characters/movingNyanSlime.gif',
  ];
  const handleClick = (id) => () => {
    // console.log(isCompleted);
    console.log(id);
    console.log(nextIndex);
    if (id <= nextIndex) {
      // console.log(id);
      playEffectSound('clickSound');
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
            {courses.slice(rownum * r, rownum * r + rownum).map((e, index, array) => (
              <React.Fragment key={e.id}>
                <S.CheckPoint
                  key={`checkpoint-${e.id}`}
                  $completed={completed[e.id].complete}
                  $isNext={e.id === nextIndex}
                  onClick={handleClick(e.id)}
                  onMouseEnter={() => {
                    playEffectSound('hoverSound');
                  }}
                >
                  {e.id + 1}. {e.title}
                  {index === array.length - 1 && r < 3 ? (
                    <>
                      <S.VerticalPath
                        key={`verticalpath-${e.id}`}
                        $completed={completed[3 * (r + 1) - 1].complete}
                      ></S.VerticalPath>
                    </>
                  ) : null}
                  {e.id === nextIndex ? (
                    <S.CharacterImage>
                      <img src={characterSource[store.registerInfo?.characterType]} />
                      <img src={characterSource[0]} style={{ height: '100px' }} />
                    </S.CharacterImage>
                  ) : null}
                  {e.id === 11 ? (
                    <div style={{ position: 'absolute', top: '-50%', right: '-10px', color: 'red', fontSize: '2rem' }}>
                      <MdFlag />
                    </div>
                  ) : null}
                </S.CheckPoint>
                {index < array.length - 1 ? (
                  <S.Path key={`path-${e.id}`} $completed={completed[e.id]?.complete} />
                ) : null}
              </React.Fragment>
            ))}
          </S.Row>
          {r < rowList.length - 1 && <S.RowBeetween key={2 * r + 1}></S.RowBeetween>}
        </React.Fragment>
      ))}
    </>
  );
}
