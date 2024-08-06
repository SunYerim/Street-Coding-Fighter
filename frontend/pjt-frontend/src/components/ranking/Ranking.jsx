import Header from '../sanghyeon/components/Header.jsx';
import S from './styled.jsx';
import RankingListItem from './RankingListItem.jsx';
import RankingGraph from './RankingGraph.jsx';
import { useState, useEffect } from 'react';
import useLeaderboardStore from '../../stores/LeaderboardStore.jsx';
import store from '../../store/store.js';
import axios from 'axios';

export default function Ranking() {
  const { rankingList, setRankingList, boardPeriod, setBoardPeriod } = useLeaderboardStore();
  
  useEffect(() => {
    const fetchRankingData = async () => {
      // const tempUrl = 'http://192.168.30.171:8080';
      const rankingObj = {};

      try {
        const [totalRes, weeklyRes, dailyRes] = await Promise.all([
          // axios.get(`${tempUrl}/rank/total`),
          // axios.get(`${tempUrl}/rank/weekly`),
          // axios.get(`${tempUrl}/rank/daily`),
          axios.get(`${store.BaseUrl}/rank/total`).then((res) => console.log(res.data)).catch((err) => console.log(err)),
          axios.get(`${store.BaseUrl}/rank/weekly`).then((res) => console.log(res.data)).catch((err) => console.log(err)),
          axios.get(`${store.BaseUrl}/rank/daily`).then(res => console.log(res.data)).catch((err) => console.log(err)),
        ]);

        rankingObj['total'] = totalRes.data;
        rankingObj['weekly'] = weeklyRes.data;
        rankingObj['daily'] = dailyRes.data;
        console.log(rankingObj)
        setRankingList(rankingObj);
      } catch (error) {
        console.error("Error fetching ranking data:", error);
      }
    };

    fetchRankingData();
  }, [setRankingList]);

  const handleTabClick = (tab) => {
    setBoardPeriod(tab);
  };

  return (
    <>
      <Header />
      <S.PageBody>
        <S.Container>
          <h1>{boardPeriod.toUpperCase()} Ranking</h1>
          <S.RankingInfoContainer>
            <S.PeriodButton
              onClick={() => handleTabClick('total')}
              $isSelected={boardPeriod === 'total'}
            >
              Total
            </S.PeriodButton>
            <S.PeriodButton
              onClick={() => handleTabClick('weekly')}
              $isSelected={boardPeriod === 'weekly'}
            >
              Weekly
            </S.PeriodButton>
            <S.PeriodButton
              onClick={() => handleTabClick('daily')}
              $isSelected={boardPeriod === 'daily'}
            >
              Daily
            </S.PeriodButton>
          </S.RankingInfoContainer>
          <S.FlexContainer>
            <S.RankingInfoSection>
              <S.GraphContainer>
                <RankingGraph />
              </S.GraphContainer>
            </S.RankingInfoSection>
            <S.RankingListSection>
              {rankingList && rankingList[boardPeriod] ? (
                rankingList[boardPeriod].slice(3).map((player, idx) => (
                  <RankingListItem key={idx} rank={idx + 4} player={player} />
                ))
              ) : null}
            </S.RankingListSection>
          </S.FlexContainer>
        </S.Container>
      </S.PageBody>
      <style></style>
    </>
  );
}
