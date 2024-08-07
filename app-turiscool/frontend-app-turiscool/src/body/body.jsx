import { Routes, Route } from 'react-router-dom';
import FormularioSatisfaccion from '../educacion/formulario-satisfaccion/formulario-satisfaccion';
import CourseInfo from '../educacion/componentes/courseInfo.jsx';
import Menu from '../menu/menu';
import Firmafy from '../firmafy/componentes/firmafy.jsx';
import PasswordIsTrue from '../middleware/passwordIsTrue.jsx';
import Unsuspend from '../unsuspend/unsuspend.jsx';
import Guide from '../guide/guide.jsx';
import MenuCustomerSuccess from '../sections/customerSuccess.jsx';
import MenuEducación from '../sections/educacion.jsx';
import File from '../files/files.jsx';
import FormProgress from '../forms-progress/form-progress.jsx';
import Wasapi from '../wasapi-hubspot/actualizar contactos.jsx';
import Conversaciones from '../wasapi-hubspot/listarConversaciones.jsx';
import Hubspot from '../sections/hubspot.jsx';
import ActualizarContactos from '../wasapi-hubspot/actualizar contactos.jsx';
import Users from '../sections/users.jsx';

const Body = () => {
  return (
    <Routes>
      <Route path="/*" element={<Menu />}/>
      <Route path="/" element={<Menu />}/>
      <Route path="/educacion" element={<PasswordIsTrue element={MenuEducación} />} />
      <Route path="/educacion/average" element={<PasswordIsTrue element={FormularioSatisfaccion} />} />
      <Route path="/educacion/average/courses" element={<PasswordIsTrue element={CourseInfo} />} />
      <Route path="/customer-success" element={<PasswordIsTrue element={MenuCustomerSuccess} />} />
      <Route path="/customer-success/firmafy" element={<PasswordIsTrue element={Firmafy} />} />
      <Route path="/customer-success/unsuspend" element={<PasswordIsTrue element={Unsuspend} />} />
      <Route path="/customer-success/progress" element={<PasswordIsTrue element={FormProgress} />} />
      <Route path="/guide" element={<PasswordIsTrue element={Guide} />} />
      <Route path="/files" element={<PasswordIsTrue element={File} />} />
      <Route path="/hubspot" element={<PasswordIsTrue element={Hubspot} />} />
      <Route path="/hubspot/usuarios" element={<PasswordIsTrue element={Users } />} />
      <Route path="/hubspot/conversaciones" element={<PasswordIsTrue element={Conversaciones} />} />
      <Route path="/hubspot/usuarios/actualizar-contactos" element={<PasswordIsTrue element={ActualizarContactos } />} />
    </Routes>
  );
}

export default Body;
