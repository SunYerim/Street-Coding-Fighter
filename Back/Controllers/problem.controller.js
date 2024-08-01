const Problem = require('../Models/problem');

const problemController = {};

problemController.createProblems = async (problems) => {
  return await Problem.insertMany(problems);
};

problemController.getProblems = async (gameRound) => {
  return await Problem.find().limit(gameRound);
};

module.exports = problemController;
