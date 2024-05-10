const token = "Bearer 17xa7adwlycG4qrbRatBdCHW41xtl9jNyaBq4d45";
const id = "62b182eea31d8d9863079f42";
let totalCourses = 0;
let courseList = [];
let courseListIds = [];
let loading = true;
let searchActive = false;
let alumnos = []
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
    const settings = localStorage.getItem('surveyInfo');
    if (settings) {
        const settingsObj = JSON.parse(settings);
        console.log("Survey Info:", settingsObj);
    } else {
        console.log('No settings found in localStorage.');
    }
}

function changeCoruseTitleContent() {
    let courseTitle = localStorage.getItem("courseTitle");
    let courseTitleContent = document.querySelector('.courseTitle');
    courseTitleContent.textContent = courseTitle;
}

function showAlumnos() {
    let alumnosMenu = document.querySelector('.alumnosMenu');

    // Alternar la visibilidad del menú si ya contiene elementos
    if (alumnosMenu.children.length > 0) {
        if (alumnosMenu.style.display === 'block') {
            alumnosMenu.style.display = 'none';
        } else {
            alumnosMenu.style.display = 'block';
        }
        return; // Salir de la función si solo estamos alternando la visibilidad
    }

    // Proceder a cargar datos si el menú está vacío
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
        });

        alumnosMenu.style.display = 'block';  // Asegurarse de que el menú sea visible
    } else {
        alert("No hay alumnos en este curso");
    }
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

