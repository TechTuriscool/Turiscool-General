import "./formulario-satisfaccion.css";
import logo from "../../assets/logo.png";
import { useEffect, useState } from "react";
import MediaGlobal from "../componentes/mediaGlobal";
import MediaCategorias from "../componentes/mediaCategorias.jsx";
import MediaCursos from "../componentes/mediaCursos.jsx";
import axios from "axios";
import loadingGif from "../../assets/Loading_2.gif";
import Navbar from "../../navbar/navbar.jsx";
import SideBar from "../../navbar/sidebar.jsx";

const FormularioSatisfaccion = () => {
  let answersObject = {};
  let courseList = [];
  let totalCourses = 0;
  let actualCourseId = 0;
  let courseData = [];
  let coursesInfo = [];
  let courNamesArray = [];
  let courseCategoriesArray = [];
  let courseIdsArray = [];
  let filteredCourseList = [];
  let courseListCategories = [];
  let arrayOfCoursesWithForms = [];
  let surveyIds = [];
  let coursesWithForms = [];
  let generalAverage = 10;
  let recoverySurveyInfoPreData = [];

  const token = "Bearer 17xa7adwlycG4qrbRatBdCHW41xtl9jNyaBq4d45";
  const id = "62b182eea31d8d9863079f42";
  const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    headers: {
        Authorization: token,
        'Content-Type': 'application/json',
        'Lw-Client': id,
    },
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let answersObject = localStorage.getItem('answersObject');
        let courseCategoriesArray = localStorage.getItem('courseCategoriesArray');
        let courNamesArray = localStorage.getItem('courNamesArray');
        let recoverySurveyInfoPreData = localStorage.getItem('recoverySurveyInfoPreData');
        let courses = localStorage.getItem('courses');
        console.log("courses", courses);

        if (
          answersObject && Object.keys(answersObject).length !== 0 &&
          courseCategoriesArray && courseCategoriesArray.length !== 0 &&
          courNamesArray && courNamesArray.length !== 0 &&
          recoverySurveyInfoPreData && Object.keys(recoverySurveyInfoPreData).length !== 0 &&
          courses && courses.length !== 0
        ) {
          setLoading(false);
        } else {
          console.log("HOLAAA SOY EL START");
          await start();
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, []);

  const handleContainerClick = () => {
    const modal = document.getElementById("confirmationModal");
    if (modal) modal.style.display = "block";
  };

  const handleCloseClick = () => {
    const modal = document.getElementById("confirmationModal");
    if (modal) modal.style.display = "none";
  };

  const handleCancelClick = () => {
    const modal = document.getElementById("confirmationModal");
    if (modal) modal.style.display = "none";
  };

  const handleConfirmClick = async () => {
    const modal = document.getElementById("confirmationModal");
    if (modal) modal.style.display = "none";
    localStorage.removeItem('answersObject');
    localStorage.removeItem('courseList');
    localStorage.removeItem('courseCategoriesArray');
    localStorage.removeItem('courNamesArray');
    localStorage.removeItem('recoverySurveyInfoPreData');

    alert('Reiniciando, por favor no cierre ni actualice la página.');
    window.location.reload();
  };

  const handleWindowClick = (event) => {
    const modal = document.getElementById("confirmationModal");
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };

  async function start() {
    // Limpiar todos los arrays y variables
    answersObject = {};
    courseList = [];
    totalCourses = 0;
    actualCourseId = 0;
    courseData = [];
    coursesInfo = [];
    courNamesArray = [];
    courseCategoriesArray = [];
    courseIdsArray = [];
    filteredCourseList = [];
    courseListCategories = [];
    arrayOfCoursesWithForms = [];
    surveyIds = [];
    coursesWithForms = [];
    generalAverage = 10;
    recoverySurveyInfoPreData = [];

    await fetchCourseMeta();
    await filterCoursesByCategory();
    const categoryUnitsMap = createObjectWithCategoriesAndUnitIds();
    await recoverySurveyInfoByCategory();
  }


  async function fetchCourseMeta() {
    try {
      const responses = await axiosInstance.get('/courses');

      const courses = responses.data;
      //console.log("courses", courses);
      localStorage.setItem('courses', JSON.stringify(courses));

      courses.forEach(course => {
        //console.log("coursesInfo")
          courseIdsArray.push(course.id);
          courNamesArray.push(course.title);
          if (course.categories || course.categories.length !== 0 || course.title !== "") {
              coursesInfo.push({ curso: course.categories, id: course.id, forms: [] });
              console.log(course)
          }

          courseCategoriesArray.push(course.categories);
          //borrar repetidos de las categorias
          courseCategoriesArray = courseCategoriesArray.flat();
          courseCategoriesArray = [...new Set(courseCategoriesArray)];

          let courseObj = {
              id: course.id,
              title: course.title,
              categories: [], // Crear un array de categorías específico para este curso
              unitIdsWithForms: [] // Crear un array para almacenar las IDs de las unidades con formularios
          };

          course.categories.forEach(category => {
              courseObj.categories.push(category);
          });

          // Añadir el objeto curso al array principal
          courseData.push(courseObj);
      });

      let courseListCategoriesWithNames = [];
      // Crear un array de categorías
      courses.forEach(course => {
          course.categories.forEach(category => {
              courseListCategories.push(category);
              courseListCategoriesWithNames.push({ [category]: course.title });
          });
      });

      // Eliminar repetidos
      courseListCategories = courseListCategories.flat();
      courseListCategories = [...new Set(courseListCategories)];

    //console.log("courseData", courseData);
    await filterCoursesWithForms();
    } catch (error) {
      
    }
  }

  // Filtrar de todos los cursos cuales tienen formularios
  async function filterCoursesWithForms() {
    for (let i = 0; i < courseData.length; i++) {
        actualCourseId = courseData[i].id;
        await fetchCourseContent(actualCourseId, courseData[i]);
    }
  }

  async function fetchCourseContent(actualCourseId, courseObj) {
    console.log("entra")
    let hasAForm = false;
    try {
        const response = await axiosInstance.get(`/courses/${actualCourseId}/contents`);

        // Asegúrate de que sections existe y es un array antes de intentar acceder a learningUnits
        const sections = response.data.sections;
        if (sections && Array.isArray(sections)) {
            // Recorre las secciones para extraer learningUnits
            sections.forEach(section => {
                // Verifica cada unidad de aprendizaje en la sección
                section.learningUnits.forEach(unit => {
                    if (unit.type === 'newSurvey') {
                        hasAForm = true;
                        surveyIds.push(unit.id);
                        courseObj.unitIdsWithForms.push(unit.id); // Añadir la ID de la unidad al objeto courseObj

                        // Añadir al objeto de coursesInfo la unidad con formulario al que pertenece
                        coursesInfo.forEach(course => {
                            if (course.id === actualCourseId) {
                                course.forms.push(unit.id);
                            }
                        });
                    }
                });
            });
        } else {
            console.log('No sections available or sections is not an array.');
        }

        // Pushear al array los cursos que tienen formularios
        if (hasAForm) {
            coursesWithForms.push(courseObj);
            //console.log("coursesWithForms", coursesWithForms);
        }
    } catch (error) {

    }
  }

  // Filtrar los cursos por categoría
  async function filterCoursesByCategory() {
    for (let i = 0; i < courseListCategories.length; i++) {
        let filteredCourses = courseData.filter(course => course.categories.includes(courseListCategories[i]));
        filteredCourseList.push({ [courseListCategories[i]]: filteredCourses.map(course => course.unitIdsWithForms).flat() });


    }
  }

  // Crear una función para crear un objeto con las categorías y las unitIdsWithForms que pertenecen a esa categoría 
  function createObjectWithCategoriesAndUnitIds() {
    const categoryUnitsMap = {};

    coursesWithForms.forEach(course => {
        course.categories.forEach(category => {
            if (!categoryUnitsMap[category]) {
                categoryUnitsMap[category] = [];
            }
            categoryUnitsMap[category] = categoryUnitsMap[category].concat(course.unitIdsWithForms);
        });
    });

    // Eliminar duplicados dentro de cada categoría
    for (const category in categoryUnitsMap) {
        categoryUnitsMap[category] = [...new Set(categoryUnitsMap[category])];
    }

    return categoryUnitsMap;
  }

  //funcion para recorrer filteredCourseList y por cada categoria hacer una llamada a revocerySurveyInfo
async function recoverySurveyInfoByCategory() {
  //console.log("entra")
  for (let i = 0; i < filteredCourseList.length; i++) {
      let category = Object.keys(filteredCourseList[i])[0];
      //recorrer el array de unitIds
      for (let j = 0; j < filteredCourseList[i][category].length; j++) {
          let unitId = filteredCourseList[i][category][j];
          try {
              const response = await axiosInstance.get(`/assessments/${unitId}/responses`);
              const surveys = response.data.data;
              surveys.forEach(survey => {
                  const answers = survey.answers;

                  answers.forEach(answer => { // Iterate over the answers array
                      let nameCourse = filteredCourseList[i].title;
                      let answerFilter = answer.answer;
                      courseList.push({ nameCourse, category, answerFilter });
                      if (!answersObject[category]) {
                          answersObject[category] = []; // Create an empty array for the category if it doesn't exist
                      }
                      answersObject[category].push(answer.answer); // Push only the answer to the corresponding category array
                  });
              });
          } catch (error) {
              // Handle error
          }
      }
  }

  console.log("answersObject", answersObject);
  // Process the answersObject
  for (let category in answersObject) {
      let answers = answersObject[category];
      // Remove null values
      let answersWithoutNull = answers.filter(el => el !== null);
      // Split by '/' and get the first value without spaces
      let answersTrimed = answersWithoutNull.map(el => el.split('/')[0].trim());
      // Remove values that don't start with a numeric digit
      let answersFiltered = answersTrimed.filter(el => !isNaN(el));
      //eliminar cualquier respuesta que tenga mas de 1 caracter de longitud 
      answersFiltered = answersFiltered.filter(el => el.length === 1);
      // Convert values to numbers and calculate the average
      let sum = answersFiltered.reduce((acc, val) => acc + Number(val), 0);
      let average = sum / answersFiltered.length;

      //si la media es NaN or null, convertirlo a 5 o contiene letras
        if (isNaN(average) || average === null) {
            average = 5;
        }

      answersObject[category] = average;
      //redondeado a 2 decimales
      answersObject[category] = Math.round(average * 100) / 100;
  }
    //console.log("este", answersObject);

    //calcular la media general sumando las medias de cada categoria y dividiendo por el numero de categorias
    let sum = 0;
    for (let category in answersObject) {
        sum += answersObject[category];
    }
    generalAverage = sum / Object.keys(answersObject).length;
    generalAverage = Math.round(generalAverage * 100) / 100;
    //si la media es NaN or null, convertirlo a 5
    if (isNaN(generalAverage) || generalAverage === null) {
        generalAverage = 5;
    }
    //console.log("generalAverage", generalAverage);

    //console.log("aquel", coursesInfo)

    //filtrar los cursos que tienen formularios, titulo y categorias
    coursesInfo = coursesInfo.filter(course => course.forms.length !== 0 && course.curso !== "" && course.id !== "");


    recoverySurveyInfoPre(coursesInfo);
  }

  //funcion para recorrer coursesInfo y por cada form hacer una llamada a recoverySurveyInfo
  async function recoverySurveyInfoPre(data) {
    console.log("data", data);
    for (let i = 0; i < data.length; i++) {
      let notas = [];
      let notasFinales = [];
      let notamedia = 0;

      console.log("hola", data[i].forms);
      try {
          const response = await axiosInstance.get(`/assessments/${data[i].forms[0]}/responses`);
          
        const data2 = await response;
        console.log("data2", data2);
          if (data2.data) {
              data2.data.data.forEach(item => {
                  item.answers.slice(0, -1).forEach(answer => {
                      //si la no es un numero entre 0 y 5 no pushear
                      console.log("answer", answer.answer);
                      if (answer.answer === null || answer.answer === undefined) {
                          // Do nothing
                      } else {
                      const answerValue = parseFloat(answer.answer.replace(/\s+/g, ''));
                        if (answerValue >= 0 && answerValue <= 5 ) {
                            notas.push(answer.answer);
                        }
                        else {
                            notas.push("5");
                        }
                    }
                  });
              });

              notasFinales = notas.map(nota => nota.charAt(0));
              console.log("notasFinales", notasFinales);
              notamedia = notasFinales.reduce((acc, nota) => acc + parseInt(nota), 0) / notasFinales.length;
              console.log("media" + notamedia);
              notamedia = notamedia.toFixed(2);

              recoverySurveyInfoPreData.push({ id: data[i].id, media: notamedia });

          }

      } catch (error) {
          ("Error:", error);
      }
  }
    console.log("fin")
    
    // Subir a localStorage todos los datos necesarios para la vista
    localStorage.setItem('answersObject', JSON.stringify(answersObject));
    localStorage.setItem('courseCategoriesArray', JSON.stringify(courseCategoriesArray));
    localStorage.setItem('courNamesArray', JSON.stringify(courNamesArray));
    localStorage.setItem('recoverySurveyInfoPreData', JSON.stringify(recoverySurveyInfoPreData));

    setLoading(false); 
    alert('Carga de datos completado.');
    // Recargar la página
    window.location.reload();
  }

  

  return (
    <div id="menuContainer">
        <div className="menuTopContainer">
            <Navbar />
        </div>
        <div className="menuBottomContainer">
            <div className="leftBottomContainer">
                <SideBar /> 
            </div>
            <div className="rightBottomContainer">
              <div className="containerAverages">
                {loading ? (
                  <div className="loading">
                    <img src={loadingGif} alt="loading" />
                  </div>
                ) : (
                  <>
                    <MediaGlobal />
                    <MediaCategorias />
                    <MediaCursos />
                    <div id="containerReload" onClick={handleContainerClick}>
                      <button id="averageReload">
                        <img src="https://cdn-icons-png.flaticon.com/512/2499/2499113.png" alt="reload" />
                      </button>
                      <h4>Refresh</h4>
                    </div>
                    <div id="confirmationModal" className="modal" onClick={handleWindowClick}>
                      <div className="modal-content">
                        <span className="close" onClick={handleCloseClick}>&times;</span>
                        <img src="https://www.svgrepo.com/show/206435/alert.svg" alt="alert" />
                        <p><strong>¿Desea reiniciar las medias?</strong></p>
                        <p>El servicio dejará de estar disponible durante varios minutos.</p>
                        <div id="containerButton">
                          <button id="confirmButton" onClick={handleConfirmClick}>Confirmar</button>
                          <button id="cancelButton" onClick={handleCancelClick}>Cancelar</button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
        </div>
    </div>
  );
};

export default FormularioSatisfaccion;