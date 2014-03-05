/**
 * Module dependencies.
 */

var _   = require('lodash'),
    net = require('net'),
    q   = require('q');

exports.defaults = {
  miner: 'cgminer',
  host: '127.0.0.1',
  port: 4028,
  interval: 5000, // Update interval 5s
  connected: false
};

/**
 * Module exports.
 */

module.exports = xgminer;

/**
 * Create an instance of xgminer.
 *
 * @param {Name} name
 * @param {Host} host
 * @param {Port} port
 * @param {Options} options
 */

function xgminer(name, host, port, options) {
  this.name = name;
  this.host = host;
  this.port = port;
  this.options = options || this.defaults;

  if (options) {
    _.defaults(this.options, this.defaults);
  }
}

xgminer.prototype.send = function (command, parameter) {
  var data = '',
      self = this,
      deferred = q.defer(),
      socket;

  socket = net.connect({
    host: self.host || self.defaults.host,
    port: self.port || self.defaults.port
  }, function () {
    var json;

    socket.on('data', function (res) {
      data += res.toString();
    });

    socket.on('end', function () {
      socket.removeAllListeners();
      json = JSON.parse(data.replace('\x00', ''));

      // Resolve the promise and pass the JSON result back
      deferred.resolve(json);
    });

    socket.on('error', function (err) {
      socket.removeAllListeners();

      // Reject the promise and pass the error back
      deferred.reject(err);
    });

    socket.write(JSON.stringify({
      command: command,
      parameter: parameter
    }));

    // Return the promise immediately
    return deferred;
  });
}