import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import './filtrarFundae.css';
import Navbar from '../navbar/navbar';
import SideBar from '../navbar/sidebar';
import MoreInfo from '../moreInfo/moreInfo';
import LoadingGif from "../assets/Loading_2.gif"; 

const FiltrarFundae = () => {
    const [inputValue, setInputValue] = useState('');
    const [numberValue, setNumberValue] = useState('');
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [currentCourse, setCurrentCourse] = useState('');
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const baseURL = import.meta.env.VITE_BASE_URL;
    const [availableCourses, setAvailableCourses] = useState([]);

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const removeCourse = (courseToRemove) => {
        setSelectedCourses(selectedCourses.filter(course => course !== courseToRemove));
        setAvailableCourses([...availableCourses, courseToRemove]);
    };

    const handleNumberChange = (event) => {
        setNumberValue(event.target.value); 
    };

    const handleCourseSelect = (event) => {
        setCurrentCourse(event.target.value);
    };

    const addCourse = () => {
        if (currentCourse && !selectedCourses.includes(currentCourse)) {
            setSelectedCourses([...selectedCourses, currentCourse]);
    
            // Eliminar el curso de la lista de cursos disponibles
            setAvailableCourses(availableCourses.filter(course => course !== currentCourse));
    
            // Limpiar el curso seleccionado
            setCurrentCourse('');
        }
    };

    const handleButtonClick = async () => {
        if (inputValue === '') {
            alert('Por favor, ingresa valores');
            return;
        }

        // Aquí podrías incluir una validación para el número y los cursos seleccionados si es necesario

        setIsLoading(true);
        await getFiltrarFundae(inputValue, numberValue, selectedCourses);
        setIsLoading(false);
    };

    useEffect(() => {
        const fetchCursos = async () => {
            try {
                const response = await fetch(`${baseURL}/courses`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
    
                if (!response.ok) {
                    throw new Error(`Error en la solicitud: ${response.status}`);
                }
                
                const responseData = await response.json();

                let coursesArray = [];
                responseData.forEach(course => {
                    coursesArray.push(course.id);
                });

                console.log('Cursos recibidos de la API:', coursesArray);
                setAvailableCourses(coursesArray); 
            } catch (error) {
                console.error('Error al obtener cursos:', error);
            }
        };
    
        fetchCursos();
    }, []); 
    
    const getFiltrarFundae = async (input, number, coursesArray) => {
        try {
            console.log('Iniciando solicitud con input:', input);
            console.log('Número enviado:', number);
            console.log('Cursos seleccionados:', coursesArray); 

            const response = await fetch(`${baseURL}/filtrar-fundae/getData`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'tags': input,
                    'number': number,
                    'courses': JSON.stringify(coursesArray)
                }
            });

            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.status}`);
            }

            const responseData = await response.json();
            console.log('Datos recibidos de la API:', responseData);
            setData(responseData);

        } catch (error) {
            console.error('Error al filtrar Fundae:', error);
        }
    };

    const renderPersonalDataTable = () => {
        return (
            <div className="table-wrapper">
                <table className="excel-table">
                    <thead>
                        <tr>
                            <th>Course</th>
                            <th>Email</th>
                            <th>User Name</th>
                            <th>Course Start Date</th>
                            <th>Learning Activities</th>
                            <th>Course Completed</th>
                            <th>Time in platform (en minutos)</th>
                            <th>Average Course Score</th>
                            <th>Porcentaje de progreso</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((user, index) =>
                            user.courses.map((course, idx) => {
                                const timeInPlatform = course.progress.time_on_course ? Math.round(course.progress.time_on_course / 60) : 0;
                                let courseId = course.course.id.replace(/-/g, ' ');
                                courseId = courseId.charAt(0).toUpperCase() + courseId.slice(1);
                                //courseId = courseId.replace(/Formación\s*/gi, '');
    
                                let date = new Date(course.created * 1000);
                                date = date.toLocaleDateString('es-ES');
    
                                return (
                                    <tr key={`${index}-${idx}`}>
                                        <td>{courseId || ''}</td>
                                        <td>{user.email || ''}</td>
                                        <td>{user.username || ''}</td>
                                        <td>{date || ''}</td>
                                        <td>{course.progress.completed_units + '/' + course.progress.total_units || ''}</td>
                                        <td>{course.progress.status ? '✓' : 'X'}</td>
                                        <td>{timeInPlatform + ' min' || 'Sin empezar'}</td>
                                        <td>{course.progress.average_score_rate || ''}</td>
                                        <td>{course.progress.progress_rate || ''}</td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        );
    };
    
    const generateExcelFile = () => {
        const workbook = XLSX.utils.book_new();
    
        // Data for InfoUser
        const personalData = [];
        data.forEach(user => {
            user.courses.forEach(course => {
                const timeInPlatform = course.progress.time_on_course ? Math.round(course.progress.time_on_course / 60) : 0;
                let courseId = course.course.id.replace(/-/g, ' ');
                courseId = courseId.charAt(0).toUpperCase() + courseId.slice(1);
    
                // Eliminar la palabra "Formación" del título del curso
                //courseId = courseId.replace(/Formación\s*/gi, '');
    
                let date = new Date(course.created * 1000);
                date = date.toLocaleDateString('es-ES');
    
                const personalInfoRow = {
                    'Course': courseId || '',
                    'Email': user.email || '',
                    'User Name': user.username || '',
                    'Course Start Date': date || '',
                    'Learning Activities': course.progress.completed_units + '/' + course.progress.total_units || '',
                    'Course Completed': course.progress.status ? '✓' : 'X',
                    'Time in platform (en minutos)': timeInPlatform + ' min' || 'Sin empezar',
                    'Average Course Score': course.progress.average_score_rate || '',
                    'Porcentaje de progreso': course.progress.progress_rate || ''
                };
                personalData.push(personalInfoRow);
            });
        });
    
        const personalWorksheet = XLSX.utils.json_to_sheet(personalData);
        XLSX.utils.book_append_sheet(workbook, personalWorksheet, 'Summary');
    
        // Data for Progreso Fundae
        const courseData = {};
        data.forEach(user => {
            user.courses.forEach(course => {
                if (course.progress && course) {
                    if (!courseData[course.contents.title]) {
                        courseData[course.contents.title] = { rows: [], users: new Set() };
                    }
                    course.contents.sections.forEach(section => {
                        if (!courseData[course.contents.title].rows.find(r => r['Learning Activity'] === `Sección: ${section.title}`)) {
                            const sectionRow = {
                                'Learning Activity': `Sección: ${section.title}`,
                                'Type': '',
                                'Started/Completed': '',
                            };
                            courseData[course.contents.title].rows.push(sectionRow);
                        }

                        // Recorrer las unidades de aprendizaje
                        section.learningUnits.forEach(unit => {
                            let unidadesCompletadas = 0;
                            let unidadesTotales = 0;

                            // Recorrer todos los usuarios y contar cuántos han completado la unidad
                            for(let i = 0; i < data.length; i++) {
                                for(let j = 0; j < data[i].courses.length; j++) {
                                    if(data[i].courses[j].contents.title === course.contents.title) {
                                        for(let k = 0; k < data[i].courses[j].progress.progress_per_section_unit.length; k++) {
                                            for(let l = 0; l < data[i].courses[j].progress.progress_per_section_unit[k].units.length; l++) {
                                                if(data[i].courses[j].progress.progress_per_section_unit[k].units[l].unit_name === unit.title) {
                                                    if(data[i].courses[j].progress.progress_per_section_unit[k].units[l].unit_progress_rate >= '70') {
                                                        unidadesCompletadas++;
                                                        unidadesTotales++;
                                                    } else {
                                                        unidadesTotales++;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }

                            const unitTitle = unit.title || '';
                            let row = courseData[course.contents.title].rows.find(r => r['Learning Activity'] === unitTitle);
                            if (!row) {
                                row = {
                                    'Learning Activity': unitTitle,
                                    'Type': unit.type || '',
                                    'Started/Completed': `${unidadesCompletadas}/${unidadesTotales}`,
                                };
                                courseData[course.contents.title].rows.push(row);
                            }
                            courseData[course.contents.title].users.add(`${user.username} - ${user.email}`);
                        });
                    });
                }
            });
        });
    
        Object.keys(courseData).forEach(courseTitle => {
            const userColumnsArray = Array.from(courseData[courseTitle].users);
            courseData[courseTitle].rows.forEach(row => {
                userColumnsArray.forEach(userColumn => {
                    row[userColumn] = '';
                });
            });
        });
    
        data.forEach(user => {
            user.courses.forEach(course => {
                if (course.progress && course.progress.progress_per_section_unit) {
                    course.progress.progress_per_section_unit.forEach(section => {
                        section.units.forEach(unit => {
                            const row = courseData[course.contents.title]?.rows.find(r => r['Learning Activity'] === unit.unit_name);
                            if (row) {
                                row[`${user.username} - ${user.email}`] = unit.unit_progress_rate >= '70' ? '✓' : '';
                            }
                        });
                    });
                }
            });
        });
    
        Object.keys(courseData).forEach(courseTitle => {
            //let truncatedTitlePre = courseTitle.replace('Formación: ', '');
            let truncatedTitle = courseTitle.length > 31 ? courseTitle.substring(0, 31) : courseTitle;
            const progressWorksheet = XLSX.utils.json_to_sheet(courseData[courseTitle].rows);
            XLSX.utils.book_append_sheet(workbook, progressWorksheet, truncatedTitle);
        });
    
        // Data for Evaluación
        const evaluationData = [];
        const emptyRow = {
            'Learning Activity': 'Evaluación',
            'Type': '',
            'Average Score': '',
        };
        const evaluationRow = {
            'Learning Activity': 'Evaluación',
            'Type': 'AssessmentV2',
            'Average Score': '',
        };
    
        let totalScoreSum = 0;
        let totalUserCount = 0;
    
        data.forEach(user => {
            let totalScore = 0;
            let count = 0;
    
            user.courses.forEach(course => {
                if (course.progress && course.progress.average_score_rate) {
                    totalScore += parseFloat(course.progress.average_score_rate);
                    count++;
                }
            });
    
            const npsAverage = count > 0 ? (totalScore / count).toFixed(2) : '';
            emptyRow[`${user.username} - ${user.email}`] = '';
            evaluationRow[`${user.username} - ${user.email}`] = npsAverage;
    
            if (npsAverage) {
                totalScoreSum += parseFloat(npsAverage);
                totalUserCount++;
            }
        });
    
        evaluationRow['Average Score'] = totalUserCount > 0 ? (totalScoreSum / totalUserCount).toFixed(2) : '';
        evaluationData.push(emptyRow, evaluationRow);
    
        const evaluationWorksheet = XLSX.utils.json_to_sheet(evaluationData);
        XLSX.utils.book_append_sheet(workbook, evaluationWorksheet, 'Scores');
    
        // Crear el archivo Excel y descargarlo
        XLSX.writeFile(workbook, 'datos_fundae.xlsx');
    };

    const renderCourseDataTables = () => {
        const courseData = {};
    
        data.forEach(user => {
            user.courses.forEach(course => {
                if (course.progress && course) {
                    if (!courseData[course.contents.title]) {
                        courseData[course.contents.title] = { rows: [], users: new Set() };
                    }
                    course.contents.sections.forEach(section => {
                        if (!courseData[course.contents.title].rows.find(r => r['Learning Activity'] === `Sección: ${section.title}`) || courseData[course.contents.title] === "📄Descargable del módulo	") {
                            const sectionRow = {
                                'Learning Activity': `Sección: ${section.title}`,
                                'Type': '',
                                'Started/Completed': '',
                            };
                            courseData[course.contents.title].rows.push(sectionRow);
                        }
                        section.learningUnits.forEach(unit => {
                            const unitTitle = unit.title || '';
                            let row = courseData[course.contents.title].rows.find(r => r['Learning Activity'] === unitTitle);
                            let unidadesCompletadas = 0;
                            let unidadesTotales = 0;

                            // Recorrer todos los usuarios y contar cuántos han completado la unidad
                            for(let i = 0; i < data.length; i++) {
                                for(let j = 0; j < data[i].courses.length; j++) {
                                    if(data[i].courses[j].contents.title === course.contents.title) {
                                        for(let k = 0; k < data[i].courses[j].progress.progress_per_section_unit.length; k++) {
                                            for(let l = 0; l < data[i].courses[j].progress.progress_per_section_unit[k].units.length; l++) {
                                                if(data[i].courses[j].progress.progress_per_section_unit[k].units[l].unit_name === unit.title) {
                                                    if(data[i].courses[j].progress.progress_per_section_unit[k].units[l].unit_progress_rate >= '70') {
                                                        unidadesCompletadas++;
                                                        unidadesTotales++;
                                                    } else {
                                                        unidadesTotales++;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                           
                            if (!row) {
                                row = {
                                    'Learning Activity': unitTitle,
                                    'Type': unit.type || '',
                                    'Started/Completed': `${unidadesCompletadas}/${unidadesTotales}`,
                                };
                                courseData[course.contents.title].rows.push(row);
                            }
                            courseData[course.contents.title].users.add(`${user.username} - ${user.email}`);
                        });
                    });
                }
            });
        });
    
        return Object.keys(courseData).map(courseTitle => {
            const userColumnsArray = Array.from(courseData[courseTitle].users);
            courseData[courseTitle].rows.forEach(row => {
                userColumnsArray.forEach(userColumn => {
                    row[userColumn] = '';
                });
            });
    
            data.forEach(user => {
                user.courses.forEach(course => {
                    if (course.progress && course.progress.progress_per_section_unit) {
                        course.progress.progress_per_section_unit.forEach(section => {
                            section.units.forEach(unit => {
                                const row = courseData[course.contents.title]?.rows.find(r => r['Learning Activity'] === unit.unit_name);
                                if (row) {
                                    row[`${user.username} - ${user.email}`] = unit.unit_progress_rate >= '70' ? '✓' : '';
                                }
                            });
                        });
                    }
                });
            });
    
            return (
                <div key={courseTitle}>
                    <h2>{courseTitle.substring(0, 31)}</h2>
                    <div className="table-wrapper">
                        <table className="excel-table">
                            <thead>
                                <tr>
                                    <th>Learning Activity</th>
                                    <th>Type</th>
                                    <th>Started/Completed</th>
                                    {userColumnsArray.map(user => <th key={user}>{user}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {courseData[courseTitle].rows.map((row, index) => (
                                    <tr key={index}>
                                        <td>{row['Learning Activity']}</td>
                                        <td>{row['Type']}</td>
                                        <td>{row['Started/Completed']}</td>
                                        {userColumnsArray.map(user => (
                                            <td key={user}>{row[user]}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            );
        });
    };    

    const renderEvaluationTable = () => {
        const evaluationData = [];
        const emptyRow = {
            'Learning Activity': 'Evaluación',
            'Type': '',
            'Average Score': '',
        };
        const evaluationRow = {
            'Learning Activity': 'Evaluación',
            'Type': 'AssessmentV2',
            'Average Score': '',
        };
    
        let totalScoreSum = 0;
        let totalUserCount = 0;
    
        data.forEach(user => {
            let totalScore = 0;
            let count = 0;
    
            user.courses.forEach(course => {
                if (course.progress && course.progress.average_score_rate) {
                    totalScore += parseFloat(course.progress.average_score_rate);
                    count++;
                }
            });
    
            const npsAverage = count > 0 ? (totalScore / count).toFixed(2) : '';
            emptyRow[`${user.username} - ${user.email}`] = '';
            evaluationRow[`${user.username} - ${user.email}`] = npsAverage;
    
            if (npsAverage) {
                totalScoreSum += parseFloat(npsAverage);
                totalUserCount++;
            }
        });
    
        evaluationRow['Average Score'] = totalUserCount > 0 ? (totalScoreSum / totalUserCount).toFixed(2) : '';
        evaluationData.push(emptyRow, evaluationRow);
    
        return (
            <div>
                <h2>Scores</h2>
                <div className="table-wrapper">
                    <table className="excel-table">
                        <thead>
                            <tr>
                                {Object.keys(evaluationData[0]).map(key => <th key={key}>{key}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {evaluationData.map((row, index) => (
                                <tr key={index}>
                                    {Object.values(row).map((value, idx) => <td key={idx}>{value}</td>)}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };
    

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
                    <div className="filtrarFundaeContainer">
                        <MoreInfo info="Aquí puedes filtrar usuarios por sus etiquetas y posteriormente visualizar." />
                        <h1>Filtrar Fundae</h1>
                        <div className="search-container">
                            <input 
                                type="text" 
                                placeholder="Ingresa valores separados por comas" 
                                value={inputValue} 
                                onChange={handleInputChange} 
                                className="search-bar2"
                            />
                            <input 
                                type="number" 
                                placeholder="Ingresa un número" 
                                value={numberValue} 
                                onChange={handleNumberChange} 
                                className="number-input"
                            />
                            <select value={currentCourse} onChange={handleCourseSelect} className="course-select">
                                <option value="">Selecciona un curso</option>
                                {availableCourses.map((course, index) => {
                                    // Eliminar guiones y capitalizar la primera letra de cada palabra
                                    const formattedCourse = course.replace(/-/g, ' ').split(' ').map(word => 
                                        word.charAt(0).toUpperCase() + word.slice(1)
                                    ).join(' ');

                                    return (
                                        <option key={index} value={course}>
                                            {formattedCourse}
                                        </option>
                                    );
                                })}
                            </select>
                            <button onClick={addCourse} className="add-course-button">Añadir curso</button>
                            </div>
                            <div>
                            <div className="selected-courses">
                                <h3 className='title-courses'>Cursos seleccionados:</h3>
                                <ul className='title-courses-ul'>
                                {selectedCourses.map((course, index) => {
                                    // Eliminar guiones y capitalizar la primera letra de cada palabra
                                    const formattedCourse = course.replace(/-/g, ' ').split(' ').map(word => 
                                        word.charAt(0).toUpperCase() + word.slice(1)
                                    ).join(' ');

                                    return (
                                        <li key={index}>
                                            {formattedCourse}
                                            <button onClick={() => removeCourse(course)} className="remove-course-button">
                                                X
                                            </button>
                                        </li>
                                    );
                                })}
                                </ul>
                            </div>
                            <div className='container-buttons-Filter'>
                                <button className="search-button" onClick={handleButtonClick}>Filtrar</button>
                                <button 
                                    className="download-button" 
                                    onClick={() => generateExcelFile()} 
                                    disabled={data.length === 0 || isLoading}
                                >
                                    Descargar Excel
                                </button>
                            </div>

                            {isLoading && (
                                <div className="loader-container">
                                    <img src={LoadingGif} alt="Loading..." className="loader-gif" />
                                </div>
                            )}
                        </div>
                        {!isLoading && data.length > 0 && (
                            <div className="tables-container">
                                {renderPersonalDataTable()}
                                {renderCourseDataTables()}
                                {renderEvaluationTable()}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default FiltrarFundae;