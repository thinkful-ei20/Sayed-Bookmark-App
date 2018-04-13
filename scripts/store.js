'use strict';
/*global */

const store = (function() {
  
  const addBookmark = function(item) {
    this.bookmarks.push(item);
  };

  const findById = function(id) {
    return this.bookmarks.find(item => item.id === id);
  };

  const findAndDelete = function(id) {
    this.bookmarks = this.bookmarks.filter( item => item.id !== id );
  };

  const filterByRating = function(num) {
    return this.bookmarks.filter(item => item.rating >= num)
  };

  const setError = function(e) {
    this.error = e.responseText;
  }


  return {
    bookmarks: [],
    filterRating: null,
    error: null,

    addBookmark,
    findById,
    findAndDelete,
    filterByRating,
    setError,
    
  };
}());