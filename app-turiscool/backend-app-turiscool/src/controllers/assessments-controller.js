const url = 'https://academy.turiscool.com/admin/api/v2/assessments';
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

export const obtainResponses = async (req, res) => {
    const formID = req.params.id;

    try {
            const response = await fetch(
                `${url}/${formID}/responses`,
                requestOptions
            );

            const data = await response.json();
        
        res.status(200).json(data);
    } catch (error) {
        
    }
};