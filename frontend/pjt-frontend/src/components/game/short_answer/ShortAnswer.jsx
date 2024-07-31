import { borderRadius, height, minWidth } from '@mui/system';
import StyleToPythonCode from '../StyleToPythonCode';

const testQuizContent = {
  content: '# 다음 코드의 출력 결과는 무엇일까요? \n print(15 % 4)',
  answer: {
    1: 'j + 1',
    2: 'j',
    3: 'data',
  },
  choices: {
    1: 'i',
    2: 'i+1',
    3: 'j+1',
    4: 'j',
    5: 'data',
    6: 'print',
  },
};
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
  input:{
    width : '100%',
    height : '100%',
  },
  inputDiv : {
    width : '100px',
    height : '20px',
  }
};
const ShortAnswer = () => {
  return (
    <>
      <h2>Short Answer</h2>
      <div style={styles.codeContainer}>
        <StyleToPythonCode codeString={testQuizContent.content} />
      </div>
      <div >
        <input style={styles.input} type="text" />
      </div>
      <button>Submit</button>
    </>
  );
};

export default ShortAnswer;
