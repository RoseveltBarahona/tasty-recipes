
import {cargarSelect} from "./functions.js"
import {selectCategories,loaderBackground } from "./selectores.js"
import {uiMostrarRecetas, uiMostrarRecetaModal} from "./ui.js"
export {obtenerCategorias, seleccionarCategoria, seleccionarReceta}


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


async function seleccionarCategoria( topCategory ) {
    const categoria = selectCategories.value.trim() || topCategory 
    
    if (categoria === "" || categoria.length === undefined) {
        alert("Selecciona una categoría")
        return
    }
    
    loaderBackground.classList.add("loader-background--show")
    const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoria}`
    
    try {
        const response = await fetch(url)
        const data = await response.json()
        uiMostrarRecetas(data.meals, false, categoria)
    } catch (e) {
        console.error("Error fetching recipes:", e)
    }
    finally {
        loaderBackground.classList.remove("loader-background--show")
        //selectCategories.selectedIndex = 0
    }
}


async function seleccionarReceta(id,time) {
    loaderBackground.classList.add("loader-background--show")   
    const url = `https://themealdb.com/api/json/v1/1/lookup.php?i=${id}`

    try {
        const response = await fetch(url)
        const data = await response.json()
        uiMostrarRecetaModal(data.meals[0],time)
    } catch (e) {
        console.error("Error fetching recipe details:", e)
    }
    finally {
        loaderBackground.classList.remove("loader-background--show")
    }
}