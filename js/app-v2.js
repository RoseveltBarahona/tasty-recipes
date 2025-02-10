import { obtenerCategorias, seleccionarCategoria } from "./api.js"
import {selectCategorias, btnSearch ,wrapFavorites} from "./selectores.js"
import {obtenerFavoritos} from "./functions.js"

document.addEventListener("DOMContentLoaded", iniciarApp)

function iniciarApp() {
    if (selectCategorias) {
        obtenerCategorias()
        btnSearch.addEventListener("click", seleccionarCategoria)
    }
    if (wrapFavorites) {
        obtenerFavoritos()
    }
}
