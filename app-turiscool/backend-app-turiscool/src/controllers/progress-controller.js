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

const totalPagesProgress = async (userID) => {
    console.log(userID)
    try {
        const response = await fetch(
            `${url}/${userID}/progress`,
            requestOptions
        );
        if (!response.ok) {
            throw new Error("Failed to fetch progress");
        }
        const data = await response.json();
        console.log(response)
        return data.meta.totalPages;
    } catch (error) {
        ("Error:", error);
    }
}

export const obtainProgressById = async (req, res) => {
    const userID = req.params.id;

    const totalPages = await totalPagesProgress(userID);
    const progressList = [];
    try {
        console.log(totalPages)

        for (let i = 1; i <= totalPages; i++) {
            const response = await fetch(
                `${url}/${userID}/progress?page=${i}&itemsPerPage=20`,
                requestOptions
            );

            if (!response.ok) {
                throw new Error("Failed to fetch progress");
            }
            const data = await response.json();
            data.data.forEach(progress => {
                progressList.push(progress);
            });
        }

        if (!progressList) {
            throw new HttpStatusError(404, 'No se encontró ningún progreso');
        }
        
        // Eliminar progresos duplicados
        const uniqueProgressList = await progressList.filter((progress, index, self) =>
            index === self.findIndex((t) => (
                t.id === progress.id
            ))
        )

        res.json(uniqueProgressList);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

// Obtener User Progress por curso
export const obtainProgressByCourse = async (req, res) => {
    const { userID, courseID } = req.params;
    console.log(userID, courseID)

    try {
        const response = await fetch(
            `https://academy.turiscool.com/admin/api/v2/users/${userID}/courses/${courseID}/progress`,
            requestOptions
        );
        if (!response.ok) {
            throw new Error("Failed to fetch progress");
        }
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}



