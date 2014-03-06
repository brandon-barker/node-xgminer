/*!
 * (x)gminer
 * Copyright(c) 2014 Brandon Barker <https://github.com/brandon-barker>
 * GPL v2 Licensed
 */

/**
 * Module dependencies.
 */

var _ = require('lodash'),
  net = require('net'),
  Q = require('q'),
  util = require('./util');

/**
 * Create an instance of xgminer.
 *
 * @param {Name} name
 * @param {Host} host
 * @param {Port} port
 * @param {Options} options
 */

function xgminer(host, port, options) {
  this.host = host || this.defaults.host;
  this.port = port || this.defaults.port;
  this.options = this.defaults;

  if (options) {
    _.defaults(this.options, options);
  }
}

/**
 * Module defaults
 */

xgminer.prototype.defaults = {
  miner: 'cgminer',
  host: '127.0.0.1',
  port: 4028,
  interval: 5000 // Update interval 5s
};

/**
 * Module functions
 */

xgminer.prototype._version = function () {
  var deferred = Q.defer();
  var self = this;

  self.send('version', '').then(function (res) {
    deferred.resolve(res);
  }, function (err) {
    deferred.reject(err);
  });

  return deferred.promise;
}

/**
 * The base 'send' command, this is a utility function that is used to connect to the actual miner and send a command
 * @param command
 * @param parameter
 */

xgminer.prototype.send = function (command, parameter) {
  var data = '',
    self = this,
    deferred = Q.defer(),
    socket;

  try {
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
    });

    socket.on('error', function (err) {
      socket.removeAllListeners();

      // Reject the promise and pass the error back
      deferred.reject(err);
    });
  } catch (ex) {
    deferred.reject(ex);
  }

  // Return the promise immediately
  return deferred.promise;
}

/**
 * Dynamically build up functions from the commands.json file
 */

xgminer.commands = require('./config/commands');

_.forEach(xgminer.commands, function (command) {
  xgminer.prototype[command.name] = function (args) {
    return this.send.apply(this, [ command.name, args ]).then(function (result) {
      return result;
    });
  }
});

/**
 * Module exports.
 */

module.exports = xgminer;