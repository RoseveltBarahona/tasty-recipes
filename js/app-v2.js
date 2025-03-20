import { obtenerCategorias, seleccionarCategoria } from "./api.js"
import {selectCategories, btnSearch ,wrapFavorites} from "./selectores.js"
import {obtenerFavoritos} from "./functions.js"
import { launchDetaillModal } from "./listeners.js"

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
    launchDetaillModal()
}
