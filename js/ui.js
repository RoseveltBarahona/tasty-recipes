
import { selectCategories, mainCategories, mainRecipes, wrapResults, resultHeading, recipeTimes, recipeDetails, wrapRecipeDetail } from "./selectores.js"
import { launchDetaillModal, existeYaEnStorage, addToFavorites } from "./functions.js"
export { uiMostrarRecetas, uiMostrarRecetaModal, uiCloseRecipeModal }

function uiMostrarRecetas(recetas, fromStorage = false, categoria) {

    // si no viene de favoritos ocultamos las categorias y recetas principales
    if (!fromStorage) {
        mainCategories.classList.add("u-hide")
        mainRecipes.classList.add("u-hide")
        wrapResults.classList.remove("u-hide")
    }

    uiLimpiarHtml(results)

    if (selectCategories) {
        let textInfo = categoria //selectCategories.value
        resultHeading.textContent = recetas.length ? `Resultados ${textInfo} :` : "No hay resultados"
    }

    recetas.forEach(receta => {
        console.log(receta)
        let index = Math.floor(Math.random() * 3);
        const { idMeal, strMeal, strMealThumb, type } = receta
        /* if (fromStorage) {idMeal = receta.id strMeal = receta.title strMealThumb = receta.img } */

        const recipeDiv = document.createElement("div")
        recipeDiv.classList.add("recipe-card")

        const recipeTitle = document.createElement("h4")
        recipeTitle.classList.add("recipe-card__title")
        recipeTitle.innerHTML = `<span class="recipe-card__title-content">${strMeal ?? receta.title}</span>`

        const recipeInfo = document.createElement("div")
        recipeInfo.classList.add("recipe-card__info")
        recipeInfo.dataset.time = recipeTimes[index]
        recipeInfo.dataset.id = idMeal ?? receta.id

        const recipeImg = document.createElement("img")
        recipeImg.loading = "lazy"
        recipeImg.draggable = false
        recipeImg.classList.add("recipe-card__img")
        recipeImg.alt = `Imagen de ${strMeal ?? receta.title}`
        recipeImg.src = `${strMealThumb ?? receta.img}`

        const wrapBtnTime = document.createElement("div")
        wrapBtnTime.classList.add("recipe-card__wrap-btn-time")
        wrapBtnTime.dataset.time = recipeTimes[index]

        const recetaBtn = document.createElement("button")
        recetaBtn.classList.add("recipe-card__button")
        recetaBtn.textContent = "Ver receta"

        const recipeTime = document.createElement("span")
        recipeTime.classList.add("recipe-card__time")
        recipeTime.innerHTML = `<img class="recipe-card__icon" loading="lazy"  height="20" width="20" src="images/clock.svg" alt="clock-icon"> ${recipeTimes[index]} min`

        const recipeBottom = document.createElement("div")
        recipeBottom.classList.add("recipe-card__bottom")
        recipeBottom.innerHTML = `<span>●</span> ${type ?? categoria}`

        wrapBtnTime.appendChild(recetaBtn)
        wrapBtnTime.appendChild(recipeTime)
        recipeInfo.appendChild(recipeImg)
        recipeInfo.appendChild(wrapBtnTime)

        recipeDiv.appendChild(recipeTitle)
        recipeDiv.appendChild(recipeInfo)
        recipeDiv.appendChild(recipeBottom)
        results.appendChild(recipeDiv)
    })
    launchDetaillModal()
}


function uiMostrarRecetaModal(receta, time) {

    uiLimpiarHtml(recipeDetails)
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
                <img class="recipe-detail__icon" loading="lazy" src="images/clock.svg" alt="clock-icon">${time} min</span>
            </div>
            <h4 class="recipe-detail__subtitle">Instrucciones</h4>
            <p class="recipe-detail__instructions">${strInstructions}</p>
            <span class="recipe-detail__area">-${receta.strArea} recipe</span>
        </div>`

    recipeDetails.appendChild(recipeContent)

    const recipeDetailsFooter = document.createElement("div")
    recipeDetailsFooter.classList.add("recipe-detail__footer")

    const favoritoBtn = document.createElement("button")
    favoritoBtn.classList.add("btn-primary", "btn-primary--small")
    favoritoBtn.id = "favorite-btn"
    favoritoBtn.textContent = existeYaEnStorage(idMeal) ? "Eliminar favorito" : "Guardar favorito---"
    favoritoBtn.onclick = () => { addToFavorites(idMeal, strMeal, strMealThumb) }

    const cerrarBtn = document.createElement("button")
    cerrarBtn.classList.add("btn-secondary", "btn-secondary--small")
    cerrarBtn.textContent = "Cerrar"
    cerrarBtn.onclick = uiCloseRecipeModal

    recipeDetailsFooter.appendChild(favoritoBtn)
    recipeDetailsFooter.appendChild(cerrarBtn)
    recipeContent.appendChild(recipeDetailsFooter)

    // mostrar detalle de receta
    //wrapRecipeDetail.classList.remove("u-hide")
    wrapRecipeDetail.classList.add("wrap-recipe-detail--show")
}

function uiCloseRecipeModal() {
    setTimeout(() => {
        uiLimpiarHtml(recipeDetails) 
    }, 300);
    
    wrapRecipeDetail.classList.remove("wrap-recipe-detail--show")
}

function uiLimpiarHtml(selector) {
    while (selector.firstChild) {
        selector.removeChild(selector.firstChild)
    }
}