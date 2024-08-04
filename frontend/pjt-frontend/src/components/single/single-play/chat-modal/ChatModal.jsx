// ChatModal.jsx
import React from 'react';
import S from './styled'; // styled 컴포넌트 파일

export default function ChatModal() {
  // if (!isOpen) return null;

  return (
    <div style={styles.modalOverlay}>
      채팅창 들갈거임 제발 나와라 ㅜㅜ

    </div>
  );
}

const styles = {
  modalOverlay: {
    position: 'absolute',
    top: '-100%',
    left: '-40px',
    width: '100%',
    height: '100%',
    backgroundColor : 'white',
  },
  
}
