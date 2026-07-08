/**
 * Quiz CRUD API Routes
 * 
 * POST /api/quizzes - Create new quiz
 * GET /api/quizzes/:quizId - Fetch quiz by ID
 * PATCH /api/quizzes/:quizId - Update quiz status
 * GET /api/teacher/:teacherId/quizzes - List teacher's quizzes
 * 
 * All quiz data stored in Supabase 'quizzes' table
 */

import { Router } from 'express';
import { createClient } from '@supabase/supabase-js';
import { nanoid } from 'nanoid'; // generate short unique IDs

const router = Router();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = (supabaseUrl && supabaseKey)
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// Helper: Generate short quiz ID (8 characters)
function generateQuizId() {
  return nanoid(8); // e.g., "a1b2c3d4"
}

/**
 * POST /api/quizzes
 * Create new quiz with questions
 * Request body: { title, timerMin, pin, questions, teacherId, teacherName }
 * Response: { quizId, shortURL, qrCodeURL, createdAt }
 */
router.post('/quizzes', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(503).json({ error: 'Database connection unavailable' });
    }

    const { title, timerMin, pin, questions, teacherId, teacherName } = req.body;

    if (!questions || questions.length === 0) {
      return res.status(400).json({ error: 'Quiz must have at least one question' });
    }

    const quizId = generateQuizId();
    const shortURL = `/quiz/${quizId}`;
    const baseURL = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:5173';
    const qrCodeURL = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(baseURL + shortURL)}`;

    // Save quiz to Supabase
    const { data, error } = await supabase
      .from('quizzes')
      .insert([{
        quiz_id: quizId,
        title,
        timer_minutes: timerMin,
        pin,
        questions: JSON.stringify(questions),
        teacher_id: teacherId || 'unknown',
        teacher_name: teacherName || 'Teacher',
        status: 'active',
        created_at: new Date().toISOString(),
        participant_count: 0
      }])
      .select();

    if (error) {
      console.error('Supabase insert error:', error);
      throw error;
    }

    res.status(201).json({
      quizId,
      shortURL,
      qrCodeURL,
      createdAt: new Date()
    });
  } catch (error) {
    console.error('Error creating quiz:', error);
    res.status(500).json({ error: error.message || 'Failed to create quiz' });
  }
});

/**
 * GET /api/quizzes/:quizId
 * Fetch quiz by short ID (for student to join)
 * Response: { quizId, title, timerMin, questions, status }
 */
router.get('/quizzes/:quizId', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(503).json({ error: 'Database connection unavailable' });
    }

    const { quizId } = req.params;

    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .eq('quiz_id', quizId)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    if (data.status === 'ended') {
      return res.status(403).json({ error: 'This quiz has ended' });
    }

    // Parse questions from JSON
    const quiz = {
      quizId: data.quiz_id,
      title: data.title,
      timerMin: data.timer_minutes,
      pin: data.pin,
      questions: JSON.parse(data.questions),
      teacherName: data.teacher_name,
      status: data.status
    };

    res.json(quiz);
  } catch (error) {
    console.error('Error fetching quiz:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch quiz' });
  }
});

/**
 * PATCH /api/quizzes/:quizId
 * Update quiz status (active → ended → archived)
 */
router.patch('/quizzes/:quizId', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(503).json({ error: 'Database connection unavailable' });
    }

    const { quizId } = req.params;
    const { status } = req.body;

    if (!['active', 'ended', 'archived'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const { error } = await supabase
      .from('quizzes')
      .update({ status })
      .eq('quiz_id', quizId);

    if (error) throw error;

    res.json({ success: true, status });
  } catch (error) {
    console.error('Error updating quiz:', error);
    res.status(500).json({ error: error.message || 'Failed to update quiz' });
  }
});

/**
 * GET /api/teacher/:teacherId/quizzes
 * List all quizzes created by a teacher
 */
router.get('/teacher/:teacherId/quizzes', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(503).json({ error: 'Database connection unavailable' });
    }

    const { teacherId } = req.params;

    const { data, error } = await supabase
      .from('quizzes')
      .select('quiz_id, title, status, participant_count, created_at')
      .eq('teacher_id', teacherId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data || []);
  } catch (error) {
    console.error('Error listing quizzes:', error);
    res.status(500).json({ error: error.message || 'Failed to list quizzes' });
  }
});

export default router;
