'use strict';
/*global */

const api = (function () {
  const BASE_URL = 'https://thinkful-list-api.herokuapp.com/sayed';
  const getBookmarks = function(callback) {
    $.getJSON(`${BASE_URL}/bookmarks`, callback);
  };

  const createBookmark = function(title, url, desc, rating, success, error) {
    $.ajax({
      url: `${BASE_URL}/bookmarks`,
      method: 'POST',
      contentType:'application/json',
      data: JSON.stringify({
        title,
        url,
        desc,
        rating,
      }),
      success,
      error,
    });
  };

  const deleteBookmark = function(id, success, error) {
    $.ajax({
      url: `${BASE_URL}/bookmarks/${id}`,
      method: 'DELETE',
      success,
      error,
    });
  };

  return {
    getBookmarks,
    createBookmark,
    deleteBookmark,
  };
}());