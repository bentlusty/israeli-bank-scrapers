"use strict";

require("core-js/modules/es.promise");

require("core-js/modules/es.string.trim");

var _unionBank = _interopRequireDefault(require("./union-bank"));

var _testsUtils = require("../tests/tests-utils");

var _definitions = require("../definitions");

var _baseScraperWithBrowser = require("./base-scraper-with-browser");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const COMPANY_ID = 'union'; // TODO this property should be hard-coded in the provider

const testsConfig = (0, _testsUtils.getTestsConfig)();
describe('Union', () => {
  beforeAll(() => {
    (0, _testsUtils.extendAsyncTimeout)(); // The default timeout is 5 seconds per async test, this function extends the timeout value
  });
  test('should expose login fields in scrapers constant', () => {
    expect(_definitions.SCRAPERS.union).toBeDefined();
    expect(_definitions.SCRAPERS.union.loginFields).toContain('username');
    expect(_definitions.SCRAPERS.union.loginFields).toContain('password');
  });
  (0, _testsUtils.maybeTestCompanyAPI)(COMPANY_ID, config => config.companyAPI.invalidPassword)('should fail on invalid user/password"', async () => {
    const options = _objectSpread({}, testsConfig.options, {
      companyId: COMPANY_ID
    });

    const scraper = new _unionBank.default(options);
    const result = await scraper.scrape({
      username: 'e10s12',
      password: '3f3ss3d'
    });
    expect(result).toBeDefined();
    expect(result.success).toBeFalsy();
    expect(result.errorType).toBe(_baseScraperWithBrowser.LoginResults.InvalidPassword);
  });
  (0, _testsUtils.maybeTestCompanyAPI)(COMPANY_ID)('should scrape transactions"', async () => {
    const options = _objectSpread({}, testsConfig.options, {
      companyId: COMPANY_ID
    });

    const scraper = new _unionBank.default(options);
    const result = await scraper.scrape(testsConfig.credentials.union);
    expect(result).toBeDefined();
    const error = `${result.errorType || ''} ${result.errorMessage || ''}`.trim();
    expect(error).toBe('');
    expect(result.success).toBeTruthy();
    (0, _testsUtils.exportTransactions)(COMPANY_ID, result.accounts || []);
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zY3JhcGVycy91bmlvbi1iYW5rLnRlc3QudHMiXSwibmFtZXMiOlsiQ09NUEFOWV9JRCIsInRlc3RzQ29uZmlnIiwiZGVzY3JpYmUiLCJiZWZvcmVBbGwiLCJ0ZXN0IiwiZXhwZWN0IiwiU0NSQVBFUlMiLCJ1bmlvbiIsInRvQmVEZWZpbmVkIiwibG9naW5GaWVsZHMiLCJ0b0NvbnRhaW4iLCJjb25maWciLCJjb21wYW55QVBJIiwiaW52YWxpZFBhc3N3b3JkIiwib3B0aW9ucyIsImNvbXBhbnlJZCIsInNjcmFwZXIiLCJVbmlvbkJhbmtTY3JhcGVyIiwicmVzdWx0Iiwic2NyYXBlIiwidXNlcm5hbWUiLCJwYXNzd29yZCIsInN1Y2Nlc3MiLCJ0b0JlRmFsc3kiLCJlcnJvclR5cGUiLCJ0b0JlIiwiTG9naW5SZXN1bHRzIiwiSW52YWxpZFBhc3N3b3JkIiwiY3JlZGVudGlhbHMiLCJlcnJvciIsImVycm9yTWVzc2FnZSIsInRyaW0iLCJ0b0JlVHJ1dGh5IiwiYWNjb3VudHMiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOztBQUNBOztBQUdBOztBQUNBOzs7Ozs7Ozs7O0FBRUEsTUFBTUEsVUFBVSxHQUFHLE9BQW5CLEMsQ0FBNEI7O0FBQzVCLE1BQU1DLFdBQVcsR0FBRyxpQ0FBcEI7QUFFQUMsUUFBUSxDQUFDLE9BQUQsRUFBVSxNQUFNO0FBQ3RCQyxFQUFBQSxTQUFTLENBQUMsTUFBTTtBQUNkLDBDQURjLENBQ1E7QUFDdkIsR0FGUSxDQUFUO0FBSUFDLEVBQUFBLElBQUksQ0FBQyxpREFBRCxFQUFvRCxNQUFNO0FBQzVEQyxJQUFBQSxNQUFNLENBQUNDLHNCQUFTQyxLQUFWLENBQU4sQ0FBdUJDLFdBQXZCO0FBQ0FILElBQUFBLE1BQU0sQ0FBQ0Msc0JBQVNDLEtBQVQsQ0FBZUUsV0FBaEIsQ0FBTixDQUFtQ0MsU0FBbkMsQ0FBNkMsVUFBN0M7QUFDQUwsSUFBQUEsTUFBTSxDQUFDQyxzQkFBU0MsS0FBVCxDQUFlRSxXQUFoQixDQUFOLENBQW1DQyxTQUFuQyxDQUE2QyxVQUE3QztBQUNELEdBSkcsQ0FBSjtBQU1BLHVDQUFvQlYsVUFBcEIsRUFBaUNXLE1BQUQsSUFBWUEsTUFBTSxDQUFDQyxVQUFQLENBQWtCQyxlQUE5RCxFQUErRSx1Q0FBL0UsRUFBd0gsWUFBWTtBQUNsSSxVQUFNQyxPQUFPLHFCQUNSYixXQUFXLENBQUNhLE9BREo7QUFFWEMsTUFBQUEsU0FBUyxFQUFFZjtBQUZBLE1BQWI7O0FBS0EsVUFBTWdCLE9BQU8sR0FBRyxJQUFJQyxrQkFBSixDQUFxQkgsT0FBckIsQ0FBaEI7QUFFQSxVQUFNSSxNQUFNLEdBQUcsTUFBTUYsT0FBTyxDQUFDRyxNQUFSLENBQWU7QUFBRUMsTUFBQUEsUUFBUSxFQUFFLFFBQVo7QUFBc0JDLE1BQUFBLFFBQVEsRUFBRTtBQUFoQyxLQUFmLENBQXJCO0FBRUFoQixJQUFBQSxNQUFNLENBQUNhLE1BQUQsQ0FBTixDQUFlVixXQUFmO0FBQ0FILElBQUFBLE1BQU0sQ0FBQ2EsTUFBTSxDQUFDSSxPQUFSLENBQU4sQ0FBdUJDLFNBQXZCO0FBQ0FsQixJQUFBQSxNQUFNLENBQUNhLE1BQU0sQ0FBQ00sU0FBUixDQUFOLENBQXlCQyxJQUF6QixDQUE4QkMscUNBQWFDLGVBQTNDO0FBQ0QsR0FiRDtBQWVBLHVDQUFvQjNCLFVBQXBCLEVBQWdDLDZCQUFoQyxFQUErRCxZQUFZO0FBQ3pFLFVBQU1jLE9BQU8scUJBQ1JiLFdBQVcsQ0FBQ2EsT0FESjtBQUVYQyxNQUFBQSxTQUFTLEVBQUVmO0FBRkEsTUFBYjs7QUFLQSxVQUFNZ0IsT0FBTyxHQUFHLElBQUlDLGtCQUFKLENBQXFCSCxPQUFyQixDQUFoQjtBQUNBLFVBQU1JLE1BQU0sR0FBRyxNQUFNRixPQUFPLENBQUNHLE1BQVIsQ0FBZWxCLFdBQVcsQ0FBQzJCLFdBQVosQ0FBd0JyQixLQUF2QyxDQUFyQjtBQUNBRixJQUFBQSxNQUFNLENBQUNhLE1BQUQsQ0FBTixDQUFlVixXQUFmO0FBQ0EsVUFBTXFCLEtBQUssR0FBSSxHQUFFWCxNQUFNLENBQUNNLFNBQVAsSUFBb0IsRUFBRyxJQUFHTixNQUFNLENBQUNZLFlBQVAsSUFBdUIsRUFBRyxFQUF2RCxDQUF5REMsSUFBekQsRUFBZDtBQUNBMUIsSUFBQUEsTUFBTSxDQUFDd0IsS0FBRCxDQUFOLENBQWNKLElBQWQsQ0FBbUIsRUFBbkI7QUFDQXBCLElBQUFBLE1BQU0sQ0FBQ2EsTUFBTSxDQUFDSSxPQUFSLENBQU4sQ0FBdUJVLFVBQXZCO0FBRUEsd0NBQW1CaEMsVUFBbkIsRUFBK0JrQixNQUFNLENBQUNlLFFBQVAsSUFBbUIsRUFBbEQ7QUFDRCxHQWREO0FBZUQsQ0F6Q08sQ0FBUiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBVbmlvbkJhbmtTY3JhcGVyIGZyb20gJy4vdW5pb24tYmFuayc7XG5pbXBvcnQge1xuICBtYXliZVRlc3RDb21wYW55QVBJLCBleHRlbmRBc3luY1RpbWVvdXQsIGdldFRlc3RzQ29uZmlnLCBleHBvcnRUcmFuc2FjdGlvbnMsXG59IGZyb20gJy4uL3Rlc3RzL3Rlc3RzLXV0aWxzJztcbmltcG9ydCB7IFNDUkFQRVJTIH0gZnJvbSAnLi4vZGVmaW5pdGlvbnMnO1xuaW1wb3J0IHsgTG9naW5SZXN1bHRzIH0gZnJvbSAnLi9iYXNlLXNjcmFwZXItd2l0aC1icm93c2VyJztcblxuY29uc3QgQ09NUEFOWV9JRCA9ICd1bmlvbic7IC8vIFRPRE8gdGhpcyBwcm9wZXJ0eSBzaG91bGQgYmUgaGFyZC1jb2RlZCBpbiB0aGUgcHJvdmlkZXJcbmNvbnN0IHRlc3RzQ29uZmlnID0gZ2V0VGVzdHNDb25maWcoKTtcblxuZGVzY3JpYmUoJ1VuaW9uJywgKCkgPT4ge1xuICBiZWZvcmVBbGwoKCkgPT4ge1xuICAgIGV4dGVuZEFzeW5jVGltZW91dCgpOyAvLyBUaGUgZGVmYXVsdCB0aW1lb3V0IGlzIDUgc2Vjb25kcyBwZXIgYXN5bmMgdGVzdCwgdGhpcyBmdW5jdGlvbiBleHRlbmRzIHRoZSB0aW1lb3V0IHZhbHVlXG4gIH0pO1xuXG4gIHRlc3QoJ3Nob3VsZCBleHBvc2UgbG9naW4gZmllbGRzIGluIHNjcmFwZXJzIGNvbnN0YW50JywgKCkgPT4ge1xuICAgIGV4cGVjdChTQ1JBUEVSUy51bmlvbikudG9CZURlZmluZWQoKTtcbiAgICBleHBlY3QoU0NSQVBFUlMudW5pb24ubG9naW5GaWVsZHMpLnRvQ29udGFpbigndXNlcm5hbWUnKTtcbiAgICBleHBlY3QoU0NSQVBFUlMudW5pb24ubG9naW5GaWVsZHMpLnRvQ29udGFpbigncGFzc3dvcmQnKTtcbiAgfSk7XG5cbiAgbWF5YmVUZXN0Q29tcGFueUFQSShDT01QQU5ZX0lELCAoY29uZmlnKSA9PiBjb25maWcuY29tcGFueUFQSS5pbnZhbGlkUGFzc3dvcmQpKCdzaG91bGQgZmFpbCBvbiBpbnZhbGlkIHVzZXIvcGFzc3dvcmRcIicsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgLi4udGVzdHNDb25maWcub3B0aW9ucyxcbiAgICAgIGNvbXBhbnlJZDogQ09NUEFOWV9JRCxcbiAgICB9O1xuXG4gICAgY29uc3Qgc2NyYXBlciA9IG5ldyBVbmlvbkJhbmtTY3JhcGVyKG9wdGlvbnMpO1xuXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgc2NyYXBlci5zY3JhcGUoeyB1c2VybmFtZTogJ2UxMHMxMicsIHBhc3N3b3JkOiAnM2Yzc3MzZCcgfSk7XG5cbiAgICBleHBlY3QocmVzdWx0KS50b0JlRGVmaW5lZCgpO1xuICAgIGV4cGVjdChyZXN1bHQuc3VjY2VzcykudG9CZUZhbHN5KCk7XG4gICAgZXhwZWN0KHJlc3VsdC5lcnJvclR5cGUpLnRvQmUoTG9naW5SZXN1bHRzLkludmFsaWRQYXNzd29yZCk7XG4gIH0pO1xuXG4gIG1heWJlVGVzdENvbXBhbnlBUEkoQ09NUEFOWV9JRCkoJ3Nob3VsZCBzY3JhcGUgdHJhbnNhY3Rpb25zXCInLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgIC4uLnRlc3RzQ29uZmlnLm9wdGlvbnMsXG4gICAgICBjb21wYW55SWQ6IENPTVBBTllfSUQsXG4gICAgfTtcblxuICAgIGNvbnN0IHNjcmFwZXIgPSBuZXcgVW5pb25CYW5rU2NyYXBlcihvcHRpb25zKTtcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBzY3JhcGVyLnNjcmFwZSh0ZXN0c0NvbmZpZy5jcmVkZW50aWFscy51bmlvbik7XG4gICAgZXhwZWN0KHJlc3VsdCkudG9CZURlZmluZWQoKTtcbiAgICBjb25zdCBlcnJvciA9IGAke3Jlc3VsdC5lcnJvclR5cGUgfHwgJyd9ICR7cmVzdWx0LmVycm9yTWVzc2FnZSB8fCAnJ31gLnRyaW0oKTtcbiAgICBleHBlY3QoZXJyb3IpLnRvQmUoJycpO1xuICAgIGV4cGVjdChyZXN1bHQuc3VjY2VzcykudG9CZVRydXRoeSgpO1xuXG4gICAgZXhwb3J0VHJhbnNhY3Rpb25zKENPTVBBTllfSUQsIHJlc3VsdC5hY2NvdW50cyB8fCBbXSk7XG4gIH0pO1xufSk7XG4iXX0=