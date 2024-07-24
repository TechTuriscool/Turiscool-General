import { Routes, Route } from 'react-router-dom';
import FormularioSatisfaccion from '../educacion/formulario-satisfaccion/formulario-satisfaccion';
import CourseInfo from '../educacion/componentes/courseInfo.jsx';
import Menu from '../menu/menu';
import Firmafy from '../firmafy/componentes/firmafy.jsx';
import PasswordIsTrue from '../middleware/passwordIsTrue.jsx';
import Unsuspend from '../unsuspend/unsuspend.jsx';
import Guide from '../guide/guide.jsx';

const Body = () => {
  return (
    <Routes>
      <Route path="/*" element={<Menu />}/>
      <Route path="/" element={<Menu />}/>
      <Route path="/educacion/average" element={<PasswordIsTrue element={FormularioSatisfaccion} />} />
      <Route path="/educacion/average/courses" element={<PasswordIsTrue element={CourseInfo} />} />
      <Route path="/customer-success/firmafy" element={<PasswordIsTrue element={Firmafy} />} />
      <Route path="/customer-success/unsuspend" element={<PasswordIsTrue element={Unsuspend} />} />
      <Route path="/guide" element={<PasswordIsTrue element={Guide} />} />
    </Routes>
  );
}

export default Body;
