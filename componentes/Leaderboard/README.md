# DOCUMENTACIÓN DEL CÓDIGO

## 🔎 FUNCIONES

### 1. `functionStart`

- **Objetivo:** ejecutar una serie de funciones una vez cargue el DOM.
- **Ejecuta:** `fetchMetaProgress` y `fetchUser`.

      function functionStart() {
          userId = document.getElementById('el_1712750078537_354').textContent;
  
          fetchMetaProgress();

          fetchUser();
      }
  
___
### `functionStart` >  `fetchMetaProgress`
- **Objetivo:** recoge todas las páginas de progreso del usuario conectado.
- **Ejecuta:** `fetchData` y `fetchMeta`.

      function fetchMetaProgress(){
          fetch(`${url}/v2/users/${userId}/progress?items_per_page=200`, requestOptions)
          .then(response => response.json())
          .then(metaData => {
              console.log(metaData);
              pages = metaData.meta.totalPages;
  
              fetchData();
              fetchMeta();
          });}
___
### `functionStart` >  `fetchMetaProgress` > `fetchData`
- **Objetivo:** recoge el progreso del usuario conectado.
- **Ejecuta:** `fetchAlumn()`.

    function fetchData() {
      let fetchPromises = [];
  
      for (let i = 1; i <= pages; i++) {
          fetchPromises.push(
              fetch(`${url}/v2/users/${userId}/progress?page=${i}&items_per_page=200`, requestOptions)
              .then(response => response.json())
              .then(progressData => {
                  for (let i = 0; i < progressData.data.length; i++) {
                      progress.push(progressData.data[i]);
                  }
              })
          );
      }
  
      Promise.all(fetchPromises)
      .then(() => {
          filterProgressUser();
      });
  }
___
###  `functionStart` >  `fetchMetaProgress` > `fetchData` > `filterProgressUser`
- **Objetivo:** recorre todos los datos del progreso del usuario conectado, realizando todos los calculos necesarios para recoger las medias y pusheandolo todo en un Array nuevo .
- **Ejecuta:** `showProgressInfo()`.
___
###  `functionStart` >  `fetchMetaProgress` > `fetchData` > `filterProgressUser` > `showProgressInfo`
- **Objetivo:** muestra todos los datos de los cursos y medias del alumno conectado.

___
### `functionStart` >  `fetchMetaProgress` > `fetchMeta`
- **Objetivo:** recoge todas las páginas de todos los usuarios.
- **Ejecuta:** `fetchAlumn()`.

        function fetchMeta() { 
            delay(1000).then(() => {
                fetch(`${url}/v2/users?items_per_page=200`, requestOptions)
                    .then(response => response.json())
                    .then(metaData => {
                        pages = metaData.meta.totalPages;

                        fetchAlumn();
                    })
                });
            }
___
### `functionStart` >  `fetchMetaProgress` > `fetchMeta` > `fetchAlumn`
- **Objetivo:** recoge en un array todos los usuarios de la academia.
- **Ejecuta:** `searchUser()`.

        function fetchAlumn() {
         let fetchPromises = [];

         delay(10000).then(() => {
            for (let i = 0; i < pages; i++) {
               fetchPromises.push(
                  fetch(`${url}/v2/users?items_per_page=200&page=${i}`, requestOptions)
                     .then(response => response.json())
                     .then(data => {
                        for (let j = 0; j < data.data.length; j++) {
                           let userObject = {
                              name: data.data[j].username.toUpperCase(),
                              tags: data.data[j].tags,
                              id: data.data[j].id,
                              nps: data.data[j].nps_score,
                              lastLogin: data.data[j].last_login,
                           };

                           users.push(userObject);
                        }
                     })
               );

            }

        Promise.allSettled(fetchPromises)
               .then(() => {
                   console.log(users);
                   searchUser();
               });
         });
      }
