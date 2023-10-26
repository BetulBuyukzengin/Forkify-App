import * as model from './model.js';
import recipeView from './views/recipeView.js';
import 'core-js/stable'; // polyfilling for everything except await/async
import 'regenerator-runtime/runtime'; // pollyfilling async/await

// https://forkify-api.herokuapp.com/v2
///////////////////////////////////////
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
   //console.log(id);

    if (!id) return;
    recipeView.renderSpinner();

    // 1)Loading recipe
    await model.loadRecipe(id);
    //const { recipe } = model.state;
    //const recipe=model.state.recipe;

    //2) Rendering recipe
    recipeView.render(model.state.recipe);
    //or const recipeView=new recipeView(model.state.recipe)
  } catch (err) {
    console.log(err);
    //console.error(err) ? mi olmalı
  }
};
['hashchange', 'load'].forEach(ev => window.addEventListener(ev, controlRecipes));
/* window.addEventListener('hashchange',controlRecipes)
window.addEventListener('load',controlRecipes) */
