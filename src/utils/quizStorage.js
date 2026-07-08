/**
 * Quiz Storage Service
 * Manages all CRUD operations for quiz data in Supabase
 * Functions wrap API calls with error handling and caching
 */

export async function saveQuiz(quizData) {
  /**
   * Save new quiz to database
   * - Generates unique quizId
   * - Stores all questions and settings
   * - Returns quizId for URL generation
   */
  try {
    const response = await fetch('/api/quizzes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quizData)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Failed to save quiz');
    return result; // { quizId, shortURL, qrCodeURL }
  } catch (error) {
    console.error('Error saving quiz:', error);
    throw error;
  }
}

export async function loadQuiz(quizId) {
  /**
   * Load quiz by quizId
   * - Fetches from database
   * - Returns complete quiz structure
   * - Used by student to join quiz
   */
  try {
    const response = await fetch(`/api/quizzes/${quizId}`);
    if (!response.ok) {
      if (response.status === 404) throw new Error('Quiz not found');
      throw new Error('Failed to load quiz');
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading quiz:', error);
    throw error;
  }
}

export async function listTeacherQuizzes(teacherId) {
  /**
   * Get all quizzes created by a teacher
   * - Used in teacher dashboard
   * - Shows quiz status, participant count, etc.
   */
  try {
    const response = await fetch(`/api/teacher/${teacherId}/quizzes`);
    if (!response.ok) throw new Error('Failed to load quizzes');
    return await response.json();
  } catch (error) {
    console.error('Error listing quizzes:', error);
    throw error;
  }
}

export async function updateQuizStatus(quizId, status) {
  /**
   * Update quiz status (active/ended/archived)
   * - Controls whether new students can join
   * - Marks quiz as completed
   */
  try {
    const response = await fetch(`/api/quizzes/${quizId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!response.ok) throw new Error('Failed to update quiz');
    return await response.json();
  } catch (error) {
    console.error('Error updating quiz:', error);
    throw error;
  }
}
