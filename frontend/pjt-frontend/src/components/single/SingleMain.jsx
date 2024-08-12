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
  const navigate = useNavigate();
  useEffect(() => {
    const { baseURL, accessToken } = store(); 
    const tempToken = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxNzUiLCJhdXRoIjoiVVNFUiIsIm1lbWJlcklkIjoxNzUsInVzZXJuYW1lIjoiRGFlZ2lCZXJuYXJkb1llbyIsImlhdCI6MTcyMzQ0NDAxNiwiZXhwIjoxNzIzNDQ3NjE2fQ.o0gqwFDuiPyaqPLBn_zpbGz-aXOCrOto3dm62-1HK4k'
    const getSingleInfo = () => {
      axios({
        method: 'get',
        url: `${baseURL}/single`,
        headers: {
          Authorization: `Bearer ${tempToken}`,
          // Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI5MCIsImF1dGgiOiJVU0VSIiwibWVtYmVySWQiOjkwLCJ1c2VybmFtZSI6IuqwgOyghOyCrOyXheu2gC3quYDrr7zsmrEiLCJpYXQiOjE3MjMwOTczNjgsImV4cCI6MTcyMzEwMDk2OH0.4wZxyxS2RwHVFiZZWq7e3QIV54UZ1_XNdYb0x-92qAQ`,
        },
      })
        .then((res) => {
          console.log(res.data);
          setCompleted(res.data.contentList);
        })
        .catch((error) => {
          console.log('완료목록 로드 실패');
          console.log(error);
        });
    };
    getSingleInfo();
  }, []);
  return (
    <>
      <Header />
      <div id="container">
        <TitleDiv>
          <h1>Story Mode</h1>
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
  margin-bottom : 50px;
`;
