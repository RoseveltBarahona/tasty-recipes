
import { seleccionarReceta, seleccionarCategoria } from "./api.js"
import { uiCloseRecipeModal } from "./ui.js"
import { burgerMenu, containerMenu, menu, selectCategories, btnSearch, mainCategories } from "./selectores.js"
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

document.addEventListener("click", function(e){
    //menu responsive
    if (e.target.closest( ".burger-menu")){
        burgerMenu.classList.toggle("burger-menu--open")
        containerMenu.classList.toggle("container-menu--open")
        document.body.classList.toggle("u-no-scroll")
    }
    // main recipes
    if (e.target.closest(".recipe__top")){
        let id = e.target.closest(".recipe__top").dataset.id
        let time = e.target.closest(".recipe__top").dataset.time
        seleccionarReceta(id, time)
    }
})

//shake animation btn search
if (selectCategories){
    selectCategories.addEventListener("change", function(){
        btnSearch.classList.add("animate__shake")
        setTimeout(() => {
            btnSearch.classList.remove("animate__shake")
        }, 900);
    })
}

//main category click
if (mainCategories){
    mainCategories.addEventListener("click", function(e){
        if (e.target.closest(".category")){
            let category = e.target.closest(".category").dataset.category
            seleccionarCategoria(e,category)
            //selectCategories.value = category
            //btnSearch.click()
        }
    })
}
