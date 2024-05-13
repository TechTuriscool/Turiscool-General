const token = "Bearer 17xa7adwlycG4qrbRatBdCHW41xtl9jNyaBq4d45";
const id = "62b182eea31d8d9863079f42";
let totalCourses = 0;
let courseList = [];
let courseListIds = [];
let loading = true;
let searchActive = false;
let alumnos = []
let showAlumnosToggle = false;
const requestOptions = {
    method: "GET",
    headers: {
        Authorization: token,
        "Content-Type": "application/json",
        "Lw-Client": id,
    },
};
document.addEventListener('DOMContentLoaded', function () {

    recoverySurveyInfoFromLocalStorage();
    changeCoruseTitleContent();
});
async function fetchCourseMeta() {
    try {
        const response = await fetch(
            "https://academy.turiscool.com/admin/api/v2/courses",
            requestOptions
        );
        if (!response.ok) {
            throw new Error("Failed to fetch cursos");
        }
        const data = await response.json();
        totalCourses = data.meta.totalPages;
        await fetchCourseData();
    } catch (error) {
        console.error("Error:", error);
    }
}
async function fetchCourseData() {
    for (let i = 1; i <= totalCourses; i++) {
        try {
            const response = await fetch(
                `https://academy.turiscool.com/admin/api/v2/courses?page=${i}`,
                requestOptions
            );
            if (!response.ok) {
                throw new Error("Failed to fetch cursos");
            }
            const data = await response.json();
            courseList = courseList.concat(data.data);
        } catch (error) {
            console.error("Error:", error);
        }
    }
    setLoadingMenuIcon(loading = false);
    courseListIds = courseList.map(course => course.id);
    courseList.sort((a, b) => a.title.localeCompare(b.title));
    console.log("Course List:", courseList);
}
function setLoadingMenuIcon() {
    let menuIcon = document.querySelector('.menu-icon');
    if (loading) {
        menuIcon.textContent = '⏳CARGANDO CURSOS...';
    } else {
        menuIcon.textContent = ' ⬇️ SELECCIONA UN CURSO ⬇️';
    }
}
async function fetchCourseContent(courseId, courseTitle) {
    console.log("Fetching content for course ID:", courseId);
    localStorage.setItem("courseId", courseId);
    localStorage.setItem("courseTitle", courseTitle);
    try {
        const response = await fetch(
            `https://academy.turiscool.com/admin/api/v2/courses/${courseId}/contents`,
            requestOptions
        );
        if (!response.ok) {
            throw new Error("Failed to fetch curso");
        }
        const data = await response.json();
        console.log("Course Content:", data);

        await checkIfCourseHasForm(courseId);


    } catch (error) {
        console.error("Error:", error);
    }
}
async function checkIfCourseHasForm(courseId) {
    try {
        const response = await fetch(
            `https://academy.turiscool.com/admin/api/v2/courses/${courseId}/contents`,
            requestOptions

        );
        if (!response.ok) {
            throw new Error("Failed to fetch curso");
        }
        const data = await response.json();
        const sections = data.sections;
        console.log("Sections:", sections);

        let learningUnits = [];
        let learningUnitsWithForm = [];

        for (let i = 0; i < sections.length; i++) {
            for (let j = 0; j < sections[i].learningUnits.length; j++) {
                if (sections[i].learningUnits[j].type === "newSurvey") {
                    learningUnitsWithForm.push(sections[i].learningUnits[j]);
                }
                learningUnits.push(sections[i].learningUnits[j]);
            }
        }
        console.log("Learning Units:", learningUnits);
        console.log("Learning Units with Form:", learningUnitsWithForm);

        if (learningUnitsWithForm.length > 0) {
            localStorage.setItem("learningUnitsWithForm", JSON.stringify(learningUnitsWithForm));
            recoverySurveyInfo(learningUnitsWithForm[0].id);

        }
        else {
            alert("Este curso no tiene formularios");
        }
    }

    catch (error) {
        console.error("Error:", error);
    }
}
function recoveryDataFromLocalStorage() {
    const settings = localStorage.getItem('learningUnitsWithForm');
    if (settings) {
        const settingsObj = JSON.parse(settings);
        let id = settingsObj[0].id;
        console.log("ID:", id);

        recoverySurveyInfo(id);

    } else {
        console.log('No settings found in localStorage.');
    }
}
async function recoverySurveyInfo(SurveyID) {
    try {
        const response = await fetch(
            `https://academy.turiscool.com/admin/api/v2/assessments/${SurveyID}/responses`,
            requestOptions
        );
        if (!response.ok) {
            alert("Este curso no tiene formulario, o el formulario no contiene respuestas");
            localStorage.removeItem("learningUnitsWithForm");
            throw new Error("Failed to fetch survey info");
        }
        else {
            const data = await response.json();
            console.log("Survey Info:", data);
            localStorage.setItem("surveyInfo", JSON.stringify(data));
            location.href = "course.html";


        }
    } catch (error) {
        console.error("Error:", error);
    }
}
function recoverySurveyInfoFromLocalStorage() {
    let notaMediaDiv = document.getElementsByClassName("notaMedia")[0]
    let notaMediaStarsDiv = document.getElementsByClassName("notaMediaStars")[0]
    let mensajeOpinionDiv = document.getElementsByClassName("mensajeOpinion")[0]
    let notaGlobalDiv = document.getElementsByClassName("notaGlobal")[0]
    let notas = []
    let notasFinales = []
    let mensajes = []
    let notamedia = 0;
    let starsObject = {
        "0": " 0 ",
        "1": "⭐",
        "2": "⭐⭐",
        "3": "⭐⭐⭐",
        "4": "⭐⭐⭐⭐",
        "5": "⭐⭐⭐⭐⭐"
    }
    const settings = localStorage.getItem('surveyInfo');
    if (settings) {
        const settingsObj = JSON.parse(settings);
        console.log("Survey Info:", settingsObj.data);

        for (let i = 0; i < settingsObj.data.length; i++) {
            for (let j = 0; j < settingsObj.data[i].answers.length - 1; j++) {
                notas.push(settingsObj.data[i].answers[j].answer);
            }

        }
        for (let i = 0; i < notas.length; i++) {
            notasFinales.push(notas[i].charAt(0));
        }
        for (let i = 0; i < notasFinales.length; i++) {
            notamedia += parseInt(notasFinales[i]);
        }
        //ver si hay mensajes de opinion
        for (let i = 0; i < settingsObj.data.length; i++) {
            if (settingsObj.data[i].answers[4].answer !== null) {
                mensajes.push(settingsObj.data[i].answers[4].answer);
            }
            else {
                mensajes.push("No hay mensaje de opinion sobre este curso");

            }
            //borrar duplicados
            mensajes = mensajes.filter((item, index) => mensajes.indexOf(item) === index);
        }
        notamedia = (notamedia / notasFinales.length).toFixed(2);


        mensajeOpinionDiv.innerHTML = `${mensajes}`;

        //condicional para el color segun la nota media

        if (notamedia >= 4) {
            notaGlobalDiv.style.color = "green";
            notaGlobalDiv.style.backgroundColor = "lightgreen";
        } else if (notamedia >= 2 && notamedia < 4) {
            notaGlobalDiv.style.color = "orange";
            notaGlobalDiv.style.backgroundColor = "lightyellow";
        } else if (notamedia < 2) {
            notaGlobalDiv.style.color = "red";
            notaGlobalDiv.style.backgroundColor = "pink";
        }

        notaGlobalDiv.innerHTML = `${Math.trunc(notamedia * 2)}`;
        notaMediaDiv.innerHTML = `Media Gobal: ${notamedia}`;
        notaMediaDiv.appendChild(notaGlobalDiv);

        if (notamedia >= 0 && notamedia < 0.5) {
            notaMediaStarsDiv.innerHTML = ` ${starsObject["0"]}`;
        } else if (notamedia >= 0.51 && notamedia < 1.5) {
            notaMediaStarsDiv.innerHTML = ` ${starsObject["1"]}`;
        }

        else if (notamedia >= 1.51 && notamedia < 2.5) {
            notaMediaStarsDiv.innerHTML = ` ${starsObject["2"]}`;
        }
        else if (notamedia >= 2.51 && notamedia < 3.5) {
            notaMediaStarsDiv.innerHTML = ` ${starsObject["3"]}`;
        }
        else if (notamedia >= 3.51 && notamedia < 4.5) {
            notaMediaStarsDiv.innerHTML = ` ${starsObject["4"]}`;
        }
        else if (notamedia >= 4.51) {
            notaMediaStarsDiv.innerHTML = ` ${starsObject["5"]}`;
        }


    } else {
        console.log('No settings found in localStorage.');
    }

    return notamedia;
}
function recoveryDataSurveyforSpecificUser() {
    let surveyInfo = localStorage.getItem("surveyInfo");
    //filrar por id de alumno
    let alumnoid = localStorage.getItem("alumnoid");
    let surveyInfoObj = JSON.parse(surveyInfo);
    let surveyInfoAlumno = surveyInfoObj.data.filter(alumno => alumno.id === alumnoid);
    localStorage.setItem("surveyInfoAlumno", JSON.stringify(surveyInfoAlumno));
    showInfoSpecificAlumno();

}

