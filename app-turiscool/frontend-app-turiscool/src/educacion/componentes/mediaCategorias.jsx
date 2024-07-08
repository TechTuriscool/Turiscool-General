import { useState, useEffect } from 'react';
import loading from '../../assets/Loading_2.gif';

const MediaCategorias = () => {
  const [answersObject2, setAnswersObject2] = useState(null);
  const [loadingState, setLoadingState] = useState(true);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('answersObject'));
    setAnswersObject2(data);
    setLoadingState(false);
  }, []);

  const clickCategory = (key) => {
    const categoryCard = document.getElementById('categoryCards');

    // Setear el valor del select de la categoría
    categoryCard.value = key;

    // Simular evento de click en la propia categoría
    const event = new Event('change');
    categoryCard.dispatchEvent(event);

    // Hacer scroll hacia abajo
    categoryCard.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div id="principalContainer">
      <h1>MEDIA CATEGORÍAS</h1>
      {loadingState ? (
        <img id="loading2" src={loading} alt="loading" />
      ) : (
        <div id="categoriesContainer">
          {answersObject2 &&
            Object.keys(answersObject2).map((key) => {
              const scoreValue = answersObject2[key] ? answersObject2[key].toFixed(2) : 5;
              let backgroundColor = '';
              let color = '';

              if (scoreValue >= 0 && scoreValue <= 3) {
                backgroundColor = '#F79394';
                color = '#C60001';
              } else if (scoreValue > 3 && scoreValue <= 3.99) {
                backgroundColor = '#FDF6C4';
                color = '#F74B00';
              } else if (scoreValue >= 4 && scoreValue <= 5) {
                backgroundColor = '#8BE68B';
                color = '#012E1F';
              }

              return (
                <div
                  key={key}
                  className="categoryContainer"
                  style={{ backgroundColor, color }}
                  onClick={() => clickCategory(key)}
                >
                  <h4>{key.toUpperCase()}</h4>
                  <h1>{scoreValue}</h1>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default MediaCategorias;
