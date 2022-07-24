"use strict";

require("core-js/modules/es.promise");

require("core-js/modules/es.string.trim");

var _mizrahi = _interopRequireDefault(require("./mizrahi"));

var _testsUtils = require("../tests/tests-utils");

var _definitions = require("../definitions");

var _constants = require("../constants");

var _baseScraperWithBrowser = require("./base-scraper-with-browser");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const COMPANY_ID = 'mizrahi'; // TODO this property should be hard-coded in the provider

const testsConfig = (0, _testsUtils.getTestsConfig)();
describe('Mizrahi scraper', () => {
  beforeAll(() => {
    (0, _testsUtils.extendAsyncTimeout)(); // The default timeout is 5 seconds per async test, this function extends the timeout value
  });
  test('should expose login fields in scrapers constant', () => {
    expect(_definitions.SCRAPERS.mizrahi).toBeDefined();
    expect(_definitions.SCRAPERS.mizrahi.loginFields).toContain('username');
    expect(_definitions.SCRAPERS.mizrahi.loginFields).toContain('password');
  });
  (0, _testsUtils.maybeTestCompanyAPI)(COMPANY_ID, config => config.companyAPI.invalidPassword)('should fail on invalid user/password', async () => {
    const options = _objectSpread({}, testsConfig.options, {
      companyId: COMPANY_ID
    });

    const scraper = new _mizrahi.default(options);
    const result = await scraper.scrape({
      username: 'e10s12',
      password: '3f3ss3d'
    });
    expect(result).toBeDefined();
    expect(result.success).toBeFalsy();
    expect(result.errorType).toBe(_baseScraperWithBrowser.LoginResults.InvalidPassword);
  });
  (0, _testsUtils.maybeTestCompanyAPI)(COMPANY_ID)('should scrape transactions', async () => {
    const options = _objectSpread({}, testsConfig.options, {
      companyId: COMPANY_ID
    });

    const scraper = new _mizrahi.default(options);
    const result = await scraper.scrape(testsConfig.credentials.mizrahi);
    expect(result).toBeDefined();
    const error = `${result.errorType || ''} ${result.errorMessage || ''}`.trim();
    expect(error).toBe('');
    expect(result.success).toBeTruthy();
    expect(result.accounts).toBeDefined();
    expect(result.accounts.length).toBeGreaterThan(0);
    const account = result.accounts[0];
    expect(account.accountNumber).not.toBe('');
    expect(account.txns[0].date).toMatch(_constants.ISO_DATE_REGEX);
    (0, _testsUtils.exportTransactions)(COMPANY_ID, result.accounts || []);
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zY3JhcGVycy9taXpyYWhpLnRlc3QudHMiXSwibmFtZXMiOlsiQ09NUEFOWV9JRCIsInRlc3RzQ29uZmlnIiwiZGVzY3JpYmUiLCJiZWZvcmVBbGwiLCJ0ZXN0IiwiZXhwZWN0IiwiU0NSQVBFUlMiLCJtaXpyYWhpIiwidG9CZURlZmluZWQiLCJsb2dpbkZpZWxkcyIsInRvQ29udGFpbiIsImNvbmZpZyIsImNvbXBhbnlBUEkiLCJpbnZhbGlkUGFzc3dvcmQiLCJvcHRpb25zIiwiY29tcGFueUlkIiwic2NyYXBlciIsIk1penJhaGlTY3JhcGVyIiwicmVzdWx0Iiwic2NyYXBlIiwidXNlcm5hbWUiLCJwYXNzd29yZCIsInN1Y2Nlc3MiLCJ0b0JlRmFsc3kiLCJlcnJvclR5cGUiLCJ0b0JlIiwiTG9naW5SZXN1bHRzIiwiSW52YWxpZFBhc3N3b3JkIiwiY3JlZGVudGlhbHMiLCJlcnJvciIsImVycm9yTWVzc2FnZSIsInRyaW0iLCJ0b0JlVHJ1dGh5IiwiYWNjb3VudHMiLCJsZW5ndGgiLCJ0b0JlR3JlYXRlclRoYW4iLCJhY2NvdW50IiwiYWNjb3VudE51bWJlciIsIm5vdCIsInR4bnMiLCJkYXRlIiwidG9NYXRjaCIsIklTT19EQVRFX1JFR0VYIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7QUFDQTs7QUFHQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7OztBQUdBLE1BQU1BLFVBQVUsR0FBRyxTQUFuQixDLENBQThCOztBQUM5QixNQUFNQyxXQUFXLEdBQUcsaUNBQXBCO0FBRUFDLFFBQVEsQ0FBQyxpQkFBRCxFQUFvQixNQUFNO0FBQ2hDQyxFQUFBQSxTQUFTLENBQUMsTUFBTTtBQUNkLDBDQURjLENBQ1E7QUFDdkIsR0FGUSxDQUFUO0FBSUFDLEVBQUFBLElBQUksQ0FBQyxpREFBRCxFQUFvRCxNQUFNO0FBQzVEQyxJQUFBQSxNQUFNLENBQUNDLHNCQUFTQyxPQUFWLENBQU4sQ0FBeUJDLFdBQXpCO0FBQ0FILElBQUFBLE1BQU0sQ0FBQ0Msc0JBQVNDLE9BQVQsQ0FBaUJFLFdBQWxCLENBQU4sQ0FBcUNDLFNBQXJDLENBQStDLFVBQS9DO0FBQ0FMLElBQUFBLE1BQU0sQ0FBQ0Msc0JBQVNDLE9BQVQsQ0FBaUJFLFdBQWxCLENBQU4sQ0FBcUNDLFNBQXJDLENBQStDLFVBQS9DO0FBQ0QsR0FKRyxDQUFKO0FBTUEsdUNBQW9CVixVQUFwQixFQUFpQ1csTUFBRCxJQUFZQSxNQUFNLENBQUNDLFVBQVAsQ0FBa0JDLGVBQTlELEVBQStFLHNDQUEvRSxFQUF1SCxZQUFZO0FBQ2pJLFVBQU1DLE9BQU8scUJBQ1JiLFdBQVcsQ0FBQ2EsT0FESjtBQUVYQyxNQUFBQSxTQUFTLEVBQUVmO0FBRkEsTUFBYjs7QUFLQSxVQUFNZ0IsT0FBTyxHQUFHLElBQUlDLGdCQUFKLENBQW1CSCxPQUFuQixDQUFoQjtBQUVBLFVBQU1JLE1BQU0sR0FBRyxNQUFNRixPQUFPLENBQUNHLE1BQVIsQ0FBZTtBQUFFQyxNQUFBQSxRQUFRLEVBQUUsUUFBWjtBQUFzQkMsTUFBQUEsUUFBUSxFQUFFO0FBQWhDLEtBQWYsQ0FBckI7QUFFQWhCLElBQUFBLE1BQU0sQ0FBQ2EsTUFBRCxDQUFOLENBQWVWLFdBQWY7QUFDQUgsSUFBQUEsTUFBTSxDQUFDYSxNQUFNLENBQUNJLE9BQVIsQ0FBTixDQUF1QkMsU0FBdkI7QUFDQWxCLElBQUFBLE1BQU0sQ0FBQ2EsTUFBTSxDQUFDTSxTQUFSLENBQU4sQ0FBeUJDLElBQXpCLENBQThCQyxxQ0FBYUMsZUFBM0M7QUFDRCxHQWJEO0FBZUEsdUNBQW9CM0IsVUFBcEIsRUFBZ0MsNEJBQWhDLEVBQThELFlBQVk7QUFDeEUsVUFBTWMsT0FBTyxxQkFDUmIsV0FBVyxDQUFDYSxPQURKO0FBRVhDLE1BQUFBLFNBQVMsRUFBRWY7QUFGQSxNQUFiOztBQUtBLFVBQU1nQixPQUFPLEdBQUcsSUFBSUMsZ0JBQUosQ0FBbUJILE9BQW5CLENBQWhCO0FBQ0EsVUFBTUksTUFBTSxHQUFHLE1BQU1GLE9BQU8sQ0FBQ0csTUFBUixDQUFlbEIsV0FBVyxDQUFDMkIsV0FBWixDQUF3QnJCLE9BQXZDLENBQXJCO0FBQ0FGLElBQUFBLE1BQU0sQ0FBQ2EsTUFBRCxDQUFOLENBQWVWLFdBQWY7QUFDQSxVQUFNcUIsS0FBSyxHQUFJLEdBQUVYLE1BQU0sQ0FBQ00sU0FBUCxJQUFvQixFQUFHLElBQUdOLE1BQU0sQ0FBQ1ksWUFBUCxJQUF1QixFQUFHLEVBQXZELENBQXlEQyxJQUF6RCxFQUFkO0FBQ0ExQixJQUFBQSxNQUFNLENBQUN3QixLQUFELENBQU4sQ0FBY0osSUFBZCxDQUFtQixFQUFuQjtBQUNBcEIsSUFBQUEsTUFBTSxDQUFDYSxNQUFNLENBQUNJLE9BQVIsQ0FBTixDQUF1QlUsVUFBdkI7QUFDQTNCLElBQUFBLE1BQU0sQ0FBQ2EsTUFBTSxDQUFDZSxRQUFSLENBQU4sQ0FBd0J6QixXQUF4QjtBQUNBSCxJQUFBQSxNQUFNLENBQUVhLE1BQU0sQ0FBQ2UsUUFBUixDQUF5QkMsTUFBMUIsQ0FBTixDQUF3Q0MsZUFBeEMsQ0FBd0QsQ0FBeEQ7QUFDQSxVQUFNQyxPQUE0QixHQUFJbEIsTUFBRCxDQUFnQmUsUUFBaEIsQ0FBeUIsQ0FBekIsQ0FBckM7QUFDQTVCLElBQUFBLE1BQU0sQ0FBQytCLE9BQU8sQ0FBQ0MsYUFBVCxDQUFOLENBQThCQyxHQUE5QixDQUFrQ2IsSUFBbEMsQ0FBdUMsRUFBdkM7QUFDQXBCLElBQUFBLE1BQU0sQ0FBQytCLE9BQU8sQ0FBQ0csSUFBUixDQUFhLENBQWIsRUFBZ0JDLElBQWpCLENBQU4sQ0FBNkJDLE9BQTdCLENBQXFDQyx5QkFBckM7QUFFQSx3Q0FBbUIxQyxVQUFuQixFQUErQmtCLE1BQU0sQ0FBQ2UsUUFBUCxJQUFtQixFQUFsRDtBQUNELEdBbkJEO0FBb0JELENBOUNPLENBQVIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTWl6cmFoaVNjcmFwZXIgZnJvbSAnLi9taXpyYWhpJztcbmltcG9ydCB7XG4gIG1heWJlVGVzdENvbXBhbnlBUEksIGV4dGVuZEFzeW5jVGltZW91dCwgZ2V0VGVzdHNDb25maWcsIGV4cG9ydFRyYW5zYWN0aW9ucyxcbn0gZnJvbSAnLi4vdGVzdHMvdGVzdHMtdXRpbHMnO1xuaW1wb3J0IHsgU0NSQVBFUlMgfSBmcm9tICcuLi9kZWZpbml0aW9ucyc7XG5pbXBvcnQgeyBJU09fREFURV9SRUdFWCB9IGZyb20gJy4uL2NvbnN0YW50cyc7XG5pbXBvcnQgeyBMb2dpblJlc3VsdHMgfSBmcm9tICcuL2Jhc2Utc2NyYXBlci13aXRoLWJyb3dzZXInO1xuaW1wb3J0IHsgVHJhbnNhY3Rpb25zQWNjb3VudCB9IGZyb20gJy4uL3RyYW5zYWN0aW9ucyc7XG5cbmNvbnN0IENPTVBBTllfSUQgPSAnbWl6cmFoaSc7IC8vIFRPRE8gdGhpcyBwcm9wZXJ0eSBzaG91bGQgYmUgaGFyZC1jb2RlZCBpbiB0aGUgcHJvdmlkZXJcbmNvbnN0IHRlc3RzQ29uZmlnID0gZ2V0VGVzdHNDb25maWcoKTtcblxuZGVzY3JpYmUoJ01penJhaGkgc2NyYXBlcicsICgpID0+IHtcbiAgYmVmb3JlQWxsKCgpID0+IHtcbiAgICBleHRlbmRBc3luY1RpbWVvdXQoKTsgLy8gVGhlIGRlZmF1bHQgdGltZW91dCBpcyA1IHNlY29uZHMgcGVyIGFzeW5jIHRlc3QsIHRoaXMgZnVuY3Rpb24gZXh0ZW5kcyB0aGUgdGltZW91dCB2YWx1ZVxuICB9KTtcblxuICB0ZXN0KCdzaG91bGQgZXhwb3NlIGxvZ2luIGZpZWxkcyBpbiBzY3JhcGVycyBjb25zdGFudCcsICgpID0+IHtcbiAgICBleHBlY3QoU0NSQVBFUlMubWl6cmFoaSkudG9CZURlZmluZWQoKTtcbiAgICBleHBlY3QoU0NSQVBFUlMubWl6cmFoaS5sb2dpbkZpZWxkcykudG9Db250YWluKCd1c2VybmFtZScpO1xuICAgIGV4cGVjdChTQ1JBUEVSUy5taXpyYWhpLmxvZ2luRmllbGRzKS50b0NvbnRhaW4oJ3Bhc3N3b3JkJyk7XG4gIH0pO1xuXG4gIG1heWJlVGVzdENvbXBhbnlBUEkoQ09NUEFOWV9JRCwgKGNvbmZpZykgPT4gY29uZmlnLmNvbXBhbnlBUEkuaW52YWxpZFBhc3N3b3JkKSgnc2hvdWxkIGZhaWwgb24gaW52YWxpZCB1c2VyL3Bhc3N3b3JkJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICAuLi50ZXN0c0NvbmZpZy5vcHRpb25zLFxuICAgICAgY29tcGFueUlkOiBDT01QQU5ZX0lELFxuICAgIH07XG5cbiAgICBjb25zdCBzY3JhcGVyID0gbmV3IE1penJhaGlTY3JhcGVyKG9wdGlvbnMpO1xuXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgc2NyYXBlci5zY3JhcGUoeyB1c2VybmFtZTogJ2UxMHMxMicsIHBhc3N3b3JkOiAnM2Yzc3MzZCcgfSk7XG5cbiAgICBleHBlY3QocmVzdWx0KS50b0JlRGVmaW5lZCgpO1xuICAgIGV4cGVjdChyZXN1bHQuc3VjY2VzcykudG9CZUZhbHN5KCk7XG4gICAgZXhwZWN0KHJlc3VsdC5lcnJvclR5cGUpLnRvQmUoTG9naW5SZXN1bHRzLkludmFsaWRQYXNzd29yZCk7XG4gIH0pO1xuXG4gIG1heWJlVGVzdENvbXBhbnlBUEkoQ09NUEFOWV9JRCkoJ3Nob3VsZCBzY3JhcGUgdHJhbnNhY3Rpb25zJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICAuLi50ZXN0c0NvbmZpZy5vcHRpb25zLFxuICAgICAgY29tcGFueUlkOiBDT01QQU5ZX0lELFxuICAgIH07XG5cbiAgICBjb25zdCBzY3JhcGVyID0gbmV3IE1penJhaGlTY3JhcGVyKG9wdGlvbnMpO1xuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHNjcmFwZXIuc2NyYXBlKHRlc3RzQ29uZmlnLmNyZWRlbnRpYWxzLm1penJhaGkpO1xuICAgIGV4cGVjdChyZXN1bHQpLnRvQmVEZWZpbmVkKCk7XG4gICAgY29uc3QgZXJyb3IgPSBgJHtyZXN1bHQuZXJyb3JUeXBlIHx8ICcnfSAke3Jlc3VsdC5lcnJvck1lc3NhZ2UgfHwgJyd9YC50cmltKCk7XG4gICAgZXhwZWN0KGVycm9yKS50b0JlKCcnKTtcbiAgICBleHBlY3QocmVzdWx0LnN1Y2Nlc3MpLnRvQmVUcnV0aHkoKTtcbiAgICBleHBlY3QocmVzdWx0LmFjY291bnRzKS50b0JlRGVmaW5lZCgpO1xuICAgIGV4cGVjdCgocmVzdWx0LmFjY291bnRzIGFzIGFueSkubGVuZ3RoKS50b0JlR3JlYXRlclRoYW4oMCk7XG4gICAgY29uc3QgYWNjb3VudDogVHJhbnNhY3Rpb25zQWNjb3VudCA9IChyZXN1bHQgYXMgYW55KS5hY2NvdW50c1swXTtcbiAgICBleHBlY3QoYWNjb3VudC5hY2NvdW50TnVtYmVyKS5ub3QudG9CZSgnJyk7XG4gICAgZXhwZWN0KGFjY291bnQudHhuc1swXS5kYXRlKS50b01hdGNoKElTT19EQVRFX1JFR0VYKTtcblxuICAgIGV4cG9ydFRyYW5zYWN0aW9ucyhDT01QQU5ZX0lELCByZXN1bHQuYWNjb3VudHMgfHwgW10pO1xuICB9KTtcbn0pO1xuIl19