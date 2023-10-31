import icons from 'url:../../img/icons.svg';

//Alt view sınıfların üst sınıfı
export default class View {
  _data;
  render(data) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const markup = this._generateMarkup();
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  //! developing a dom updating algorithm:  Böylece porsiyon güncellendikçe sayfa yeniden yüklenmeyecek sadece değişen değerler
  update(data) {
    /*  if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError(); */

    this._data = data;
    const newMarkup = this._generateMarkup();

    const newDom = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDom.querySelectorAll('*')); // NODE LIST olduğu için array a çevir
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    //* ilk ve güncel hallerini karşılaştıralım
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      console.log(curEl, newEl.isEqualNode(curEl));
      // Updates changed TEXT
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        //firstChild her zaman olamayacağından isteğe bağlı zincirleme eklendi
        console.log(newEl.firstChild?.nodeValue.trim());
        curEl.textContent = newEl.textContent;
      }

      // Updates changed ATTRIBUES
      if (!newEl.isEqualNode(curEl));
      Array.from(newEl.attributes).forEach(attr =>
        curEl.setAttribute(attr.name, attr.value)
      );
    });
  }
  _clear() {
    this._parentElement.innerHTML = '';
  }
  renderSpinner() {
    const markup = `
            <div class="spinner">
              <svg>
                 <use href="${icons}#icon-loader"></use>
              </svg>
            </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
        <div>
           <svg>
               <use href="${icons}#icon-alert-triangle"></use>
           </svg>
         </div>
         <p>${message}</p>
      </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  renderMessage(message = this._message) {
    const markup = `
      <div class="error">
        <div>
           <svg>
               <use href="${icons}#icon-smile"></use>
           </svg>
         </div>
         <p>${message}</p>
      </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}