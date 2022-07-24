"use strict";

require("core-js/modules/es.promise");

require("core-js/modules/es.string.trim");

var _beyahadBishvilha = _interopRequireDefault(require("./beyahad-bishvilha"));

var _testsUtils = require("../tests/tests-utils");

var _definitions = require("../definitions");

var _baseScraperWithBrowser = require("./base-scraper-with-browser");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const COMPANY_ID = 'beyahadBishvilha'; // TODO this property should be hard-coded in the provider

const testsConfig = (0, _testsUtils.getTestsConfig)();
describe('Beyahad Bishvilha scraper', () => {
  beforeAll(() => {
    (0, _testsUtils.extendAsyncTimeout)(); // The default timeout is 5 seconds per async test, this function extends the timeout value
  });
  test('should expose login fields in scrapers constant', () => {
    expect(_definitions.SCRAPERS.beyahadBishvilha).toBeDefined();
    expect(_definitions.SCRAPERS.beyahadBishvilha.loginFields).toContain('id');
    expect(_definitions.SCRAPERS.beyahadBishvilha.loginFields).toContain('password');
  });
  (0, _testsUtils.maybeTestCompanyAPI)(COMPANY_ID, config => config.companyAPI.invalidPassword)('should fail on invalid user/password"', async () => {
    const options = _objectSpread({}, testsConfig.options, {
      companyId: COMPANY_ID
    });

    const scraper = new _beyahadBishvilha.default(options);
    const result = await scraper.scrape({
      id: 'e10s12',
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

    const scraper = new _beyahadBishvilha.default(options);
    const result = await scraper.scrape(testsConfig.credentials.beyahadBishvilha);
    expect(result).toBeDefined();
    const error = `${result.errorType || ''} ${result.errorMessage || ''}`.trim();
    expect(error).toBe('');
    expect(result.success).toBeTruthy();
    (0, _testsUtils.exportTransactions)(COMPANY_ID, result.accounts || []);
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zY3JhcGVycy9iZXlhaGFkLWJpc2h2aWxoYS50ZXN0LnRzIl0sIm5hbWVzIjpbIkNPTVBBTllfSUQiLCJ0ZXN0c0NvbmZpZyIsImRlc2NyaWJlIiwiYmVmb3JlQWxsIiwidGVzdCIsImV4cGVjdCIsIlNDUkFQRVJTIiwiYmV5YWhhZEJpc2h2aWxoYSIsInRvQmVEZWZpbmVkIiwibG9naW5GaWVsZHMiLCJ0b0NvbnRhaW4iLCJjb25maWciLCJjb21wYW55QVBJIiwiaW52YWxpZFBhc3N3b3JkIiwib3B0aW9ucyIsImNvbXBhbnlJZCIsInNjcmFwZXIiLCJCZXlhaGFkQmlzaHZpbGhhU2NyYXBlciIsInJlc3VsdCIsInNjcmFwZSIsImlkIiwicGFzc3dvcmQiLCJzdWNjZXNzIiwidG9CZUZhbHN5IiwiZXJyb3JUeXBlIiwidG9CZSIsIkxvZ2luUmVzdWx0cyIsIkludmFsaWRQYXNzd29yZCIsImNyZWRlbnRpYWxzIiwiZXJyb3IiLCJlcnJvck1lc3NhZ2UiLCJ0cmltIiwidG9CZVRydXRoeSIsImFjY291bnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7QUFDQTs7QUFHQTs7QUFDQTs7Ozs7Ozs7OztBQUVBLE1BQU1BLFVBQVUsR0FBRyxrQkFBbkIsQyxDQUF1Qzs7QUFDdkMsTUFBTUMsV0FBVyxHQUFHLGlDQUFwQjtBQUVBQyxRQUFRLENBQUMsMkJBQUQsRUFBOEIsTUFBTTtBQUMxQ0MsRUFBQUEsU0FBUyxDQUFDLE1BQU07QUFDZCwwQ0FEYyxDQUNRO0FBQ3ZCLEdBRlEsQ0FBVDtBQUlBQyxFQUFBQSxJQUFJLENBQUMsaURBQUQsRUFBb0QsTUFBTTtBQUM1REMsSUFBQUEsTUFBTSxDQUFDQyxzQkFBU0MsZ0JBQVYsQ0FBTixDQUFrQ0MsV0FBbEM7QUFDQUgsSUFBQUEsTUFBTSxDQUFDQyxzQkFBU0MsZ0JBQVQsQ0FBMEJFLFdBQTNCLENBQU4sQ0FBOENDLFNBQTlDLENBQXdELElBQXhEO0FBQ0FMLElBQUFBLE1BQU0sQ0FBQ0Msc0JBQVNDLGdCQUFULENBQTBCRSxXQUEzQixDQUFOLENBQThDQyxTQUE5QyxDQUF3RCxVQUF4RDtBQUNELEdBSkcsQ0FBSjtBQU1BLHVDQUFvQlYsVUFBcEIsRUFBaUNXLE1BQUQsSUFBWUEsTUFBTSxDQUFDQyxVQUFQLENBQWtCQyxlQUE5RCxFQUErRSx1Q0FBL0UsRUFBd0gsWUFBWTtBQUNsSSxVQUFNQyxPQUFPLHFCQUNSYixXQUFXLENBQUNhLE9BREo7QUFFWEMsTUFBQUEsU0FBUyxFQUFFZjtBQUZBLE1BQWI7O0FBS0EsVUFBTWdCLE9BQU8sR0FBRyxJQUFJQyx5QkFBSixDQUE0QkgsT0FBNUIsQ0FBaEI7QUFFQSxVQUFNSSxNQUFNLEdBQUcsTUFBTUYsT0FBTyxDQUFDRyxNQUFSLENBQWU7QUFBRUMsTUFBQUEsRUFBRSxFQUFFLFFBQU47QUFBZ0JDLE1BQUFBLFFBQVEsRUFBRTtBQUExQixLQUFmLENBQXJCO0FBRUFoQixJQUFBQSxNQUFNLENBQUNhLE1BQUQsQ0FBTixDQUFlVixXQUFmO0FBQ0FILElBQUFBLE1BQU0sQ0FBQ2EsTUFBTSxDQUFDSSxPQUFSLENBQU4sQ0FBdUJDLFNBQXZCO0FBQ0FsQixJQUFBQSxNQUFNLENBQUNhLE1BQU0sQ0FBQ00sU0FBUixDQUFOLENBQXlCQyxJQUF6QixDQUE4QkMscUNBQWFDLGVBQTNDO0FBQ0QsR0FiRDtBQWVBLHVDQUFvQjNCLFVBQXBCLEVBQWdDLDZCQUFoQyxFQUErRCxZQUFZO0FBQ3pFLFVBQU1jLE9BQU8scUJBQ1JiLFdBQVcsQ0FBQ2EsT0FESjtBQUVYQyxNQUFBQSxTQUFTLEVBQUVmO0FBRkEsTUFBYjs7QUFLQSxVQUFNZ0IsT0FBTyxHQUFHLElBQUlDLHlCQUFKLENBQTRCSCxPQUE1QixDQUFoQjtBQUNBLFVBQU1JLE1BQU0sR0FBRyxNQUFNRixPQUFPLENBQUNHLE1BQVIsQ0FBZWxCLFdBQVcsQ0FBQzJCLFdBQVosQ0FBd0JyQixnQkFBdkMsQ0FBckI7QUFDQUYsSUFBQUEsTUFBTSxDQUFDYSxNQUFELENBQU4sQ0FBZVYsV0FBZjtBQUNBLFVBQU1xQixLQUFLLEdBQUksR0FBRVgsTUFBTSxDQUFDTSxTQUFQLElBQW9CLEVBQUcsSUFBR04sTUFBTSxDQUFDWSxZQUFQLElBQXVCLEVBQUcsRUFBdkQsQ0FBeURDLElBQXpELEVBQWQ7QUFDQTFCLElBQUFBLE1BQU0sQ0FBQ3dCLEtBQUQsQ0FBTixDQUFjSixJQUFkLENBQW1CLEVBQW5CO0FBQ0FwQixJQUFBQSxNQUFNLENBQUNhLE1BQU0sQ0FBQ0ksT0FBUixDQUFOLENBQXVCVSxVQUF2QjtBQUVBLHdDQUFtQmhDLFVBQW5CLEVBQStCa0IsTUFBTSxDQUFDZSxRQUFQLElBQW1CLEVBQWxEO0FBQ0QsR0FkRDtBQWVELENBekNPLENBQVIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmV5YWhhZEJpc2h2aWxoYVNjcmFwZXIgZnJvbSAnLi9iZXlhaGFkLWJpc2h2aWxoYSc7XG5pbXBvcnQge1xuICBtYXliZVRlc3RDb21wYW55QVBJLCBleHRlbmRBc3luY1RpbWVvdXQsIGdldFRlc3RzQ29uZmlnLCBleHBvcnRUcmFuc2FjdGlvbnMsXG59IGZyb20gJy4uL3Rlc3RzL3Rlc3RzLXV0aWxzJztcbmltcG9ydCB7IFNDUkFQRVJTIH0gZnJvbSAnLi4vZGVmaW5pdGlvbnMnO1xuaW1wb3J0IHsgTG9naW5SZXN1bHRzIH0gZnJvbSAnLi9iYXNlLXNjcmFwZXItd2l0aC1icm93c2VyJztcblxuY29uc3QgQ09NUEFOWV9JRCA9ICdiZXlhaGFkQmlzaHZpbGhhJzsgLy8gVE9ETyB0aGlzIHByb3BlcnR5IHNob3VsZCBiZSBoYXJkLWNvZGVkIGluIHRoZSBwcm92aWRlclxuY29uc3QgdGVzdHNDb25maWcgPSBnZXRUZXN0c0NvbmZpZygpO1xuXG5kZXNjcmliZSgnQmV5YWhhZCBCaXNodmlsaGEgc2NyYXBlcicsICgpID0+IHtcbiAgYmVmb3JlQWxsKCgpID0+IHtcbiAgICBleHRlbmRBc3luY1RpbWVvdXQoKTsgLy8gVGhlIGRlZmF1bHQgdGltZW91dCBpcyA1IHNlY29uZHMgcGVyIGFzeW5jIHRlc3QsIHRoaXMgZnVuY3Rpb24gZXh0ZW5kcyB0aGUgdGltZW91dCB2YWx1ZVxuICB9KTtcblxuICB0ZXN0KCdzaG91bGQgZXhwb3NlIGxvZ2luIGZpZWxkcyBpbiBzY3JhcGVycyBjb25zdGFudCcsICgpID0+IHtcbiAgICBleHBlY3QoU0NSQVBFUlMuYmV5YWhhZEJpc2h2aWxoYSkudG9CZURlZmluZWQoKTtcbiAgICBleHBlY3QoU0NSQVBFUlMuYmV5YWhhZEJpc2h2aWxoYS5sb2dpbkZpZWxkcykudG9Db250YWluKCdpZCcpO1xuICAgIGV4cGVjdChTQ1JBUEVSUy5iZXlhaGFkQmlzaHZpbGhhLmxvZ2luRmllbGRzKS50b0NvbnRhaW4oJ3Bhc3N3b3JkJyk7XG4gIH0pO1xuXG4gIG1heWJlVGVzdENvbXBhbnlBUEkoQ09NUEFOWV9JRCwgKGNvbmZpZykgPT4gY29uZmlnLmNvbXBhbnlBUEkuaW52YWxpZFBhc3N3b3JkKSgnc2hvdWxkIGZhaWwgb24gaW52YWxpZCB1c2VyL3Bhc3N3b3JkXCInLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgIC4uLnRlc3RzQ29uZmlnLm9wdGlvbnMsXG4gICAgICBjb21wYW55SWQ6IENPTVBBTllfSUQsXG4gICAgfTtcblxuICAgIGNvbnN0IHNjcmFwZXIgPSBuZXcgQmV5YWhhZEJpc2h2aWxoYVNjcmFwZXIob3B0aW9ucyk7XG5cbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBzY3JhcGVyLnNjcmFwZSh7IGlkOiAnZTEwczEyJywgcGFzc3dvcmQ6ICczZjNzczNkJyB9KTtcblxuICAgIGV4cGVjdChyZXN1bHQpLnRvQmVEZWZpbmVkKCk7XG4gICAgZXhwZWN0KHJlc3VsdC5zdWNjZXNzKS50b0JlRmFsc3koKTtcbiAgICBleHBlY3QocmVzdWx0LmVycm9yVHlwZSkudG9CZShMb2dpblJlc3VsdHMuSW52YWxpZFBhc3N3b3JkKTtcbiAgfSk7XG5cbiAgbWF5YmVUZXN0Q29tcGFueUFQSShDT01QQU5ZX0lEKSgnc2hvdWxkIHNjcmFwZSB0cmFuc2FjdGlvbnNcIicsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgLi4udGVzdHNDb25maWcub3B0aW9ucyxcbiAgICAgIGNvbXBhbnlJZDogQ09NUEFOWV9JRCxcbiAgICB9O1xuXG4gICAgY29uc3Qgc2NyYXBlciA9IG5ldyBCZXlhaGFkQmlzaHZpbGhhU2NyYXBlcihvcHRpb25zKTtcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBzY3JhcGVyLnNjcmFwZSh0ZXN0c0NvbmZpZy5jcmVkZW50aWFscy5iZXlhaGFkQmlzaHZpbGhhKTtcbiAgICBleHBlY3QocmVzdWx0KS50b0JlRGVmaW5lZCgpO1xuICAgIGNvbnN0IGVycm9yID0gYCR7cmVzdWx0LmVycm9yVHlwZSB8fCAnJ30gJHtyZXN1bHQuZXJyb3JNZXNzYWdlIHx8ICcnfWAudHJpbSgpO1xuICAgIGV4cGVjdChlcnJvcikudG9CZSgnJyk7XG4gICAgZXhwZWN0KHJlc3VsdC5zdWNjZXNzKS50b0JlVHJ1dGh5KCk7XG5cbiAgICBleHBvcnRUcmFuc2FjdGlvbnMoQ09NUEFOWV9JRCwgcmVzdWx0LmFjY291bnRzIHx8IFtdKTtcbiAgfSk7XG59KTtcbiJdfQ==