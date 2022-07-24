"use strict";

require("core-js/modules/es.promise");

require("core-js/modules/es.string.trim");

var _isracard = _interopRequireDefault(require("./isracard"));

var _testsUtils = require("../tests/tests-utils");

var _definitions = require("../definitions");

var _baseScraperWithBrowser = require("./base-scraper-with-browser");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const COMPANY_ID = 'isracard'; // TODO this property should be hard-coded in the provider

const testsConfig = (0, _testsUtils.getTestsConfig)();
describe('Isracard legacy scraper', () => {
  beforeAll(() => {
    (0, _testsUtils.extendAsyncTimeout)(); // The default timeout is 5 seconds per async test, this function extends the timeout value
  });
  test('should expose login fields in scrapers constant', () => {
    expect(_definitions.SCRAPERS.isracard).toBeDefined();
    expect(_definitions.SCRAPERS.isracard.loginFields).toContain('id');
    expect(_definitions.SCRAPERS.isracard.loginFields).toContain('card6Digits');
    expect(_definitions.SCRAPERS.isracard.loginFields).toContain('password');
  });
  (0, _testsUtils.maybeTestCompanyAPI)(COMPANY_ID, config => config.companyAPI.invalidPassword)('should fail on invalid user/password"', async () => {
    const options = _objectSpread({}, testsConfig.options, {
      companyId: COMPANY_ID
    });

    const scraper = new _isracard.default(options);
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

    const scraper = new _isracard.default(options);
    const result = await scraper.scrape(testsConfig.credentials.isracard);
    expect(result).toBeDefined();
    const error = `${result.errorType || ''} ${result.errorMessage || ''}`.trim();
    expect(error).toBe('');
    expect(result.success).toBeTruthy();
    (0, _testsUtils.exportTransactions)(COMPANY_ID, result.accounts || []);
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zY3JhcGVycy9pc3JhY2FyZC50ZXN0LnRzIl0sIm5hbWVzIjpbIkNPTVBBTllfSUQiLCJ0ZXN0c0NvbmZpZyIsImRlc2NyaWJlIiwiYmVmb3JlQWxsIiwidGVzdCIsImV4cGVjdCIsIlNDUkFQRVJTIiwiaXNyYWNhcmQiLCJ0b0JlRGVmaW5lZCIsImxvZ2luRmllbGRzIiwidG9Db250YWluIiwiY29uZmlnIiwiY29tcGFueUFQSSIsImludmFsaWRQYXNzd29yZCIsIm9wdGlvbnMiLCJjb21wYW55SWQiLCJzY3JhcGVyIiwiSXNyYWNhcmRTY3JhcGVyIiwicmVzdWx0Iiwic2NyYXBlIiwidXNlcm5hbWUiLCJwYXNzd29yZCIsInN1Y2Nlc3MiLCJ0b0JlRmFsc3kiLCJlcnJvclR5cGUiLCJ0b0JlIiwiTG9naW5SZXN1bHRzIiwiSW52YWxpZFBhc3N3b3JkIiwiY3JlZGVudGlhbHMiLCJlcnJvciIsImVycm9yTWVzc2FnZSIsInRyaW0iLCJ0b0JlVHJ1dGh5IiwiYWNjb3VudHMiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOztBQUNBOztBQUdBOztBQUNBOzs7Ozs7Ozs7O0FBRUEsTUFBTUEsVUFBVSxHQUFHLFVBQW5CLEMsQ0FBK0I7O0FBQy9CLE1BQU1DLFdBQVcsR0FBRyxpQ0FBcEI7QUFFQUMsUUFBUSxDQUFDLHlCQUFELEVBQTRCLE1BQU07QUFDeENDLEVBQUFBLFNBQVMsQ0FBQyxNQUFNO0FBQ2QsMENBRGMsQ0FDUTtBQUN2QixHQUZRLENBQVQ7QUFJQUMsRUFBQUEsSUFBSSxDQUFDLGlEQUFELEVBQW9ELE1BQU07QUFDNURDLElBQUFBLE1BQU0sQ0FBQ0Msc0JBQVNDLFFBQVYsQ0FBTixDQUEwQkMsV0FBMUI7QUFDQUgsSUFBQUEsTUFBTSxDQUFDQyxzQkFBU0MsUUFBVCxDQUFrQkUsV0FBbkIsQ0FBTixDQUFzQ0MsU0FBdEMsQ0FBZ0QsSUFBaEQ7QUFDQUwsSUFBQUEsTUFBTSxDQUFDQyxzQkFBU0MsUUFBVCxDQUFrQkUsV0FBbkIsQ0FBTixDQUFzQ0MsU0FBdEMsQ0FBZ0QsYUFBaEQ7QUFDQUwsSUFBQUEsTUFBTSxDQUFDQyxzQkFBU0MsUUFBVCxDQUFrQkUsV0FBbkIsQ0FBTixDQUFzQ0MsU0FBdEMsQ0FBZ0QsVUFBaEQ7QUFDRCxHQUxHLENBQUo7QUFPQSx1Q0FBb0JWLFVBQXBCLEVBQWlDVyxNQUFELElBQVlBLE1BQU0sQ0FBQ0MsVUFBUCxDQUFrQkMsZUFBOUQsRUFBK0UsdUNBQS9FLEVBQXdILFlBQVk7QUFDbEksVUFBTUMsT0FBTyxxQkFDUmIsV0FBVyxDQUFDYSxPQURKO0FBRVhDLE1BQUFBLFNBQVMsRUFBRWY7QUFGQSxNQUFiOztBQUtBLFVBQU1nQixPQUFPLEdBQUcsSUFBSUMsaUJBQUosQ0FBb0JILE9BQXBCLENBQWhCO0FBRUEsVUFBTUksTUFBTSxHQUFHLE1BQU1GLE9BQU8sQ0FBQ0csTUFBUixDQUFlO0FBQUVDLE1BQUFBLFFBQVEsRUFBRSxRQUFaO0FBQXNCQyxNQUFBQSxRQUFRLEVBQUU7QUFBaEMsS0FBZixDQUFyQjtBQUVBaEIsSUFBQUEsTUFBTSxDQUFDYSxNQUFELENBQU4sQ0FBZVYsV0FBZjtBQUNBSCxJQUFBQSxNQUFNLENBQUNhLE1BQU0sQ0FBQ0ksT0FBUixDQUFOLENBQXVCQyxTQUF2QjtBQUNBbEIsSUFBQUEsTUFBTSxDQUFDYSxNQUFNLENBQUNNLFNBQVIsQ0FBTixDQUF5QkMsSUFBekIsQ0FBOEJDLHFDQUFhQyxlQUEzQztBQUNELEdBYkQ7QUFlQSx1Q0FBb0IzQixVQUFwQixFQUFnQyw2QkFBaEMsRUFBK0QsWUFBWTtBQUN6RSxVQUFNYyxPQUFPLHFCQUNSYixXQUFXLENBQUNhLE9BREo7QUFFWEMsTUFBQUEsU0FBUyxFQUFFZjtBQUZBLE1BQWI7O0FBS0EsVUFBTWdCLE9BQU8sR0FBRyxJQUFJQyxpQkFBSixDQUFvQkgsT0FBcEIsQ0FBaEI7QUFDQSxVQUFNSSxNQUFNLEdBQUcsTUFBTUYsT0FBTyxDQUFDRyxNQUFSLENBQWVsQixXQUFXLENBQUMyQixXQUFaLENBQXdCckIsUUFBdkMsQ0FBckI7QUFDQUYsSUFBQUEsTUFBTSxDQUFDYSxNQUFELENBQU4sQ0FBZVYsV0FBZjtBQUNBLFVBQU1xQixLQUFLLEdBQUksR0FBRVgsTUFBTSxDQUFDTSxTQUFQLElBQW9CLEVBQUcsSUFBR04sTUFBTSxDQUFDWSxZQUFQLElBQXVCLEVBQUcsRUFBdkQsQ0FBeURDLElBQXpELEVBQWQ7QUFDQTFCLElBQUFBLE1BQU0sQ0FBQ3dCLEtBQUQsQ0FBTixDQUFjSixJQUFkLENBQW1CLEVBQW5CO0FBQ0FwQixJQUFBQSxNQUFNLENBQUNhLE1BQU0sQ0FBQ0ksT0FBUixDQUFOLENBQXVCVSxVQUF2QjtBQUVBLHdDQUFtQmhDLFVBQW5CLEVBQStCa0IsTUFBTSxDQUFDZSxRQUFQLElBQW1CLEVBQWxEO0FBQ0QsR0FkRDtBQWVELENBMUNPLENBQVIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgSXNyYWNhcmRTY3JhcGVyIGZyb20gJy4vaXNyYWNhcmQnO1xuaW1wb3J0IHtcbiAgbWF5YmVUZXN0Q29tcGFueUFQSSwgZXh0ZW5kQXN5bmNUaW1lb3V0LCBnZXRUZXN0c0NvbmZpZywgZXhwb3J0VHJhbnNhY3Rpb25zLFxufSBmcm9tICcuLi90ZXN0cy90ZXN0cy11dGlscyc7XG5pbXBvcnQgeyBTQ1JBUEVSUyB9IGZyb20gJy4uL2RlZmluaXRpb25zJztcbmltcG9ydCB7IExvZ2luUmVzdWx0cyB9IGZyb20gJy4vYmFzZS1zY3JhcGVyLXdpdGgtYnJvd3Nlcic7XG5cbmNvbnN0IENPTVBBTllfSUQgPSAnaXNyYWNhcmQnOyAvLyBUT0RPIHRoaXMgcHJvcGVydHkgc2hvdWxkIGJlIGhhcmQtY29kZWQgaW4gdGhlIHByb3ZpZGVyXG5jb25zdCB0ZXN0c0NvbmZpZyA9IGdldFRlc3RzQ29uZmlnKCk7XG5cbmRlc2NyaWJlKCdJc3JhY2FyZCBsZWdhY3kgc2NyYXBlcicsICgpID0+IHtcbiAgYmVmb3JlQWxsKCgpID0+IHtcbiAgICBleHRlbmRBc3luY1RpbWVvdXQoKTsgLy8gVGhlIGRlZmF1bHQgdGltZW91dCBpcyA1IHNlY29uZHMgcGVyIGFzeW5jIHRlc3QsIHRoaXMgZnVuY3Rpb24gZXh0ZW5kcyB0aGUgdGltZW91dCB2YWx1ZVxuICB9KTtcblxuICB0ZXN0KCdzaG91bGQgZXhwb3NlIGxvZ2luIGZpZWxkcyBpbiBzY3JhcGVycyBjb25zdGFudCcsICgpID0+IHtcbiAgICBleHBlY3QoU0NSQVBFUlMuaXNyYWNhcmQpLnRvQmVEZWZpbmVkKCk7XG4gICAgZXhwZWN0KFNDUkFQRVJTLmlzcmFjYXJkLmxvZ2luRmllbGRzKS50b0NvbnRhaW4oJ2lkJyk7XG4gICAgZXhwZWN0KFNDUkFQRVJTLmlzcmFjYXJkLmxvZ2luRmllbGRzKS50b0NvbnRhaW4oJ2NhcmQ2RGlnaXRzJyk7XG4gICAgZXhwZWN0KFNDUkFQRVJTLmlzcmFjYXJkLmxvZ2luRmllbGRzKS50b0NvbnRhaW4oJ3Bhc3N3b3JkJyk7XG4gIH0pO1xuXG4gIG1heWJlVGVzdENvbXBhbnlBUEkoQ09NUEFOWV9JRCwgKGNvbmZpZykgPT4gY29uZmlnLmNvbXBhbnlBUEkuaW52YWxpZFBhc3N3b3JkKSgnc2hvdWxkIGZhaWwgb24gaW52YWxpZCB1c2VyL3Bhc3N3b3JkXCInLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgIC4uLnRlc3RzQ29uZmlnLm9wdGlvbnMsXG4gICAgICBjb21wYW55SWQ6IENPTVBBTllfSUQsXG4gICAgfTtcblxuICAgIGNvbnN0IHNjcmFwZXIgPSBuZXcgSXNyYWNhcmRTY3JhcGVyKG9wdGlvbnMpO1xuXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgc2NyYXBlci5zY3JhcGUoeyB1c2VybmFtZTogJ2UxMHMxMicsIHBhc3N3b3JkOiAnM2Yzc3MzZCcgfSk7XG5cbiAgICBleHBlY3QocmVzdWx0KS50b0JlRGVmaW5lZCgpO1xuICAgIGV4cGVjdChyZXN1bHQuc3VjY2VzcykudG9CZUZhbHN5KCk7XG4gICAgZXhwZWN0KHJlc3VsdC5lcnJvclR5cGUpLnRvQmUoTG9naW5SZXN1bHRzLkludmFsaWRQYXNzd29yZCk7XG4gIH0pO1xuXG4gIG1heWJlVGVzdENvbXBhbnlBUEkoQ09NUEFOWV9JRCkoJ3Nob3VsZCBzY3JhcGUgdHJhbnNhY3Rpb25zXCInLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgIC4uLnRlc3RzQ29uZmlnLm9wdGlvbnMsXG4gICAgICBjb21wYW55SWQ6IENPTVBBTllfSUQsXG4gICAgfTtcblxuICAgIGNvbnN0IHNjcmFwZXIgPSBuZXcgSXNyYWNhcmRTY3JhcGVyKG9wdGlvbnMpO1xuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHNjcmFwZXIuc2NyYXBlKHRlc3RzQ29uZmlnLmNyZWRlbnRpYWxzLmlzcmFjYXJkKTtcbiAgICBleHBlY3QocmVzdWx0KS50b0JlRGVmaW5lZCgpO1xuICAgIGNvbnN0IGVycm9yID0gYCR7cmVzdWx0LmVycm9yVHlwZSB8fCAnJ30gJHtyZXN1bHQuZXJyb3JNZXNzYWdlIHx8ICcnfWAudHJpbSgpO1xuICAgIGV4cGVjdChlcnJvcikudG9CZSgnJyk7XG4gICAgZXhwZWN0KHJlc3VsdC5zdWNjZXNzKS50b0JlVHJ1dGh5KCk7XG5cbiAgICBleHBvcnRUcmFuc2FjdGlvbnMoQ09NUEFOWV9JRCwgcmVzdWx0LmFjY291bnRzIHx8IFtdKTtcbiAgfSk7XG59KTtcbiJdfQ==