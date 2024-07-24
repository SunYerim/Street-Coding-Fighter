import styled from 'styled-components';

const Row = styled.div`
  display: flex;
  flex-direction: ${(props) => (props.$rowidx % 2 ? 'row-reverse' : 'row')};
  justify-content: center;
  border-radius: 10px;
  // background-color: rgba(83, 92, 145, 0.9);
  align-items: center;
  height: 70px;
  width: 100%;
`;
const RowBeetween = styled.div`
  height: 50px;
  width: 100%;
`;

const CheckPoint = styled.div`
position: relative;
width: 170px;
height: 100%;
background-color: red;
display: flex;
justify-content: center;
align-items: center;
border-radius: 10%;
transition: background-color 0.3s;
cursor: pointer;
background-color: ${(props) => (props.$completed ? '#12486B' : 'gray')};
border: ${(props) => (props.$isNext ? '2px solid white' : null)};
&:hover {
  background-color: rgba(83, 92, 145, 1);
  }
  `;
  
  const Path = styled.div`
  width: 50px;
  height: 10px;
  background-color: ${(props) => (props.$completed ? '#419197' : 'gray')};
  transition: background-color 0.3s;
  `;
  
  const VerticalPath = styled.div`
  width : 10px;
  height: 50px;
    background-color: ${(props) => (props.$completed ? '#419197' : 'gray')};
    transition: background-color 0.3s;
    position : absolute;
    top : 100%
  `;
  const S = {
    Row,
    CheckPoint,
    Path,
    RowBeetween,
    VerticalPath,
  };
  
  export default S;
