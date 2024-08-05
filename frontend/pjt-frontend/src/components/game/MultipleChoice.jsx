import React from 'react';

const MultipleChoice = ({ problem }) => {
  return (
    <div>
      <h2>{problem.title}</h2>
      <p>{problem.problemContent.content}</p>
      {problem.problemChoices.map((choice) => (
        <div key={choice.choiceId}>
          <input type="radio" id={choice.choiceId} name="choice" value={choice.choiceId} />
          <label htmlFor={choice.choiceId}>{choice.choiceText}</label>
        </div>
      ))}
    </div>
  );
};

export default MultipleChoice;
