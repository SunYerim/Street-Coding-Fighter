import { useState } from 'react';
import S from './styled';
import { FaRegCommentDots } from 'react-icons/fa';
import { CgProfile } from 'react-icons/cg';
import { PiMouseRightClick, PiMouseLeftClick } from 'react-icons/pi';
import { TypeAnimation } from 'react-type-animation';
import { useParams } from 'react-router-dom';

export default function SinglePlay() {
  const [page, setPage] = useState(0);
  const {content_id} = useParams();
  const dialogueList = [
    {
      page_no: 0,
      script_content: "첫번째 줄 \n 두번째 줄 \n 세번째 줄",
      action: 0,
      image : 0,
    },
    {
      page_no: 1,
      script_content: "두번빼 페이지 줄 \n 두번째 줄 \n 세번째 줄",
    },
    {
      page_no: 3,
      script_content: "세번째 페이지 줄 \n 두번째 줄 \n 세번째 줄",
    },
    {
      page_no: 4,
      script_content: "네번째 페이지 \n 두번째 줄 \n 세번째 줄",
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
              <span> Hoshino Ai {content_id}</span>
            </span>
          </S.CharacterName>
        </S.DialogueHeader>

        <S.DialogueBody>
          <S.DialogueBodyLeft>
            <p>
              <FaRegCommentDots />
            </p>
          </S.DialogueBodyLeft>
          <S.DialogueContent >
            <TypeAnimation key={page}
                    style={{
                      color: "black",
                      whiteSpace: "pre-line",
                    }}            
            sequence={[dialogueList[page].script_content, 500]} wrapper="p" speed={50} />
          </S.DialogueContent>
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