function changeCoruseTitleContent() {
    let courseTitle = localStorage.getItem("courseTitle");
    let courseTitleContent = document.querySelector('.courseTitle');
    courseTitleContent.textContent = courseTitle;
}
function showAlumnos() {
    showAlumnosToggle = !showAlumnosToggle;

    let alumnosMenu = document.querySelector('.alumnosMenu');
    let infoAlumnoDiv = document.querySelector('.infoAlumno');

    // Alternar la visibilidad del menú si ya contiene elementos
    if (showAlumnosToggle) {
        infoAlumnoDiv.style.display = 'block';
        alumnosMenu.style.display = 'block';

    } else {
        infoAlumnoDiv.style.display = 'none';
        alumnosMenu.style.display = 'none';
        return
    }
    alumnosMenu.innerHTML = '';


    let dataAlumnos = localStorage.getItem('surveyInfo');
    if (dataAlumnos) {
        let dataAlumnosObj = JSON.parse(dataAlumnos);
        console.log("Alumnos:", dataAlumnosObj.data);

        let listadoAlumnos = dataAlumnosObj.data.map(alumno => alumno.email);
        console.log("Listado de Alumnos:", listadoAlumnos);

        listadoAlumnos.forEach(email => {
            let listItem = document.createElement('li');
            listItem.textContent = email;
            listItem.style.cursor = 'pointer';  // Estilo para el cursor
            alumnosMenu.appendChild(listItem);
            // Agregar un evento de clic para mostrar la información del alumno
            listItem.addEventListener('click', () => {
                let alumno = dataAlumnosObj.data.find(alumno => alumno.email === email);
                localStorage.setItem("alumnoid", alumno.id);
                recoveryDataSurveyforSpecificUser();
            });
        });
        alumnosMenu.classList.add('open');

    } else {
        alert("No hay alumnos en este curso");
    }
}

