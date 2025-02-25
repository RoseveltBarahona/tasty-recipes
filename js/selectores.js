export {selectCategories, mainCategories, mainRecipes, wrapResults, results, resultHeading, wrapRecipeDetail, recipeDetails, wrapFavorites, btnSearch, containerMenu, burgerMenu, menu,recipeTimes}

const selectCategories = document.querySelector("#category")
const mainCategories = document.querySelector("#main-categories")
const mainRecipes = document.querySelector("#main-recipes")
const wrapResults = document.querySelector("#wrap-results")
const results = document.querySelector("#results")
const resultHeading = document.querySelector("#results-heading")

const wrapRecipeDetail = document.querySelector("#wrap-recipe-detail")
const recipeDetails = document.querySelector("#recipe-detail")
const wrapFavorites = document.querySelector("#wrap-favorites")
const btnSearch = document.querySelector("#btn-search")

const containerMenu = document.querySelector("#container-menu")
const burgerMenu = document.querySelector("#burger-menu")
const menu = document.querySelector("#menu")


let recipeTimes = [30, 40, 45]
let readingFromStorage = false