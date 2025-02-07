document.addEventListener("DOMContentLoaded", inicarApp)

function inicarApp() {

    const selectCategorias = document.querySelector("#category")
    const maincategories = document.querySelector("#main-categories")
    const mainrecipes = document.querySelector("#main-recipes")
    const wrapResults = document.querySelector("#wrap-results")
    const results = document.querySelector("#results")
    const resultHeading = document.querySelector("#results-heading")

    const wrapRecipeDetail = document.querySelector("#wrap-recipe-detail")
    const recipeDetails = document.querySelector("#recipe-detail")

    const wrapFavorites = document.querySelector("#wrap-favorites")
    const btnSearch = document.querySelector("#btn-search")
    let readingFromstorage = false


    if (selectCategorias) {
        obtenercategorias()
        btnSearch.addEventListener("click", seleccionarCategoría)
    }

    // si estoy en pag favoritos
    if (wrapFavorites) {
        obtenerFavoritos()

    }

    function obtenercategorias() {
        const url = "https://www.themealdb.com/api/json/v1/1/categories.php"
        fetch(url)
            .then(response => response.json())
            .then(data => {
                cargarSelect(data.categories)
            })
            .catch(e => console.log({ e }))
    }

    function seleccionarCategoría(e) {

        const categoria = selectCategorias.value.trim()

        if (categoria === "") {
            alert("Selecciona una categoría");
            return
        }

        const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoria}`

        fetch(url)
            .then(response => response.json())
            .then(data => {
                mostrarRecetas(data.meals, false, categoria)
            })
            .catch(e => console.log({ e }))
    }


    function mostrarRecetas(recetas, fromStorage = false, typeFromSearch) {

        if (!fromStorage) {
            maincategories.classList.add("u-hide")
            mainrecipes.classList.add("u-hide")
            wrapResults.classList.remove("u-hide")
        }

        limpiarHtml(results)

        if (selectCategorias) {
            let textInfo = selectCategorias.value
            resultHeading.textContent = recetas.length ? `Resultados ${textInfo} :` : "No hay resultados"
        }


        recetas.forEach(receta => {

            let { idMeal, strMeal, strMealThumb, type } = receta
            /* if (fromStorage) {idMeal = receta.id; strMeal = receta.title; strMealThumb = receta.img } */

            const recipeDiv = document.createElement("div")
            recipeDiv.classList.add("recipe-card")

            const recipeTitle = document.createElement("h4")
            recipeTitle.classList.add("recipe-card__title")
            recipeTitle.innerHTML = `<span class="recipe-card__title-content"">${strMeal ?? receta.title}</span>`

            const recipeImg = document.createElement("img")
            recipeImg.loading = "lazy"
            recipeImg.classList.add("recipe-card__img")
            recipeImg.alt = `ìmagen de ${strMeal ?? receta.title}`
            recipeImg.src = `${strMealThumb ?? receta.img}`

            const recipeInfo = document.createElement("div")
            recipeInfo.classList.add("recipe-card__info")

            const wrapBtnTime = document.createElement("div")
            wrapBtnTime.classList.add("recipe-card__wrap-btn-time")

            const recetaBtn = document.createElement("button")
            recetaBtn.classList.add("recipe-card__button")
            recetaBtn.textContent = "Ver receta"

            const recipeTime = document.createElement("span")
            recipeTime.classList.add("recipe-card__time")
            recipeTime.innerHTML = `<img class="recipe-card__icon" loading ="lazy" src="images/clock.svg" alt="clock-icon">30 min`

            const recipeBottom = document.createElement("div")
            recipeBottom.classList.add("recipe-card__bottom")
            recipeBottom.innerHTML = `<span>●</span> ${type ?? typeFromSearch} `

            /* recetaBtn.onclick = function () { detalleReceta (idMeal) } 
            pasar a delegación de eventos
            */
            recetaBtn.addEventListener("click", () => {
                seleccionarReceta(idMeal ?? receta.id)
            })

            // add to html
            recipeDiv.appendChild(recipeTitle)

            wrapBtnTime.appendChild(recetaBtn)
            wrapBtnTime.appendChild(recipeTime)
            recipeInfo.appendChild(recipeImg)
            recipeInfo.appendChild(wrapBtnTime)

            recipeDiv.appendChild(recipeInfo)
            recipeDiv.appendChild(recipeBottom)
            results.appendChild(recipeDiv)
        })
    }

    function seleccionarReceta(id) {
        const url = `https://themealdb.com/api/json/v1/1/lookup.php?i=${id}`
        fetch(url)
            .then(response => response.json())
            .then(data => mostrarRecetaModal(data.meals[0]))
            .catch(e => console.log({ e }))
    }

    function mostrarRecetaModal(receta) {

        console.log(receta)
        const { idMeal, strInstructions, strMeal, strMealThumb } = receta

        const recipeContent = document.createElement("div")
        recipeContent.classList.add("recipe-detail__content")

        // cantidades e ingredientes
        let ingredientes = ""
        for (let i = 1; i < 20; i++) {
            if (receta[`strIngredient${i}`]) { // si hay algo en la propiedad > true
                const ingrediente = receta[`strIngredient${i}`]
                const cantidad = receta[`strMeasure${i}`]

                const ingredienteLi = document.createElement("li")
                ingredienteLi.classList.add("recipe-detail__ingredient")
                ingredienteLi.innerHTML = `<span>${ingrediente}</span> <span>${cantidad}</span>`

                ingredientes += ingredienteLi.outerHTML
            }
        }

        recipeContent.innerHTML += `  
            <h3 class="recipe-detail__title">${strMeal}</h3> 
            <div class="recipe-detail__image-and-ingredients">
                <img class="recipe-detail__image" src= "${strMealThumb}" alt ="receta ${strMeal}">
                <h4 class="recipe-detail__subtitle">Ingredientes y cantidades</h4>
                <ul class="recipe-detail__ingredients-list">${ingredientes}</ul>
            </div>            
            <div class="recipe-detail__info">
                <div class="recipe-detail__type-time">
                    <span class="recipe-detail__type">${receta.strCategory}</span>
                    <span class="recipe-detail__time">30 min</span>
                </div>
                <h4 class="recipe-detail__subtitle">Instrucciones</h4> 
                <p class="recipe-detail__instructions">${strInstructions}</p>
                <span class="recipe-detail__area">-${receta.strArea} recipe</span>
            </div>`

        recipeDetails.appendChild(recipeContent)

        // botones modal
        const recipeDetailsFooter = document.createElement("div")
        recipeDetailsFooter.classList.add("recipe-detail__footer")

        const favoritoBtn = document.createElement("button")
        favoritoBtn.classList.add("button-primay")
        favoritoBtn.id = "favorite-btn"
        favoritoBtn.textContent = existeYaEnStorage(idMeal) ? "Eliminar favorito" : "Guardar favorito--"

        favoritoBtn.onclick = () => { addToFavorites(idMeal, strMeal, strMealThumb) }

        const cerrarBtn = document.createElement("button")
        cerrarBtn.classList.add("btn-secondary")
        cerrarBtn.textContent = "cerrar"
        cerrarBtn.onclick = () => { closeRecipeModal() }

        recipeDetailsFooter.appendChild(favoritoBtn)
        recipeDetailsFooter.appendChild(cerrarBtn)
        recipeContent.appendChild(recipeDetailsFooter)

        wrapRecipeDetail.classList.remove("u-hide")
        //modal.show()
    }

    closeRecipeModal = () => {
        limpiarHtml(recipeDetails)
        wrapRecipeDetail.classList.add("u-hide")
    }

    const addToFavorites = (idMeal, strMeal, strMealThumb) => {

        const favoriteBtn = document.querySelector("#favorite-btn")

        // evita que duplique, si existe y da click lo elimina del array y actualizamos el texto 
        if (existeYaEnStorage(idMeal)) {
            eliminarFavorito(idMeal)
            alert("favorito eliminado")
            favoriteBtn.textContent = "Guardar favorit---oxxx"
            return
        }

        agregarFavorito({
            id: idMeal,
            title: strMeal,
            img: strMealThumb,
            type: document.querySelector(".recipe-detail__type").textContent
        })

        alert("favorito añadido")
        favoriteBtn.textContent = "Eliminar favorito"

    }


    function agregarFavorito(receta) {
        // si existe lo guardo en una variable. si no (la primera vez)le asigno array vacio
        const favoritos = JSON.parse(localStorage.getItem("recetasFavoritas")) || [];
        localStorage.setItem("recetasFavoritas", JSON.stringify([...favoritos, receta]))
    }


    function existeYaEnStorage(idMeal) {
        const favoritos = JSON.parse(localStorage.getItem("recetasFavoritas")) || [];
        return favoritos.some(item => item.id === idMeal)
    }

    function eliminarFavorito(id) {
        const favoritos = JSON.parse(localStorage.getItem("recetasFavoritas"));
        const favoritosACtualizados = favoritos.filter(item => item.id !== id)

        localStorage.setItem("recetasFavoritas", JSON.stringify(favoritosACtualizados))

    }

    function obtenerFavoritos() {
        const favoritosGuardados = JSON.parse(localStorage.getItem("recetasFavoritas")) || [];

        if (favoritosGuardados.length) {
            mostrarRecetas(favoritosGuardados, true)

            resultHeading.textContent = "Tus recetas favoritas"
            return
        }
        resultHeading.textContent = " Aún no tienes favoritos"
    }

    /* function mostrarToast(mensaje) {
        const toastDiv = document.querySelector("#toast")
        const toastBody = document.querySelector(".toast-body")
        toastBody.textContent = mensaje
        const toast = new bootstrap.Toast(toastDiv)

        toast.show()
    } */

    function limpiarHtml(selector) {
        while (selector.firstChild) {
            selector.removeChild(selector.firstChild)
        }
    }

    function cargarSelect(data = []) { // forzar por defecto que sea array
        for (let item of data) {
            const option = document.createElement("option")
            option.value = item.strCategory
            option.textContent = item.strCategory
            selectCategorias.appendChild(option)
            //selectCategorias.innerHTML += `<option value =${item.strCategory}>${item.strCategory}</option>`
        }
    }
}

