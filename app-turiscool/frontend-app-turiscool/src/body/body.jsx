import { Routes, Route } from 'react-router-dom';
import FormularioSatisfaccion from '../educacion/formulario-satisfaccion/formulario-satisfaccion';
import CourseInfo from '../educacion/componentes/courseInfo.jsx';
import Menu from '../menu/menu';

const Body = () => {
  return (
    <Routes>
      <Route path="/*"/>
      <Route path="/" element={<Menu />}/>
      <Route path="/average" element={<FormularioSatisfaccion />} />
      <Route path="/average/courses" element={<CourseInfo />} />
    </Routes>
  );
}

export default Body;
