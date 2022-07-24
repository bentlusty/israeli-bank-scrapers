"use strict";

require("core-js/modules/es.promise");

var _testsUtils = require("../tests/tests-utils");

var _baseScraperWithBrowser = require("./base-scraper-with-browser");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const testsConfig = (0, _testsUtils.getTestsConfig)();

function isNoSandbox(browser) {
  // eslint-disable-next-line no-underscore-dangle
  const args = browser._process.spawnargs;
  return args.includes('--no-sandbox');
}

describe('Base scraper with browser', () => {
  beforeAll(() => {
    (0, _testsUtils.extendAsyncTimeout)(); // The default timeout is 5 seconds per async test, this function extends the timeout value
  });
  test('should pass custom args to scraper if provided', async () => {
    const options = _objectSpread({}, testsConfig.options, {
      companyId: 'test',
      showBrowser: false,
      args: []
    }); // avoid false-positive result by confirming that --no-sandbox is not a default flag provided by puppeteer


    let baseScraperWithBrowser = new _baseScraperWithBrowser.BaseScraperWithBrowser(options);

    try {
      await baseScraperWithBrowser.initialize(); // @ts-ignore

      expect(baseScraperWithBrowser.browser).toBeDefined(); // @ts-ignore

      expect(isNoSandbox(baseScraperWithBrowser.browser)).toBe(false);
      await baseScraperWithBrowser.terminate(true);
    } catch (e) {
      await baseScraperWithBrowser.terminate(false);
      throw e;
    } // set --no-sandbox flag and expect it to be passed by puppeteer.lunch to the new created browser instance


    options.args = ['--no-sandbox', '--disable-gpu', '--window-size=1920x1080'];
    baseScraperWithBrowser = new _baseScraperWithBrowser.BaseScraperWithBrowser(options);

    try {
      await baseScraperWithBrowser.initialize(); // @ts-ignore

      expect(baseScraperWithBrowser.browser).toBeDefined(); // @ts-ignore

      expect(isNoSandbox(baseScraperWithBrowser.browser)).toBe(true);
      await baseScraperWithBrowser.terminate(true);
    } catch (e) {
      await baseScraperWithBrowser.terminate(false);
      throw e;
    }
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zY3JhcGVycy9iYXNlLXNjcmFwZXItd2l0aC1icm93c2VyLnRlc3QudHMiXSwibmFtZXMiOlsidGVzdHNDb25maWciLCJpc05vU2FuZGJveCIsImJyb3dzZXIiLCJhcmdzIiwiX3Byb2Nlc3MiLCJzcGF3bmFyZ3MiLCJpbmNsdWRlcyIsImRlc2NyaWJlIiwiYmVmb3JlQWxsIiwidGVzdCIsIm9wdGlvbnMiLCJjb21wYW55SWQiLCJzaG93QnJvd3NlciIsImJhc2VTY3JhcGVyV2l0aEJyb3dzZXIiLCJCYXNlU2NyYXBlcldpdGhCcm93c2VyIiwiaW5pdGlhbGl6ZSIsImV4cGVjdCIsInRvQmVEZWZpbmVkIiwidG9CZSIsInRlcm1pbmF0ZSIsImUiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQTs7QUFHQTs7Ozs7Ozs7QUFFQSxNQUFNQSxXQUFXLEdBQUcsaUNBQXBCOztBQUVBLFNBQVNDLFdBQVQsQ0FBcUJDLE9BQXJCLEVBQW1DO0FBQ2pDO0FBQ0EsUUFBTUMsSUFBSSxHQUFHRCxPQUFPLENBQUNFLFFBQVIsQ0FBaUJDLFNBQTlCO0FBQ0EsU0FBT0YsSUFBSSxDQUFDRyxRQUFMLENBQWMsY0FBZCxDQUFQO0FBQ0Q7O0FBRURDLFFBQVEsQ0FBQywyQkFBRCxFQUE4QixNQUFNO0FBQzFDQyxFQUFBQSxTQUFTLENBQUMsTUFBTTtBQUNkLDBDQURjLENBQ1E7QUFDdkIsR0FGUSxDQUFUO0FBSUFDLEVBQUFBLElBQUksQ0FBQyxnREFBRCxFQUFtRCxZQUFZO0FBQ2pFLFVBQU1DLE9BQU8scUJBQ1JWLFdBQVcsQ0FBQ1UsT0FESjtBQUVYQyxNQUFBQSxTQUFTLEVBQUUsTUFGQTtBQUdYQyxNQUFBQSxXQUFXLEVBQUUsS0FIRjtBQUlYVCxNQUFBQSxJQUFJLEVBQUU7QUFKSyxNQUFiLENBRGlFLENBUWpFOzs7QUFDQSxRQUFJVSxzQkFBc0IsR0FBRyxJQUFJQyw4Q0FBSixDQUEyQkosT0FBM0IsQ0FBN0I7O0FBQ0EsUUFBSTtBQUNGLFlBQU1HLHNCQUFzQixDQUFDRSxVQUF2QixFQUFOLENBREUsQ0FFRjs7QUFDQUMsTUFBQUEsTUFBTSxDQUFDSCxzQkFBc0IsQ0FBQ1gsT0FBeEIsQ0FBTixDQUF1Q2UsV0FBdkMsR0FIRSxDQUlGOztBQUNBRCxNQUFBQSxNQUFNLENBQUNmLFdBQVcsQ0FBQ1ksc0JBQXNCLENBQUNYLE9BQXhCLENBQVosQ0FBTixDQUFvRGdCLElBQXBELENBQXlELEtBQXpEO0FBQ0EsWUFBTUwsc0JBQXNCLENBQUNNLFNBQXZCLENBQWlDLElBQWpDLENBQU47QUFDRCxLQVBELENBT0UsT0FBT0MsQ0FBUCxFQUFVO0FBQ1YsWUFBTVAsc0JBQXNCLENBQUNNLFNBQXZCLENBQWlDLEtBQWpDLENBQU47QUFDQSxZQUFNQyxDQUFOO0FBQ0QsS0FwQmdFLENBc0JqRTs7O0FBQ0FWLElBQUFBLE9BQU8sQ0FBQ1AsSUFBUixHQUFlLENBQ2IsY0FEYSxFQUViLGVBRmEsRUFHYix5QkFIYSxDQUFmO0FBS0FVLElBQUFBLHNCQUFzQixHQUFHLElBQUlDLDhDQUFKLENBQTJCSixPQUEzQixDQUF6Qjs7QUFDQSxRQUFJO0FBQ0YsWUFBTUcsc0JBQXNCLENBQUNFLFVBQXZCLEVBQU4sQ0FERSxDQUVGOztBQUNBQyxNQUFBQSxNQUFNLENBQUNILHNCQUFzQixDQUFDWCxPQUF4QixDQUFOLENBQXVDZSxXQUF2QyxHQUhFLENBSUY7O0FBQ0FELE1BQUFBLE1BQU0sQ0FBQ2YsV0FBVyxDQUFDWSxzQkFBc0IsQ0FBQ1gsT0FBeEIsQ0FBWixDQUFOLENBQW9EZ0IsSUFBcEQsQ0FBeUQsSUFBekQ7QUFDQSxZQUFNTCxzQkFBc0IsQ0FBQ00sU0FBdkIsQ0FBaUMsSUFBakMsQ0FBTjtBQUNELEtBUEQsQ0FPRSxPQUFPQyxDQUFQLEVBQVU7QUFDVixZQUFNUCxzQkFBc0IsQ0FBQ00sU0FBdkIsQ0FBaUMsS0FBakMsQ0FBTjtBQUNBLFlBQU1DLENBQU47QUFDRDtBQUNGLEdBeENHLENBQUo7QUF5Q0QsQ0E5Q08sQ0FBUiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIGV4dGVuZEFzeW5jVGltZW91dCwgZ2V0VGVzdHNDb25maWcsXG59IGZyb20gJy4uL3Rlc3RzL3Rlc3RzLXV0aWxzJztcbmltcG9ydCB7IEJhc2VTY3JhcGVyV2l0aEJyb3dzZXIgfSBmcm9tICcuL2Jhc2Utc2NyYXBlci13aXRoLWJyb3dzZXInO1xuXG5jb25zdCB0ZXN0c0NvbmZpZyA9IGdldFRlc3RzQ29uZmlnKCk7XG5cbmZ1bmN0aW9uIGlzTm9TYW5kYm94KGJyb3dzZXI6IGFueSkge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5kZXJzY29yZS1kYW5nbGVcbiAgY29uc3QgYXJncyA9IGJyb3dzZXIuX3Byb2Nlc3Muc3Bhd25hcmdzO1xuICByZXR1cm4gYXJncy5pbmNsdWRlcygnLS1uby1zYW5kYm94Jyk7XG59XG5cbmRlc2NyaWJlKCdCYXNlIHNjcmFwZXIgd2l0aCBicm93c2VyJywgKCkgPT4ge1xuICBiZWZvcmVBbGwoKCkgPT4ge1xuICAgIGV4dGVuZEFzeW5jVGltZW91dCgpOyAvLyBUaGUgZGVmYXVsdCB0aW1lb3V0IGlzIDUgc2Vjb25kcyBwZXIgYXN5bmMgdGVzdCwgdGhpcyBmdW5jdGlvbiBleHRlbmRzIHRoZSB0aW1lb3V0IHZhbHVlXG4gIH0pO1xuXG4gIHRlc3QoJ3Nob3VsZCBwYXNzIGN1c3RvbSBhcmdzIHRvIHNjcmFwZXIgaWYgcHJvdmlkZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgIC4uLnRlc3RzQ29uZmlnLm9wdGlvbnMsXG4gICAgICBjb21wYW55SWQ6ICd0ZXN0JyxcbiAgICAgIHNob3dCcm93c2VyOiBmYWxzZSxcbiAgICAgIGFyZ3M6IFtdLFxuICAgIH07XG5cbiAgICAvLyBhdm9pZCBmYWxzZS1wb3NpdGl2ZSByZXN1bHQgYnkgY29uZmlybWluZyB0aGF0IC0tbm8tc2FuZGJveCBpcyBub3QgYSBkZWZhdWx0IGZsYWcgcHJvdmlkZWQgYnkgcHVwcGV0ZWVyXG4gICAgbGV0IGJhc2VTY3JhcGVyV2l0aEJyb3dzZXIgPSBuZXcgQmFzZVNjcmFwZXJXaXRoQnJvd3NlcihvcHRpb25zKTtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgYmFzZVNjcmFwZXJXaXRoQnJvd3Nlci5pbml0aWFsaXplKCk7XG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICBleHBlY3QoYmFzZVNjcmFwZXJXaXRoQnJvd3Nlci5icm93c2VyKS50b0JlRGVmaW5lZCgpO1xuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgZXhwZWN0KGlzTm9TYW5kYm94KGJhc2VTY3JhcGVyV2l0aEJyb3dzZXIuYnJvd3NlcikpLnRvQmUoZmFsc2UpO1xuICAgICAgYXdhaXQgYmFzZVNjcmFwZXJXaXRoQnJvd3Nlci50ZXJtaW5hdGUodHJ1ZSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgYXdhaXQgYmFzZVNjcmFwZXJXaXRoQnJvd3Nlci50ZXJtaW5hdGUoZmFsc2UpO1xuICAgICAgdGhyb3cgZTtcbiAgICB9XG5cbiAgICAvLyBzZXQgLS1uby1zYW5kYm94IGZsYWcgYW5kIGV4cGVjdCBpdCB0byBiZSBwYXNzZWQgYnkgcHVwcGV0ZWVyLmx1bmNoIHRvIHRoZSBuZXcgY3JlYXRlZCBicm93c2VyIGluc3RhbmNlXG4gICAgb3B0aW9ucy5hcmdzID0gW1xuICAgICAgJy0tbm8tc2FuZGJveCcsXG4gICAgICAnLS1kaXNhYmxlLWdwdScsXG4gICAgICAnLS13aW5kb3ctc2l6ZT0xOTIweDEwODAnLFxuICAgIF07XG4gICAgYmFzZVNjcmFwZXJXaXRoQnJvd3NlciA9IG5ldyBCYXNlU2NyYXBlcldpdGhCcm93c2VyKG9wdGlvbnMpO1xuICAgIHRyeSB7XG4gICAgICBhd2FpdCBiYXNlU2NyYXBlcldpdGhCcm93c2VyLmluaXRpYWxpemUoKTtcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIGV4cGVjdChiYXNlU2NyYXBlcldpdGhCcm93c2VyLmJyb3dzZXIpLnRvQmVEZWZpbmVkKCk7XG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICBleHBlY3QoaXNOb1NhbmRib3goYmFzZVNjcmFwZXJXaXRoQnJvd3Nlci5icm93c2VyKSkudG9CZSh0cnVlKTtcbiAgICAgIGF3YWl0IGJhc2VTY3JhcGVyV2l0aEJyb3dzZXIudGVybWluYXRlKHRydWUpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGF3YWl0IGJhc2VTY3JhcGVyV2l0aEJyb3dzZXIudGVybWluYXRlKGZhbHNlKTtcbiAgICAgIHRocm93IGU7XG4gICAgfVxuICB9KTtcbn0pO1xuIl19