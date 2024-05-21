const token = "Bearer 17xa7adwlycG4qrbRatBdCHW41xtl9jNyaBq4d45";
const id = "62b182eea31d8d9863079f42";
let bundleId = "i-economato-2-jefe";
let coursesOfBundle = [];
let starsNumber = 0;
let userId = "65d3763f741db932c906da1c";
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

        const coursesProgress = await getUserProgressForEachCourseInBundle();
        createObjectWithCoursesProgress(coursesProgress);
        let starsArrayToPrint = createStarsArray();
    } catch (error) {
        console.log(error);
    }
}

async function getUserProgressForEachCourseInBundle() {
    let coursesProgress = [];
    try {
        for (let i = 0; i < coursesOfBundle.length; i++) {
            const courseId = coursesOfBundle[i];
            const response = await fetch(`https://academy.turiscool.com/admin/api/v2/users/${userId}/courses/${courseId}/progress`, requestOptions);
            const data = await response.json();
            coursesProgress.push(data);
        }
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
}

function createStarsArray() {
    starsArray = [];
    for (let courseId in userProgressObject) {
        if (userProgressObject[courseId].status === "not_started") {
            starsArray.push("🌑");
        } else if (userProgressObject[courseId].status === "not_completed") {
            starsArray.push("🌑");
        } else if (userProgressObject[courseId].status === "completed") {
            starsArray.push("🌕");
        }
    }
    orderStarsArray();
    let progressInnerBar = document.querySelector(".progress-inner");
    let progressNumber = calculateProgress();
    createDivWithStarsAlongsideProgress();
    progressInnerBar.style.width = `${progressNumber}%`;
    return starsArray;
}

function orderStarsArray() {
    starsArray.sort();
    starsArray.reverse();
}

function splitUrl() {
    let url = window.location.href;
    let urlArray = url.split("/");
    let courseIdofArray = urlArray[3];
}

function calculateProgress() {
    let completedCourses = 0;
    for (let courseId in userProgressObject) {
        if (userProgressObject[courseId].status === "completed") {
            completedCourses++;
        }
    }
    return (completedCourses / starsNumber) * 100;
}

function createDivWithStarsAlongsideProgress() {
    let starsProgressDiv = document.querySelector(".starsprogress");
    starsProgressDiv.innerHTML = '';
    for (let i = 0; i < starsArray.length; i++) {
        let starDiv = document.createElement("div");
        starDiv.textContent = starsArray[i];
        starDiv.classList.add("star");
        starsProgressDiv.appendChild(starDiv);
    }
}

function start() {
    splitUrl();
    getBundleCourses();
}

start();