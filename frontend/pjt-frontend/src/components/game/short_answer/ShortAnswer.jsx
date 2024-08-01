import { borderRadius, height, minWidth, padding, style } from '@mui/system';
import StyleToPythonCode from '../StyleToPythonCode';
import { useState } from 'react';

// const testQuizContent = {
//   content: '# 다음 코드의 출력 결과는 무엇일까요? \n print(15 % 4)',
//   answer: {
//     1: 'j + 1',
//     2: 'j',
//     3: 'data',
//   },
//   choices: {
//     1: 'i',
//     2: 'i+1',
//     3: 'j+1',
//     4: 'j',
//     5: 'data',
//     6: 'print',
//   },
// };

const styles = {
  codeContainer: {
    maxWidth: '600px',
    height: '150px',
    margin: '0 auto',
    padding: '1rem',
    // backgroundColor: '#f9f9f9',
    borderRadius: '5px',
    boxShadow: '0 0 5px rgba(0, 0, 0, 0.2)',
  },
  answerInput: {
    width: '200px',
    height: '30px',
    padding : '10px',
    paddingLeft: '20px',
  },
  inputDiv: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '10px',
    borderRadius: '5px',
  },
  submitButton: {
    display: 'inline-block',
    padding: '10px 20px',
    fontSize: '16px',
    color: '#fff',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    // marginTop: '20px',
    marginLeft: '20px',
  },

};
const ShortAnswer = ({ problem }) => {
  const [answer, setAnswer] = useState('');
  
  const onInputChange = (e) =>{
    console.log(e.target.value);
    setAnswer(e.target.value)
  }
  const handleKeyDown = (e) => {
    if(e.key == 'Enter'){
      handleSubmit();
    }
  }
  const handleSubmit = () => {
    // 여기 제출하는 함수 작성하시면 됩니다!
    alert(`${answer}제출됨`)
  };
  return (
    <>
      <h2>Short Answer</h2>
      <div style={styles.codeContainer}>
        <StyleToPythonCode codeString={problem.problemContent.content} />
      </div>
      <div style={styles.inputDiv}>
        <input style={styles.answerInput} type="text" onChange={onInputChange} onKeyDown={handleKeyDown} />
        <button style={styles.submitButton} onClick={handleSubmit}>제출</button>
      </div>
    </>
  );
};

export default ShortAnswer;
