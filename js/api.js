
import {cargarSelect} from "./functions.js"
import {selectCategorias } from "./selectores.js"
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
        uiMostrarRecetas(data.meals, false, categoria)
    } catch (e) {
        console.error("Error fetching recipes:", e)
    }
}


async function seleccionarReceta(id,time) {   
    const url = `https://themealdb.com/api/json/v1/1/lookup.php?i=${id}`
    try {
        const response = await fetch(url)
        const data = await response.json()
        uiMostrarRecetaModal(data.meals[0],time)
    } catch (e) {
        console.error("Error fetching recipe details:", e)
    }
}