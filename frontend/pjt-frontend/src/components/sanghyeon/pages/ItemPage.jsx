import Header from "../components/Header";
import "../../../css/ItemPage.css";
import { useRef } from "react";

import pixelTicket from "/pixel-ticket.jpg";
import movingGreenSlime from "../../../assets/characters/movingGreenSlime.gif";

const ItemPage = () => {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * 25; // 기울기 정도를 조절
    const rotateY = ((centerX - x) / centerX) * 25;

    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    card.style.transform = `rotateX(0) rotateY(0)`; // 원상 복귀
  };

  return (
    <>
      <div className="item-outer-outer-container">
        <Header />
        <div className="item-outer-container">
          <div className="item-container">
            <div className="item-inner-container">
              <div className="item-left-container">
                <div className="item-title-container">
                  <div className="item-title">아이템 샵</div>
                </div>
                <div className="item-point-container">
                  <div className="item-point">포인트: 1,000,000 P</div>
                </div>
                <div className="item-info-container">
                  <div className="item-info-upper-container">
                    <div className="item-info-img-container">
                      <img src={pixelTicket} alt="my-character" />
                    </div>
                    <div className="item-info-title-container">
                      알쏭달쏭 캐릭터 티켓
                    </div>
                  </div>
                  <div className="item-info">
                    사용하면 프로필의 캐릭터를 10가지 캐릭터와 일부 특별한
                    캐릭터 중 임의로 바꿔 주는 아이템입니다. 아이템을 사용하는
                    순간 프로필의 캐릭터가 바뀌며 영구적으로 적용되고, 현재
                    캐릭터는 사라집니다.
                  </div>
                  <div className="item-info-button-container">
                    <button>구매 (1000 P)</button>
                  </div>
                </div>
              </div>
              <div className="item-right-container">
                <div
                  className="item-character-outer-container"
                  ref={cardRef}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="item-character-inner-container">
                    <div className="item-character-rank-container">
                      <div className="item-character-rank">R</div>
                    </div>
                    <div className="item-character-img-container">
                      <img src={movingGreenSlime} alt="my-character" />
                    </div>
                    <div className="item-character-name-container">
                      <div className="item-character-name">The Slime.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ItemPage;
