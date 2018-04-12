'use strict';
/*global bookmarkList, store */

$(document).ready(function() {
  bookmarkList.bindEventListeners();
  api.getBookmarks((items) => {
    items.forEach((item) => store.addBookmark(item));
    bookmarkList.render();
  });
}());