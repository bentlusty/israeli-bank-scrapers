"use strict";

require("core-js/modules/es.promise");

require("core-js/modules/es.string.trim");

var _discount = _interopRequireDefault(require("./discount"));

var _testsUtils = require("../tests/tests-utils");

var _definitions = require("../definitions");

var _baseScraperWithBrowser = require("./base-scraper-with-browser");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const COMPANY_ID = 'discount'; // TODO this property should be hard-coded in the provider

const testsConfig = (0, _testsUtils.getTestsConfig)();
describe('Discount legacy scraper', () => {
  beforeAll(() => {
    (0, _testsUtils.extendAsyncTimeout)(); // The default timeout is 5 seconds per async test, this function extends the timeout value
  });
  test('should expose login fields in scrapers constant', () => {
    expect(_definitions.SCRAPERS.discount).toBeDefined();
    expect(_definitions.SCRAPERS.discount.loginFields).toContain('id');
    expect(_definitions.SCRAPERS.discount.loginFields).toContain('password');
    expect(_definitions.SCRAPERS.discount.loginFields).toContain('num');
  });
  (0, _testsUtils.maybeTestCompanyAPI)(COMPANY_ID, config => config.companyAPI.invalidPassword)('should fail on invalid user/password"', async () => {
    const options = _objectSpread({}, testsConfig.options, {
      companyId: COMPANY_ID
    });

    const scraper = new _discount.default(options);
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

    const scraper = new _discount.default(options);
    const result = await scraper.scrape(testsConfig.credentials.discount);
    expect(result).toBeDefined();
    const error = `${result.errorType || ''} ${result.errorMessage || ''}`.trim();
    expect(error).toBe('');
    expect(result.success).toBeTruthy();
    (0, _testsUtils.exportTransactions)(COMPANY_ID, result.accounts || []);
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zY3JhcGVycy9kaXNjb3VudC50ZXN0LnRzIl0sIm5hbWVzIjpbIkNPTVBBTllfSUQiLCJ0ZXN0c0NvbmZpZyIsImRlc2NyaWJlIiwiYmVmb3JlQWxsIiwidGVzdCIsImV4cGVjdCIsIlNDUkFQRVJTIiwiZGlzY291bnQiLCJ0b0JlRGVmaW5lZCIsImxvZ2luRmllbGRzIiwidG9Db250YWluIiwiY29uZmlnIiwiY29tcGFueUFQSSIsImludmFsaWRQYXNzd29yZCIsIm9wdGlvbnMiLCJjb21wYW55SWQiLCJzY3JhcGVyIiwiRGlzY291bnRTY3JhcGVyIiwicmVzdWx0Iiwic2NyYXBlIiwidXNlcm5hbWUiLCJwYXNzd29yZCIsInN1Y2Nlc3MiLCJ0b0JlRmFsc3kiLCJlcnJvclR5cGUiLCJ0b0JlIiwiTG9naW5SZXN1bHRzIiwiSW52YWxpZFBhc3N3b3JkIiwiY3JlZGVudGlhbHMiLCJlcnJvciIsImVycm9yTWVzc2FnZSIsInRyaW0iLCJ0b0JlVHJ1dGh5IiwiYWNjb3VudHMiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOztBQUNBOztBQUdBOztBQUNBOzs7Ozs7Ozs7O0FBRUEsTUFBTUEsVUFBVSxHQUFHLFVBQW5CLEMsQ0FBK0I7O0FBQy9CLE1BQU1DLFdBQVcsR0FBRyxpQ0FBcEI7QUFFQUMsUUFBUSxDQUFDLHlCQUFELEVBQTRCLE1BQU07QUFDeENDLEVBQUFBLFNBQVMsQ0FBQyxNQUFNO0FBQ2QsMENBRGMsQ0FDUTtBQUN2QixHQUZRLENBQVQ7QUFJQUMsRUFBQUEsSUFBSSxDQUFDLGlEQUFELEVBQW9ELE1BQU07QUFDNURDLElBQUFBLE1BQU0sQ0FBQ0Msc0JBQVNDLFFBQVYsQ0FBTixDQUEwQkMsV0FBMUI7QUFDQUgsSUFBQUEsTUFBTSxDQUFDQyxzQkFBU0MsUUFBVCxDQUFrQkUsV0FBbkIsQ0FBTixDQUFzQ0MsU0FBdEMsQ0FBZ0QsSUFBaEQ7QUFDQUwsSUFBQUEsTUFBTSxDQUFDQyxzQkFBU0MsUUFBVCxDQUFrQkUsV0FBbkIsQ0FBTixDQUFzQ0MsU0FBdEMsQ0FBZ0QsVUFBaEQ7QUFDQUwsSUFBQUEsTUFBTSxDQUFDQyxzQkFBU0MsUUFBVCxDQUFrQkUsV0FBbkIsQ0FBTixDQUFzQ0MsU0FBdEMsQ0FBZ0QsS0FBaEQ7QUFDRCxHQUxHLENBQUo7QUFPQSx1Q0FBb0JWLFVBQXBCLEVBQWlDVyxNQUFELElBQVlBLE1BQU0sQ0FBQ0MsVUFBUCxDQUFrQkMsZUFBOUQsRUFBK0UsdUNBQS9FLEVBQXdILFlBQVk7QUFDbEksVUFBTUMsT0FBTyxxQkFDUmIsV0FBVyxDQUFDYSxPQURKO0FBRVhDLE1BQUFBLFNBQVMsRUFBRWY7QUFGQSxNQUFiOztBQUtBLFVBQU1nQixPQUFPLEdBQUcsSUFBSUMsaUJBQUosQ0FBb0JILE9BQXBCLENBQWhCO0FBRUEsVUFBTUksTUFBTSxHQUFHLE1BQU1GLE9BQU8sQ0FBQ0csTUFBUixDQUFlO0FBQUVDLE1BQUFBLFFBQVEsRUFBRSxRQUFaO0FBQXNCQyxNQUFBQSxRQUFRLEVBQUU7QUFBaEMsS0FBZixDQUFyQjtBQUVBaEIsSUFBQUEsTUFBTSxDQUFDYSxNQUFELENBQU4sQ0FBZVYsV0FBZjtBQUNBSCxJQUFBQSxNQUFNLENBQUNhLE1BQU0sQ0FBQ0ksT0FBUixDQUFOLENBQXVCQyxTQUF2QjtBQUNBbEIsSUFBQUEsTUFBTSxDQUFDYSxNQUFNLENBQUNNLFNBQVIsQ0FBTixDQUF5QkMsSUFBekIsQ0FBOEJDLHFDQUFhQyxlQUEzQztBQUNELEdBYkQ7QUFlQSx1Q0FBb0IzQixVQUFwQixFQUFnQyw2QkFBaEMsRUFBK0QsWUFBWTtBQUN6RSxVQUFNYyxPQUFPLHFCQUNSYixXQUFXLENBQUNhLE9BREo7QUFFWEMsTUFBQUEsU0FBUyxFQUFFZjtBQUZBLE1BQWI7O0FBS0EsVUFBTWdCLE9BQU8sR0FBRyxJQUFJQyxpQkFBSixDQUFvQkgsT0FBcEIsQ0FBaEI7QUFDQSxVQUFNSSxNQUFNLEdBQUcsTUFBTUYsT0FBTyxDQUFDRyxNQUFSLENBQWVsQixXQUFXLENBQUMyQixXQUFaLENBQXdCckIsUUFBdkMsQ0FBckI7QUFDQUYsSUFBQUEsTUFBTSxDQUFDYSxNQUFELENBQU4sQ0FBZVYsV0FBZjtBQUNBLFVBQU1xQixLQUFLLEdBQUksR0FBRVgsTUFBTSxDQUFDTSxTQUFQLElBQW9CLEVBQUcsSUFBR04sTUFBTSxDQUFDWSxZQUFQLElBQXVCLEVBQUcsRUFBdkQsQ0FBeURDLElBQXpELEVBQWQ7QUFDQTFCLElBQUFBLE1BQU0sQ0FBQ3dCLEtBQUQsQ0FBTixDQUFjSixJQUFkLENBQW1CLEVBQW5CO0FBQ0FwQixJQUFBQSxNQUFNLENBQUNhLE1BQU0sQ0FBQ0ksT0FBUixDQUFOLENBQXVCVSxVQUF2QjtBQUVBLHdDQUFtQmhDLFVBQW5CLEVBQStCa0IsTUFBTSxDQUFDZSxRQUFQLElBQW1CLEVBQWxEO0FBQ0QsR0FkRDtBQWVELENBMUNPLENBQVIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRGlzY291bnRTY3JhcGVyIGZyb20gJy4vZGlzY291bnQnO1xuaW1wb3J0IHtcbiAgbWF5YmVUZXN0Q29tcGFueUFQSSwgZXh0ZW5kQXN5bmNUaW1lb3V0LCBnZXRUZXN0c0NvbmZpZywgZXhwb3J0VHJhbnNhY3Rpb25zLFxufSBmcm9tICcuLi90ZXN0cy90ZXN0cy11dGlscyc7XG5pbXBvcnQgeyBTQ1JBUEVSUyB9IGZyb20gJy4uL2RlZmluaXRpb25zJztcbmltcG9ydCB7IExvZ2luUmVzdWx0cyB9IGZyb20gJy4vYmFzZS1zY3JhcGVyLXdpdGgtYnJvd3Nlcic7XG5cbmNvbnN0IENPTVBBTllfSUQgPSAnZGlzY291bnQnOyAvLyBUT0RPIHRoaXMgcHJvcGVydHkgc2hvdWxkIGJlIGhhcmQtY29kZWQgaW4gdGhlIHByb3ZpZGVyXG5jb25zdCB0ZXN0c0NvbmZpZyA9IGdldFRlc3RzQ29uZmlnKCk7XG5cbmRlc2NyaWJlKCdEaXNjb3VudCBsZWdhY3kgc2NyYXBlcicsICgpID0+IHtcbiAgYmVmb3JlQWxsKCgpID0+IHtcbiAgICBleHRlbmRBc3luY1RpbWVvdXQoKTsgLy8gVGhlIGRlZmF1bHQgdGltZW91dCBpcyA1IHNlY29uZHMgcGVyIGFzeW5jIHRlc3QsIHRoaXMgZnVuY3Rpb24gZXh0ZW5kcyB0aGUgdGltZW91dCB2YWx1ZVxuICB9KTtcblxuICB0ZXN0KCdzaG91bGQgZXhwb3NlIGxvZ2luIGZpZWxkcyBpbiBzY3JhcGVycyBjb25zdGFudCcsICgpID0+IHtcbiAgICBleHBlY3QoU0NSQVBFUlMuZGlzY291bnQpLnRvQmVEZWZpbmVkKCk7XG4gICAgZXhwZWN0KFNDUkFQRVJTLmRpc2NvdW50LmxvZ2luRmllbGRzKS50b0NvbnRhaW4oJ2lkJyk7XG4gICAgZXhwZWN0KFNDUkFQRVJTLmRpc2NvdW50LmxvZ2luRmllbGRzKS50b0NvbnRhaW4oJ3Bhc3N3b3JkJyk7XG4gICAgZXhwZWN0KFNDUkFQRVJTLmRpc2NvdW50LmxvZ2luRmllbGRzKS50b0NvbnRhaW4oJ251bScpO1xuICB9KTtcblxuICBtYXliZVRlc3RDb21wYW55QVBJKENPTVBBTllfSUQsIChjb25maWcpID0+IGNvbmZpZy5jb21wYW55QVBJLmludmFsaWRQYXNzd29yZCkoJ3Nob3VsZCBmYWlsIG9uIGludmFsaWQgdXNlci9wYXNzd29yZFwiJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICAuLi50ZXN0c0NvbmZpZy5vcHRpb25zLFxuICAgICAgY29tcGFueUlkOiBDT01QQU5ZX0lELFxuICAgIH07XG5cbiAgICBjb25zdCBzY3JhcGVyID0gbmV3IERpc2NvdW50U2NyYXBlcihvcHRpb25zKTtcblxuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHNjcmFwZXIuc2NyYXBlKHsgdXNlcm5hbWU6ICdlMTBzMTInLCBwYXNzd29yZDogJzNmM3NzM2QnIH0pO1xuXG4gICAgZXhwZWN0KHJlc3VsdCkudG9CZURlZmluZWQoKTtcbiAgICBleHBlY3QocmVzdWx0LnN1Y2Nlc3MpLnRvQmVGYWxzeSgpO1xuICAgIGV4cGVjdChyZXN1bHQuZXJyb3JUeXBlKS50b0JlKExvZ2luUmVzdWx0cy5JbnZhbGlkUGFzc3dvcmQpO1xuICB9KTtcblxuICBtYXliZVRlc3RDb21wYW55QVBJKENPTVBBTllfSUQpKCdzaG91bGQgc2NyYXBlIHRyYW5zYWN0aW9uc1wiJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICAuLi50ZXN0c0NvbmZpZy5vcHRpb25zLFxuICAgICAgY29tcGFueUlkOiBDT01QQU5ZX0lELFxuICAgIH07XG5cbiAgICBjb25zdCBzY3JhcGVyID0gbmV3IERpc2NvdW50U2NyYXBlcihvcHRpb25zKTtcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBzY3JhcGVyLnNjcmFwZSh0ZXN0c0NvbmZpZy5jcmVkZW50aWFscy5kaXNjb3VudCk7XG4gICAgZXhwZWN0KHJlc3VsdCkudG9CZURlZmluZWQoKTtcbiAgICBjb25zdCBlcnJvciA9IGAke3Jlc3VsdC5lcnJvclR5cGUgfHwgJyd9ICR7cmVzdWx0LmVycm9yTWVzc2FnZSB8fCAnJ31gLnRyaW0oKTtcbiAgICBleHBlY3QoZXJyb3IpLnRvQmUoJycpO1xuICAgIGV4cGVjdChyZXN1bHQuc3VjY2VzcykudG9CZVRydXRoeSgpO1xuXG4gICAgZXhwb3J0VHJhbnNhY3Rpb25zKENPTVBBTllfSUQsIHJlc3VsdC5hY2NvdW50cyB8fCBbXSk7XG4gIH0pO1xufSk7XG4iXX0=