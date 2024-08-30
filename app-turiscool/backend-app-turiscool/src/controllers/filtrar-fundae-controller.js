const url = 'https://academy.turiscool.com/admin/api/v2/users';
const token = "Bearer 17xa7adwlycG4qrbRatBdCHW41xtl9jNyaBq4d45";
const id = "62b182eea31d8d9863079f42";

const requestOptions = {
    method: "GET",
    headers: {
        Authorization: token,
        "Content-Type": "application/json",
        "Lw-Client": id,
    },
};

const obtainTotalPages = async (tags) => {
    try {
        const response = await fetch(
            `https://academy.turiscool.com/admin/api/v2/users?items_per_page=200&tags=${tags}`,
            requestOptions
        );
        if (!response.ok) {
            throw new Error("Failed to fetch usuarios");
        }
        const data = await response.json();
        return data.meta.totalPages;
    } catch (error) {
        ("Error:", error);
    }
};

export const getData = async (req, res) => {
    const tags = req.headers.tags;
    const totalPages = await obtainTotalPages(tags);
    const userList = [];
    console.log('Tags:', tags);

    try {
        for (let i = 0; i <= totalPages; i++) {
            const response = await fetch(
                `${url}?page=${i}&items_per_page=200&tags=${tags}`,
                requestOptions
            );

            if (!response.ok) {
                throw new Error("Failed to fetch usuarios");
            }
            const data = await response.json();
            data.data.forEach(user => {
                userList.push(user);
            });
        }

        if (!userList) {
            throw new HttpStatusError(404, 'No se encontró ningún usuario');
        }


        // Eliminar usuarios duplicados
        const uniqueUserList = await userList.filter((user, index, self) =>
            index === self.findIndex((t) => (
                t.id === user.id
            ))
        )

        console.log('Usuarios obtenidos con éxito (total: ' + uniqueUserList.length + ')')

        let userData = [];
        // Recorrer la lista de usuarios y obtener los cursos de cada uno
        for (let i = 0; i < uniqueUserList.length; i++) {
            const user = uniqueUserList[i];
            const userId = user.id;
            const courses = await getCourses(userId);
            userData.push( {
                id: userId,
                username: user.username,
                email: user.email,
                tags: user.tags,
                created: user.created,
                last_login: user.last_login,
                nps_score: user.nps_score,
                courses: courses
            });
        }

        console.log('Usuarios con cursos:', userData.length);
    
        // Elimina un curso si no tiene progreso
        userData = userData.map(user => {
            //console.log(user)
            user.courses = user.courses.filter(course => course.progress);
            return user;
        });


        // Filtrar solo los usuarios que tengan cursos
        userData = userData.filter(user => user.courses.length > 0);

        //Eliminar cursos duplicados
        userData = userData.map(user => {
            user.courses = user.courses.filter((course, index, self) =>
                index === self.findIndex((t) => (
                    t.course.id === course.course.id
                ))
            );
            return user;
        });


        //console.log('Unique users:', userData);
        res.status(200).json(userData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Obtener todas las páginas de los cursos de un usuario
const obtainTotalPagesCourses = async (userId) => {
    try {
        const response = await fetch(
            `https://academy.turiscool.com/admin/api/v2/users/${userId}/courses?items_per_page=200`,
            requestOptions
        );
        if (!response.ok) {
            throw new Error("Failed to fetch cursos");
        }
        const data = await response.json();
        return data.meta.totalPages;
    } catch (error) {
        ("Error:", error);
    }
};

// Obtener los cursos de un usuario
const getCourses = async (userId) => {
    const totalPages = await obtainTotalPagesCourses(userId);
    const courseList = [];

    try {
        //console.log(totalPages);

        for (let i = 0; i <= totalPages; i++) {
            const response = await fetch(
                `https://academy.turiscool.com/admin/api/v2/users/${userId}/courses?page=${i}&items_per_page=200`,
                requestOptions
            );

            if (!response.ok) {
                throw new Error("Failed to fetch cursos");
            }
            const data = await response.json();
            data.data.forEach(course => {
                courseList.push(course);
            });
        }

        if (!courseList.length) {
            throw new Error('No se encontró ningún curso');
        }

        //console.log(courseList);

        // Filtrar solo los cursos cuya id incluya "formacion"
        const filteredCourseList = courseList.filter(course => {
            if (course) {
                const courseId = course.course.id;
                const courseFiltered = courseId.includes('formacion') ||
                                       courseId.includes('habilidades-y-herramientas-para-la-gestion-del-estres') ||
                                       courseId.includes('liderazgo-y-gestion-del-talento-en-alojamientos-turisticos') || 
                                       courseId.includes('planificacion-optimizacion-ingresos-hoteles');
                return courseFiltered;
            }
            return false;
        });

        // Recoger progreso de cada curso del usuario
        for (let i = 0; i < filteredCourseList.length; i++) {
            const response2 = await fetch(
                `https://academy.turiscool.com/admin/api/v2/users/${userId}/courses/${filteredCourseList[i].course.id}/progress`,
                requestOptions
            );

            if (!response2.ok) {
                throw new Error("Failed to fetch progreso de cursos");
            }
            const data = await response2.json();
            
            if (data.progress_rate >= 80){
                filteredCourseList[i].progress = data;
            } 
            
            // Pushear progreso al curso
            
        }

        // Recoger el contenido de cada curso del usuario y pushearlo al curso
        for (let i = 0; i < filteredCourseList.length; i++) {
            const response3 = await fetch(
                `https://academy.turiscool.com/admin/api/v2/courses/${filteredCourseList[i].course.id}/contents`,
                requestOptions
            );

            if (!response3.ok) {
                throw new Error("Failed to fetch contenido de cursos");
            }
            const data = await response3.json();
            filteredCourseList[i].contents = data;
        }

        return filteredCourseList;
    } catch (error) {
        console.error('Error al obtener los cursos:', error);
        throw new Error(error.message || 'Error al obtener cursos');
    }
}
