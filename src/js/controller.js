import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable'; // polyfilling for everything except await/async
import 'regenerator-runtime/runtime'; // pollyfilling async/await
import { async } from 'regenerator-runtime';

const controlRecipes = async function () {
  try {
    // find hash
    const id = window.location.hash.slice(1);
    //console.log(id);

    if (!id) return;
    // show spinner
    recipeView.renderSpinner();

    //0 ) Update results view  to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    //1 ) updating bookmarks view
    bookmarksView.update(model.state.bookmarks);

    //2 )Loading recipe
    await model.loadRecipe(id);
    //const { recipe } = model.state;
    //const recipe=model.state.recipe;

    //3 ) Rendering recipe
    recipeView.render(model.state.recipe);
    //or const recipeView=new recipeView(model.state.recipe)
  } catch (err) {
    recipeView.renderError();
  }
};
//! Implementing search results
const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    //1-get search query
    const query = searchView.getQuery();
    if (!query) return;

    //2-load search results  -  herhangi bir şey döndürmediğinden değişekende saklamaya gerek yok
    await model.loadSearchResults(query);
    //3-render results
    //  resultsView.render(model.state.search.results) ->tüm sonuçları getirir
    resultsView.render(model.getSearchResultsPage());

    //4-render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};
const controlPagination = function (goToPage) {
  //3-render new results
  resultsView.render(model.getSearchResultsPage(goToPage));

  //4-render initial pagination buttons
  paginationView.render(model.state.search);
  // console.log(goToPage);
};

//! Updating Recipe Servings
const controlServings = function (newServings) {
  //update the recipe servings (in state)
  model.updateServings(newServings);

  //update the recipe view
  //recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

//! Implementing Bookmarks
const controlAddBookmark = function () {
  // 1)Add
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  //Delete
  else model.deleteBookmark(model.state.recipe.id);

  // 2)update
  recipeView.update(model.state.recipe);

  //3)render bookmarks
  bookmarksView.render(model.state.bookmarks);
};
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};
//! yeni recipe ekleme kontrolü
const controlAddRecipe = async function (newRecipe) {
  //console.log(newRecipe);
  try {
    //* show loading spinner
    addRecipeView.renderSpinner();

    //* upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //* Render recipe
    recipeView.render(model.state.recipe);

    //* Success message
    addRecipeView.renderMessage();

    //* render bookmark view
    bookmarksView.render(model.state.bookmarks);

    //* change ID in URL without reload the page
    window.history.pushState(null, '', `#${model.state.recipe.id}`); //2.başlık,3. url
    //window.history.back();bir önceki sayfayı getirir
    //* close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    //* uploadRecipe da fırlatılan hatayı yakalamak için try-catch
    console.error('🧨🧨', err);
    addRecipeView.renderError(err.message);
  }
};
//*Controllerdaki bir işlevi view de çağıramayız bu sebeple publisher-subscriber pattern kullanıldı
//SUBSCRIBER: code that wants to react
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView._addHandlerUpload(controlAddRecipe);
};
init();
