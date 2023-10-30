// Bu sınıf sorguyu alıp tıklama eventini dinleyecek
class SearchView {
  #parentEl = document.querySelector('.search');
  //controllerdan çağıracağımız yöntem:
  getQuery() {
    const query = this.#parentEl.querySelector('.search__field').value;
    this.#clearInput();
    return query;
  }

  #clearInput() {
    this.#parentEl.querySelector('.search__field').value = '';
  }
  // Publisher-Subscriber Pattern : Kullanıcı istenilen sorguyu(query) submitlediğinde yeni form açılacak bu yüzden dinleme yapmalıyız viewde de controller kullanabilmek için
  addHandlerSearch(handler) {
    // click or enter key
    this.#parentEl.addEventListener('submit', function (e) {
      e.preventDefault(); // formun yeniden yüklenmemesi için
      handler();
    });
  }
}
export default new SearchView();
