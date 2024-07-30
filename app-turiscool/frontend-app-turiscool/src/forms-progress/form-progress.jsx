import React, { useState, useEffect } from "react";
import Password from "../popups/password";
import Navbar from "../navbar/navbar.jsx";
import SideBar from "../navbar/sidebar.jsx";
import MainContent from "../mainContent/mainContent.jsx";
import "./form-progress.css";
import loading from "../assets/Loading_2.gif";
import moreInfo from "../moreInfo/moreInfo.jsx";
import MoreInfo from "../moreInfo/moreInfo.jsx";

const FormComponent = () => {
  const url = import.meta.env.VITE_BASE_URL;
  const token = import.meta.env.VITE_TOKEN;
  const lwId = "62b182eea31d8d9863079f42";
  const userId = import.meta.env.VITE_USER_ID;

  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
      "Lw-Client": lwId,
    },
  };

  const [paginas, setPaginas] = useState(0);
  const [etiqueta, setEtiqueta] = useState("");
  const [etiqueta2, setEtiqueta2] = useState("");
  const [selectorCursos, setSelectorCursos] = useState("default");
  const [usuarios, setUsuarios] = useState([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [alumnosConCurso, setAlumnosConCurso] = useState([]);
  const [progreso, setProgreso] = useState([]);
  const [error1, setError1] = useState("");
  const [error2, setError2] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(true); // Nueva variable de estado

  useEffect(() => {
    crearListadoDeCursos();
  }, []);

  useEffect(() => {
    if (usuariosFiltrados.length > 0) {
      buscarCursosDeUsuariosFiltrados();
    } else {
      setAlumnosConCurso([]);
    }
  }, [usuariosFiltrados]);

  useEffect(() => {
    if (alumnosConCurso.length > 0) {
      buscarProgreso();
    } else {
      setProgreso([]);
    }
  }, [alumnosConCurso]);

  const fetchMeta = async () => {
    try {
      const response = await fetch(`${url}/users`);
      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }
      const data = await response.json();

      setUsuarios(data.map(user => ({
        nombre: user.username,
        tags: user.tags,
        id: user.id
      })));
      setUsersLoading(false); // Usuarios cargados
    } catch (error) {
      console.error("Error fetching metadata:", error);
    }
  };

  const crearListadoDeCursos = async () => {
    try {
      const response = await fetch(`${url}/courses`, requestOptions);
      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }
      const data = await response.json();
      setCursos(data.map((curso) => curso.id));
      await fetchMeta();
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const searchUser = () => {
    console.log("Usuarios", usuarios);
    console.log("Etiqueta", etiqueta);
    console.log("Etiqueta2", etiqueta2);
    let dataUsuariosFiltrados = [];

    for (let i = 0; i < usuarios.length; i++) {
      if (usuarios[i].tags.includes(etiqueta) && usuarios[i].tags.includes(etiqueta2)) {
        console.log("Usuario con etiqueta", usuarios[i]);
        dataUsuariosFiltrados.push(usuarios[i]);
      }
    }
    setUsuariosFiltrados(dataUsuariosFiltrados);

    // Verifica si no se encontraron usuarios con las etiquetas seleccionadas
    if (usuarios.length > 0 && dataUsuariosFiltrados.length === 0) {
      alert("No se encontraron usuarios con las etiquetas seleccionadas (Sensible a mayúsculas)");
      setIsLoading(false);
      return;
    }

    console.log("Usuarios Filtrados:", dataUsuariosFiltrados);
  };

  const buscarCursosDeUsuariosFiltrados = async () => {
    try {
      const usuariosConCursos = [];
      for (let i = 0; i < usuariosFiltrados.length; i++) {
        const response = await fetch(
          `${url}/users/${usuariosFiltrados[i].id}/courses`);
        if (!response.ok) {
          throw new Error("Network response was not ok.");
        }
        const data = await response.json();
        console.log("Data", data);  
        const listadoCursosPorUsuario = data.map((cursoData) => cursoData.course.id);

        usuariosConCursos.push({
          id: usuariosFiltrados[i].id,
          nombre: usuariosFiltrados[i].nombre,
          cursos: listadoCursosPorUsuario,
        });
      }
      const dataUsers = usuariosConCursos.filter((user) => user.cursos.includes(selectorCursos));
      setAlumnosConCurso(dataUsers);
      setIsLoading(false);

      if (usuariosConCursos.length > 0 && dataUsers.length === 0) {
        alert("No se encontraron usuarios con el curso seleccionado / etiquetas seleccionadas");
      }
    } catch (error) {
      console.error("Error fetching user courses:", error);
    }
  };

  const buscarProgreso = async () => {
    console.log("Ha entrado en buscar progreso");
    console.log("Alumnos con curso", alumnosConCurso);
    try {
      const progresoPromises = alumnosConCurso.map(async (alumno) => {
        const response = await fetch(
          `${url}/users/${alumno.id}/courses/${selectorCursos}/progress`,
          requestOptions
        );
        if (!response.ok) {
          throw new Error("Network response was not ok.");
        }
        const data = await response.json();
        return {
          nombre: alumno.nombre,
          info: {
            status: data.status,
            completado: convertTimestampToDate(data.completed_at),
            progreso: data.progress_rate,
            puntuacion: data.average_score_rate,
            tiempo: data.time_on_course,
          },
        };
      });
      const progreso = await Promise.all(progresoPromises);
      setProgreso(progreso);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching progress:", error);
    }
  };

  const convertTimestampToDate = (timestamp) => {
    if (timestamp === null) {
      return "No completado";
    }
    const date = new Date(timestamp * 1000);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError1("");
    setError2("");

    // Reiniciar los resultados
    setProgreso([]);
    setAlumnosConCurso([]);
    setUsuariosFiltrados([]);

    if (!etiqueta && !etiqueta2) {
      setError1("Campo obligatorio");
      setError2("Campo obligatorio");
      return;
    }
    if (!etiqueta) {
      setError1("Campo obligatorio");
      return;
    }
    if (!etiqueta2) {
      setError2("Campo obligatorio");
      return;
    }

    setIsLoading(true);

    searchUser(); // `searchUser` no es asíncrono, no necesita `await`
  };

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
        <div className="rightBottomContainer containerFormProgress">
          <form onSubmit={handleSubmit}>
            <MoreInfo info="Aquí podrá seleccionar dos tags de un usuario, para posteriormente filtrar el progreso de dichos usuarios que coincidan con dichas etiquetas a un curso determinado." />
            <div className="estrecho">
              <h1>Buscar Progreso</h1>

              <label htmlFor="etiqueta">Etiquetas:</label>
              <input
                type="text"
                name="etiqueta"
                id="etiqueta"
                value={etiqueta}
                onChange={(e) => setEtiqueta(e.target.value)}
              />
              <p id="mensajeError1" style={{ color: "red" }}>{error1}</p>
              <input
                type="text"
                name="etiqueta2"
                id="etiqueta2"
                value={etiqueta2}
                onChange={(e) => setEtiqueta2(e.target.value)}
              />
              <p id="mensajeError2" style={{ color: "red" }}>{error2}</p>
              <label htmlFor="selectorCursos">Lista de Cursos:</label>
              <select
                name="selectorCursos"
                id="selectorCursos"
                value={selectorCursos}
                onChange={(e) => setSelectorCursos(e.target.value)}
              >
                <option value="default">Default</option>
                {cursos.map((curso) => (
                  <option key={curso} value={curso}>
                    {curso.charAt(0).toUpperCase() + curso.replaceAll("-", " ").slice(1)}
                  </option>
                ))}
              </select>
              <br />
              <button type="submit" disabled={isLoading || usersLoading}>
                {isLoading ? "Buscando..." : "Buscar"}
              </button>
            </div>

            <div id="resultado" className="estrecho">
              {isLoading && <img src={loading} alt="Loading..." />}
              {progreso.length > 0 && (
                <div className="containerTable">
                  <h2>Se han encontrado {progreso.length} resultados</h2>
                  <table id="tablaDatos" className="estrecho">
                    <thead>
                      <tr className="primeraFila">
                        <th></th>
                        <th>Nombre</th>
                        <th>Status</th>
                        <th>Progreso</th>
                        <th>Puntuacion</th>
                        <th>Tiempo</th>
                        <th>Fecha Finalización</th>
                      </tr>
                    </thead>
                    <tbody>
                      {progreso.map((user, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{user.nombre}</td>
                          <td>{user.info.status}</td>
                          <td>{user.info.progreso}%</td>
                          <td>{user.info.puntuacion}%</td>
                          <td>{user.info.tiempo} mins</td>
                          <td>{user.info.completado}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormComponent;
