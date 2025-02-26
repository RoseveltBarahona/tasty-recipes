import { obtenerCategorias, seleccionarCategoria } from "./api.js"
import {selectCategories, btnSearch ,wrapFavorites} from "./selectores.js"
import {obtenerFavoritos} from "./functions.js"

document.addEventListener("DOMContentLoaded", iniciarApp)

function iniciarApp() {
    if (selectCategories) {
        obtenerCategorias()
        btnSearch.addEventListener("click", seleccionarCategoria)
        btnSearch.disabled = false
    }
    if (wrapFavorites) {
        obtenerFavoritos()
    }
}
