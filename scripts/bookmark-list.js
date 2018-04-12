'use strict';
/*global store, api*/

const bookmarkList = (function() {

  function generateBookmarkElement(item) {
    return `
      <li class="js-bookmark-element" data-item-id="${item.id}">
        <div class="bookmark-title">
          <span>${item.title}</span>
          <span>${item.rating}</span>
        </div>
        <div class="bookmark-buttons">
          <button class="js-bookmark-delete">Delete Bookmark</button>
        </div>
      </li>`;
  }

  function generateBookmarksString(bookmarkList) {
    const bookmarks = bookmarkList.map((item) => generateBookmarkElement(item));
    return bookmarks.join('');
  }

  function handleAddButtonClicked() {
    $('.add-element').on('click', '.add-button', event => {
      let currEl = $(event.currentTarget).parent();
      console.log(currEl);
      currEl.html(`
        <form id="bookmark-form>
          <label for="bookmark-title" class="entry-label">Title:</label>
          <input type="text" id="bookmarkTitle" name="bookmark-title" class="js-bookmark-title" value="" placeholder="title for bookmark...">

          <label for="bookmark-url" class="entry-label">Url:</label>
          <input type="text" id="bookmarkUrl" name="bookmark-url" class="js-bookmark-url" value="" placeholder="enter a url...">

          <label for="bookmark-description" class="entry-label">Description:</label>
          <input type="text" id="bookmarkDescription" name="bookmark-description" class="js-bookmark-description" value="" placeholder="Add a description...">

          <select class="star-rating">
            <option value = '1'>1</option>
            <option value = '2'>2</option>
            <option value = '3'>3</option>
            <option value = '4'>4</option>
            <option value = '5'>5</option>
          </select>

          <button type="submit" class="add-bookmark">Submit</button>
        </form>
        <button class="cancel-bookmark">cancel</button>
      `);
    });
  }

  function handleCancelNewBookmark() {
    $('.add-element').on('click', '.cancel-bookmark', event => {
      const currEl = $(event.currentTarget).parent().children('.add-element');
      currEl.html(`
        <button class="add-button">
          <span>Add Bookmark</span>
        </button>
      `);
    })
  }

  function handleSubmitNewBookmark() {
    $('.add-element').on('submit', event => {
      event.preventDefault();
      const itemTitle = $('.js-bookmark-title').val();
      const itemUrl = $('.js-bookmark-url').val();
      const itemDesc = $('.js-bookmark-description').val();
      const itemRating = $('.star-rating').val();
      const currEl = $(event.currentTarget).parent().children('.add-element');
      console.log(itemRating)
      api.createBookmark(itemTitle, itemUrl, itemDesc, itemRating,
        (newItem) => {
          store.addBookmark(newItem);
          render();
        },
        (error) => {
          console.log(error);
        });
      currEl.html(`
        <button class="add-button">
          <span>Add Bookmark</span>
        </button>
      `);
    });
  }

  function handleListElementClicked() {
    $('.js-bookmark-list').on('click', '.js-bookmark-element', event => {
      const id = getItemIdFromElement(event.currentTarget);
      const currEl = $(event.currentTarget);
      const thisObj = store.findById(id);
      if (!$(event.currentTarget).hasClass('detailed')) {
        $(event.currentTarget).addClass('detailed');
        console.log(thisObj);
        currEl.html(`
          <li class="js-bookmark-element" data-item-id="${thisObj.id}">
            <div class="bookmark-title">
              <span>${thisObj.title}</span>
              <span>${thisObj.rating}</span>
            </div>
            <div>
              <p>${thisObj.desc}</p>
            </div>
            <div class="bookmark-buttons">
              <button class="js-bookmark-link">Visit Link</button>
              <button class="js-bookmark-delete">Delete Bookmark</button>
            </div>
          </li>
        `);
      } else {
        $(event.currentTarget).removeClass('detailed');
        currEl.html(`
          <li class="js-bookmark-element" data-item-id="${thisObj.id}">
            <div class="bookmark-title">
              <span>${thisObj.title}</span>
              <span>${thisObj.rating}</span>
            </div>
            <div class="bookmark-buttons">
              <button class="js-bookmark-delete">Delete Bookmark</button>
            </div>
          </li>
        `);
      }
    });
  }

  function getItemIdFromElement(item) {
    return $(item).closest('.js-bookmark-element').data('item-id');
  }

  function handleVisitLinkButtonClicked() {
    $('.js-bookmark-list').on('click', '.js-bookmark-link', event => {
      const itemId = getItemIdFromElement(event.currentTarget);
      const currentItem = store.bookmarks.find(item => item.id === itemId);
      window.open(currentItem.url, '_blank');
    });
  }

  function handleDeleteButtonClicked() {
    $('.js-bookmark-list').on('click', '.js-bookmark-delete', event => {
      const itemId = getItemIdFromElement(event.currentTarget);
      api.deleteBookmark(itemId, 
        () => {
          store.findAndDelete(itemId);
          render();
        }, 
        () => {});
    });
  }

  function render() {
    let bookmarks = store.bookmarks;
    const bookmarksString = generateBookmarksString(bookmarks);
    $('.js-bookmark-list').html(bookmarksString);
  }

  function bindEventListeners() {
    handleAddButtonClicked();
    handleSubmitNewBookmark();
    handleDeleteButtonClicked();
    handleVisitLinkButtonClicked();
    handleListElementClicked();
    handleCancelNewBookmark();
  }

  return {
    bindEventListeners,
    render,
  };
}());