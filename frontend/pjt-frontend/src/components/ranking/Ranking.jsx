import Header from '../sanghyeon/components/Header.jsx';
import S from './styled.jsx';
import RankingListItem from './RankingListItem.jsx';
import RankingGraph from './RankingGraph.jsx';
import { useState } from 'react';

const testRanking = {
  total: {
    1: { name: 'Bernie1', exp: 1000000 },
    2: { name: 'Bernie2', exp: 1000000 },
    3: { name: 'Bernie3', exp: 1000000 },
    4: { name: 'Bernie4', exp: 1000000 },
    5: { name: 'Bernie5', exp: 1000000 },
    6: { name: 'Bernie6', exp: 1000000 },
    7: { name: 'Bernie7', exp: 1000000 },
    8: { name: 'Bernie8', exp: 1000000 },
    9: { name: 'Bernie9', exp: 1000000 },
    10: { name: 'Bernie10', exp: 1000000 },
  },
  weekly: {
    1: { name: 'Bernie', exp: 1000000 },
    2: { name: 'Bernie', exp: 1000000 },
    3: { name: 'Bernie', exp: 1000000 },
    4: { name: 'Bernie', exp: 1000000 },
    5: { name: 'Bernie', exp: 1000000 },
    6: { name: 'Bernie', exp: 1000000 },
    7: { name: 'Bernie', exp: 1000000 },
    8: { name: 'Bernie', exp: 1000000 },
    9: { name: 'Bernie', exp: 1000000 },
    10: { name: 'Bernie', exp: 1000000 },
  },
  daily: {
    1: { name: 'Bernie', exp: 1000000 },
    2: { name: 'Bernie', exp: 1000000 },
    3: { name: 'Bernie', exp: 1000000 },
    4: { name: 'Bernie', exp: 1000000 },
    5: { name: 'Bernie', exp: 1000000 },
    6: { name: 'Bernie', exp: 1000000 },
    7: { name: 'Bernie', exp: 1000000 },
    8: { name: 'Bernie', exp: 1000000 },
    9: { name: 'Bernie', exp: 1000000 },
    10: { name: 'Bernie', exp: 1000000 },
  },
};
export default function Ranking() {
  const [selectedTab, setSelectedTab] = useState('Total');
  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };
  const rankingData = testRanking[selectedTab];
    return (
    <>
      <Header></Header>
      <S.FlexContainer>
        <S.RankingInfoSection>
          <S.RankingInfoContainer>
            <h1>Ranking</h1>
            <button
              onClick={() => {
                handleTabClick('Total');
              }}
            >
              Total
            </button>
            <button onClick={() => handleTabClick('Weekly')}>Weekly</button>
            <button onClick={() => handleTabClick('Daily')}>Daily</button>
          </S.RankingInfoContainer>
          <S.GraphContainer>
            <RankingGraph data={rankingData.slice(0, 3)}></RankingGraph>
          </S.GraphContainer>
        </S.RankingInfoSection>
        <S.RankingListSection>
          <h2>{selectedTab} Ranking</h2>
          <RankingListItem></RankingListItem>
          <RankingListItem></RankingListItem>
          <RankingListItem></RankingListItem>
          <RankingListItem></RankingListItem>
          <RankingListItem></RankingListItem>
          <RankingListItem></RankingListItem>
          <RankingListItem></RankingListItem>
        </S.RankingListSection>
      </S.FlexContainer>
    </>
  );
}
