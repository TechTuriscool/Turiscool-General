import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import './filtrarFundae.css';
import Navbar from '../navbar/navbar';
import SideBar from '../navbar/sidebar';
import MoreInfo from '../moreInfo/moreInfo';
import LoadingGif from "../assets/Loading_2.gif"; 

const FiltrarFundae = () => {
    const [inputValue, setInputValue] = useState('');
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const baseURL = import.meta.env.VITE_BASE_URL;

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleButtonClick = async () => {
        if (inputValue === '') {
            alert('Por favor, ingresa valores');
            return;
        }

        setIsLoading(true);
        await getFiltrarFundae(inputValue);
        setIsLoading(false);
    };

    const getFiltrarFundae = async (input) => {
        try {
            console.log('Iniciando solicitud con input:', input);

            const response = await fetch(`${baseURL}/filtrar-fundae/getData`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'tags': input
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
                                courseId = courseId.replace(/Formación\s*/gi, '');
    
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
                courseId = courseId.replace(/Formación\s*/gi, '');
    
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
                        section.learningUnits.forEach(unit => {
                            const unitTitle = unit.title || '';
                            let row = courseData[course.contents.title].rows.find(r => r['Learning Activity'] === unitTitle);
                            if (!row) {
                                row = {
                                    'Learning Activity': unitTitle,
                                    'Type': unit.type || '',
                                    'Started/Completed': '1/1',
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
            let truncatedTitlePre = courseTitle.replace('Formación: ', '');
            let truncatedTitle = truncatedTitlePre.length > 31 ? truncatedTitlePre.substring(0, 31) : truncatedTitlePre;
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
                        if (!courseData[course.contents.title].rows.find(r => r['Learning Activity'] === `Sección: ${section.title}`)) {
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
                            if (!row) {
                                row = {
                                    'Learning Activity': unitTitle,
                                    'Type': unit.type || '',
                                    'Started/Completed': '1/1',
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
                    <h2>{courseTitle.replace('Formación: ', '').substring(0, 31)}</h2>
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
                        <MoreInfo info='Aquí puedes filtrar usuarios por sus etiquetas y posteriormente visualizar.' />
                        <div className="search-container">
                            <h1>Filtrar Fundae</h1>
                            <input 
                                type="text" 
                                placeholder="Ingresa valores separados por comas" 
                                value={inputValue} 
                                onChange={handleInputChange} 
                                className="search-bar2"
                            />
                            <button className="search-button" onClick={handleButtonClick}>Filtrar</button>
                            <button 
                                className="download-button" 
                                onClick={() => generateExcelFile()} 
                                disabled={data.length === 0 || isLoading}
                            >
                                Descargar Excel
                            </button>
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
}

export default FiltrarFundae;
