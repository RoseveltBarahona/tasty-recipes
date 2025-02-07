document.addEventListener("DOMContentLoaded", iniciarApp)

function iniciarApp() {
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

    let readingFromStorage = false

    if (selectCategorias) {
        obtenerCategorias()
        btnSearch.addEventListener("click", seleccionarCategoria)
    }

    if (wrapFavorites) {
        obtenerFavoritos()
    }

    async function obtenerCategorias() {
        const url = "https://www.themealdb.com/api/json/v1/1/categories.php"
        try {
            const response = await fetch(url)
            const data = await response.json()
            cargarSelect(data.categories)
        } catch (e) {
            console.error("Error fetching categories:", e)
        }
    }

    async function seleccionarCategoria() {
        const categoria = selectCategorias.value.trim()

        if (categoria === "") {
            alert("Selecciona una categoría")
            return
        }

        const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoria}`
        try {
            const response = await fetch(url)
            const data = await response.json()
            mostrarRecetas(data.meals, false, categoria)
        } catch (e) {
            console.error("Error fetching recipes:", e)
        }
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
            const { idMeal, strMeal, strMealThumb, type } = receta
            /* if (fromStorage) {idMeal = receta.id strMeal = receta.title strMealThumb = receta.img } */

            const recipeDiv = document.createElement("div")
            recipeDiv.classList.add("recipe-card")

            const recipeTitle = document.createElement("h4")
            recipeTitle.classList.add("recipe-card__title")
            recipeTitle.innerHTML = `<span class="recipe-card__title-content">${strMeal ?? receta.title}</span>`

            const recipeImg = document.createElement("img")
            recipeImg.loading = "lazy"
            recipeImg.classList.add("recipe-card__img")
            recipeImg.alt = `Imagen de ${strMeal ?? receta.title}`
            recipeImg.src = `${strMealThumb ?? receta.img}`

            const recipeInfo = document.createElement("div")
            recipeInfo.classList.add("recipe-card__info")

            const wrapBtnTime = document.createElement("div")
            wrapBtnTime.classList.add("recipe-card__wrap-btn-time")

            const recetaBtn = document.createElement("button")
            recetaBtn.classList.add("recipe-card__button")
            recetaBtn.textContent = "Ver receta"
            recetaBtn.addEventListener("click", () => {
                seleccionarReceta(idMeal ?? receta.id)
            })

            const recipeTime = document.createElement("span")
            recipeTime.classList.add("recipe-card__time")
            recipeTime.innerHTML = `<img class="recipe-card__icon" loading="lazy" src="images/clock.svg" alt="clock-icon">30 min`

            const recipeBottom = document.createElement("div")
            recipeBottom.classList.add("recipe-card__bottom")
            recipeBottom.innerHTML = `<span>●</span> ${type ?? typeFromSearch}`

            wrapBtnTime.appendChild(recetaBtn)
            wrapBtnTime.appendChild(recipeTime)
            recipeInfo.appendChild(recipeImg)
            recipeInfo.appendChild(wrapBtnTime)

            recipeDiv.appendChild(recipeTitle)
            recipeDiv.appendChild(recipeInfo)
            recipeDiv.appendChild(recipeBottom)
            results.appendChild(recipeDiv)
        })
    }

    async function seleccionarReceta(id) {
        const url = `https://themealdb.com/api/json/v1/1/lookup.php?i=${id}`
        try {
            const response = await fetch(url)
            const data = await response.json()
            mostrarRecetaModal(data.meals[0])
        } catch (e) {
            console.error("Error fetching recipe details:", e)
        }
    }

    function mostrarRecetaModal(receta) {
        const { idMeal, strInstructions, strMeal, strMealThumb } = receta

        const recipeContent = document.createElement("div")
        recipeContent.classList.add("recipe-detail__content")

        // cantidades e ingredientes
        let ingredientes = ""
        for (let i = 1; i < 20; i++) {
            // si el ingrediente es true
            if (receta[`strIngredient${i}`]) {
                const ingrediente = receta[`strIngredient${i}`]
                const cantidad = receta[`strMeasure${i}`]

                const ingredienteLi = document.createElement("li")
                ingredienteLi.classList.add("recipe-detail__ingredient")
                ingredienteLi.innerHTML = `<span>${ingrediente}</span> <span>${cantidad}</span>`

                ingredientes += ingredienteLi.outerHTML
            }
        }

        recipeContent.innerHTML = `
            <h3 class="recipe-detail__title">${strMeal}</h3>
            <div class="recipe-detail__image-and-ingredients">
                <img class="recipe-detail__image" src="${strMealThumb}" alt="Receta ${strMeal}">
                <h4 class="recipe-detail__subtitle">Ingredientes y cantidades</h4>
                <ul class="recipe-detail__ingredients-list">${ingredientes}</ul>
            </div>
            <div class="recipe-detail__info">
                <div class="recipe-detail__type-time">
                    <span class="recipe-detail__type">${receta.strCategory}</span>
                    <span class="recipe-detail__time">
                    <img class="recipe-detail__icon" loading="lazy" src="images/clock.svg" alt="clock-icon">30 min</span>
                </div>
                <h4 class="recipe-detail__subtitle">Instrucciones</h4>
                <p class="recipe-detail__instructions">${strInstructions}</p>
                <span class="recipe-detail__area">-${receta.strArea} recipe</span>
            </div>`

        recipeDetails.appendChild(recipeContent)

        const recipeDetailsFooter = document.createElement("div")
        recipeDetailsFooter.classList.add("recipe-detail__footer")

        const favoritoBtn = document.createElement("button")
        favoritoBtn.classList.add("btn-primary","btn-primary--small")
        favoritoBtn.id = "favorite-btn"
        favoritoBtn.textContent = existeYaEnStorage(idMeal) ? "Eliminar favorito" : "Guardar favorito---"
        favoritoBtn.onclick = () => { addToFavorites(idMeal, strMeal, strMealThumb) }

        const cerrarBtn = document.createElement("button")
        cerrarBtn.classList.add("btn-secondary" , "btn-secondary--small")
        cerrarBtn.textContent = "Cerrar"
        cerrarBtn.onclick = closeRecipeModal

        recipeDetailsFooter.appendChild(favoritoBtn)
        recipeDetailsFooter.appendChild(cerrarBtn)
        recipeContent.appendChild(recipeDetailsFooter)

        // mostrar detalle de receta
        wrapRecipeDetail.classList.remove("u-hide")
    }

    function closeRecipeModal() {
        limpiarHtml(recipeDetails)
        wrapRecipeDetail.classList.add("u-hide")
    }

    function addToFavorites(idMeal, strMeal, strMealThumb) {
        const favoriteBtn = document.querySelector("#favorite-btn")

        // evitar que duplique, si existe y da click lo elimina del array y actualizamos el texto 
        if (existeYaEnStorage(idMeal)) {
            eliminarFavorito(idMeal)

            alert("favorito eliminado")
            favoriteBtn.textContent = "Guardar favoritoN"
            return
        }

        agregarFavorito({
            id: idMeal,
            title: strMeal,
            img: strMealThumb,
            type: document.querySelector(".recipe-detail__type").textContent
        })

        alert("Favorito añadido")
        favoriteBtn.textContent = "Eliminar favorito"
    }

    function agregarFavorito(receta) {
        const favoritos = JSON.parse(localStorage.getItem("recetasFavoritas")) || [];
        localStorage.setItem("recetasFavoritas", JSON.stringify([...favoritos, receta]))
    }

    function existeYaEnStorage(idMeal) {
        const favoritos = JSON.parse(localStorage.getItem("recetasFavoritas")) || [];
        return favoritos.some(item => item.id === idMeal)
    }

    function eliminarFavorito(id) {
        const favoritos = JSON.parse(localStorage.getItem("recetasFavoritas")) || [];
        const favoritosActualizados = favoritos.filter(item => item.id !== id)
        localStorage.setItem("recetasFavoritas", JSON.stringify(favoritosActualizados))
    }

    function obtenerFavoritos() {
        const favoritosGuardados = JSON.parse(localStorage.getItem("recetasFavoritas")) || [];
        if (favoritosGuardados.length) {
            mostrarRecetas(favoritosGuardados, true)
            resultHeading.textContent = "Tus recetas favoritas"
        } else {
            resultHeading.textContent = "Aún no tienes favoritos"
        }
    }

    function limpiarHtml(selector) {
        while (selector.firstChild) {
            selector.removeChild(selector.firstChild)
        }
    }

    function cargarSelect(data = []) {
        data.forEach(item => {
            const option = document.createElement("option")
            option.value = item.strCategory
            option.textContent = item.strCategory
            selectCategorias.appendChild(option)
        })
    }
}
