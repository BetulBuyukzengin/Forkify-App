import * as model from './model.js';
import recipeView from './views/recipeView.js';
import 'core-js/stable'; // polyfilling for everything except await/async
import 'regenerator-runtime/runtime'; // pollyfilling async/await
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';

const controlRecipes = async function () {
  try {
    // find hash
    const id = window.location.hash.slice(1);
    console.log(id);

    if (!id) return;
    // show spinner
    recipeView.renderSpinner();

    // 0) Update results view  to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);
    // 1)Loading recipe
    await model.loadRecipe(id);
    //const { recipe } = model.state;
    //const recipe=model.state.recipe;

    //2) Rendering recipe
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
    console.log(err);
  }
};
const controlPagination = function (goToPage) {
  //3-render new results
  resultsView.render(model.getSearchResultsPage(goToPage));

  //4-render initial pagination buttons
  paginationView.render(model.state.search);
  console.log(goToPage);
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

//*Controllerdaki bir işlevi view de çağıramayız bu sebeple publisher-subscriber pattern kullanıldı
//SUBSCRIBER: code that wants to react
const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};
init();
