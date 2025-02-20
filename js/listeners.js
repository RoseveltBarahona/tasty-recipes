
import { seleccionarReceta } from "./api.js"
import { uiCloseRecipeModal } from "./ui.js"
export { launchDetaillModal }

function launchDetaillModal() {
    document.addEventListener("click", function (e) {
        if (e.target.classList.contains("recipe-card__button") || e.target.classList.contains("recipe-card__img")) {
            let id = e.target.closest(".recipe-card__info").dataset.id
            let time = e.target.closest(".recipe-card__info").dataset.time
            seleccionarReceta(id, time)
        }
        if (e.target.classList.contains("wrap-recipe-detail")) {
            uiCloseRecipeModal()
        }
        //if (e.target.nodeName === 'BODY') / e.target.tagName != 'selector' 
    })
}

