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
  bookmarks: [],
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
    //? kaydedilen recipe tekrar tıklandığında kayıtlı halini koruyacak
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
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
    state.search.page = STARTER_PAGE; //arama yapıldıgında her gelen sonuç 1 den başlar
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

//! localStorage setItem
const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};
//! UPDATING RECIPE SERVINGS
export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    // newQt=oldQt*newServings/oldServings
  });
  state.recipe.servings = newServings;
};

//! IMPLEMENTING BOOKMARKS
export const addBookmark = function (recipe) {
  //* add bookmark
  state.bookmarks.push(recipe);

  //* mark current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmarks();
};

export const deleteBookmark = function (id) {
  //* Delete bookmark
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  //* Mark current recipe as not bookmark
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmarks();
};

//! localStorage getItem
const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage); //stringi nesneye dönüştürür
};
init();

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
//clearBookmarks();
