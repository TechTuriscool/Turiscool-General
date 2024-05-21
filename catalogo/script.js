const token = "Bearer 17xa7adwlycG4qrbRatBdCHW41xtl9jNyaBq4d45";
const id = "62b182eea31d8d9863079f42";
let arrayNamesForbidden = ["feet", "bienvenidos", "onboarding"];
let categories = [];

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

    await getAllCourses();
}

async function getAllCourses() {
    for (let i = 1; i <= pages; i++) {
        const response = await fetch(`https://academy.turiscool.com/admin/api/v2/courses?page=${i}`, requestOptions);
        const courses = await response.json();
        courseList.push(...courses.data);
    }
    await getAllCategories();

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

    card.addEventListener('click', () => showDescription(course.description));

    return card;
}

function containsForbiddenWord(title) {
    return arrayNamesForbidden.some(word => title.toLowerCase().includes(word.toLowerCase()));
}

function getAllCategories() {
    courseList.forEach(course => {
        if (course.categories) {
            categories.push(...course.categories);
        }
    });
    // Remove duplicates and void values
    categories = [...new Set(categories.filter(category => category))];
    console.log(categories);
}

function generateCards() {
    const gridCatalogue = document.querySelector('.gridCatalogue');
    courseList.forEach(course => {
        if (!containsForbiddenWord(course.title)) {
            const card = createCourseCard(course);
            gridCatalogue.appendChild(card);
        }
    });
    populateCategories();
}

function showDescription(description) {
    const modal = document.getElementById('myModal');
    const descriptionText = document.getElementById('courseDescription');
    const backdrop = document.getElementById('modalBackdrop');

    descriptionText.innerText = description && description.length > 0 ? description : "Este curso no tiene descripción.";

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

function populateCategories() {
    const select = document.getElementById('categorySelector');
    select.innerHTML = ''; // Clear previous options
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.innerText = category;
        select.appendChild(option);
    });
    select.addEventListener('change', filterByCategorySelected);
}

function filterByCategorySelected(e) {
    const category = e.target.value;
    const filteredCourses = courseList.filter(course => course.categories.includes(category));
    const gridCatalogue = document.querySelector('.gridCatalogue');
    gridCatalogue.innerHTML = '';
    filteredCourses.forEach(course => {
        const card = createCourseCard(course);
        gridCatalogue.appendChild(card);
    });
}

function start() {
    getAllCoursesMeta();
}

start();
