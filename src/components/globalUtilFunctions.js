export function calculateScore(answerSelected,actualAnswer,isDoubleIt,isTripleIt) {
  //check if selected option same as actual answer
  let isCorrect = ((answerSelected === actualAnswer)? 1: 0),scoreValue=0;
  //check if user opted to double value(2) or triple it(3) or none
  let willTheValueBeDoubledOrTripledOrNone = isDoubleIt * 2
    + isTripleIt * 3;

  // if answer not correct and user selected double or triple, reduce points
  if(!(isCorrect) && willTheValueBeDoubledOrTripledOrNone) {
    scoreValue = -1 * (willTheValueBeDoubledOrTripledOrNone-1) * 10;
  }

  //if answer correct and user selected double or triple, award additional points
  else if(isCorrect && willTheValueBeDoubledOrTripledOrNone){
    scoreValue = willTheValueBeDoubledOrTripledOrNone * 10;
  }

  //if answer correct and user didn't select double or triple, award usual points
  else if((isCorrect && !(willTheValueBeDoubledOrTripledOrNone))
    || (!isCorrect && !(willTheValueBeDoubledOrTripledOrNone)) ){
    scoreValue = isCorrect*10;
  }
  return scoreValue;
}

export function selectAndRemoveQuestion(jsonQuestions) {
  //select random question from array
  let randomQuestionIndex = Math.floor( Math.random() * jsonQuestions.length );
  let randomQuestion = jsonQuestions[randomQuestionIndex];

  //remove that random question from array so next time,a new question is selected randomly
  jsonQuestions.splice( randomQuestionIndex, 1);
  return Object.values( randomQuestion);
}
