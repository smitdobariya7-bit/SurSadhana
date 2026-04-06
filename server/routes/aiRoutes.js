import express from "express";
import jwt from "jsonwebtoken";
import { askAI, getAIHistory, saveAIHistory, analyzeAudioWithAI } from "../controllers/aiController.js";

const router = express.Router();

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ error: 'Server configuration error' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token.' });
  }
};

router.post("/ask", askAI);
router.post("/query", askAI);
router.post("/audio/analyze", analyzeAudioWithAI);
router.get("/history", authenticateToken, getAIHistory);
router.post("/history", authenticateToken, saveAIHistory);

export default router;