function showInfoSpecificAlumno() {
    // Obtener elementos del DOM
    let infoAlumnoDiv = document.getElementsByClassName("infoAlumno")[0];
    let emailAlumnoDiv = document.getElementsByClassName("alumnoEmail")[0];
    let responsesAlumnoDiv = document.getElementsByClassName("responsesAlumno")[0];

    // Limpiar el contenido previo
    emailAlumnoDiv.innerHTML = "";
    responsesAlumnoDiv.innerHTML = "";

    // Obtener información del alumno desde el almacenamiento local
    let surveyInfoAlumno = localStorage.getItem("surveyInfoAlumno");
    let surveyInfoAlumnoObj = JSON.parse(surveyInfoAlumno);

    // Asegurar que hay datos antes de proceder
    if (surveyInfoAlumnoObj && surveyInfoAlumnoObj.length > 0) {
        console.log("Survey Info Alumno:", surveyInfoAlumnoObj);
        let email = surveyInfoAlumnoObj[0].email;
        emailAlumnoDiv.innerHTML = `Email: ${email}`;

        // Mostrar respuestas del alumno
        let responses = surveyInfoAlumnoObj[0].answers;
        for (let i = 0; i < responses.length; i++) {
            let response = document.createElement('p');
            let answerText = responses[i].answer === null ? "No hay mensajes" : responses[i].answer;
            response.innerHTML = `${responses[i].description}<br>${answerText}<br>`;
            responsesAlumnoDiv.appendChild(response);
        }
        if (showAlumnosToggle) {
            infoAlumnoDiv.style.display = "block";
        } else {
            infoAlumnoDiv.style.display = "none";
        }
        infoAlumnoDiv.style.backgroundColor = "#05BFAD";
        // Configurar el encabezado y agregar elementos al contenedor principal
        infoAlimonialDiv.innerHTML = `Información del Alumno`;
        infoAlumnoDiv.appendChild(emailAlumnoDiv);
        infoAlumnoDiv.appendChild(responsesAlumnoDiv);
    } else {
        console.log("No se encontraron datos del alumno.");
    }

    console.log("Email:", email);
}

function toggleMenu() {
    let menu = document.querySelector('.menu');
    let isActive = menu.classList.contains('active');

    // Verifica si la búsqueda está activa y si el menú está actualmente inactivo
    if (searchActive && !isActive) {
        searchCourse();  // Si hay una búsqueda activa, actualiza la lista de cursos
    } else if (!isActive) {
        populateMenu(courseList);  // Si no hay búsqueda activa, muestra todos los cursos
    } else {
        menu.classList.remove('active');  // Cierra el menú si está activo
    }
}
function populateMenu(courses) {
    let menu = document.querySelector('.menu');
    menu.innerHTML = '';  // Limpia el menú existente
    courses.forEach(course => {
        let listItem = document.createElement('li');
        listItem.textContent = course.title;
        listItem.id = course.id;
        listItem.style.cursor = 'pointer';  // Estilo para el cursor
        listItem.addEventListener('click', () => fetchCourseContent(course.id, course.title));
        menu.appendChild(listItem);
    });
    menu.classList.add('active');  // Asegura que el menú se marque como activo
}
function searchCourse() {
    let searchInput = document.querySelector('.search-input');
    let isActive = document.querySelector('.menu').classList.contains('active');

    searchActive = searchInput.value !== '';  // Verifica si hay texto en el campo de búsqueda

    if (searchActive) {
        let searchResults = courseList.filter(course =>
            course.title.toLowerCase().includes(searchInput.value.toLowerCase())
        );
        populateMenu(searchResults);  // Puebla el menú solo con los resultados de la búsqueda
    } else if (isActive) {
        populateMenu(courseList);  // Si no hay búsqueda y el menú está activo, muestra todos los cursos
    }
}
function resetSearchCourse() {
    let searchInput = document.querySelector('.search-input');
    searchInput.value = '';
    searchCourse();  // Realiza la búsqueda con el campo vacío para resetear los resultados
}
function start() {
    setLoadingMenuIcon(loading = true);
    fetchCourseMeta();
}

start();