___
### `functionStart` >  `fetchMetaProgress` > `fetchMeta` > `fetchAlumn` > `searchUser`
- **Objetivo:** filtra solo los usuarios cuyo tag coincida con la etiqueta.
- **Ejecuta:** `fetchProgress()`.

        function searchUser() {
         users.filter(user => {
            if (user.tags.includes(tag)) {
               usersByTag.push(user);
            }
         });

         console.log(usersByTag);
         fetchProgress();
      }

___
### `functionStart` >  `fetchMetaProgress` > `fetchMeta` > `fetchAlumn` > `searchUser` > `fetchProgress`
- **Objetivo:** obtiene el progreso de todos los usuarios de una etiqueta en concreto.
- **Ejecuta:** `filterProgress()`.

        function fetchProgress() {
        let fetchPromises = [];

        delay(10000).then(() => {
            for (let i = 0; i < usersByTag.length; i++) {
                fetchPromises.push(
                    fetch(`${url}/v2/users/${usersByTag[i].id}/progress`, requestOptions)
                        .then(response => response.json())
                        .then(progressData => {
                            progressData.name = usersByTag[i].name;
                            progressData.userID = usersByTag[i].id;
                            progressData.nps = usersByTag[i].nps;
                            progressData.lastLogin = usersByTag[i].lastLogin;
                            filteredUsers.push(progressData);
                        })
                );
            }
        

            Promise.allSettled(fetchPromises)
                .then(() => {
                    console.log(filteredUsers);
                    filterProgress();
                });
        });
        }
___
### `functionStart` >  `fetchMetaProgress` > `fetchMeta` > `fetchAlumn` > `searchUser` > `fetchProgress`
- **Objetivo:** obtiene el progreso de todos los usuarios de una etiqueta en concreto.
- **Ejecuta:** `filterProgress()`.

        function fetchProgress() {
        let fetchPromises = [];

        delay(10000).then(() => {
            for (let i = 0; i < usersByTag.length; i++) {
                fetchPromises.push(
                    fetch(`${url}/v2/users/${usersByTag[i].id}/progress`, requestOptions)
                        .then(response => response.json())
                        .then(progressData => {
                            progressData.name = usersByTag[i].name;
                            progressData.userID = usersByTag[i].id;
                            progressData.nps = usersByTag[i].nps;
                            progressData.lastLogin = usersByTag[i].lastLogin;
                            filteredUsers.push(progressData);
                        })
                );
            }
        

            Promise.allSettled(fetchPromises)
                .then(() => {
                    console.log(filteredUsers);
                    filterProgress();
                });
        });
        }
___
### `functionStart` >  `fetchMetaProgress` > `fetchMeta` > `fetchAlumn` > `searchUser` > `fetchProgress` > `filterProgress`
- **Objetivo:** recoge el progreso del usuario (de nuevo xd) y ejecuta el resto de funciones para el visualizado de datos.
- **Ejecuta:** `showTopUsers()`, `showTopUsers3()`, `showUserMe()`, `showCourseInfo()`, `filterCourses()`, `showMoreCourseInfo()`, `showInfoUser()`.

        function filterProgress() {
            console.log('Filtrando progreso');

            console.log(user);
                for (let i = 0; i < filteredUsers.length; i++) {
                console.log(filteredUsers[i].userID, user.id)
                if (filteredUsers[i].userID === user.id) {
                    user = filteredUsers[i];
                }
            }
            showTopUsers();
            showTopUsers3();
            showUserMe();
            showCourseInfo()
            filterCourses();
            showMoreCourseInfo();
            showInfoUser();
      }

___
### `showTopUsers` / `showTopUsers3` / `showUserMe`
- **Objetivo:** llama a una función que recoge un Array de objetos (usuario y su media) ordenados, para posteriormente mostrarlos, para el caso del showUserMe devolvera unicamente el indice del array en donde se encuentre el usuario.
- **Ejecuta:** `showTop10()`.

