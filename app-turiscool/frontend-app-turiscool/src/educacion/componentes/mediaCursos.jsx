import { useEffect, useState } from 'react';
import loading from '../../assets/Loading_2.gif';
import { useNavigate } from 'react-router-dom';

const MediaCursos = () => {
    const navigate = useNavigate();
    const token = "Bearer 17xa7adwlycG4qrbRatBdCHW41xtl9jNyaBq4d45";
    const id = "62b182eea31d8d9863079f42";
    let totalCourses = 0;
    let categories = [];
    let courseList = [];
    let courseListCategories = [];
    let courseListIds = [];
    let loading = true;
    let searchActive = false;
    let alumnos = []
    let deployCoursesActive = false;
    let optionDisabledifNotForm = false;
    let usersString = "";
    const baseURL = import.meta.env.VITE_BASE_URL;
    
    let url = new URL(window.location.href);
    let host = url.host;

    useEffect(() => {
        const fetchInitialData = async () => {
            await fetchCourseData();
            await getAllCourseIds();
            await populateCategoryMenu();
        };

        fetchInitialData();
    }, []);
    
    const requestOptions = {
        method: "GET",
        headers: {
            Authorization: token,
            "Content-Type": "application/json",
            "Lw-Client": id,
        },
    };
    
    async function fetchCourseData() {
        try {
            courseList = localStorage.getItem('courses');
            courseList = JSON.parse(courseList);
            //console.log(courseList);
            setLoadingMenuIcon(loading = false);
            courseListIds = courseList.map(course => course.id);
            courseListCategories = courseList.map(course => course.categories);
    
            // Recoger todas las categorias desde el localStorage
            let categoriesFromLocalStorage = localStorage.getItem('answersObject');
    
            // Recorrer todas las keys del objeto y añadir las categorias al array
            if (categoriesFromLocalStorage) {
                let categoriesObject = JSON.parse(categoriesFromLocalStorage);
                for (let key in categoriesObject) {
                    categories.push(key);
                }
            }
    
            courseList.sort((a, b) => a.title.localeCompare(b.title));
    
        } catch (error) {
            ("Error:", error);
        }
    }
    
    function setLoadingMenuIcon(loading) {
        let menuIcon = document.querySelector('.menu-icon');
        if (loading) {
            menuIcon.textContent = '⏳CARGANDO CURSOS...';
        } else {
            menuIcon.textContent = ' ⬇️ MOSTRAR CURSOS ⬇️';
        }
    }
    
    async function fetchCourseContent(courseId, courseTitle) {
        localStorage.setItem("courseId", courseId);
        localStorage.setItem("courseTitle", courseTitle);
        try {
            const response = await fetch(
                `${baseURL}/courses/${courseId}/contents`,
                requestOptions
            );
            if (!response.ok) {
                throw new Error("Failed to fetch curso");
            }
            await checkIfCourseHasForm(courseId);
        } catch (error) {
            ("Error:", error);
        }
    }
    
    async function checkIfCourseHasForm(courseId) {
        try {
            const response = await fetch(
                `${baseURL}/courses/${courseId}/contents`,
                requestOptions
            );
            if (!response.ok) {
                throw new Error("Failed to fetch curso");
            }
            const data = await response.json();
            const sections = data.sections;
    
            let learningUnitsWithForm = [];
    
            sections.forEach(section => {
                section.learningUnits.forEach(unit => {
                    if (unit.type === "newSurvey") {
                        learningUnitsWithForm.push(unit);
                    }
                });
            });
    
            if (learningUnitsWithForm.length > 0) {
                localStorage.setItem("learningUnitsWithForm", JSON.stringify(learningUnitsWithForm));
                recoverySurveyInfo(learningUnitsWithForm[0].id);
            } else {
                alert("Este curso no tiene formularios");
            }
        } catch (error) {
            ("Error:", error);
        }
    }
    
    function recoveryDataFromLocalStorage() {
        const settings = localStorage.getItem('learningUnitsWithForm');
        if (settings) {
            const settingsObj = JSON.parse(settings);
            let id = settingsObj[0].id;
            recoverySurveyInfo(id);
        } else {
            console.log('No settings found in localStorage.');
        }
    }
    
    async function recoverySurveyInfo(SurveyID) {
        try {
            const response = await fetch(
                `${baseURL}/assessments/${SurveyID}/responses`,
                requestOptions
            );
            const data = await response.json();
            //console.log(data);
            if (!response.ok || data === undefined || data === null || data.length === 0) {  
                alert("Este curso no tiene formulario, o el formulario no contiene respuestas");
                throw new Error("Failed to fetch survey info");
            } else {
                                
                // Realizar un bucle, si da error en la primera iteración, mostrar mensaje de error
                for (let i = 0; i < data.length; i++) {
                    if (data[i].answers.length === 0) {
                        alert("Este curso no tiene formulario, o el formulario no contiene respuestas");
                        return;
                    }
                }


                localStorage.setItem("surveyInfo", JSON.stringify(data));
                // Navegar a /average/courses sin usar window.location.href

                navigate('/educacion/average/courses');
         }
        } catch (error) {
            ("Error:", error);
        }
    }
    
    function toggleMenu() {
        let menu = document.querySelector('.menu');
        let isActive = menu.classList.contains('active');
        let menuIcon = document.querySelector('.menu-icon');
        let searchInput = document.querySelector('.search-input');
    
        if (!isActive) {
            menu.classList.add('active');
            menuIcon.textContent = 'CERRAR';
    
            if (searchInput.value !== '') {
                searchCourse();
            } else {
                populateMenu(courseList);
            }
        } else {
            menu.classList.remove('active');
            menuIcon.textContent = '⬇️ MOSTRAR CURSOS ⬇️';
        }
    }
    
    function closeMenu() {
        let menu = document.querySelector('.menu');
        let menuIcon = document.querySelector('.menu-icon');
        let searchInput = document.querySelector('.search-input');
    
        menu.classList.remove('active');
        menuIcon.textContent = '⬇️ MOSTRAR CURSOS ⬇️';
        searchInput.value = '';
    }
    
    function populateMenu(courses) {
        let menu = document.querySelector('.menu');
        menu.innerHTML = '';
        let recoverySurveyInfoPreData2 = JSON.parse(localStorage.getItem("recoverySurveyInfoPreData"));
    
        //console.log("courses");
        //console.log(courses);
        //console.log("recoverySurveyInfoPreData2");
        //console.log(recoverySurveyInfoPreData2);
    
        courses.forEach(course => {
            let listItem = document.createElement('li');
            let courseTitle = course.title;
            let notaMedia = recoverySurveyInfoPreData2.find(item => item.id === course.id);
    
            if (notaMedia) {
                // Verificar si la nota media ya está en el título para evitar duplicados
                if (!courseTitle.includes(' - ')) {
                    courseTitle += ` - ${notaMedia.media}`;
                }
    
                // Cambiar el background color según la nota media
                if (notaMedia.media >= 4) {
                    listItem.style.backgroundColor = "lightgreen";
                } else if (notaMedia.media >= 2 && notaMedia.media < 4) {
                    listItem.style.backgroundColor = "lightyellow";
                } else if (notaMedia.media < 2) {
                    listItem.style.backgroundColor = "lightred";
                }
            } else {
                listItem.style.backgroundColor = "white";
            }
            listItem.style.borderRadius = "10px";
            listItem.textContent = courseTitle;
            listItem.id = course.id;
            listItem.style.cursor = 'pointer';
            listItem.addEventListener('click', () => fetchCourseContent(course.id, courseTitle));
            menu.appendChild(listItem);
        });
    
        menu.classList.add('active');
    }
    
    
    function searchCourse() {
        let searchInput = document.querySelector('.search-input');
        let isActive = document.querySelector('.menu').classList.contains('active');
        let menuIcon = document.querySelector('.menu-icon');
    
        menuIcon.textContent = " CERRAR";
        searchActive = searchInput.value !== '';
    
        if (searchActive) {
            let searchResults = courseList.filter(course =>
                course.title.toLowerCase().includes(searchInput.value.toLowerCase())
            );
            populateMenu(searchResults);
        } else if (isActive) {
            populateMenu(courseList);
        }
    }
    
    function resetSearchCourse() {
        let menuIcon = document.querySelector('.menu-icon');
        let searchInput = document.querySelector('.search-input');
        searchInput.value = '';
        searchCourse();
    
        menuIcon.textContent = "⬇️ MOSTRAR CURSOS ⬇️";
        closeMenu();
    }
    
    async function getAllCourseIds() {
        let courseIds = localStorage.getItem('courses');
        courseIds = JSON.parse(courseIds);
        courseIds = courseIds.map(course => course.id);
        return courseIds;
    }
    
    async function populateCategoryMenu() {
        //console.log(categories);
        let categoryCardsContainer = document.querySelector('#categoryCards');
        let option = document.createElement('option');
        option.textContent = 'Filtrar por categoria';
        option.style.cursor = 'pointer';
        categoryCardsContainer.appendChild(option);
        categories.forEach(category => {
            let option = document.createElement('option');
            option.textContent = category;
            option.style.cursor = 'pointer';
            categoryCardsContainer.appendChild(option);
        });
        categoryCardsContainer.addEventListener('change', (e) => {
            let selectedCategory = e.target.value;
            let courseListFiltered = courseList.filter(course => course.categories.includes(selectedCategory));
            populateMenu(courseListFiltered);
        });
    }

    return (
        <>
            <h1>BUSCADOR DE CURSOS</h1>
            <div className="topContainer">
                <div className="navbar2">
                    <select id="categoryCards"></select>
                    <div className="search">
                        <input type="text" className="search-input" placeholder="Buscador de cursos" />
                        <button className="reset-search" onClick={resetSearchCourse}>Reset</button>
                        <button className="search-btn" onClick={searchCourse}>Buscar</button>
                    </div>
                    <div className="menu-icon" onClick={toggleMenu}> ⬇️ MOSTRAR CURSOS ⬇️</div>
                    <ul className="menu"></ul>
                </div>
            </div>
        </>
    );

    
};

export default MediaCursos;