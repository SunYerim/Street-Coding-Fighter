const mongoose = require('mongoose');

const problemContentSchema = new mongoose.Schema({
  problemId: Number,
  content: String,
  numberOfBlanks: Number,
});

const problemChoiceSchema = new mongoose.Schema({
  choiceId: Number,
  problemId: Number,
  choiceText: String,
});

const problemAnswerSchema = new mongoose.Schema({
  answerId: Number,
  problemId: Number,
  blankPosition: Number,
  correctChoice: problemChoiceSchema,
  correctAnswerText: String,
});

const problemSchema = new mongoose.Schema({
  problemId: Number,
  title: String,
  problemType: String,
  category: String,
  difficulty: Number,
  problemContent: problemContentSchema,
  problemChoices: [problemChoiceSchema],
  problemAnswers: [problemAnswerSchema],
});

module.exports = mongoose.model('Problem', problemSchema);
