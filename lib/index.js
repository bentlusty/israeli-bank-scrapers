"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPuppeteerConfig = getPuppeteerConfig;
Object.defineProperty(exports, "createScraper", {
  enumerable: true,
  get: function () {
    return _factory.default;
  }
});
Object.defineProperty(exports, "SCRAPERS", {
  enumerable: true,
  get: function () {
    return _definitions.SCRAPERS;
  }
});
Object.defineProperty(exports, "CompanyTypes", {
  enumerable: true,
  get: function () {
    return _definitions.CompanyTypes;
  }
});
Object.defineProperty(exports, "ScraperOptions", {
  enumerable: true,
  get: function () {
    return _baseScraper.ScraperOptions;
  }
});

var _puppeteerConfig = _interopRequireDefault(require("./puppeteer-config.json"));

var _factory = _interopRequireDefault(require("./scrapers/factory"));

var _definitions = require("./definitions");

var _baseScraper = require("./scrapers/base-scraper");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function getPuppeteerConfig() {
  return _objectSpread({}, _puppeteerConfig.default);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6WyJnZXRQdXBwZXRlZXJDb25maWciLCJwdXBwZXRlZXJDb25maWciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFFQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7OztBQUVPLFNBQVNBLGtCQUFULEdBQThCO0FBQ25DLDJCQUFZQyx3QkFBWjtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHB1cHBldGVlckNvbmZpZyBmcm9tICcuL3B1cHBldGVlci1jb25maWcuanNvbic7XG5cbmV4cG9ydCB7IGRlZmF1bHQgYXMgY3JlYXRlU2NyYXBlciB9IGZyb20gJy4vc2NyYXBlcnMvZmFjdG9yeSc7XG5leHBvcnQgeyBTQ1JBUEVSUywgQ29tcGFueVR5cGVzIH0gZnJvbSAnLi9kZWZpbml0aW9ucyc7XG5leHBvcnQgeyBTY3JhcGVyT3B0aW9ucyB9IGZyb20gJy4vc2NyYXBlcnMvYmFzZS1zY3JhcGVyJztcblxuZXhwb3J0IGZ1bmN0aW9uIGdldFB1cHBldGVlckNvbmZpZygpIHtcbiAgcmV0dXJuIHsgLi4ucHVwcGV0ZWVyQ29uZmlnIH07XG59XG4iXX0=