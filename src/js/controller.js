import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';
import { MODEL_CLOSE_SEC } from './config.js';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

async function controlRecipes() {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    recipeView.renderSpiner();
    //Update result View to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);
    // Loading Recipe
    await model.loadRecipe(id);

    //Rendering Recipe
    recipeView.render(model.state.recipe);
  } catch (error) {
    recipeView.renderError();
    console.error(error);
  }
}
async function controlSerch() {
  try {
    resultsView.renderSpiner();

    // Get Search query
    const query = searchView.getQuery();
    if (!query) return;
    // Load shearch
    await model.loadSearchResults(query);
    //Rander the result
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());
    // Render the initial pagination page
    paginationView.render(model.state.search);
    //Render bookmark view
    bookmarksView.render(model.state.bookmarks);
    //Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
  } catch (error) {
    // resultsView.renderError();
    console.log(error);
  }
}

function controlPagination(goToPage) {
  //Rander the result at 'goToPage' page
  resultsView.render(model.getSearchResultsPage(goToPage));
  // Render the initial pagination page
  paginationView.render(model.state.search);
}

function controlServings(newServings) {
  //Update the recipe servings (in state)
  model.updateServings(newServings);
  //Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
}

function controlAddBookmark() {
  // Add or Remove Bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe);

  //Update recipe view
  recipeView.update(model.state.recipe);

  // Render bookmarks
  bookmarksView.render(model.state.bookmarks);
}

function controlBookmark() {
  bookmarksView.render(model.state.bookmarks);
}

async function controlAddRecipe(newRecipe) {
  try {
    // Show Spinner
    recipeView.renderSpiner();
    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    // Render Recipe
    recipeView.render(model.state.recipe);
    //Display sucssec message
    addRecipeView.renderMessage();
    //Render bookmarks
    bookmarksView.render(model.state.bookmarks);
    //Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODEL_CLOSE_SEC * 1000);
  } catch (error) {
    addRecipeView.renderError(error);
    console.error(error);
  }
}

function init() {
  bookmarksView.addHandlerRender(controlBookmark);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSerch);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUplad(controlAddRecipe);
  console.log('Welcome!');
}

init();
