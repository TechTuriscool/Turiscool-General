import { useState, useEffect } from 'react';
import loading from '../../assets/Loading_2.gif';

const MediaGlobal = () => {
  const [averageScore, setAverageScore] = useState(0);
  const [loadingImage, setLoadingImage] = useState(true);
  const variableDesdeEJS22 = JSON.parse(localStorage.getItem('answersObject'));
  console.log("Variable desde EJS22: ", variableDesdeEJS22);

  useEffect(() => {
    let totalScore = 0;
    let totalQuestions = 0;

    for (let key in variableDesdeEJS22) {
      totalScore += variableDesdeEJS22[key];
      totalQuestions++;
    }

    const average = totalScore / totalQuestions;
    setAverageScore(average.toFixed(2));
    setLoadingImage(false);
  }, [variableDesdeEJS22]);

  let backgroundColor = '';
  let color = '';

  if (averageScore >= 0 && averageScore <= 3) {
    backgroundColor = '#F79394';
    color = '#C60001';
  } else if (averageScore > 3 && averageScore <= 4) {
    backgroundColor = '#FDF6C4';
    color = '#F74B00';
  } else if (averageScore > 4 && averageScore <= 5) {
    backgroundColor = '#8BE68B';
    color = '#012E1F';
  }

  return (
    <div className="header">
      <h1>MEDIA GLOBAL</h1>
      {loadingImage ? (
        <img id="loading" src={loading} alt="loading" />
      ) : (
        <div
          id="averageScore"
          style={{ backgroundColor: backgroundColor, color: color }}
        >
          <h3></h3>
          <h1>{averageScore}</h1>
        </div>
      )}
    </div>
  );
};

export default MediaGlobal;
