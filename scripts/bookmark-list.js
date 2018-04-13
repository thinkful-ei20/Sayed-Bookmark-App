'use strict';
/*global store, api*/

const bookmarkList = (function() {

  function generateBookmarkElement(item) {
    return `
      <li class="js-bookmark-element" data-item-id="${item.id}">
        <div class="bookmark-title">
          <h2 class="title-name">${item.title}</h2>
          <div class="bookmark-rating">
            <span class="stars fa fa-star"> ${item.rating} </span>
          </div>
        </div>
        <div class="bookmark-buttons">
          <button class="js-bookmark-delete btn">Delete Bookmark</button>
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
      currEl.html(`
        <form id="bookmark-form">
          <div class="bookmark-title-input">
            <label for="bookmarkTitle" class="entry-label">Title:</label>
            <input type="text" id="bookmarkTitle" name="bookmark-title" class="js-bookmark-title form-input" placeholder="Title:" required>
          </div>  
          <div class="bookmark-url-input>  
            <label for="bookmarkUrl" class="entry-label">Url:</label>
            <input type="url" id="bookmarkUrl" name="bookmark-url" class="js-bookmark-url form-input" placeholder="Url:" required>
          </div>
          <div>
            <label for="starRating" class="entry-label">Rate:</label>
              <select name="star-rating" id="starRating" class="star-rating form-input">
                <option value ="1">1 star</option>
                <option value ="2">2 stars</option>
                <option value ="3">3 stars</option>
                <option value ="4">4 stars</option>
                <option value ="5">5 stars</option>
              </select>
          </div>
          <div>
            <label for="bookmarkDescription" class="entry-label">Description:</label>
              <textarea id="bookmarkDescription" name="bookmark-description" class="js-bookmark-description form-input" cols="40" rows="3" placeholder="Add a description..."></textarea>
          </div>
          <button type="submit" class="add-bookmark form-btn">Submit</button>
        </form>
        <button class="cancel-bookmark form-btn">cancel</button>
      `);
    });
  }

  function handleCancelNewBookmark() {
    $('.add-element').on('click', '.cancel-bookmark', event => {
      const currEl = $(event.currentTarget).parent();
      currEl.html(`
      <button class="add-button top-click btn">
        <span>Add Bookmark</span>
      </button>
      <select name="star-rating" class="js-star-rating top-click">
        <option value="0">Rating</option>
        <option value="5">5 stars</option>
        <option value="4">4 stars and up</option>
        <option value="3">3 stars and up</option>
        <option value="2">2 stars and up</option>
      </select>
      `);
    });
  }

  function handleSubmitNewBookmark() {
    $('.add-element').on('submit', event => {
      event.preventDefault();

      const itemTitle = $('.js-bookmark-title').val();
      const itemUrl = $('.js-bookmark-url').val();
      const itemDesc = $('.js-bookmark-description').val();
      const itemRating = $('.star-rating').val();
      const currEl = $(event.currentTarget).parent().children('.add-element');

      api.createBookmark(itemTitle, itemUrl, itemDesc, itemRating,
        (newItem) => {
          store.addBookmark(newItem);
          render();
        },
        (error) => {
          store.setError(error);
          render();
        });

      currEl.html(`
        <button class="add-button top-click btn">
          <span>Add Bookmark</span>
        </button>
        <select name="star-rating" class="js-star-rating top-click">
          <option value="0">Rating</option>
          <option value="5">5 stars</option>
          <option value="4">4 stars and up</option>
          <option value="3">3 stars and up</option>
          <option value="2">2 stars and up</option>
        </select>
      `);
    });
  }

  function handleStarRatingChanged() {
    $('.add-element').on('change', '.js-star-rating', event => {
      const ratingValueString = $('.js-star-rating').val();
      const ratingValueNumber = parseInt(ratingValueString);
      const filteredObjs = store.filterByRating(ratingValueNumber);

      if (ratingValueNumber === 0) {
        const bookmarksString = generateBookmarksString(store.bookmarks);
        $('.js-bookmark-list').html(bookmarksString);
      } else {
        const bookmarksString = generateBookmarksString(filteredObjs);
        $('.js-bookmark-list').html(bookmarksString);
      }
    });
  }

  function handleListElementClicked() {
    $('.js-bookmark-list').on('click', '.bookmark-title', event => {
      const id = getItemIdFromElement(event.currentTarget);
      const currEl = $(event.currentTarget).parents('li');
      const thisObj = store.findById(id);

      if (!$(event.currentTarget).parents('li').hasClass('detailed')) {
        
        $(event.currentTarget).parents('li').addClass('detailed');
        
        currEl.html(`
            <div class="bookmark-title">
              <h2 class="title-name">${thisObj.title}</h2>
              <div class="bookmark-rating">
                <span class="stars fa fa-star"> ${thisObj.rating} </span>
              </div>
            </div>
            <div class="bookmark-desc">
              <p>${thisObj.desc}</p>
            </div>
            <div class="bookmark-buttons">
              <button class="js-bookmark-link btn">Visit Link</button>
              <button class="js-bookmark-delete btn">Delete Bookmark</button>
            </div>
        `);
      } else {
        
        $(event.currentTarget).parents('li').removeClass('detailed');
        
        currEl.html(`

          <div class="bookmark-title">
            <h2 class="title-name">${thisObj.title}</h2>
            <div class="bookmark-rating">
            <span class="stars fa fa-star"> ${thisObj.rating} </span>
            </div>
          </div>
          <div class="bookmark-buttons">
            <button class="js-bookmark-delete btn">Delete Bookmark</button>
          </div>

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
        (error) => {
          store.setError(error);
          render();
        });
    });
  }

  function handleErrorButtonClicked() {
    $('.container').on('click', '.error-button', event => {
      console.log('hello')
      $('.error-box').html('')
    });
  }

  function render() {
    const bookmarks = store.bookmarks;
    const bookmarksString = generateBookmarksString(bookmarks);
    $('.js-bookmark-list').html(bookmarksString);
    if (store.error) {
      $('.error-box').html(`
        <span class="error-message">${store.error}</span>
        <button class="error-button">
          <i class="fa fa-close"></i>
        </button>`);
      store.error = null;
    } 
  }

  function bindEventListeners() {
    handleAddButtonClicked();
    handleSubmitNewBookmark();
    handleDeleteButtonClicked();
    handleVisitLinkButtonClicked();
    handleListElementClicked();
    handleCancelNewBookmark();
    handleStarRatingChanged();
    handleErrorButtonClicked();
  }

  return {
    bindEventListeners,
    render,
  };
}());