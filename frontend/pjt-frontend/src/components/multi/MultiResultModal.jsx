import React, { useRef, useEffect, useState } from "react";
import MultiRanking from "./MultiRanking.jsx";
import JSConfetti from 'js-confetti';


const MultiResultModal = ({ isFinalResult }) => {
  
  const [modalOpen, setModalOpen] = useState(true);
  const modalOutside = useRef();
  
  useEffect(() => {
    const confettiInstance = new JSConfetti();

    if (isFinalResult) { // resultModalOpen일 때만 confetti를 터트림
      confettiInstance.addConfetti({
        confettiColors: [
          "#CAB0FF"
        ],
        confettiNumber: 500,
      });
    }
  }, [isFinalResult]);

  const handleModalClick = (e) => {
    if (e.target === modalOutside.current) {
      setModalOpen(false);
    }
  };

  return (
    <>
      {
        modalOpen &&
        <div
          className={'result-modal-container'}
          ref={modalOutside}
          onClick={handleModalClick}
        >
          <div className="result-modal-content">
              <MultiRanking />
          </div>
        </div>
      }
    
    </>
  );
}

export default MultiResultModal;