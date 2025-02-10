
import {selectCategorias, resultHeading} from "./selectores.js"
import {launchDetaillModal} from "./listeners.js"
import {uiMostrarRecetas} from "./ui.js"
export {cargarSelect, launchDetaillModal, existeYaEnStorage, addToFavorites, obtenerFavoritos}


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
        uiMostrarRecetas(favoritosGuardados, true)
        resultHeading.textContent = "Tus recetas favoritas"
    } else {
        resultHeading.textContent = "Aún no tienes favoritos"
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