class SearchView {
  #parentEl = document.querySelector('.search');
  getQuery() {
    const query = this.#parentEl.querySelector('.search__field').value;
    this.#clearInput();
    return query;
  }
  #clearInput() {
    this.#parentEl.querySelector('.search__field').value = '';
  }
  //* Publisher-Subscriber Pattern
  addHandlerSearch(handler) {
    // click or enter key
    this.#parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}
export default new SearchView();
