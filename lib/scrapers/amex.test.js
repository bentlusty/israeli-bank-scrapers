"use strict";

require("core-js/modules/es.promise");

require("core-js/modules/es.string.trim");

var _amex = _interopRequireDefault(require("./amex"));

var _testsUtils = require("../tests/tests-utils");

var _definitions = require("../definitions");

var _baseScraperWithBrowser = require("./base-scraper-with-browser");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const COMPANY_ID = 'amex'; // TODO this property should be hard-coded in the provider

const testsConfig = (0, _testsUtils.getTestsConfig)();
describe('AMEX legacy scraper', () => {
  beforeAll(() => {
    (0, _testsUtils.extendAsyncTimeout)(); // The default timeout is 5 seconds per async test, this function extends the timeout value
  });
  test('should expose login fields in scrapers constant', () => {
    expect(_definitions.SCRAPERS.amex).toBeDefined();
    expect(_definitions.SCRAPERS.amex.loginFields).toContain('id');
    expect(_definitions.SCRAPERS.amex.loginFields).toContain('card6Digits');
    expect(_definitions.SCRAPERS.amex.loginFields).toContain('password');
  });
  (0, _testsUtils.maybeTestCompanyAPI)(COMPANY_ID, config => config.companyAPI.invalidPassword)('should fail on invalid user/password"', async () => {
    const options = _objectSpread({}, testsConfig.options, {
      companyId: COMPANY_ID
    });

    const scraper = new _amex.default(options);
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

    const scraper = new _amex.default(options);
    const result = await scraper.scrape(testsConfig.credentials.amex);
    expect(result).toBeDefined();
    const error = `${result.errorType || ''} ${result.errorMessage || ''}`.trim();
    expect(error).toBe('');
    expect(result.success).toBeTruthy();
    (0, _testsUtils.exportTransactions)(COMPANY_ID, result.accounts || []);
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zY3JhcGVycy9hbWV4LnRlc3QudHMiXSwibmFtZXMiOlsiQ09NUEFOWV9JRCIsInRlc3RzQ29uZmlnIiwiZGVzY3JpYmUiLCJiZWZvcmVBbGwiLCJ0ZXN0IiwiZXhwZWN0IiwiU0NSQVBFUlMiLCJhbWV4IiwidG9CZURlZmluZWQiLCJsb2dpbkZpZWxkcyIsInRvQ29udGFpbiIsImNvbmZpZyIsImNvbXBhbnlBUEkiLCJpbnZhbGlkUGFzc3dvcmQiLCJvcHRpb25zIiwiY29tcGFueUlkIiwic2NyYXBlciIsIkFNRVhTY3JhcGVyIiwicmVzdWx0Iiwic2NyYXBlIiwidXNlcm5hbWUiLCJwYXNzd29yZCIsInN1Y2Nlc3MiLCJ0b0JlRmFsc3kiLCJlcnJvclR5cGUiLCJ0b0JlIiwiTG9naW5SZXN1bHRzIiwiSW52YWxpZFBhc3N3b3JkIiwiY3JlZGVudGlhbHMiLCJlcnJvciIsImVycm9yTWVzc2FnZSIsInRyaW0iLCJ0b0JlVHJ1dGh5IiwiYWNjb3VudHMiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOztBQUNBOztBQUdBOztBQUNBOzs7Ozs7Ozs7O0FBRUEsTUFBTUEsVUFBVSxHQUFHLE1BQW5CLEMsQ0FBMkI7O0FBQzNCLE1BQU1DLFdBQVcsR0FBRyxpQ0FBcEI7QUFFQUMsUUFBUSxDQUFDLHFCQUFELEVBQXdCLE1BQU07QUFDcENDLEVBQUFBLFNBQVMsQ0FBQyxNQUFNO0FBQ2QsMENBRGMsQ0FDUTtBQUN2QixHQUZRLENBQVQ7QUFJQUMsRUFBQUEsSUFBSSxDQUFDLGlEQUFELEVBQW9ELE1BQU07QUFDNURDLElBQUFBLE1BQU0sQ0FBQ0Msc0JBQVNDLElBQVYsQ0FBTixDQUFzQkMsV0FBdEI7QUFDQUgsSUFBQUEsTUFBTSxDQUFDQyxzQkFBU0MsSUFBVCxDQUFjRSxXQUFmLENBQU4sQ0FBa0NDLFNBQWxDLENBQTRDLElBQTVDO0FBQ0FMLElBQUFBLE1BQU0sQ0FBQ0Msc0JBQVNDLElBQVQsQ0FBY0UsV0FBZixDQUFOLENBQWtDQyxTQUFsQyxDQUE0QyxhQUE1QztBQUNBTCxJQUFBQSxNQUFNLENBQUNDLHNCQUFTQyxJQUFULENBQWNFLFdBQWYsQ0FBTixDQUFrQ0MsU0FBbEMsQ0FBNEMsVUFBNUM7QUFDRCxHQUxHLENBQUo7QUFPQSx1Q0FBb0JWLFVBQXBCLEVBQWlDVyxNQUFELElBQVlBLE1BQU0sQ0FBQ0MsVUFBUCxDQUFrQkMsZUFBOUQsRUFBK0UsdUNBQS9FLEVBQXdILFlBQVk7QUFDbEksVUFBTUMsT0FBTyxxQkFDUmIsV0FBVyxDQUFDYSxPQURKO0FBRVhDLE1BQUFBLFNBQVMsRUFBRWY7QUFGQSxNQUFiOztBQUtBLFVBQU1nQixPQUFPLEdBQUcsSUFBSUMsYUFBSixDQUFnQkgsT0FBaEIsQ0FBaEI7QUFFQSxVQUFNSSxNQUFNLEdBQUcsTUFBTUYsT0FBTyxDQUFDRyxNQUFSLENBQWU7QUFBRUMsTUFBQUEsUUFBUSxFQUFFLFFBQVo7QUFBc0JDLE1BQUFBLFFBQVEsRUFBRTtBQUFoQyxLQUFmLENBQXJCO0FBRUFoQixJQUFBQSxNQUFNLENBQUNhLE1BQUQsQ0FBTixDQUFlVixXQUFmO0FBQ0FILElBQUFBLE1BQU0sQ0FBQ2EsTUFBTSxDQUFDSSxPQUFSLENBQU4sQ0FBdUJDLFNBQXZCO0FBQ0FsQixJQUFBQSxNQUFNLENBQUNhLE1BQU0sQ0FBQ00sU0FBUixDQUFOLENBQXlCQyxJQUF6QixDQUE4QkMscUNBQWFDLGVBQTNDO0FBQ0QsR0FiRDtBQWVBLHVDQUFvQjNCLFVBQXBCLEVBQWdDLDZCQUFoQyxFQUErRCxZQUFZO0FBQ3pFLFVBQU1jLE9BQU8scUJBQ1JiLFdBQVcsQ0FBQ2EsT0FESjtBQUVYQyxNQUFBQSxTQUFTLEVBQUVmO0FBRkEsTUFBYjs7QUFLQSxVQUFNZ0IsT0FBTyxHQUFHLElBQUlDLGFBQUosQ0FBZ0JILE9BQWhCLENBQWhCO0FBQ0EsVUFBTUksTUFBTSxHQUFHLE1BQU1GLE9BQU8sQ0FBQ0csTUFBUixDQUFlbEIsV0FBVyxDQUFDMkIsV0FBWixDQUF3QnJCLElBQXZDLENBQXJCO0FBQ0FGLElBQUFBLE1BQU0sQ0FBQ2EsTUFBRCxDQUFOLENBQWVWLFdBQWY7QUFDQSxVQUFNcUIsS0FBSyxHQUFJLEdBQUVYLE1BQU0sQ0FBQ00sU0FBUCxJQUFvQixFQUFHLElBQUdOLE1BQU0sQ0FBQ1ksWUFBUCxJQUF1QixFQUFHLEVBQXZELENBQXlEQyxJQUF6RCxFQUFkO0FBQ0ExQixJQUFBQSxNQUFNLENBQUN3QixLQUFELENBQU4sQ0FBY0osSUFBZCxDQUFtQixFQUFuQjtBQUNBcEIsSUFBQUEsTUFBTSxDQUFDYSxNQUFNLENBQUNJLE9BQVIsQ0FBTixDQUF1QlUsVUFBdkI7QUFFQSx3Q0FBbUJoQyxVQUFuQixFQUErQmtCLE1BQU0sQ0FBQ2UsUUFBUCxJQUFtQixFQUFsRDtBQUNELEdBZEQ7QUFlRCxDQTFDTyxDQUFSIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFNRVhTY3JhcGVyIGZyb20gJy4vYW1leCc7XG5pbXBvcnQge1xuICBtYXliZVRlc3RDb21wYW55QVBJLCBleHRlbmRBc3luY1RpbWVvdXQsIGdldFRlc3RzQ29uZmlnLCBleHBvcnRUcmFuc2FjdGlvbnMsXG59IGZyb20gJy4uL3Rlc3RzL3Rlc3RzLXV0aWxzJztcbmltcG9ydCB7IFNDUkFQRVJTIH0gZnJvbSAnLi4vZGVmaW5pdGlvbnMnO1xuaW1wb3J0IHsgTG9naW5SZXN1bHRzIH0gZnJvbSAnLi9iYXNlLXNjcmFwZXItd2l0aC1icm93c2VyJztcblxuY29uc3QgQ09NUEFOWV9JRCA9ICdhbWV4JzsgLy8gVE9ETyB0aGlzIHByb3BlcnR5IHNob3VsZCBiZSBoYXJkLWNvZGVkIGluIHRoZSBwcm92aWRlclxuY29uc3QgdGVzdHNDb25maWcgPSBnZXRUZXN0c0NvbmZpZygpO1xuXG5kZXNjcmliZSgnQU1FWCBsZWdhY3kgc2NyYXBlcicsICgpID0+IHtcbiAgYmVmb3JlQWxsKCgpID0+IHtcbiAgICBleHRlbmRBc3luY1RpbWVvdXQoKTsgLy8gVGhlIGRlZmF1bHQgdGltZW91dCBpcyA1IHNlY29uZHMgcGVyIGFzeW5jIHRlc3QsIHRoaXMgZnVuY3Rpb24gZXh0ZW5kcyB0aGUgdGltZW91dCB2YWx1ZVxuICB9KTtcblxuICB0ZXN0KCdzaG91bGQgZXhwb3NlIGxvZ2luIGZpZWxkcyBpbiBzY3JhcGVycyBjb25zdGFudCcsICgpID0+IHtcbiAgICBleHBlY3QoU0NSQVBFUlMuYW1leCkudG9CZURlZmluZWQoKTtcbiAgICBleHBlY3QoU0NSQVBFUlMuYW1leC5sb2dpbkZpZWxkcykudG9Db250YWluKCdpZCcpO1xuICAgIGV4cGVjdChTQ1JBUEVSUy5hbWV4LmxvZ2luRmllbGRzKS50b0NvbnRhaW4oJ2NhcmQ2RGlnaXRzJyk7XG4gICAgZXhwZWN0KFNDUkFQRVJTLmFtZXgubG9naW5GaWVsZHMpLnRvQ29udGFpbigncGFzc3dvcmQnKTtcbiAgfSk7XG5cbiAgbWF5YmVUZXN0Q29tcGFueUFQSShDT01QQU5ZX0lELCAoY29uZmlnKSA9PiBjb25maWcuY29tcGFueUFQSS5pbnZhbGlkUGFzc3dvcmQpKCdzaG91bGQgZmFpbCBvbiBpbnZhbGlkIHVzZXIvcGFzc3dvcmRcIicsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgLi4udGVzdHNDb25maWcub3B0aW9ucyxcbiAgICAgIGNvbXBhbnlJZDogQ09NUEFOWV9JRCxcbiAgICB9O1xuXG4gICAgY29uc3Qgc2NyYXBlciA9IG5ldyBBTUVYU2NyYXBlcihvcHRpb25zKTtcblxuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHNjcmFwZXIuc2NyYXBlKHsgdXNlcm5hbWU6ICdlMTBzMTInLCBwYXNzd29yZDogJzNmM3NzM2QnIH0pO1xuXG4gICAgZXhwZWN0KHJlc3VsdCkudG9CZURlZmluZWQoKTtcbiAgICBleHBlY3QocmVzdWx0LnN1Y2Nlc3MpLnRvQmVGYWxzeSgpO1xuICAgIGV4cGVjdChyZXN1bHQuZXJyb3JUeXBlKS50b0JlKExvZ2luUmVzdWx0cy5JbnZhbGlkUGFzc3dvcmQpO1xuICB9KTtcblxuICBtYXliZVRlc3RDb21wYW55QVBJKENPTVBBTllfSUQpKCdzaG91bGQgc2NyYXBlIHRyYW5zYWN0aW9uc1wiJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICAuLi50ZXN0c0NvbmZpZy5vcHRpb25zLFxuICAgICAgY29tcGFueUlkOiBDT01QQU5ZX0lELFxuICAgIH07XG5cbiAgICBjb25zdCBzY3JhcGVyID0gbmV3IEFNRVhTY3JhcGVyKG9wdGlvbnMpO1xuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHNjcmFwZXIuc2NyYXBlKHRlc3RzQ29uZmlnLmNyZWRlbnRpYWxzLmFtZXgpO1xuICAgIGV4cGVjdChyZXN1bHQpLnRvQmVEZWZpbmVkKCk7XG4gICAgY29uc3QgZXJyb3IgPSBgJHtyZXN1bHQuZXJyb3JUeXBlIHx8ICcnfSAke3Jlc3VsdC5lcnJvck1lc3NhZ2UgfHwgJyd9YC50cmltKCk7XG4gICAgZXhwZWN0KGVycm9yKS50b0JlKCcnKTtcbiAgICBleHBlY3QocmVzdWx0LnN1Y2Nlc3MpLnRvQmVUcnV0aHkoKTtcblxuICAgIGV4cG9ydFRyYW5zYWN0aW9ucyhDT01QQU5ZX0lELCByZXN1bHQuYWNjb3VudHMgfHwgW10pO1xuICB9KTtcbn0pO1xuIl19