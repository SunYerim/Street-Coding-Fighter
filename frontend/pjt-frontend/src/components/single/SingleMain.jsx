import SinglePlay from './single-play/SinglePlay.jsx';
import EpisodeList from './single-list/EpisodeList.jsx';
import Container from '../../components/sanghyeon/components/Container.jsx';
import '../../css/Container.css';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import store from '../../store/store.js';
import SingleInfoStore from '../../stores/SingleInfoStore.jsx';
import Header from '../sanghyeon/components/Header.jsx';
export default function SingleMain() {
  const { setCompleted } = SingleInfoStore();
  const {baseURL, accessToken} = store()
  const navigate = useNavigate();
  const getSingleInfo = () => {
    axios({
      method: 'get',
      url: `${baseURL}/single`,
      headers: {
        "Authorization" : `Bearer ${accessToken}`	
      }
    }).then((res) => {
      console.log(res.data);
      setCompleted(res.data);
    });
  };
  useEffect(() => {getSingleInfo()}, []);
  return (
  <>
  <Header />
    <div id="container">
      <TitleDiv>
        <h1>Single Play</h1>
      </TitleDiv>
      <EpisodeList rownum={3}></EpisodeList>
    </div>
  </>
  );
}

const TitleDiv = styled.div`
  display: flex;
  justify-content: center;
  margin: 15px 0px;
`;
