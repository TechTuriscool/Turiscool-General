const url = 'https://academy.turiscool.com/admin/api/v2/courses';
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

async function fetchCourseData() {
    try {
        const response = await fetch(
            "https://academy.turiscool.com/admin/api/v2/courses?itemsPerPage=50",
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

export const obtainCourses = async (req, res) => {
    const totalPages = await fetchCourseData();
    const courseList = [];

    try {
        console.log(totalPages)

        for (let i = 0; i <= totalPages; i++) {
            const response = await fetch(
                `${url}?page=${i}&itemsPerPage=50`,
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

        if (!courseList) {
            throw new HttpStatusError(404, 'No se encontró ningún curso');
        }
        
        // Eliminar cursos duplicados
        const uniqueCourseList = await courseList.filter((course, index, self) =>
            index === self.findIndex((t) => (
                t.id === course.id
            ))
        );

        console.log('Cursos obtenidos con éxito (total: ' + uniqueCourseList.length + ')')
        res.json(uniqueCourseList);
    } catch (error) {
        console.error('Error al obtener los cursos:', error);
        res.status(error.status || 500).json({ message: error.message || 'Error al obtener cursos' });
    }
}

export const obtainCourse = async (req, res) => {
    const { id } = req.params;

    try {
        const response = await fetch(
            `${url}/${id}`,
            requestOptions
        );
        if (!response.ok) {
            throw new Error("Failed to fetch curso");
        }
        const data = await response.json();
        res.json(data);
    }
    catch (error) {
        console.error('Error al obtener el curso:', error);
        res.status(error.status || 500).json({ message: error.message || 'Error al obtener curso' });
    }
}

export const obtainContent = async (req, res) => {
    const { id } = req.params;
    try {
        const response = await fetch(
            `${url}/${id}/contents`,
            requestOptions
        );
        if (!response.ok) {
            throw new Error("Failed to fetch content");
        }
        const data = await response.json();
        console.log("Contenido obtenido con éxito")
        res.json(data);
    } catch (error) {
        console.error('Error al obtener el contenido:', error);
        res.status(error.status || 500).json({ message: error.message || 'Error al obtener contenido' });
    }
}

async function fetchUserPages(courseId) {
    console.log(courseId)
    try {
        const response = await fetch(
            `${url}/${courseId}/users?itemsPerPage=200`,
            requestOptions
        );
        if (!response.ok) {
            throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        console.log(data.meta)
        return data.meta.totalPages;
    } catch (error) {
        console.error('Error al obtener las páginas de usuarios:', error);
    }
}

export const obtainUsersPerCourse = async (req, res) => {
    const { id } = req.params;
    const totalPages = await fetchUserPages(id);
    const userList = [];

    try {
        for (let i = 0; i <= totalPages; i++) {
            const response = await fetch(
                `${url}/${id}/users?itemsPerPage=200`,
                requestOptions
            );
            if (!response.ok) {
                throw new Error("Failed to fetch users");
            }
            const data = await response.json();
            data.data.forEach(user => {
                userList.push(user);
            });
        }
        res.json(userList);
    } catch (error) {
        console.error('Error al obtener los usuarios:', error);
        res.status(error.status || 500).json({ message: error.message || 'Error al obtener usuarios' });
    }
}