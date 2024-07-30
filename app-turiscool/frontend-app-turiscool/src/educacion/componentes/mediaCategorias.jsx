import { useState, useEffect } from 'react';
import loading from '../../assets/Loading_2.gif';
import StarsCategory from '../../stars/startsCategory';

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
        <div className='subContainerCategories'>
          {answersObject2 &&
            Object.keys(answersObject2).map((key) => {
              const scoreValue = answersObject2[key] ? answersObject2[key].toFixed(2) : 5;

              return (
                <div key={key} className="categoryContainer" onClick={() => clickCategory(key)}>
                  <StarsCategory rating={scoreValue} title={key} />
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default MediaCategorias;