____
### `showTopUsers` -  `showTop10`
- **Objetivo:** recorre todos los usuarios filtrados, calculando sus medias de los cursos para posteriormente crear un array de objetos ordenados por la nota media.

        function showTop10() {
            let topUsers = [];

            for(let i = 0; i < filteredUsers.length; i++){
                let totalScore = 0;

                for(let j = 0; j < filteredUsers[i].data.length; j++){
                    totalScore += filteredUsers[i].data[j].average_score_rate;
                }

                // Calcula la media de las puntuaciones para este usuario
                let averageScore = totalScore / filteredUsers[i].data.length;


                averageScore = Math.trunc(averageScore * 10);

                topUsers.push({name: filteredUsers[i].name, total: averageScore})
            }
            
            topUsers.sort((a, b) => b.total - a.total);

            return topUsers;
        }

___
### `showCourseInfo`
- **Objetivo:** devuelve una media/resumen de datos de los cursos de los usuarios de dicha etiqueta.
        function showCourseInfo(){
        let datosRecibidos = false;

        let coursesData = courseInfo();
        if (coursesData) {
          datosRecibidos = true;
        }
        let courses = document.getElementById("statistic-courses");
        courses.innerHTML = `${coursesData.totalCoursesCompleted} cursos`;

        let time = document.getElementById("statistic-hours");
        // Redondear a horas
        coursesData.totalTime = Math.round(coursesData.totalTime / 60);

        time.innerHTML = `${coursesData.totalTime} horas`;

        let average = document.getElementById("statistic-average");
        average.innerHTML = `${coursesData.averageScore} / 10`;

        let lessons = document.getElementById("statistic-units");
        lessons.innerHTML = `${coursesData.totalUnits} lecciones`;

        if (datosRecibidos) {
          courses.classList.remove('loading');
          time.classList.remove('loading');
          average.classList.remove('loading');
          lessons.classList.remove('loading');
        }
      }
___
### `showCourseInfo`
- **Objetivo:** devuelve una media/resumen de datos de los cursos de los usuarios de dicha etiqueta.
        function showCourseInfo(){
        let datosRecibidos = false;

        let coursesData = courseInfo();
        if (coursesData) {
          datosRecibidos = true;
        }
        let courses = document.getElementById("statistic-courses");
        courses.innerHTML = `${coursesData.totalCoursesCompleted} cursos`;

        let time = document.getElementById("statistic-hours");
        // Redondear a horas
        coursesData.totalTime = Math.round(coursesData.totalTime / 60);

        time.innerHTML = `${coursesData.totalTime} horas`;

        let average = document.getElementById("statistic-average");
        average.innerHTML = `${coursesData.averageScore} / 10`;

        let lessons = document.getElementById("statistic-units");
        lessons.innerHTML = `${coursesData.totalUnits} lecciones`;

        if (datosRecibidos) {
          courses.classList.remove('loading');
          time.classList.remove('loading');
          average.classList.remove('loading');
          lessons.classList.remove('loading');
        }
      }

___
### `filterCourses`
- **Objetivo:** recoge un resumen de medias de los cursos, para ello recorrera todos los cursos de los usuarios y hara una media devolviendo un Array de objetos para cada curso, para posteriormente ir guardando la media de cada dato en nuevos objetos.

        let longCourse = {
            name: "",
            time: 0,
        };

        let shortCourse = {
          name: "",
          time: 100000000,
        };

        let courseAbandoned = {
          name: "",
          count: 0,
        };

        let coursePopular = {
          name: "",
          count: 0,
        };

        let lowerCourseAverage = {
          name: "",
          average: 100000,
        };

        let highestCourseAverage = {
          name: "",
          average: 0,
        };  

        let lastUserConected = {
          name: "",
          time: 0,
        };

        let userConected = {
          name: "",
          time: 1000000000,
        };
___   
### `showMoreCourseInfo`
- **Objetivo:** una vez recorrido todos los datos de los respectivos cursos en la función anterior, imprime los datos que se necesiten.

___ 
### `showInfoUser`
- **Objetivo:** devuelve el último usuario logueado junto con su fecha de conexión.