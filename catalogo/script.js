const token = "Bearer 17xa7adwlycG4qrbRatBdCHW41xtl9jNyaBq4d45";
const id = "62b182eea31d8d9863079f42";
let arrayNamesForbidden = ["feet", "bienvenidos", "onboarding"];

let pages = 0;
let courseList = [];
const requestOptions = {
    method: "GET",
    headers: {
        Authorization: token,
        "Content-Type": "application/json",
        "Lw-Client": id,
    },
};

async function getAllCoursesMeta() {
    const response = await fetch("https://academy.turiscool.com/admin/api/v2/courses", requestOptions);
    const metadata = await response.json();
    const courses = metadata.meta;
    console.log(courses);
    pages = courses.totalPages;

    getAllCourses();
}

async function getAllCourses() {
    for (let i = 1; i <= pages; i++) {
        const response = await fetch(`https://academy.turiscool.com/admin/api/v2/courses?page=${i}`, requestOptions);
        const courses = await response.json();
        courseList.push(...courses.data);  // Flatten the array of courses
    }
    console.log(courseList);
    orderAlphabetically();
}

function createCourseCard(course) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
        <img src="${course.courseImage}" alt="course-image">
        <h3>${course.title}</h3>
    `;

    // Add click event listener to show the modal with course description
    card.addEventListener('click', () => showDescription(course.description));

    return card;
}

function containsForbiddenWord(title) {
    return arrayNamesForbidden.some(word => title.toLowerCase().includes(word.toLowerCase()));
}

function generateCards() {
    const gridCatalogue = document.querySelector('.gridCatalogue');
    courseList.forEach(course => {
        if (!containsForbiddenWord(course.title)) {
            const card = createCourseCard(course);
            gridCatalogue.appendChild(card);
        }
    });
}

function showDescription(description) {
    const modal = document.getElementById('myModal');
    const descriptionText = document.getElementById('courseDescription');
    const backdrop = document.getElementById('modalBackdrop');

    if (!description || description.length === 0) {
        descriptionText.innerText = "Este curso no tiene descripción.";
    } else {
        descriptionText.innerText = description;
    }

    modal.style.display = "block";
    backdrop.style.display = "block";
}

function hideDescription() {
    const modal = document.getElementById('myModal');
    const backdrop = document.getElementById('modalBackdrop');

    modal.style.display = "none";
    backdrop.style.display = "none";
}

function orderAlphabetically() {
    courseList.sort((a, b) => a.title.localeCompare(b.title));
    const gridCatalogue = document.querySelector('.gridCatalogue');
    gridCatalogue.innerHTML = '';
    generateCards();
}

const span = document.getElementsByClassName("close")[0];
span.onclick = function () {
    hideDescription();
}

window.onclick = function (event) {
    const modal = document.getElementById('myModal');
    const backdrop = document.getElementById('modalBackdrop');

    if (event.target == modal || event.target == backdrop) {
        hideDescription();
    }
}

function start() {
    getAllCoursesMeta();
}

start();
