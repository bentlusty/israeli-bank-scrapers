"use strict";

require("core-js/modules/es.promise");

require("core-js/modules/es.string.trim");

var _visaCal = _interopRequireDefault(require("./visa-cal"));

var _testsUtils = require("../tests/tests-utils");

var _definitions = require("../definitions");

var _baseScraperWithBrowser = require("./base-scraper-with-browser");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const COMPANY_ID = 'visaCal'; // TODO this property should be hard-coded in the provider

const testsConfig = (0, _testsUtils.getTestsConfig)();
describe('VisaCal legacy scraper', () => {
  beforeAll(() => {
    (0, _testsUtils.extendAsyncTimeout)(); // The default timeout is 5 seconds per async test, this function extends the timeout value
  });
  test('should expose login fields in scrapers constant', () => {
    expect(_definitions.SCRAPERS.visaCal).toBeDefined();
    expect(_definitions.SCRAPERS.visaCal.loginFields).toContain('username');
    expect(_definitions.SCRAPERS.visaCal.loginFields).toContain('password');
  });
  (0, _testsUtils.maybeTestCompanyAPI)(COMPANY_ID, config => config.companyAPI.invalidPassword)('should fail on invalid user/password"', async () => {
    const options = _objectSpread({}, testsConfig.options, {
      companyId: COMPANY_ID
    });

    const scraper = new _visaCal.default(options);
    const result = await scraper.scrape({
      username: '971sddksmsl',
      password: '3f3ssdkSD3d'
    });
    expect(result).toBeDefined();
    expect(result.success).toBeFalsy();
    expect(result.errorType).toBe(_baseScraperWithBrowser.LoginResults.InvalidPassword);
  });
  (0, _testsUtils.maybeTestCompanyAPI)(COMPANY_ID)('should scrape transactions"', async () => {
    const options = _objectSpread({}, testsConfig.options, {
      companyId: COMPANY_ID
    });

    const scraper = new _visaCal.default(options);
    const result = await scraper.scrape(testsConfig.credentials.visaCal);
    expect(result).toBeDefined();
    const error = `${result.errorType || ''} ${result.errorMessage || ''}`.trim();
    expect(error).toBe('');
    expect(result.success).toBeTruthy(); // uncomment to test multiple accounts
    // expect(result?.accounts?.length).toEqual(2)

    (0, _testsUtils.exportTransactions)(COMPANY_ID, result.accounts || []);
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zY3JhcGVycy92aXNhLWNhbC50ZXN0LnRzIl0sIm5hbWVzIjpbIkNPTVBBTllfSUQiLCJ0ZXN0c0NvbmZpZyIsImRlc2NyaWJlIiwiYmVmb3JlQWxsIiwidGVzdCIsImV4cGVjdCIsIlNDUkFQRVJTIiwidmlzYUNhbCIsInRvQmVEZWZpbmVkIiwibG9naW5GaWVsZHMiLCJ0b0NvbnRhaW4iLCJjb25maWciLCJjb21wYW55QVBJIiwiaW52YWxpZFBhc3N3b3JkIiwib3B0aW9ucyIsImNvbXBhbnlJZCIsInNjcmFwZXIiLCJWaXNhQ2FsU2NyYXBlciIsInJlc3VsdCIsInNjcmFwZSIsInVzZXJuYW1lIiwicGFzc3dvcmQiLCJzdWNjZXNzIiwidG9CZUZhbHN5IiwiZXJyb3JUeXBlIiwidG9CZSIsIkxvZ2luUmVzdWx0cyIsIkludmFsaWRQYXNzd29yZCIsImNyZWRlbnRpYWxzIiwiZXJyb3IiLCJlcnJvck1lc3NhZ2UiLCJ0cmltIiwidG9CZVRydXRoeSIsImFjY291bnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7QUFDQTs7QUFHQTs7QUFDQTs7Ozs7Ozs7OztBQUVBLE1BQU1BLFVBQVUsR0FBRyxTQUFuQixDLENBQThCOztBQUM5QixNQUFNQyxXQUFXLEdBQUcsaUNBQXBCO0FBRUFDLFFBQVEsQ0FBQyx3QkFBRCxFQUEyQixNQUFNO0FBQ3ZDQyxFQUFBQSxTQUFTLENBQUMsTUFBTTtBQUNkLDBDQURjLENBQ1E7QUFDdkIsR0FGUSxDQUFUO0FBSUFDLEVBQUFBLElBQUksQ0FBQyxpREFBRCxFQUFvRCxNQUFNO0FBQzVEQyxJQUFBQSxNQUFNLENBQUNDLHNCQUFTQyxPQUFWLENBQU4sQ0FBeUJDLFdBQXpCO0FBQ0FILElBQUFBLE1BQU0sQ0FBQ0Msc0JBQVNDLE9BQVQsQ0FBaUJFLFdBQWxCLENBQU4sQ0FBcUNDLFNBQXJDLENBQStDLFVBQS9DO0FBQ0FMLElBQUFBLE1BQU0sQ0FBQ0Msc0JBQVNDLE9BQVQsQ0FBaUJFLFdBQWxCLENBQU4sQ0FBcUNDLFNBQXJDLENBQStDLFVBQS9DO0FBQ0QsR0FKRyxDQUFKO0FBTUEsdUNBQW9CVixVQUFwQixFQUFpQ1csTUFBRCxJQUFZQSxNQUFNLENBQUNDLFVBQVAsQ0FBa0JDLGVBQTlELEVBQStFLHVDQUEvRSxFQUF3SCxZQUFZO0FBQ2xJLFVBQU1DLE9BQU8scUJBQ1JiLFdBQVcsQ0FBQ2EsT0FESjtBQUVYQyxNQUFBQSxTQUFTLEVBQUVmO0FBRkEsTUFBYjs7QUFLQSxVQUFNZ0IsT0FBTyxHQUFHLElBQUlDLGdCQUFKLENBQW1CSCxPQUFuQixDQUFoQjtBQUVBLFVBQU1JLE1BQU0sR0FBRyxNQUFNRixPQUFPLENBQUNHLE1BQVIsQ0FBZTtBQUFFQyxNQUFBQSxRQUFRLEVBQUUsYUFBWjtBQUEyQkMsTUFBQUEsUUFBUSxFQUFFO0FBQXJDLEtBQWYsQ0FBckI7QUFFQWhCLElBQUFBLE1BQU0sQ0FBQ2EsTUFBRCxDQUFOLENBQWVWLFdBQWY7QUFDQUgsSUFBQUEsTUFBTSxDQUFDYSxNQUFNLENBQUNJLE9BQVIsQ0FBTixDQUF1QkMsU0FBdkI7QUFDQWxCLElBQUFBLE1BQU0sQ0FBQ2EsTUFBTSxDQUFDTSxTQUFSLENBQU4sQ0FBeUJDLElBQXpCLENBQThCQyxxQ0FBYUMsZUFBM0M7QUFDRCxHQWJEO0FBZUEsdUNBQW9CM0IsVUFBcEIsRUFBZ0MsNkJBQWhDLEVBQStELFlBQVk7QUFDekUsVUFBTWMsT0FBTyxxQkFDUmIsV0FBVyxDQUFDYSxPQURKO0FBRVhDLE1BQUFBLFNBQVMsRUFBRWY7QUFGQSxNQUFiOztBQUtBLFVBQU1nQixPQUFPLEdBQUcsSUFBSUMsZ0JBQUosQ0FBbUJILE9BQW5CLENBQWhCO0FBQ0EsVUFBTUksTUFBTSxHQUFHLE1BQU1GLE9BQU8sQ0FBQ0csTUFBUixDQUFlbEIsV0FBVyxDQUFDMkIsV0FBWixDQUF3QnJCLE9BQXZDLENBQXJCO0FBQ0FGLElBQUFBLE1BQU0sQ0FBQ2EsTUFBRCxDQUFOLENBQWVWLFdBQWY7QUFDQSxVQUFNcUIsS0FBSyxHQUFJLEdBQUVYLE1BQU0sQ0FBQ00sU0FBUCxJQUFvQixFQUFHLElBQUdOLE1BQU0sQ0FBQ1ksWUFBUCxJQUF1QixFQUFHLEVBQXZELENBQXlEQyxJQUF6RCxFQUFkO0FBQ0ExQixJQUFBQSxNQUFNLENBQUN3QixLQUFELENBQU4sQ0FBY0osSUFBZCxDQUFtQixFQUFuQjtBQUNBcEIsSUFBQUEsTUFBTSxDQUFDYSxNQUFNLENBQUNJLE9BQVIsQ0FBTixDQUF1QlUsVUFBdkIsR0FYeUUsQ0FZekU7QUFDQTs7QUFDQSx3Q0FBbUJoQyxVQUFuQixFQUErQmtCLE1BQU0sQ0FBQ2UsUUFBUCxJQUFtQixFQUFsRDtBQUNELEdBZkQ7QUFnQkQsQ0ExQ08sQ0FBUiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBWaXNhQ2FsU2NyYXBlciBmcm9tICcuL3Zpc2EtY2FsJztcbmltcG9ydCB7XG4gIG1heWJlVGVzdENvbXBhbnlBUEksIGV4dGVuZEFzeW5jVGltZW91dCwgZ2V0VGVzdHNDb25maWcsIGV4cG9ydFRyYW5zYWN0aW9ucyxcbn0gZnJvbSAnLi4vdGVzdHMvdGVzdHMtdXRpbHMnO1xuaW1wb3J0IHsgU0NSQVBFUlMgfSBmcm9tICcuLi9kZWZpbml0aW9ucyc7XG5pbXBvcnQgeyBMb2dpblJlc3VsdHMgfSBmcm9tICcuL2Jhc2Utc2NyYXBlci13aXRoLWJyb3dzZXInO1xuXG5jb25zdCBDT01QQU5ZX0lEID0gJ3Zpc2FDYWwnOyAvLyBUT0RPIHRoaXMgcHJvcGVydHkgc2hvdWxkIGJlIGhhcmQtY29kZWQgaW4gdGhlIHByb3ZpZGVyXG5jb25zdCB0ZXN0c0NvbmZpZyA9IGdldFRlc3RzQ29uZmlnKCk7XG5cbmRlc2NyaWJlKCdWaXNhQ2FsIGxlZ2FjeSBzY3JhcGVyJywgKCkgPT4ge1xuICBiZWZvcmVBbGwoKCkgPT4ge1xuICAgIGV4dGVuZEFzeW5jVGltZW91dCgpOyAvLyBUaGUgZGVmYXVsdCB0aW1lb3V0IGlzIDUgc2Vjb25kcyBwZXIgYXN5bmMgdGVzdCwgdGhpcyBmdW5jdGlvbiBleHRlbmRzIHRoZSB0aW1lb3V0IHZhbHVlXG4gIH0pO1xuXG4gIHRlc3QoJ3Nob3VsZCBleHBvc2UgbG9naW4gZmllbGRzIGluIHNjcmFwZXJzIGNvbnN0YW50JywgKCkgPT4ge1xuICAgIGV4cGVjdChTQ1JBUEVSUy52aXNhQ2FsKS50b0JlRGVmaW5lZCgpO1xuICAgIGV4cGVjdChTQ1JBUEVSUy52aXNhQ2FsLmxvZ2luRmllbGRzKS50b0NvbnRhaW4oJ3VzZXJuYW1lJyk7XG4gICAgZXhwZWN0KFNDUkFQRVJTLnZpc2FDYWwubG9naW5GaWVsZHMpLnRvQ29udGFpbigncGFzc3dvcmQnKTtcbiAgfSk7XG5cbiAgbWF5YmVUZXN0Q29tcGFueUFQSShDT01QQU5ZX0lELCAoY29uZmlnKSA9PiBjb25maWcuY29tcGFueUFQSS5pbnZhbGlkUGFzc3dvcmQpKCdzaG91bGQgZmFpbCBvbiBpbnZhbGlkIHVzZXIvcGFzc3dvcmRcIicsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgLi4udGVzdHNDb25maWcub3B0aW9ucyxcbiAgICAgIGNvbXBhbnlJZDogQ09NUEFOWV9JRCxcbiAgICB9O1xuXG4gICAgY29uc3Qgc2NyYXBlciA9IG5ldyBWaXNhQ2FsU2NyYXBlcihvcHRpb25zKTtcblxuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHNjcmFwZXIuc2NyYXBlKHsgdXNlcm5hbWU6ICc5NzFzZGRrc21zbCcsIHBhc3N3b3JkOiAnM2Yzc3Nka1NEM2QnIH0pO1xuXG4gICAgZXhwZWN0KHJlc3VsdCkudG9CZURlZmluZWQoKTtcbiAgICBleHBlY3QocmVzdWx0LnN1Y2Nlc3MpLnRvQmVGYWxzeSgpO1xuICAgIGV4cGVjdChyZXN1bHQuZXJyb3JUeXBlKS50b0JlKExvZ2luUmVzdWx0cy5JbnZhbGlkUGFzc3dvcmQpO1xuICB9KTtcblxuICBtYXliZVRlc3RDb21wYW55QVBJKENPTVBBTllfSUQpKCdzaG91bGQgc2NyYXBlIHRyYW5zYWN0aW9uc1wiJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICAuLi50ZXN0c0NvbmZpZy5vcHRpb25zLFxuICAgICAgY29tcGFueUlkOiBDT01QQU5ZX0lELFxuICAgIH07XG5cbiAgICBjb25zdCBzY3JhcGVyID0gbmV3IFZpc2FDYWxTY3JhcGVyKG9wdGlvbnMpO1xuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHNjcmFwZXIuc2NyYXBlKHRlc3RzQ29uZmlnLmNyZWRlbnRpYWxzLnZpc2FDYWwpO1xuICAgIGV4cGVjdChyZXN1bHQpLnRvQmVEZWZpbmVkKCk7XG4gICAgY29uc3QgZXJyb3IgPSBgJHtyZXN1bHQuZXJyb3JUeXBlIHx8ICcnfSAke3Jlc3VsdC5lcnJvck1lc3NhZ2UgfHwgJyd9YC50cmltKCk7XG4gICAgZXhwZWN0KGVycm9yKS50b0JlKCcnKTtcbiAgICBleHBlY3QocmVzdWx0LnN1Y2Nlc3MpLnRvQmVUcnV0aHkoKTtcbiAgICAvLyB1bmNvbW1lbnQgdG8gdGVzdCBtdWx0aXBsZSBhY2NvdW50c1xuICAgIC8vIGV4cGVjdChyZXN1bHQ/LmFjY291bnRzPy5sZW5ndGgpLnRvRXF1YWwoMilcbiAgICBleHBvcnRUcmFuc2FjdGlvbnMoQ09NUEFOWV9JRCwgcmVzdWx0LmFjY291bnRzIHx8IFtdKTtcbiAgfSk7XG59KTtcbiJdfQ==