// lib/quiz-utils.ts
export const validateAnswer = (question: any, userSelection: any) => {
  if (question.type === 'MCQ') {
    return userSelection === question.correct_answers[0];
  }

  if (question.type === 'FITB') {
    return userSelection.toLowerCase().trim() === question.correct_answers[0].toLowerCase().trim();
  }

  if (question.type === 'MSQ') {
    const isCorrect = 
      userSelection.length === question.correct_answers.length &&
      userSelection.every((val: any) => question.correct_answers.includes(val));
    
    return isCorrect;
  }
  return false;
};