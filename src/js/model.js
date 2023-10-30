import { API_URL, RESULTS_PER_PAGE, STARTER_PAGE } from './config.js';
import { getJSON } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultsPerPage: RESULTS_PER_PAGE,
    page: STARTER_PAGE,
  },
};

export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}${id}`);
    const { recipe } = data.data;
    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };
    console.log(state.recipe);
  } catch (err) {
    //temp error handling
    console.error(`${err} 🧨🧨🧨`);
    throw err; //controllerda yakalamak için fırlatıyoruz, viewdeki renderError() metoduyla buradaki hata arasında controller köprü olacak
  }
};
//! Implementing Search Results
export const loadSearchResults = async function (query) {
  try {
    state.search.query = query; //daha sonra aramaları analiz etmede kullanılacak
    const data = await getJSON(`${API_URL}?search=${query}`);
    console.log(data);

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
      };
    });
  } catch (err) {
    console.error(`${err} 🧨🧨🧨`);
    throw err;
  }
};
//! PAGINATION
export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page; // sayfa güncelleme - updating current page into state
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
};

//! UPDATING RECIPE SERVINGS
export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    // newQt=oldQt*newServings/oldServings
  });
  state.recipe.servings = newServings;
};
