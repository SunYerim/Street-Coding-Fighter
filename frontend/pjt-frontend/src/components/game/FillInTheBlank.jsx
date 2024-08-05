import React from 'react';

const FillInTheBlank = ({ problem }) => {
  return (
    <div>
      <h2>{problem.title}</h2>
      <p>{problem.problemContent.content}</p>
      {/* Blank input fields can be generated here */}
      {/* For example: */}
      {Array.from({ length: problem.problemContent.numberOfBlanks }).map((_, index) => (
        <input key={index} type="text" placeholder={`Blank ${index + 1}`} />
      ))}
    </div>
  );
};

export default FillInTheBlank;
