import { Routes, Route } from 'react-router-dom';
import FormularioSatisfaccion from '../educacion/formulario-satisfaccion/formulario-satisfaccion';
import CourseInfo from '../educacion/componentes/courseInfo.jsx';
import Menu from '../menu/menu';
import Firmafy from '../firmafy/componentes/firmafy.jsx';
import PasswordIsTrue from '../middleware/passwordIsTrue.jsx';

const Body = () => {
  return (
    <Routes>
      <Route path="/*" element={<Menu />}/>
      <Route path="/" element={<Menu />}/>
      <Route path="/average" element={<PasswordIsTrue element={FormularioSatisfaccion} />} />
      <Route path="/average/courses" element={<PasswordIsTrue element={CourseInfo} />} />
      <Route path="/firmafy" element={<PasswordIsTrue element={Firmafy} />} />
    </Routes>
  );
}

export default Body;
