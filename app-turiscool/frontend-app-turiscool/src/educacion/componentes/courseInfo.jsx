import React, { useEffect } from 'react';
import retroceder from '../../assets/back-arrow_318504.png';
import './styleCourses.css'; 
import Password from "../../popups/password";
import Navbar from "../../navbar/navbar.jsx";
import SideBar from "../../navbar/sidebar.jsx";

const CourseInfo = () => {
    let showAlumnosToggle = false;

    useEffect(() => {
        recoverySurveyInfoFromLocalStorage();
        changeCoruseTitleContent();
        //addOpinionsToContainer();
    }, []);

    function showAlumnos() {
        showAlumnosToggle = !showAlumnosToggle;
        let alumnosIconDiv = document.querySelector('.alumnos-icon');
        let alumnosMenu = document.querySelector('.alumnosMenu');
        let infoAlumnoDiv = document.querySelector('.infoAlumno');
    
        if (showAlumnosToggle) {
            infoAlumnoDiv.style.display = 'block';
            alumnosMenu.style.display = 'block';
            alumnosIconDiv.textContent = 'CERRAR';
            alumnosIconDiv.style.color = "black";
            alumnosIconDiv.style.backgroundColor = "#efefef";
        } else {
            infoAlumnoDiv.style.display = 'none';
            alumnosMenu.style.display = 'none';
            alumnosIconDiv.textContent = '⬇️ SELECCIONA UN ALUMNO ⬇️';
            alumnosIconDiv.style.backgroundColor = "#ffffff";
            alumnosIconDiv.style.color = "black";
            return;
        }
        alumnosMenu.innerHTML = '';
    
        let dataAlumnos = localStorage.getItem('surveyInfo');
        if (dataAlumnos) {
            let dataAlumnosObj = JSON.parse(dataAlumnos);
            let listadoAlumnos = dataAlumnosObj.data.map(alumno => alumno.email);
    
            listadoAlumnos.forEach(email => {
                let listItem = document.createElement('li');
                listItem.textContent = email;
                listItem.style.cursor = 'pointer';
                alumnosMenu.appendChild(listItem);
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

    function recoveryDataSurveyforSpecificUser() {
        let surveyInfo = localStorage.getItem("surveyInfo");
        let alumnoid = localStorage.getItem("alumnoid");
        let surveyInfoObj = JSON.parse(surveyInfo);
        console.log("he llegado 1");
        let surveyInfoAlumno = surveyInfoObj.data.filter(alumno => alumno.id === alumnoid);
        console.log("he llegado 2");
        localStorage.setItem("surveyInfoAlumno", JSON.stringify(surveyInfoAlumno));
        showInfoSpecificAlumno();
    }
    
    function showInfoSpecificAlumno() {
        let infoAlumnoDiv = document.getElementsByClassName("infoAlumno")[0];
        let emailAlumnoDiv = document.getElementsByClassName("alumnoEmail")[0];
        let responsesAlumnoDiv = document.getElementsByClassName("responsesAlumno")[0];
    
        emailAlumnoDiv.innerHTML = "";
        responsesAlumnoDiv.innerHTML = "";
    
        let surveyInfoAlumno = localStorage.getItem("surveyInfoAlumno");
        let surveyInfoAlumnoObj = JSON.parse(surveyInfoAlumno);
    
        if (surveyInfoAlumnoObj && surveyInfoAlumnoObj.length > 0) {
            let email = surveyInfoAlumnoObj[0].email;
            emailAlumnoDiv.innerHTML = `Email: ${email}`;
            emailAlumnoDiv.style.fontWeight = 'bold';
            emailAlumnoDiv.style.color = '#333';
    
            let responses = surveyInfoAlumnoObj[0].answers;
            responses.forEach(response => {
                let responseElement = document.createElement('p');
                responseElement.style.margin = "10px 0";
                responseElement.style.padding = "10px";
                responseElement.style.borderRadius = "8px";
                responseElement.style.backgroundColor = "#efefef";
                responseElement.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
    
                let answerText = response.answer === null ? "No hay respuesta" : response.answer;
    
                responseElement.innerHTML = `<strong>${response.description}</strong><br>${answerText}<br>`;
                responsesAlumnoDiv.appendChild(responseElement);
            });
    
            infoAlumnoDiv.style.position = "fixed";
            infoAlumnoDiv.style.top = "50%";
            infoAlumnoDiv.style.left = "50%";
            infoAlumnoDiv.style.transform = "translate(-50%, -50%)";
            infoAlumnoDiv.style.visibility = "visible";
            infoAlumnoDiv.style.opacity = "1";
            infoAlumnoDiv.style.transition = "visibility 0s, opacity 0.4s";
            infoAlumnoDiv.style.backgroundColor = "white";
            infoAlumnoDiv.style.padding = "20px";
            infoAlumnoDiv.style.borderRadius = "10px";
            infoAlumnoDiv.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
            infoAlumnoDiv.style.color = "black";
    
            infoAlumnoDiv.innerHTML = `Información del Alumno`;
            infoAlumnoDiv.appendChild(emailAlumnoDiv);
            infoAlumnoDiv.appendChild(responsesAlumnoDiv);
    
            let closeButton = document.createElement('button');
            closeButton.textContent = 'x';
            closeButton.style.position = 'absolute';
            closeButton.style.top = '10px';
            closeButton.style.right = '10px';
            closeButton.style.padding = '5px 10px';
            closeButton.style.border = 'none';
            closeButton.style.background = 'red';
            closeButton.style.color = 'white';
            closeButton.style.cursor = 'pointer';
            closeButton.onclick = function () {
                infoAlumnoDiv.style.opacity = '0';
                infoAlumnoDiv.style.visibility = 'hidden';
            };
            infoAlumnoDiv.appendChild(closeButton);
        } else {
            console.log("No se encontraron datos del alumno.");
        }
    }

    function recoverySurveyInfoFromLocalStorage() {
        let opinionDiv = document.getElementById("opinionContainer");
        let notaMediaDiv = document.getElementsByClassName("notaMedia")[0];
        let notaMediaStarsDiv = document.getElementsByClassName("notaMediaStars")[0];
        let mensajeOpinionDiv = document.getElementsByClassName("mensajeOpinion")[0];
        let notaGlobalDiv = document.getElementsByClassName("notaGlobal")[0];
        let notas = [];
        let notasFinales = [];
        let mensajes = [];
        let notamedia = 0;
        let starsObject = {
            "0": " 0 ",
            "1": "⭐",
            "2": "⭐⭐",
            "3": "⭐⭐⭐",
            "4": "⭐⭐⭐⭐",
            "5": "⭐⭐⭐⭐⭐"
        };
        const settings = localStorage.getItem('surveyInfo');
        if (settings) {
            const settingsObj = JSON.parse(settings);
            console.log(settingsObj);
    
            settingsObj.data.forEach(item => {
                item.answers.slice(0, -1).forEach(answer => {
                    if (answer.answer !== null && answer.answer !== undefined) {
                        notas.push(answer.answer);
                    }
                });
            });
    
            notasFinales = notas.map(nota => {
                if (nota !== null && nota !== undefined) {
                    return nota.charAt(0);
                }
                return ''; // or any default value you deem appropriate
            });
            notamedia = notasFinales.reduce((acc, nota) => acc + parseInt(nota), 0) / notasFinales.length;
            notamedia = notamedia.toFixed(2);
    
            let hasOpinions = false;
    
            settingsObj.data.forEach(item => {
                let opinion = item.answers[4]?.answer?.trim();
                if (opinion && opinion.toLowerCase() !== 'null') {
                    hasOpinions = true;
                    let opinionP = document.createElement('p');
                    opinionP.classList.add('opinionP');
                    opinionP.innerHTML = `<strong>${item.email}</strong>: ${opinion}`;
                    opinionDiv.appendChild(opinionP);
                }
            });
    
            if (!hasOpinions) {
                mensajeOpinionDiv.style.color = "black";
                mensajeOpinionDiv.textContent = "⚠️ Los usuarios no han dejado opiniones sobre este curso";
            } else {
                mensajeOpinionDiv.textContent = ""; // Clear any previous message if there are opinions
            }
    
            if (notamedia >= 4) {
                notaGlobalDiv.style.color = "green";
                notaGlobalDiv.style.backgroundColor = "lightgreen";
            } else if (notamedia >= 2 && notamedia <= 3.99) {
                notaGlobalDiv.style.color = "orange";
                notaGlobalDiv.style.backgroundColor = "lightyellow";
            } else if (notamedia < 2) {
                notaGlobalDiv.style.color = "red";
                notaGlobalDiv.style.backgroundColor = "#ffc0cbbf";
            }
    
            notaGlobalDiv.innerHTML = `${Math.trunc(notamedia * 2)}`;
            notaMediaDiv.innerHTML = `Media Global: ${notamedia}`;
            notaMediaDiv.appendChild(notaGlobalDiv);
    
            for (let i = 0; i <= 5; i++) {
                if (notamedia >= i - 0.5 && notamedia < i + 0.5) {
                    notaMediaStarsDiv.innerHTML = ` ${starsObject[i.toString()]}`;
                    break;
                }
            }
        } else {
            console.log('No settings found in localStorage.');
        }
    
        return notamedia;
    }
    
    function changeCoruseTitleContent() {
        let courseTitle = localStorage.getItem("courseTitle");
        let courseTitleContent = document.querySelector('.courseTitle');
        courseTitleContent.textContent = courseTitle;
    }

    return (
        <div id="menuContainer">
            <Password />
            <div className="menuTopContainer">
                <Navbar />
            </div>
            <div className="menuBottomContainer">
                <div className="leftBottomContainer">
                    <SideBar /> 
                </div>
                <div className="rightBottomContainer">
                    <div className="app-container">
                        <div className="courseWrapper">
                            <div className="head">
                                <a href="./" className="backToCourses">
                                    <img src={retroceder} alt="back" />
                                </a>
                                <div className="courseTitle">Cargando...</div>
                            </div>

                            <div className="notaMedia">
                                <div className="notaGlobal">
                                    <img id="loading" src="./assets/Loading_2.gif" alt="loading" />
                                </div>
                            </div>
                            <div className="notaMediaStars"></div>
                            <div className="mensajeOpinion"></div>
                            <div id="opinionContainer"></div>
                            <div className="alumnos-icon" onClick={showAlumnos}> ⬇️ VER ALUMNOS ⬇️</div>
                            <ul className="alumnosMenu"></ul>
                        </div>

                        <div className="infoAlumno">
                            <h3 className="alumnoEmail"></h3>
                            <h4 className="responsesAlumno">
                                <ul className="responsesAlumnoList"></ul>
                            </h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
    );
};

export default CourseInfo;