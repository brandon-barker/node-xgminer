/*!
 * (x)gminer
 * Copyright(c) 2014 Brandon Barker <https://github.com/brandon-barker>
 * GPL v2 Licensed
 */

/**
 * Creates a generic error object which can be passed back to your app
 */

exports.createError = function (name, message, data) {
  return {
    success: false,
    name: name,
    error: message,
    data: data
  };
}