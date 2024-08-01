import React from 'react';

const ShortAnswerQuestion = ({ problem }) => {
  return (
    <div>
      <h2>{problem.title}</h2>
      <p>{problem.problemContent.content}</p>
      <input type="text" placeholder="Your answer" />
    </div>
  );
};

export default ShortAnswerQuestion;
