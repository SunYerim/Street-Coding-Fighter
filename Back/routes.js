const express = require('express');
const problemController = require('./Controllers/problem.controller');
const router = express.Router();

router.post('/problems', async (req, res) => {
  try {
    const problems = await problemController.createProblems(req.body);
    res.status(201).json(problems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/problems', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;
    const problems = await problemController.getProblems(limit);
    res.status(200).json(problems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
