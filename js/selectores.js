export {selectCategorias, maincategories, mainrecipes, wrapResults, results, resultHeading, wrapRecipeDetail, recipeDetails, wrapFavorites, btnSearch, recipeTimes}

const selectCategorias = document.querySelector("#category")
const maincategories = document.querySelector("#main-categories")
const mainrecipes = document.querySelector("#main-recipes")
const wrapResults = document.querySelector("#wrap-results")
const results = document.querySelector("#results")
const resultHeading = document.querySelector("#results-heading")

const wrapRecipeDetail = document.querySelector("#wrap-recipe-detail")
const recipeDetails = document.querySelector("#recipe-detail")
const wrapFavorites = document.querySelector("#wrap-favorites")
const btnSearch = document.querySelector("#btn-search")
let recipeTimes = [30, 40, 45]
let readingFromStorage = false