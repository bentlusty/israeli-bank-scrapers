"use strict";

require("core-js/modules/es.promise");

require("core-js/modules/es.string.trim");

var _beinleumi = _interopRequireDefault(require("./beinleumi"));

var _testsUtils = require("../tests/tests-utils");

var _definitions = require("../definitions");

var _baseScraperWithBrowser = require("./base-scraper-with-browser");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const COMPANY_ID = 'beinleumi'; // TODO this property should be hard-coded in the provider

const testsConfig = (0, _testsUtils.getTestsConfig)();
describe('Beinleumi', () => {
  beforeAll(() => {
    (0, _testsUtils.extendAsyncTimeout)(); // The default timeout is 5 seconds per async test, this function extends the timeout value
  });
  test('should expose login fields in scrapers constant', () => {
    expect(_definitions.SCRAPERS.beinleumi).toBeDefined();
    expect(_definitions.SCRAPERS.beinleumi.loginFields).toContain('username');
    expect(_definitions.SCRAPERS.beinleumi.loginFields).toContain('password');
  });
  (0, _testsUtils.maybeTestCompanyAPI)(COMPANY_ID, config => config.companyAPI.invalidPassword)('should fail on invalid user/password', async () => {
    const options = _objectSpread({}, testsConfig.options, {
      companyId: COMPANY_ID
    });

    const scraper = new _beinleumi.default(options);
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

    const scraper = new _beinleumi.default(options);
    const result = await scraper.scrape(testsConfig.credentials.beinleumi);
    expect(result).toBeDefined();
    const error = `${result.errorType || ''} ${result.errorMessage || ''}`.trim();
    expect(error).toBe('');
    expect(result.success).toBeTruthy();
    (0, _testsUtils.exportTransactions)(COMPANY_ID, result.accounts || []);
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zY3JhcGVycy9iZWlubGV1bWkudGVzdC50cyJdLCJuYW1lcyI6WyJDT01QQU5ZX0lEIiwidGVzdHNDb25maWciLCJkZXNjcmliZSIsImJlZm9yZUFsbCIsInRlc3QiLCJleHBlY3QiLCJTQ1JBUEVSUyIsImJlaW5sZXVtaSIsInRvQmVEZWZpbmVkIiwibG9naW5GaWVsZHMiLCJ0b0NvbnRhaW4iLCJjb25maWciLCJjb21wYW55QVBJIiwiaW52YWxpZFBhc3N3b3JkIiwib3B0aW9ucyIsImNvbXBhbnlJZCIsInNjcmFwZXIiLCJCZWlubGV1bWlTY3JhcGVyIiwicmVzdWx0Iiwic2NyYXBlIiwidXNlcm5hbWUiLCJwYXNzd29yZCIsInN1Y2Nlc3MiLCJ0b0JlRmFsc3kiLCJlcnJvclR5cGUiLCJ0b0JlIiwiTG9naW5SZXN1bHRzIiwiSW52YWxpZFBhc3N3b3JkIiwiY3JlZGVudGlhbHMiLCJlcnJvciIsImVycm9yTWVzc2FnZSIsInRyaW0iLCJ0b0JlVHJ1dGh5IiwiYWNjb3VudHMiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOztBQUNBOztBQUdBOztBQUNBOzs7Ozs7Ozs7O0FBRUEsTUFBTUEsVUFBVSxHQUFHLFdBQW5CLEMsQ0FBZ0M7O0FBQ2hDLE1BQU1DLFdBQVcsR0FBRyxpQ0FBcEI7QUFFQUMsUUFBUSxDQUFDLFdBQUQsRUFBYyxNQUFNO0FBQzFCQyxFQUFBQSxTQUFTLENBQUMsTUFBTTtBQUNkLDBDQURjLENBQ1E7QUFDdkIsR0FGUSxDQUFUO0FBSUFDLEVBQUFBLElBQUksQ0FBQyxpREFBRCxFQUFvRCxNQUFNO0FBQzVEQyxJQUFBQSxNQUFNLENBQUNDLHNCQUFTQyxTQUFWLENBQU4sQ0FBMkJDLFdBQTNCO0FBQ0FILElBQUFBLE1BQU0sQ0FBQ0Msc0JBQVNDLFNBQVQsQ0FBbUJFLFdBQXBCLENBQU4sQ0FBdUNDLFNBQXZDLENBQWlELFVBQWpEO0FBQ0FMLElBQUFBLE1BQU0sQ0FBQ0Msc0JBQVNDLFNBQVQsQ0FBbUJFLFdBQXBCLENBQU4sQ0FBdUNDLFNBQXZDLENBQWlELFVBQWpEO0FBQ0QsR0FKRyxDQUFKO0FBTUEsdUNBQW9CVixVQUFwQixFQUFpQ1csTUFBRCxJQUFZQSxNQUFNLENBQUNDLFVBQVAsQ0FBa0JDLGVBQTlELEVBQStFLHNDQUEvRSxFQUF1SCxZQUFZO0FBQ2pJLFVBQU1DLE9BQU8scUJBQ1JiLFdBQVcsQ0FBQ2EsT0FESjtBQUVYQyxNQUFBQSxTQUFTLEVBQUVmO0FBRkEsTUFBYjs7QUFLQSxVQUFNZ0IsT0FBTyxHQUFHLElBQUlDLGtCQUFKLENBQXFCSCxPQUFyQixDQUFoQjtBQUVBLFVBQU1JLE1BQU0sR0FBRyxNQUFNRixPQUFPLENBQUNHLE1BQVIsQ0FBZTtBQUFFQyxNQUFBQSxRQUFRLEVBQUUsUUFBWjtBQUFzQkMsTUFBQUEsUUFBUSxFQUFFO0FBQWhDLEtBQWYsQ0FBckI7QUFFQWhCLElBQUFBLE1BQU0sQ0FBQ2EsTUFBRCxDQUFOLENBQWVWLFdBQWY7QUFDQUgsSUFBQUEsTUFBTSxDQUFDYSxNQUFNLENBQUNJLE9BQVIsQ0FBTixDQUF1QkMsU0FBdkI7QUFDQWxCLElBQUFBLE1BQU0sQ0FBQ2EsTUFBTSxDQUFDTSxTQUFSLENBQU4sQ0FBeUJDLElBQXpCLENBQThCQyxxQ0FBYUMsZUFBM0M7QUFDRCxHQWJEO0FBZUEsdUNBQW9CM0IsVUFBcEIsRUFBZ0MsNkJBQWhDLEVBQStELFlBQVk7QUFDekUsVUFBTWMsT0FBTyxxQkFDUmIsV0FBVyxDQUFDYSxPQURKO0FBRVhDLE1BQUFBLFNBQVMsRUFBRWY7QUFGQSxNQUFiOztBQUtBLFVBQU1nQixPQUFPLEdBQUcsSUFBSUMsa0JBQUosQ0FBcUJILE9BQXJCLENBQWhCO0FBQ0EsVUFBTUksTUFBTSxHQUFHLE1BQU1GLE9BQU8sQ0FBQ0csTUFBUixDQUFlbEIsV0FBVyxDQUFDMkIsV0FBWixDQUF3QnJCLFNBQXZDLENBQXJCO0FBQ0FGLElBQUFBLE1BQU0sQ0FBQ2EsTUFBRCxDQUFOLENBQWVWLFdBQWY7QUFDQSxVQUFNcUIsS0FBSyxHQUFJLEdBQUVYLE1BQU0sQ0FBQ00sU0FBUCxJQUFvQixFQUFHLElBQUdOLE1BQU0sQ0FBQ1ksWUFBUCxJQUF1QixFQUFHLEVBQXZELENBQXlEQyxJQUF6RCxFQUFkO0FBQ0ExQixJQUFBQSxNQUFNLENBQUN3QixLQUFELENBQU4sQ0FBY0osSUFBZCxDQUFtQixFQUFuQjtBQUNBcEIsSUFBQUEsTUFBTSxDQUFDYSxNQUFNLENBQUNJLE9BQVIsQ0FBTixDQUF1QlUsVUFBdkI7QUFFQSx3Q0FBbUJoQyxVQUFuQixFQUErQmtCLE1BQU0sQ0FBQ2UsUUFBUCxJQUFtQixFQUFsRDtBQUNELEdBZEQ7QUFlRCxDQXpDTyxDQUFSIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJlaW5sZXVtaVNjcmFwZXIgZnJvbSAnLi9iZWlubGV1bWknO1xuaW1wb3J0IHtcbiAgbWF5YmVUZXN0Q29tcGFueUFQSSwgZXh0ZW5kQXN5bmNUaW1lb3V0LCBnZXRUZXN0c0NvbmZpZywgZXhwb3J0VHJhbnNhY3Rpb25zLFxufSBmcm9tICcuLi90ZXN0cy90ZXN0cy11dGlscyc7XG5pbXBvcnQgeyBTQ1JBUEVSUyB9IGZyb20gJy4uL2RlZmluaXRpb25zJztcbmltcG9ydCB7IExvZ2luUmVzdWx0cyB9IGZyb20gJy4vYmFzZS1zY3JhcGVyLXdpdGgtYnJvd3Nlcic7XG5cbmNvbnN0IENPTVBBTllfSUQgPSAnYmVpbmxldW1pJzsgLy8gVE9ETyB0aGlzIHByb3BlcnR5IHNob3VsZCBiZSBoYXJkLWNvZGVkIGluIHRoZSBwcm92aWRlclxuY29uc3QgdGVzdHNDb25maWcgPSBnZXRUZXN0c0NvbmZpZygpO1xuXG5kZXNjcmliZSgnQmVpbmxldW1pJywgKCkgPT4ge1xuICBiZWZvcmVBbGwoKCkgPT4ge1xuICAgIGV4dGVuZEFzeW5jVGltZW91dCgpOyAvLyBUaGUgZGVmYXVsdCB0aW1lb3V0IGlzIDUgc2Vjb25kcyBwZXIgYXN5bmMgdGVzdCwgdGhpcyBmdW5jdGlvbiBleHRlbmRzIHRoZSB0aW1lb3V0IHZhbHVlXG4gIH0pO1xuXG4gIHRlc3QoJ3Nob3VsZCBleHBvc2UgbG9naW4gZmllbGRzIGluIHNjcmFwZXJzIGNvbnN0YW50JywgKCkgPT4ge1xuICAgIGV4cGVjdChTQ1JBUEVSUy5iZWlubGV1bWkpLnRvQmVEZWZpbmVkKCk7XG4gICAgZXhwZWN0KFNDUkFQRVJTLmJlaW5sZXVtaS5sb2dpbkZpZWxkcykudG9Db250YWluKCd1c2VybmFtZScpO1xuICAgIGV4cGVjdChTQ1JBUEVSUy5iZWlubGV1bWkubG9naW5GaWVsZHMpLnRvQ29udGFpbigncGFzc3dvcmQnKTtcbiAgfSk7XG5cbiAgbWF5YmVUZXN0Q29tcGFueUFQSShDT01QQU5ZX0lELCAoY29uZmlnKSA9PiBjb25maWcuY29tcGFueUFQSS5pbnZhbGlkUGFzc3dvcmQpKCdzaG91bGQgZmFpbCBvbiBpbnZhbGlkIHVzZXIvcGFzc3dvcmQnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgIC4uLnRlc3RzQ29uZmlnLm9wdGlvbnMsXG4gICAgICBjb21wYW55SWQ6IENPTVBBTllfSUQsXG4gICAgfTtcblxuICAgIGNvbnN0IHNjcmFwZXIgPSBuZXcgQmVpbmxldW1pU2NyYXBlcihvcHRpb25zKTtcblxuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHNjcmFwZXIuc2NyYXBlKHsgdXNlcm5hbWU6ICdlMTBzMTInLCBwYXNzd29yZDogJzNmM3NzM2QnIH0pO1xuXG4gICAgZXhwZWN0KHJlc3VsdCkudG9CZURlZmluZWQoKTtcbiAgICBleHBlY3QocmVzdWx0LnN1Y2Nlc3MpLnRvQmVGYWxzeSgpO1xuICAgIGV4cGVjdChyZXN1bHQuZXJyb3JUeXBlKS50b0JlKExvZ2luUmVzdWx0cy5JbnZhbGlkUGFzc3dvcmQpO1xuICB9KTtcblxuICBtYXliZVRlc3RDb21wYW55QVBJKENPTVBBTllfSUQpKCdzaG91bGQgc2NyYXBlIHRyYW5zYWN0aW9uc1wiJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICAuLi50ZXN0c0NvbmZpZy5vcHRpb25zLFxuICAgICAgY29tcGFueUlkOiBDT01QQU5ZX0lELFxuICAgIH07XG5cbiAgICBjb25zdCBzY3JhcGVyID0gbmV3IEJlaW5sZXVtaVNjcmFwZXIob3B0aW9ucyk7XG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgc2NyYXBlci5zY3JhcGUodGVzdHNDb25maWcuY3JlZGVudGlhbHMuYmVpbmxldW1pKTtcbiAgICBleHBlY3QocmVzdWx0KS50b0JlRGVmaW5lZCgpO1xuICAgIGNvbnN0IGVycm9yID0gYCR7cmVzdWx0LmVycm9yVHlwZSB8fCAnJ30gJHtyZXN1bHQuZXJyb3JNZXNzYWdlIHx8ICcnfWAudHJpbSgpO1xuICAgIGV4cGVjdChlcnJvcikudG9CZSgnJyk7XG4gICAgZXhwZWN0KHJlc3VsdC5zdWNjZXNzKS50b0JlVHJ1dGh5KCk7XG5cbiAgICBleHBvcnRUcmFuc2FjdGlvbnMoQ09NUEFOWV9JRCwgcmVzdWx0LmFjY291bnRzIHx8IFtdKTtcbiAgfSk7XG59KTtcbiJdfQ==