const Problem = require('../Models/problem');

const problemController = {};

problemController.createProblems = async (problems) => {
  return await Problem.insertMany(problems);
};

problemController.getProblems = async (limit) => {
  return await Problem.find().limit(limit);
};

module.exports = problemController;
