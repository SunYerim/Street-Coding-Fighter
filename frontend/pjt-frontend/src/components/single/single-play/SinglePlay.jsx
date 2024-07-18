import './SinglePlay.css'


export default function SinglePlay() {
  return (
    <div id='play-view'>
      <div id='image-box'> {/* image, fixed로 할 예정 */}
        <img className = "character" src="/src/assets/character-test-removebg-preview.png" alt="" />

      </div>
      <div id='dialogue-box'>
        {' '}
        {/* dialogue box */}
        <div id='dialogue-header'>
          {' '}
          {/* dialogue header */}
          <button className='dialogue-btn'>이전</button>
          <button className='dialogue-btn'>다음</button>
        </div>
        <div>
          {' '}
          {/* dialogue body */}
          <p>대사 들어갈 자리 어쩌고 저쩌고</p>
        </div>
      </div>
    </div>
  );
}
