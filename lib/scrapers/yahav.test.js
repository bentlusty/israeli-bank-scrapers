"use strict";

require("core-js/modules/es.promise");

require("core-js/modules/es.string.trim");

var _yahav = _interopRequireDefault(require("./yahav"));

var _testsUtils = require("../tests/tests-utils");

var _definitions = require("../definitions");

var _baseScraperWithBrowser = require("./base-scraper-with-browser");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const COMPANY_ID = 'yahav'; // TODO this property should be hard-coded in the provider

const testsConfig = (0, _testsUtils.getTestsConfig)();
describe('Yahav scraper', () => {
  beforeAll(() => {
    (0, _testsUtils.extendAsyncTimeout)(); // The default timeout is 5 seconds per async test, this function extends the timeout value
  });
  test('should expose login fields in scrapers constant', () => {
    expect(_definitions.SCRAPERS.yahav).toBeDefined();
    expect(_definitions.SCRAPERS.yahav.loginFields).toContain('username');
    expect(_definitions.SCRAPERS.yahav.loginFields).toContain('password');
    expect(_definitions.SCRAPERS.yahav.loginFields).toContain('nationalID');
  });
  (0, _testsUtils.maybeTestCompanyAPI)(COMPANY_ID, config => config.companyAPI.invalidPassword)('should fail on invalid user/password"', async () => {
    const options = _objectSpread({}, testsConfig.options, {
      companyId: COMPANY_ID
    });

    const scraper = new _yahav.default(options);
    const result = await scraper.scrape({
      username: 'e10s12',
      password: '3f3ss3d',
      nationalID: '12345679'
    });
    expect(result).toBeDefined();
    expect(result.success).toBeFalsy();
    expect(result.errorType).toBe(_baseScraperWithBrowser.LoginResults.InvalidPassword);
  });
  (0, _testsUtils.maybeTestCompanyAPI)(COMPANY_ID)('should scrape transactions"', async () => {
    const options = _objectSpread({}, testsConfig.options, {
      companyId: COMPANY_ID
    });

    const scraper = new _yahav.default(options);
    const result = await scraper.scrape(testsConfig.credentials.yahav);
    expect(result).toBeDefined();
    const error = `${result.errorType || ''} ${result.errorMessage || ''}`.trim();
    expect(error).toBe('');
    expect(result.success).toBeTruthy();
    (0, _testsUtils.exportTransactions)(COMPANY_ID, result.accounts || []);
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zY3JhcGVycy95YWhhdi50ZXN0LnRzIl0sIm5hbWVzIjpbIkNPTVBBTllfSUQiLCJ0ZXN0c0NvbmZpZyIsImRlc2NyaWJlIiwiYmVmb3JlQWxsIiwidGVzdCIsImV4cGVjdCIsIlNDUkFQRVJTIiwieWFoYXYiLCJ0b0JlRGVmaW5lZCIsImxvZ2luRmllbGRzIiwidG9Db250YWluIiwiY29uZmlnIiwiY29tcGFueUFQSSIsImludmFsaWRQYXNzd29yZCIsIm9wdGlvbnMiLCJjb21wYW55SWQiLCJzY3JhcGVyIiwiWWFoYXZTY3JhcGVyIiwicmVzdWx0Iiwic2NyYXBlIiwidXNlcm5hbWUiLCJwYXNzd29yZCIsIm5hdGlvbmFsSUQiLCJzdWNjZXNzIiwidG9CZUZhbHN5IiwiZXJyb3JUeXBlIiwidG9CZSIsIkxvZ2luUmVzdWx0cyIsIkludmFsaWRQYXNzd29yZCIsImNyZWRlbnRpYWxzIiwiZXJyb3IiLCJlcnJvck1lc3NhZ2UiLCJ0cmltIiwidG9CZVRydXRoeSIsImFjY291bnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7QUFDQTs7QUFHQTs7QUFDQTs7Ozs7Ozs7OztBQUVBLE1BQU1BLFVBQVUsR0FBRyxPQUFuQixDLENBQTRCOztBQUM1QixNQUFNQyxXQUFXLEdBQUcsaUNBQXBCO0FBRUFDLFFBQVEsQ0FBQyxlQUFELEVBQWtCLE1BQU07QUFDOUJDLEVBQUFBLFNBQVMsQ0FBQyxNQUFNO0FBQ2QsMENBRGMsQ0FDUTtBQUN2QixHQUZRLENBQVQ7QUFJQUMsRUFBQUEsSUFBSSxDQUFDLGlEQUFELEVBQW9ELE1BQU07QUFDNURDLElBQUFBLE1BQU0sQ0FBQ0Msc0JBQVNDLEtBQVYsQ0FBTixDQUF1QkMsV0FBdkI7QUFDQUgsSUFBQUEsTUFBTSxDQUFDQyxzQkFBU0MsS0FBVCxDQUFlRSxXQUFoQixDQUFOLENBQW1DQyxTQUFuQyxDQUE2QyxVQUE3QztBQUNBTCxJQUFBQSxNQUFNLENBQUNDLHNCQUFTQyxLQUFULENBQWVFLFdBQWhCLENBQU4sQ0FBbUNDLFNBQW5DLENBQTZDLFVBQTdDO0FBQ0FMLElBQUFBLE1BQU0sQ0FBQ0Msc0JBQVNDLEtBQVQsQ0FBZUUsV0FBaEIsQ0FBTixDQUFtQ0MsU0FBbkMsQ0FBNkMsWUFBN0M7QUFDRCxHQUxHLENBQUo7QUFPQSx1Q0FBb0JWLFVBQXBCLEVBQWlDVyxNQUFELElBQVlBLE1BQU0sQ0FBQ0MsVUFBUCxDQUFrQkMsZUFBOUQsRUFBK0UsdUNBQS9FLEVBQXdILFlBQVk7QUFDbEksVUFBTUMsT0FBTyxxQkFDUmIsV0FBVyxDQUFDYSxPQURKO0FBRVhDLE1BQUFBLFNBQVMsRUFBRWY7QUFGQSxNQUFiOztBQUtBLFVBQU1nQixPQUFPLEdBQUcsSUFBSUMsY0FBSixDQUFpQkgsT0FBakIsQ0FBaEI7QUFFQSxVQUFNSSxNQUFNLEdBQUcsTUFBTUYsT0FBTyxDQUFDRyxNQUFSLENBQWU7QUFBRUMsTUFBQUEsUUFBUSxFQUFFLFFBQVo7QUFBc0JDLE1BQUFBLFFBQVEsRUFBRSxTQUFoQztBQUEyQ0MsTUFBQUEsVUFBVSxFQUFFO0FBQXZELEtBQWYsQ0FBckI7QUFFQWpCLElBQUFBLE1BQU0sQ0FBQ2EsTUFBRCxDQUFOLENBQWVWLFdBQWY7QUFDQUgsSUFBQUEsTUFBTSxDQUFDYSxNQUFNLENBQUNLLE9BQVIsQ0FBTixDQUF1QkMsU0FBdkI7QUFDQW5CLElBQUFBLE1BQU0sQ0FBQ2EsTUFBTSxDQUFDTyxTQUFSLENBQU4sQ0FBeUJDLElBQXpCLENBQThCQyxxQ0FBYUMsZUFBM0M7QUFDRCxHQWJEO0FBZUEsdUNBQW9CNUIsVUFBcEIsRUFBZ0MsNkJBQWhDLEVBQStELFlBQVk7QUFDekUsVUFBTWMsT0FBTyxxQkFDUmIsV0FBVyxDQUFDYSxPQURKO0FBRVhDLE1BQUFBLFNBQVMsRUFBRWY7QUFGQSxNQUFiOztBQUtBLFVBQU1nQixPQUFPLEdBQUcsSUFBSUMsY0FBSixDQUFpQkgsT0FBakIsQ0FBaEI7QUFDQSxVQUFNSSxNQUFNLEdBQUcsTUFBTUYsT0FBTyxDQUFDRyxNQUFSLENBQWVsQixXQUFXLENBQUM0QixXQUFaLENBQXdCdEIsS0FBdkMsQ0FBckI7QUFDQUYsSUFBQUEsTUFBTSxDQUFDYSxNQUFELENBQU4sQ0FBZVYsV0FBZjtBQUNBLFVBQU1zQixLQUFLLEdBQUksR0FBRVosTUFBTSxDQUFDTyxTQUFQLElBQW9CLEVBQUcsSUFBR1AsTUFBTSxDQUFDYSxZQUFQLElBQXVCLEVBQUcsRUFBdkQsQ0FBeURDLElBQXpELEVBQWQ7QUFDQTNCLElBQUFBLE1BQU0sQ0FBQ3lCLEtBQUQsQ0FBTixDQUFjSixJQUFkLENBQW1CLEVBQW5CO0FBQ0FyQixJQUFBQSxNQUFNLENBQUNhLE1BQU0sQ0FBQ0ssT0FBUixDQUFOLENBQXVCVSxVQUF2QjtBQUVBLHdDQUFtQmpDLFVBQW5CLEVBQStCa0IsTUFBTSxDQUFDZ0IsUUFBUCxJQUFtQixFQUFsRDtBQUNELEdBZEQ7QUFlRCxDQTFDTyxDQUFSIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFlhaGF2U2NyYXBlciBmcm9tICcuL3lhaGF2JztcbmltcG9ydCB7XG4gIG1heWJlVGVzdENvbXBhbnlBUEksIGV4dGVuZEFzeW5jVGltZW91dCwgZ2V0VGVzdHNDb25maWcsIGV4cG9ydFRyYW5zYWN0aW9ucyxcbn0gZnJvbSAnLi4vdGVzdHMvdGVzdHMtdXRpbHMnO1xuaW1wb3J0IHsgU0NSQVBFUlMgfSBmcm9tICcuLi9kZWZpbml0aW9ucyc7XG5pbXBvcnQgeyBMb2dpblJlc3VsdHMgfSBmcm9tICcuL2Jhc2Utc2NyYXBlci13aXRoLWJyb3dzZXInO1xuXG5jb25zdCBDT01QQU5ZX0lEID0gJ3lhaGF2JzsgLy8gVE9ETyB0aGlzIHByb3BlcnR5IHNob3VsZCBiZSBoYXJkLWNvZGVkIGluIHRoZSBwcm92aWRlclxuY29uc3QgdGVzdHNDb25maWcgPSBnZXRUZXN0c0NvbmZpZygpO1xuXG5kZXNjcmliZSgnWWFoYXYgc2NyYXBlcicsICgpID0+IHtcbiAgYmVmb3JlQWxsKCgpID0+IHtcbiAgICBleHRlbmRBc3luY1RpbWVvdXQoKTsgLy8gVGhlIGRlZmF1bHQgdGltZW91dCBpcyA1IHNlY29uZHMgcGVyIGFzeW5jIHRlc3QsIHRoaXMgZnVuY3Rpb24gZXh0ZW5kcyB0aGUgdGltZW91dCB2YWx1ZVxuICB9KTtcblxuICB0ZXN0KCdzaG91bGQgZXhwb3NlIGxvZ2luIGZpZWxkcyBpbiBzY3JhcGVycyBjb25zdGFudCcsICgpID0+IHtcbiAgICBleHBlY3QoU0NSQVBFUlMueWFoYXYpLnRvQmVEZWZpbmVkKCk7XG4gICAgZXhwZWN0KFNDUkFQRVJTLnlhaGF2LmxvZ2luRmllbGRzKS50b0NvbnRhaW4oJ3VzZXJuYW1lJyk7XG4gICAgZXhwZWN0KFNDUkFQRVJTLnlhaGF2LmxvZ2luRmllbGRzKS50b0NvbnRhaW4oJ3Bhc3N3b3JkJyk7XG4gICAgZXhwZWN0KFNDUkFQRVJTLnlhaGF2LmxvZ2luRmllbGRzKS50b0NvbnRhaW4oJ25hdGlvbmFsSUQnKTtcbiAgfSk7XG5cbiAgbWF5YmVUZXN0Q29tcGFueUFQSShDT01QQU5ZX0lELCAoY29uZmlnKSA9PiBjb25maWcuY29tcGFueUFQSS5pbnZhbGlkUGFzc3dvcmQpKCdzaG91bGQgZmFpbCBvbiBpbnZhbGlkIHVzZXIvcGFzc3dvcmRcIicsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgLi4udGVzdHNDb25maWcub3B0aW9ucyxcbiAgICAgIGNvbXBhbnlJZDogQ09NUEFOWV9JRCxcbiAgICB9O1xuXG4gICAgY29uc3Qgc2NyYXBlciA9IG5ldyBZYWhhdlNjcmFwZXIob3B0aW9ucyk7XG5cbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBzY3JhcGVyLnNjcmFwZSh7IHVzZXJuYW1lOiAnZTEwczEyJywgcGFzc3dvcmQ6ICczZjNzczNkJywgbmF0aW9uYWxJRDogJzEyMzQ1Njc5JyB9KTtcblxuICAgIGV4cGVjdChyZXN1bHQpLnRvQmVEZWZpbmVkKCk7XG4gICAgZXhwZWN0KHJlc3VsdC5zdWNjZXNzKS50b0JlRmFsc3koKTtcbiAgICBleHBlY3QocmVzdWx0LmVycm9yVHlwZSkudG9CZShMb2dpblJlc3VsdHMuSW52YWxpZFBhc3N3b3JkKTtcbiAgfSk7XG5cbiAgbWF5YmVUZXN0Q29tcGFueUFQSShDT01QQU5ZX0lEKSgnc2hvdWxkIHNjcmFwZSB0cmFuc2FjdGlvbnNcIicsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgLi4udGVzdHNDb25maWcub3B0aW9ucyxcbiAgICAgIGNvbXBhbnlJZDogQ09NUEFOWV9JRCxcbiAgICB9O1xuXG4gICAgY29uc3Qgc2NyYXBlciA9IG5ldyBZYWhhdlNjcmFwZXIob3B0aW9ucyk7XG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgc2NyYXBlci5zY3JhcGUodGVzdHNDb25maWcuY3JlZGVudGlhbHMueWFoYXYpO1xuICAgIGV4cGVjdChyZXN1bHQpLnRvQmVEZWZpbmVkKCk7XG4gICAgY29uc3QgZXJyb3IgPSBgJHtyZXN1bHQuZXJyb3JUeXBlIHx8ICcnfSAke3Jlc3VsdC5lcnJvck1lc3NhZ2UgfHwgJyd9YC50cmltKCk7XG4gICAgZXhwZWN0KGVycm9yKS50b0JlKCcnKTtcbiAgICBleHBlY3QocmVzdWx0LnN1Y2Nlc3MpLnRvQmVUcnV0aHkoKTtcblxuICAgIGV4cG9ydFRyYW5zYWN0aW9ucyhDT01QQU5ZX0lELCByZXN1bHQuYWNjb3VudHMgfHwgW10pO1xuICB9KTtcbn0pO1xuIl19