/* ========================================================
   UnrealAkademi — Quiz Interactivity
   ======================================================== */

const Quiz = {
  /**
   * Bir seçeneğe tıklanınca çağrılır
   * @param {HTMLElement} el - Tıklanan option
   * @param {boolean} isCorrect
   * @param {string} questionId
   */
  answer(el, isCorrect, questionId) {
    const container = document.getElementById(questionId);
    if (!container) return;

    // Zaten yanıtlanmışsa devre dışı bırak
    if (container.querySelector('.quiz-option.correct, .quiz-option.wrong')) {
      return;
    }

    // Görsel işaret
    el.classList.add(isCorrect ? 'correct' : 'wrong');

    // Feedback göster
    const feedbackId = isCorrect ? `${questionId}-ok` : `${questionId}-fail`;
    const feedback = document.getElementById(feedbackId);
    if (feedback) {
      feedback.classList.add('show');
    }

    // Doğru cevap işaretle (yanlış seçildi ise)
    if (!isCorrect) {
      const correctOption = container.querySelector('.quiz-option[data-correct="true"]');
      if (correctOption && correctOption !== el) {
        correctOption.classList.add('correct');
      }
    }
  },

  /**
   * Quizi sıfırla
   */
  reset(questionId) {
    const container = document.getElementById(questionId);
    if (!container) return;

    container.querySelectorAll('.quiz-option').forEach(opt => {
      opt.classList.remove('correct', 'wrong');
    });

    document.getElementById(`${questionId}-ok`)?.classList.remove('show');
    document.getElementById(`${questionId}-fail`)?.classList.remove('show');
  }
};

window.Quiz = Quiz;

// Eski API uyumluluğu için
window.answer = (el, isCorrect, qid) => Quiz.answer(el, isCorrect, qid);
window.resetQ = (qid) => Quiz.reset(qid);
