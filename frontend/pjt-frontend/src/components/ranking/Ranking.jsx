import Header from '../sanghyeon/components/Header.jsx';
import S from './styled.jsx';
import RankingListItem from './RankingListItem.jsx';
import RankingGraph from './RankingGraph.jsx';
import { useState } from 'react';
import useLeaderboardStore from '../../../stores/LeaderboardStore.jsx';

export default function Ranking() {
  const { rankingList, setRankingList, boardPeriod, setBoardPeriod } = useLeaderboardStore();
  const handleTabClick = (tab) => {
    setBoardPeriod(tab);
  };
  const restRankings = [3, 4, 5, 6, 7, 8, 9, 10];
  return (
    <>
      <Header></Header>
      <S.FlexContainer>
        <S.RankingInfoSection>
          <S.RankingInfoContainer>
            <h1>Ranking</h1>
            <button
              onClick={() => {
                handleTabClick('total');
              }}
            >
              Total
            </button>
            <button onClick={() => handleTabClick('weekly')}>Weekly</button>
            <button onClick={() => handleTabClick('daily')}>Daily</button>
          </S.RankingInfoContainer>
          <S.GraphContainer>
            <RankingGraph></RankingGraph>
          </S.GraphContainer>
        </S.RankingInfoSection>
        <S.RankingListSection>
          <h2>{boardPeriod} Ranking</h2>
          {restRankings.map((e, idx) =>{
            console.log(rankingList[boardPeriod])
            return(
              <RankingListItem key={idx} rank = {e} player={rankingList[boardPeriod]?.[e]}></RankingListItem>
            )
          })}
        </S.RankingListSection>
      </S.FlexContainer>
    </>
  );
}
