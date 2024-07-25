import styled from 'styled-components';

const PageBody = styled.div`
  display: flex;
  margin-top: 15px;
  justify-content: center;
`;
const Container = styled.div`
  // display : flex;
  text-align: center;
  justify-content: center;
  background-color: rgba(248, 249, 250, 0.6);
  width: 80vw;
  margin: 20px;
  margin-top: 0px;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;
const FlexContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const RankingInfoSection = styled.div`
  text-align: center;
  // width : 200px;
  margin-bottom: 20px;
  margin-right: 60px;
  font-size: 1.2em;
  color: #495057;
`;

const RankingListSection = styled.div`
  // width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;
const RankingInfoContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
`;

const RankingInfo = styled.div`
  flex: 1;
  padding: 10px;
  text-align: center;
  color: #343a40;
`;

const RankingList = styled.div`
  width: 100%;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const RankingItem = styled.div`
  padding: 10px;
  border-bottom: 1px solid #dee2e6;
  &:last-child {
    border-bottom: none;
  }
  &:hover {
    background-color: #f1f3f5;
  }
`;

const GraphContainer = styled.div`
  width: 100%;
  height: 50vh;
  margin: 20px 0;
`;

const PeriodButton = styled.button`
  padding: 10px 20px;
  margin: 10px;
  border: none;
  border-radius: 8px;
  // background-color: #007bff;
  background-color: ${(props) => (props.$isSelected ? '#007bff' : 'gray')};
  color: #ffffff;
  font-size: 1em;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

const S = {
  FlexContainer,
  RankingInfoContainer,
  RankingInfo,
  RankingList,
  RankingItem,
  GraphContainer,
  RankingInfoSection,
  RankingListSection,
  PeriodButton,
  Container,
  PageBody,
};

export default S;
