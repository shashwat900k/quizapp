export function calculateScore(answerSelected,actualAnswer,isDoubleIt,isTripleIt) {
  let isCorrect = ((answerSelected === actualAnswer)? 1: 0),scoreValue=0;
  let willTheValueBeDoubledOrTripledOrNone = isDoubleIt * 2
    + isTripleIt * 3;

  if(!(isCorrect) && willTheValueBeDoubledOrTripledOrNone) {
    scoreValue = -1 * (willTheValueBeDoubledOrTripledOrNone-1) * 10;
  }

  else if(isCorrect && willTheValueBeDoubledOrTripledOrNone){
    scoreValue = willTheValueBeDoubledOrTripledOrNone * 10;
  }

  else if((isCorrect && !(willTheValueBeDoubledOrTripledOrNone))
    || (!isCorrect && !(willTheValueBeDoubledOrTripledOrNone)) ){
    scoreValue = isCorrect*10;
  }
  return scoreValue;
}

export function selectAndRemoveQuestion(jsonQuestions) {
  let randomQuestionIndex = Math.floor( Math.random() * jsonQuestions.length );
  let randomQuestion = jsonQuestions[randomQuestionIndex];

  jsonQuestions.splice( randomQuestionIndex, 1);
  return Object.values( randomQuestion);
}
