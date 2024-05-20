const token = "Bearer 17xa7adwlycG4qrbRatBdCHW41xtl9jNyaBq4d45";
const id = "62b182eea31d8d9863079f42";
let userId = "65d3763f741db932c906da1c";
let coursesOfBundle = [];
let starsNumber = 0;
let userProgressObject = {};
let starsArray = [];

const requestOptions = {
    method: "GET",
    headers: {
        Authorization: token,
        "Content-Type": "application/json",
        "Lw-Client": id,
    },
};

async function getBundleCourses() {
    try {
        const response = await fetch(`https://academy.turiscool.com/admin/api/v2/bundles/${bundleId}`, requestOptions);
        const data = await response.json();
        coursesOfBundle = data.products.courses;
        starsNumber = coursesOfBundle.length;
        console.log(coursesOfBundle);

        // Llamar a getUserProgressForEachCourseInBundle aquí
        const coursesProgress = await getUserProgressForEachCourseInBundle();
        createObjectWithCoursesProgress(coursesProgress);
        let starsArrayToPrint = createStarsArray();
        console.log(starsArrayToPrint);
    } catch (error) {
        console.log(error);
    }
}

async function getUserProgressForEachCourseInBundle() {
    console.log("entra");
    let coursesProgress = [];
    try {
        for (let i = 0; i < coursesOfBundle.length; i++) {
            const courseId = coursesOfBundle[i];
            const response = await fetch(`https://academy.turiscool.com/admin/api/v2/users/${userId}/courses/${courseId}/progress`, requestOptions);
            const data = await response.json();
            coursesProgress.push(data);
        }
        console.log(coursesProgress);
        return coursesProgress;
    } catch (error) {
        console.log(error);
    }
}

function createObjectWithCoursesProgress(coursesProgress) {
    for (let i = 0; i < coursesProgress.length; i++) {
        const courseId = coursesOfBundle[i];
        userProgressObject[courseId] = {
            course: coursesOfBundle[i],
            status: coursesProgress[i].status,
        };
    }
    console.log(userProgressObject);
}

function createStarsArray() {
    starsArray = [];
    for (let courseId in userProgressObject) {
        if (userProgressObject[courseId].status === "not_started") {
            starsArray.push("0");
        } else if (userProgressObject[courseId].status === "not_completed") {
            starsArray.push("1");
        } else {
            starsArray.push("2");
        }
    }
    return starsArray;
}

getBundleCourses();
