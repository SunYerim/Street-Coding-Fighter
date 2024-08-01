import Header from '../sanghyeon/components/Header.jsx';
import S from './styled.jsx';
import RankingListItem from './RankingListItem.jsx';
import RankingGraph from './RankingGraph.jsx';
import { useState } from 'react';
import useLeaderboardStore from '../../stores/LeaderboardStore.jsx';
import styled from 'styled-components';

export default function Ranking() {
  const { rankingList, setRankingList, boardPeriod, setBoardPeriod, rankingLength, setRankingLength } = useLeaderboardStore();

  const handleTabClick = (tab) => {
    setBoardPeriod(tab);
  };
  return (
    <>
      <Header></Header>
      <S.PageBody>
        <S.Container>
          <h1>{boardPeriod.toUpperCase()} Ranking</h1>
          <S.RankingInfoContainer>
            <S.PeriodButton
              onClick={() => {
                handleTabClick('total');
                // console.log(boardPeriod);
                // console.log(rankingList[boardPeriod].length);
                // console.log(boardPeriod === 'total');
                console.log(rankingList[boardPeriod]);
                console.log(Object.keys(rankingList[boardPeriod]).length-3);
              }}
              $isSelected={boardPeriod === 'total'}
            >
              Total
            </S.PeriodButton>
            <S.PeriodButton onClick={() => handleTabClick('weekly')} $isSelected={boardPeriod === 'weekly'}>
              Weekly
            </S.PeriodButton>
            <S.PeriodButton onClick={() => handleTabClick('daily')} $isSelected={boardPeriod === 'daily'}>
              Daily
            </S.PeriodButton>
          </S.RankingInfoContainer>
          <S.FlexContainer>
            <S.RankingInfoSection>
              <S.GraphContainer>
                <RankingGraph></RankingGraph>
              </S.GraphContainer>
            </S.RankingInfoSection>
            <S.RankingListSection>
              {new Array(Object.keys(rankingList[boardPeriod]).length-3)
                .fill(0)
                .map((_, i) => {
                  return i + 4;
                })
                .map((e, idx) => {
                  // console.log(rankingList[boardPeriod]);
                  return <RankingListItem key={idx} rank={e} player={rankingList[boardPeriod]?.[e]}></RankingListItem>;
                })}
            </S.RankingListSection>
          </S.FlexContainer>
        </S.Container>
      </S.PageBody>
    </>
  );
}
