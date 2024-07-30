import Header from '../sanghyeon/components/Header.jsx';
import S from './styled.jsx';
import RankingListItem from './RankingListItem.jsx';
import RankingGraph from './RankingGraph.jsx';
import { useState } from 'react';
import useLeaderboardStore from '../../../stores/LeaderboardStore.jsx';
import styled from 'styled-components';

export default function Ranking() {
  const { rankingList, setRankingList, boardPeriod, setBoardPeriod } = useLeaderboardStore();
  const handleTabClick = (tab) => {
    setBoardPeriod(tab);
  };
  const restRankings = [4, 5, 6, 7, 8, 9, 10];
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
                console.log(boardPeriod);
                console.log(boardPeriod === 'total');
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
              {restRankings.map((e, idx) => {
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
