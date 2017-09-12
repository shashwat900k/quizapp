let React = require('react');
const ScoreCard = (props) => {
  return(
    <div className="score">
    {props.userscore}
    </div>
  )
}

export default ScoreCard;
