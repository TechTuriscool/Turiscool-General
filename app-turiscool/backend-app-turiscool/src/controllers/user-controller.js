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

const obtainTotalPages = async () => {
    try {
        const response = await fetch(
            "https://academy.turiscool.com/admin/api/v2/users?items_per_page=200",
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

export const obtainUsers = async (req, res) => {
    const totalPages = await obtainTotalPages();
    const userList = [];

    try {
        console.log(totalPages)

        for (let i = 0; i <= totalPages; i++) {
            const response = await fetch(
                `${url}?page=${i}&items_per_page=200`,
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

        console.log("Usuarios obtenidos con éxito:", uniqueUserList.length);

        res.status(200).json(uniqueUserList);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const obtainUserById = async (req, res) => {
    const { id } = req.params;

    console.log("Obteniendo usuario con id:", id);
    try {
        const response = await fetch(
            `https://academy.turiscool.com/admin/api/v2/users/${id}`,
            requestOptions
        );

        if (!response.ok) {
            throw new Error("Failed to fetch usuario");
        }
        const data = await response.json();
        console.log("Usuario obtenido con éxito.");

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
