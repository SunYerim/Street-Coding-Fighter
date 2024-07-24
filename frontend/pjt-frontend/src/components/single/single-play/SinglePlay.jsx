import { useState } from 'react';
import S from './styled';
import { FaRegCommentDots } from 'react-icons/fa';
import { CgProfile } from 'react-icons/cg';
import { PiMouseRightClick, PiMouseLeftClick } from 'react-icons/pi';

export default function SinglePlay() {
  const [page, setPage] = useState(0);
  const dialogueList = [
    {
      page_no: 0,
      script_content: '<p>첫번째줄 대사입니다.</p><p>두번째줄 대사입니다.</p><p>세번째줄 대사입니다.</p>',
    },
    {
      page_no: 1,
      script_content: '<p>두번째페이지입니다.</p><p>두번째줄 대사입니다.</p><p>세번째줄 대사입니다.</p>',
    },
    {
      page_no: 2,
      script_content: '<p>3번째페이지입니다.</p><p>두번째줄 대사입니다.</p><p>세번째줄 대사입니다.</p>',
    },
    {
      page_no: 3,
      script_content: '<p>4번째페이지입니다.</p><p>두번째줄 대사입니다.</p><p>세번째줄 대사입니다.</p>',
    },
    {
      page_no: 4,
      script_content: '<p>5번째페이지입니다.</p><p>두번째줄 대사입니다.</p><p>세번째줄 대사입니다.</p>',
    },
  ];
  const nextPage = () => {
    if (page < dialogueList.length - 1) {
      setPage((prevPage) => prevPage + 1);
    } else {
      setPage(dialogueList.length - 1);
    }
    console.log(page);
  };
  const prevPage = (event) => {
    event.preventDefault();
    if (0 < page) {
      setPage((prevPage) => prevPage - 1);
    } else {
      setPage(0);
    }
    console.log(page);
  };
  return (
    <S.PlayView>
      <S.ImageBox>
        <S.CharacterImage src="/src/assets/character-test-removebg-preview.png" alt="" />
      </S.ImageBox>
      <S.DialogueBox onClick={nextPage} onContextMenu={prevPage}>
        <S.DialogueHeader>
          <S.CharacterName>
            <span>
              <CgProfile />
              <span> Hoshino Ai</span>
            </span>
          </S.CharacterName>
        </S.DialogueHeader>

        <S.DialogueBody>
          <S.DialogueBodyLeft>
            <p>
              <FaRegCommentDots />
            </p>
          </S.DialogueBodyLeft>
          <S.DialogueContent
            dangerouslySetInnerHTML={{ __html: dialogueList[page].script_content }}
          ></S.DialogueContent>
        </S.DialogueBody>
        <S.DialogueBodyRight>
          <p>
            <PiMouseLeftClick /> 클릭 : 다음
          </p>
          <p>
            <PiMouseRightClick /> 우클릭 : 이전
          </p>
        </S.DialogueBodyRight>
      </S.DialogueBox>
    </S.PlayView>
  );
}
