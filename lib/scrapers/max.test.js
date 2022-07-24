"use strict";

require("core-js/modules/es.promise");

require("core-js/modules/es.string.trim");

var _max = _interopRequireDefault(require("./max"));

var _testsUtils = require("../tests/tests-utils");

var _definitions = require("../definitions");

var _baseScraperWithBrowser = require("./base-scraper-with-browser");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const COMPANY_ID = 'max'; // TODO this property should be hard-coded in the provider

const testsConfig = (0, _testsUtils.getTestsConfig)();
describe('Max scraper', () => {
  beforeAll(() => {
    (0, _testsUtils.extendAsyncTimeout)(); // The default timeout is 5 seconds per async test, this function extends the timeout value
  });
  test('should expose login fields in scrapers constant', () => {
    expect(_definitions.SCRAPERS.max).toBeDefined();
    expect(_definitions.SCRAPERS.max.loginFields).toContain('username');
    expect(_definitions.SCRAPERS.max.loginFields).toContain('password');
  });
  (0, _testsUtils.maybeTestCompanyAPI)(COMPANY_ID, config => config.companyAPI.invalidPassword)('should fail on invalid user/password"', async () => {
    const options = _objectSpread({}, testsConfig.options, {
      companyId: COMPANY_ID
    });

    const scraper = new _max.default(options);
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

    const scraper = new _max.default(options);
    const result = await scraper.scrape(testsConfig.credentials.max);
    expect(result).toBeDefined();
    const error = `${result.errorType || ''} ${result.errorMessage || ''}`.trim();
    expect(error).toBe('');
    expect(result.success).toBeTruthy();
    (0, _testsUtils.exportTransactions)(COMPANY_ID, result.accounts || []);
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zY3JhcGVycy9tYXgudGVzdC50cyJdLCJuYW1lcyI6WyJDT01QQU5ZX0lEIiwidGVzdHNDb25maWciLCJkZXNjcmliZSIsImJlZm9yZUFsbCIsInRlc3QiLCJleHBlY3QiLCJTQ1JBUEVSUyIsIm1heCIsInRvQmVEZWZpbmVkIiwibG9naW5GaWVsZHMiLCJ0b0NvbnRhaW4iLCJjb25maWciLCJjb21wYW55QVBJIiwiaW52YWxpZFBhc3N3b3JkIiwib3B0aW9ucyIsImNvbXBhbnlJZCIsInNjcmFwZXIiLCJNYXhTY3JhcGVyIiwicmVzdWx0Iiwic2NyYXBlIiwidXNlcm5hbWUiLCJwYXNzd29yZCIsInN1Y2Nlc3MiLCJ0b0JlRmFsc3kiLCJlcnJvclR5cGUiLCJ0b0JlIiwiTG9naW5SZXN1bHRzIiwiSW52YWxpZFBhc3N3b3JkIiwiY3JlZGVudGlhbHMiLCJlcnJvciIsImVycm9yTWVzc2FnZSIsInRyaW0iLCJ0b0JlVHJ1dGh5IiwiYWNjb3VudHMiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOztBQUNBOztBQUdBOztBQUNBOzs7Ozs7Ozs7O0FBRUEsTUFBTUEsVUFBVSxHQUFHLEtBQW5CLEMsQ0FBMEI7O0FBQzFCLE1BQU1DLFdBQVcsR0FBRyxpQ0FBcEI7QUFFQUMsUUFBUSxDQUFDLGFBQUQsRUFBZ0IsTUFBTTtBQUM1QkMsRUFBQUEsU0FBUyxDQUFDLE1BQU07QUFDZCwwQ0FEYyxDQUNRO0FBQ3ZCLEdBRlEsQ0FBVDtBQUlBQyxFQUFBQSxJQUFJLENBQUMsaURBQUQsRUFBb0QsTUFBTTtBQUM1REMsSUFBQUEsTUFBTSxDQUFDQyxzQkFBU0MsR0FBVixDQUFOLENBQXFCQyxXQUFyQjtBQUNBSCxJQUFBQSxNQUFNLENBQUNDLHNCQUFTQyxHQUFULENBQWFFLFdBQWQsQ0FBTixDQUFpQ0MsU0FBakMsQ0FBMkMsVUFBM0M7QUFDQUwsSUFBQUEsTUFBTSxDQUFDQyxzQkFBU0MsR0FBVCxDQUFhRSxXQUFkLENBQU4sQ0FBaUNDLFNBQWpDLENBQTJDLFVBQTNDO0FBQ0QsR0FKRyxDQUFKO0FBTUEsdUNBQW9CVixVQUFwQixFQUFpQ1csTUFBRCxJQUFZQSxNQUFNLENBQUNDLFVBQVAsQ0FBa0JDLGVBQTlELEVBQStFLHVDQUEvRSxFQUF3SCxZQUFZO0FBQ2xJLFVBQU1DLE9BQU8scUJBQ1JiLFdBQVcsQ0FBQ2EsT0FESjtBQUVYQyxNQUFBQSxTQUFTLEVBQUVmO0FBRkEsTUFBYjs7QUFLQSxVQUFNZ0IsT0FBTyxHQUFHLElBQUlDLFlBQUosQ0FBZUgsT0FBZixDQUFoQjtBQUVBLFVBQU1JLE1BQU0sR0FBRyxNQUFNRixPQUFPLENBQUNHLE1BQVIsQ0FBZTtBQUFFQyxNQUFBQSxRQUFRLEVBQUUsUUFBWjtBQUFzQkMsTUFBQUEsUUFBUSxFQUFFO0FBQWhDLEtBQWYsQ0FBckI7QUFFQWhCLElBQUFBLE1BQU0sQ0FBQ2EsTUFBRCxDQUFOLENBQWVWLFdBQWY7QUFDQUgsSUFBQUEsTUFBTSxDQUFDYSxNQUFNLENBQUNJLE9BQVIsQ0FBTixDQUF1QkMsU0FBdkI7QUFDQWxCLElBQUFBLE1BQU0sQ0FBQ2EsTUFBTSxDQUFDTSxTQUFSLENBQU4sQ0FBeUJDLElBQXpCLENBQThCQyxxQ0FBYUMsZUFBM0M7QUFDRCxHQWJEO0FBZUEsdUNBQW9CM0IsVUFBcEIsRUFBZ0MsNkJBQWhDLEVBQStELFlBQVk7QUFDekUsVUFBTWMsT0FBTyxxQkFDUmIsV0FBVyxDQUFDYSxPQURKO0FBRVhDLE1BQUFBLFNBQVMsRUFBRWY7QUFGQSxNQUFiOztBQUtBLFVBQU1nQixPQUFPLEdBQUcsSUFBSUMsWUFBSixDQUFlSCxPQUFmLENBQWhCO0FBQ0EsVUFBTUksTUFBTSxHQUFHLE1BQU1GLE9BQU8sQ0FBQ0csTUFBUixDQUFlbEIsV0FBVyxDQUFDMkIsV0FBWixDQUF3QnJCLEdBQXZDLENBQXJCO0FBQ0FGLElBQUFBLE1BQU0sQ0FBQ2EsTUFBRCxDQUFOLENBQWVWLFdBQWY7QUFDQSxVQUFNcUIsS0FBSyxHQUFJLEdBQUVYLE1BQU0sQ0FBQ00sU0FBUCxJQUFvQixFQUFHLElBQUdOLE1BQU0sQ0FBQ1ksWUFBUCxJQUF1QixFQUFHLEVBQXZELENBQXlEQyxJQUF6RCxFQUFkO0FBQ0ExQixJQUFBQSxNQUFNLENBQUN3QixLQUFELENBQU4sQ0FBY0osSUFBZCxDQUFtQixFQUFuQjtBQUNBcEIsSUFBQUEsTUFBTSxDQUFDYSxNQUFNLENBQUNJLE9BQVIsQ0FBTixDQUF1QlUsVUFBdkI7QUFFQSx3Q0FBbUJoQyxVQUFuQixFQUErQmtCLE1BQU0sQ0FBQ2UsUUFBUCxJQUFtQixFQUFsRDtBQUNELEdBZEQ7QUFlRCxDQXpDTyxDQUFSIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE1heFNjcmFwZXIgZnJvbSAnLi9tYXgnO1xuaW1wb3J0IHtcbiAgbWF5YmVUZXN0Q29tcGFueUFQSSwgZXh0ZW5kQXN5bmNUaW1lb3V0LCBnZXRUZXN0c0NvbmZpZywgZXhwb3J0VHJhbnNhY3Rpb25zLFxufSBmcm9tICcuLi90ZXN0cy90ZXN0cy11dGlscyc7XG5pbXBvcnQgeyBTQ1JBUEVSUyB9IGZyb20gJy4uL2RlZmluaXRpb25zJztcbmltcG9ydCB7IExvZ2luUmVzdWx0cyB9IGZyb20gJy4vYmFzZS1zY3JhcGVyLXdpdGgtYnJvd3Nlcic7XG5cbmNvbnN0IENPTVBBTllfSUQgPSAnbWF4JzsgLy8gVE9ETyB0aGlzIHByb3BlcnR5IHNob3VsZCBiZSBoYXJkLWNvZGVkIGluIHRoZSBwcm92aWRlclxuY29uc3QgdGVzdHNDb25maWcgPSBnZXRUZXN0c0NvbmZpZygpO1xuXG5kZXNjcmliZSgnTWF4IHNjcmFwZXInLCAoKSA9PiB7XG4gIGJlZm9yZUFsbCgoKSA9PiB7XG4gICAgZXh0ZW5kQXN5bmNUaW1lb3V0KCk7IC8vIFRoZSBkZWZhdWx0IHRpbWVvdXQgaXMgNSBzZWNvbmRzIHBlciBhc3luYyB0ZXN0LCB0aGlzIGZ1bmN0aW9uIGV4dGVuZHMgdGhlIHRpbWVvdXQgdmFsdWVcbiAgfSk7XG5cbiAgdGVzdCgnc2hvdWxkIGV4cG9zZSBsb2dpbiBmaWVsZHMgaW4gc2NyYXBlcnMgY29uc3RhbnQnLCAoKSA9PiB7XG4gICAgZXhwZWN0KFNDUkFQRVJTLm1heCkudG9CZURlZmluZWQoKTtcbiAgICBleHBlY3QoU0NSQVBFUlMubWF4LmxvZ2luRmllbGRzKS50b0NvbnRhaW4oJ3VzZXJuYW1lJyk7XG4gICAgZXhwZWN0KFNDUkFQRVJTLm1heC5sb2dpbkZpZWxkcykudG9Db250YWluKCdwYXNzd29yZCcpO1xuICB9KTtcblxuICBtYXliZVRlc3RDb21wYW55QVBJKENPTVBBTllfSUQsIChjb25maWcpID0+IGNvbmZpZy5jb21wYW55QVBJLmludmFsaWRQYXNzd29yZCkoJ3Nob3VsZCBmYWlsIG9uIGludmFsaWQgdXNlci9wYXNzd29yZFwiJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICAuLi50ZXN0c0NvbmZpZy5vcHRpb25zLFxuICAgICAgY29tcGFueUlkOiBDT01QQU5ZX0lELFxuICAgIH07XG5cbiAgICBjb25zdCBzY3JhcGVyID0gbmV3IE1heFNjcmFwZXIob3B0aW9ucyk7XG5cbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBzY3JhcGVyLnNjcmFwZSh7IHVzZXJuYW1lOiAnZTEwczEyJywgcGFzc3dvcmQ6ICczZjNzczNkJyB9KTtcblxuICAgIGV4cGVjdChyZXN1bHQpLnRvQmVEZWZpbmVkKCk7XG4gICAgZXhwZWN0KHJlc3VsdC5zdWNjZXNzKS50b0JlRmFsc3koKTtcbiAgICBleHBlY3QocmVzdWx0LmVycm9yVHlwZSkudG9CZShMb2dpblJlc3VsdHMuSW52YWxpZFBhc3N3b3JkKTtcbiAgfSk7XG5cbiAgbWF5YmVUZXN0Q29tcGFueUFQSShDT01QQU5ZX0lEKSgnc2hvdWxkIHNjcmFwZSB0cmFuc2FjdGlvbnNcIicsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgLi4udGVzdHNDb25maWcub3B0aW9ucyxcbiAgICAgIGNvbXBhbnlJZDogQ09NUEFOWV9JRCxcbiAgICB9O1xuXG4gICAgY29uc3Qgc2NyYXBlciA9IG5ldyBNYXhTY3JhcGVyKG9wdGlvbnMpO1xuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHNjcmFwZXIuc2NyYXBlKHRlc3RzQ29uZmlnLmNyZWRlbnRpYWxzLm1heCk7XG4gICAgZXhwZWN0KHJlc3VsdCkudG9CZURlZmluZWQoKTtcbiAgICBjb25zdCBlcnJvciA9IGAke3Jlc3VsdC5lcnJvclR5cGUgfHwgJyd9ICR7cmVzdWx0LmVycm9yTWVzc2FnZSB8fCAnJ31gLnRyaW0oKTtcbiAgICBleHBlY3QoZXJyb3IpLnRvQmUoJycpO1xuICAgIGV4cGVjdChyZXN1bHQuc3VjY2VzcykudG9CZVRydXRoeSgpO1xuXG4gICAgZXhwb3J0VHJhbnNhY3Rpb25zKENPTVBBTllfSUQsIHJlc3VsdC5hY2NvdW50cyB8fCBbXSk7XG4gIH0pO1xufSk7XG4iXX0=