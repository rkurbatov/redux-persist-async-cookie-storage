'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CookieStorage = undefined;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _setImmediate2 = require('babel-runtime/core-js/set-immediate');

var _setImmediate3 = _interopRequireDefault(_setImmediate2);

var _cookiesJs = require('cookies-js');

var _cookiesJs2 = _interopRequireDefault(_cookiesJs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var genericSetImmediate = typeof _setImmediate3.default === 'undefined' ? global.setImmediate : _setImmediate3.default;
var nextTick = process && process.nextTick ? process.nextTick : genericSetImmediate;

var CookieStorage = exports.CookieStorage = function () {
  function CookieStorage() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, CookieStorage);

    this.keyPrefix = options.keyPrefix || '';
    this.indexKey = options.indexKey || 'reduxPersistIndex';
    this.cookiesLib = typeof window === 'undefined' ? new FakeCookies(options.cookies) : _cookiesJs2.default;
  }

  (0, _createClass3.default)(CookieStorage, [{
    key: 'getAllKeys',
    value: function getAllKeys(cb) {
      var _this = this;

      return new _promise2.default(function (resolve, reject) {
        try {
          (function () {
            var cookie = _this.cookiesLib.get(_this.indexKey);
            var result = cookie ? JSON.parse(cookie) : [];
            nextTick(function () {
              cb && cb(null, result);
              resolve(result);
            });
          })();
        } catch (err) {
          cb && cb(err);
          reject(err);
        }
      });
    }
  }, {
    key: 'getItem',
    value: function getItem(key, cb) {
      var _this2 = this;

      return new _promise2.default(function (resolve, reject) {
        try {
          (function () {
            var value = _this2.cookiesLib.get(_this2.keyPrefix + key);
            nextTick(function () {
              cb && cb(null, value);
              resolve(value);
            });
          })();
        } catch (err) {
          cb && cb(err);
          reject(err);
        }
      });
    }
  }, {
    key: 'setItem',
    value: function setItem(key, value, cb) {
      var _this3 = this;

      return new _promise2.default(function () {
        var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
          var keys;
          return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.prev = 0;

                  _this3.cookiesLib.set(_this3.keyPrefix + key, value);
                  _context.next = 4;
                  return _this3.getAllKeys();

                case 4:
                  keys = _context.sent;

                  if (!keys.includes(key)) {
                    keys.push(key);
                    _this3.cookiesLib.set(_this3.indexKey, (0, _stringify2.default)(keys));
                  }
                  nextTick(function () {
                    cb && cb(null);
                    resolve();
                  });
                  _context.next = 13;
                  break;

                case 9:
                  _context.prev = 9;
                  _context.t0 = _context['catch'](0);

                  cb && cb(_context.t0);
                  reject(_context.t0);

                case 13:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, _this3, [[0, 9]]);
        }));

        return function (_x2, _x3) {
          return _ref.apply(this, arguments);
        };
      }());
    }
  }, {
    key: 'removeItem',
    value: function removeItem(key, cb) {
      var _this4 = this;

      return new _promise2.default(function () {
        var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(resolve, reject) {
          var keys;
          return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  _context2.prev = 0;

                  _this4.cookiesLib.expire(_this4.keyPrefix + key);
                  _context2.next = 4;
                  return _this4.getAllKeys();

                case 4:
                  keys = _context2.sent;

                  keys = keys.filter(function (k) {
                    return k !== key;
                  });
                  _this4.cookiesLib.set(_this4.indexKey, (0, _stringify2.default)(keys));
                  nextTick(function () {
                    cb && cb(null);
                    resolve();
                  });
                  _context2.next = 14;
                  break;

                case 10:
                  _context2.prev = 10;
                  _context2.t0 = _context2['catch'](0);

                  cb && cb(_context2.t0);
                  reject(_context2.t0);

                case 14:
                case 'end':
                  return _context2.stop();
              }
            }
          }, _callee2, _this4, [[0, 10]]);
        }));

        return function (_x4, _x5) {
          return _ref2.apply(this, arguments);
        };
      }());
    }
  }]);
  return CookieStorage;
}();

var FakeCookies = function () {
  function FakeCookies() {
    var cookies = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, FakeCookies);

    var parsed = {};
    (0, _keys2.default)(cookies).forEach(function (key) {
      parsed[decodeURIComponent(key)] = cookies[key];
    });
    this.cookies = parsed;
  }

  (0, _createClass3.default)(FakeCookies, [{
    key: 'get',
    value: function get(key) {
      return this.cookies[key];
    }
  }, {
    key: 'set',
    value: function set(key, value) {
      this.cookies[key] = value;
    }
  }, {
    key: 'expire',
    value: function expire(key) {
      delete this.cookies[key];
    }
  }]);
  return FakeCookies;
}();