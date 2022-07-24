"use strict";

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.promise");

require("core-js/modules/es.string.replace");

require("core-js/modules/es.string.trim");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _moment = _interopRequireDefault(require("moment"));

var _baseScraperWithBrowser = require("./base-scraper-with-browser");

var _elementsInteractions = require("../helpers/elements-interactions");

var _transactions = require("../transactions");

var _constants = require("../constants");

var _waiting = require("../helpers/waiting");

var _transactions2 = require("../helpers/transactions");

var _debug = require("../helpers/debug");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const LOGIN_URL = 'https://www.cal-online.co.il/';
const TRANSACTIONS_URL = 'https://services.cal-online.co.il/Card-Holders/Screens/Transactions/Transactions.aspx';
const LONG_DATE_FORMAT = 'DD/MM/YYYY';
const DATE_FORMAT = 'DD/MM/YY';
const InvalidPasswordMessage = 'שם המשתמש או הסיסמה שהוזנו שגויים';
const debug = (0, _debug.getDebug)('visa-cal');

async function getLoginFrame(page) {
  let frame = null;
  debug('wait until login frame found');
  await (0, _waiting.waitUntil)(() => {
    frame = page.frames().find(f => f.url().includes('calconnect')) || null;
    return Promise.resolve(!!frame);
  }, 'wait for iframe with login form', 10000, 1000);

  if (!frame) {
    debug('failed to find login frame for 10 seconds');
    throw new Error('failed to extract login iframe');
  }

  return frame;
}

async function hasInvalidPasswordError(page) {
  const frame = await getLoginFrame(page);
  const errorFound = await (0, _elementsInteractions.elementPresentOnPage)(frame, 'div.general-error > div');
  const errorMessage = errorFound ? await (0, _elementsInteractions.pageEval)(frame, 'div.general-error > div', '', item => {
    return item.innerText;
  }) : '';
  return errorMessage === InvalidPasswordMessage;
}

function getPossibleLoginResults() {
  debug('return possible login results');
  const urls = {
    [_baseScraperWithBrowser.LoginResults.Success]: [/AccountManagement/i],
    [_baseScraperWithBrowser.LoginResults.InvalidPassword]: [async options => {
      const page = options === null || options === void 0 ? void 0 : options.page;

      if (!page) {
        return false;
      }

      return hasInvalidPasswordError(page);
    }] // [LoginResults.AccountBlocked]: [], // TODO add when reaching this scenario
    // [LoginResults.ChangePassword]: [], // TODO add when reaching this scenario

  };
  return urls;
}

function createLoginFields(credentials) {
  debug('create login fields for username and password');
  return [{
    selector: '[formcontrolname="userName"]',
    value: credentials.username
  }, {
    selector: '[formcontrolname="password"]',
    value: credentials.password
  }];
}

function getAmountData(amountStr) {
  const amountStrCln = amountStr.replace(',', '');
  let currency = null;
  let amount = null;

  if (amountStrCln.includes(_constants.SHEKEL_CURRENCY_SYMBOL)) {
    amount = -parseFloat(amountStrCln.replace(_constants.SHEKEL_CURRENCY_SYMBOL, ''));
    currency = _constants.SHEKEL_CURRENCY;
  } else if (amountStrCln.includes(_constants.DOLLAR_CURRENCY_SYMBOL)) {
    amount = -parseFloat(amountStrCln.replace(_constants.DOLLAR_CURRENCY_SYMBOL, ''));
    currency = _constants.DOLLAR_CURRENCY;
  } else if (amountStrCln.includes(_constants.EURO_CURRENCY_SYMBOL)) {
    amount = -parseFloat(amountStrCln.replace(_constants.EURO_CURRENCY_SYMBOL, ''));
    currency = _constants.EURO_CURRENCY;
  } else {
    const parts = amountStrCln.split(' ');
    [currency] = parts;
    amount = -parseFloat(parts[1]);
  }

  return {
    amount,
    currency
  };
}

function getTransactionInstallments(memo) {
  const parsedMemo = /תשלום (\d+) מתוך (\d+)/.exec(memo || '');

  if (!parsedMemo || parsedMemo.length === 0) {
    return null;
  }

  return {
    number: parseInt(parsedMemo[1], 10),
    total: parseInt(parsedMemo[2], 10)
  };
}

function convertTransactions(txns) {
  debug(`convert ${txns.length} raw transactions to official Transaction structure`);
  return txns.map(txn => {
    const originalAmountTuple = getAmountData(txn.originalAmount || '');
    const chargedAmountTuple = getAmountData(txn.chargedAmount || '');
    const installments = getTransactionInstallments(txn.memo);
    const txnDate = (0, _moment.default)(txn.date, DATE_FORMAT);
    const processedDateFormat = txn.processedDate.length === 8 ? DATE_FORMAT : txn.processedDate.length === 9 || txn.processedDate.length === 10 ? LONG_DATE_FORMAT : null;

    if (!processedDateFormat) {
      throw new Error('invalid processed date');
    }

    const txnProcessedDate = (0, _moment.default)(txn.processedDate, processedDateFormat);
    const result = {
      type: installments ? _transactions.TransactionTypes.Installments : _transactions.TransactionTypes.Normal,
      status: _transactions.TransactionStatuses.Completed,
      date: installments ? txnDate.add(installments.number - 1, 'month').toISOString() : txnDate.toISOString(),
      processedDate: txnProcessedDate.toISOString(),
      originalAmount: originalAmountTuple.amount,
      originalCurrency: originalAmountTuple.currency,
      chargedAmount: chargedAmountTuple.amount,
      chargedCurrency: chargedAmountTuple.currency,
      description: txn.description || '',
      memo: txn.memo || ''
    };

    if (installments) {
      result.installments = installments;
    }

    return result;
  });
}

async function fetchTransactionsForAccount(page, startDate, accountNumber, scraperOptions) {
  const startDateValue = startDate.format('MM/YYYY');
  const dateSelector = '[id$="FormAreaNoBorder_FormArea_clndrDebitDateScope_TextBox"]';
  const dateHiddenFieldSelector = '[id$="FormAreaNoBorder_FormArea_clndrDebitDateScope_HiddenField"]';
  const buttonSelector = '[id$="FormAreaNoBorder_FormArea_ctlSubmitRequest"]';
  const nextPageSelector = '[id$="FormAreaNoBorder_FormArea_ctlGridPager_btnNext"]';
  const billingLabelSelector = '[id$=FormAreaNoBorder_FormArea_ctlMainToolBar_lblCaption]';
  const secondaryBillingLabelSelector = '[id$=FormAreaNoBorder_FormArea_ctlSecondaryToolBar_lblCaption]';
  const noDataSelector = '[id$=FormAreaNoBorder_FormArea_msgboxErrorMessages]';
  debug('find the start date index in the dropbox');
  const options = await (0, _elementsInteractions.pageEvalAll)(page, '[id$="FormAreaNoBorder_FormArea_clndrDebitDateScope_OptionList"] li', [], items => {
    return items.map(el => el.innerText);
  });
  const startDateIndex = options.findIndex(option => option === startDateValue);
  debug(`scrape ${options.length - startDateIndex} billing cycles`);
  const accountTransactions = [];

  for (let currentDateIndex = startDateIndex; currentDateIndex < options.length; currentDateIndex += 1) {
    debug('wait for date selector to be found');
    await (0, _elementsInteractions.waitUntilElementFound)(page, dateSelector, true);
    debug(`set hidden value of the date selector to be the index ${currentDateIndex}`);
    await (0, _elementsInteractions.setValue)(page, dateHiddenFieldSelector, `${currentDateIndex}`);
    debug('wait a second to workaround navigation issue in headless browser mode');
    await page.waitForTimeout(1000);
    debug('click on the filter submit button and wait for navigation');
    await Promise.all([page.waitForNavigation({
      waitUntil: 'domcontentloaded'
    }), (0, _elementsInteractions.clickButton)(page, buttonSelector)]);
    debug('check if month has no transactions');
    const pageHasNoTransactions = await (0, _elementsInteractions.pageEval)(page, noDataSelector, false, element => {
      const siteValue = (element.innerText || '').replace(/[^ א-ת]/g, '');
      return siteValue === 'לא נמצאו נתונים';
    });

    if (pageHasNoTransactions) {
      debug('page has no transactions');
    } else {
      var _settlementDateRegex$;

      debug('find the billing date');
      let billingDateLabel = await (0, _elementsInteractions.pageEval)(page, billingLabelSelector, '', element => {
        return element.innerText;
      });
      let settlementDateRegex = /\d{1,2}[/]\d{2}[/]\d{2,4}/;

      if (billingDateLabel === '') {
        billingDateLabel = await (0, _elementsInteractions.pageEval)(page, secondaryBillingLabelSelector, '', element => {
          return element.innerText;
        });
        settlementDateRegex = /\d{1,2}[/]\d{2,4}/;
      }

      const billingDate = (_settlementDateRegex$ = settlementDateRegex.exec(billingDateLabel)) === null || _settlementDateRegex$ === void 0 ? void 0 : _settlementDateRegex$[0];

      if (!billingDate) {
        throw new Error('failed to fetch process date');
      }

      debug(`found the billing date for that month ${billingDate}`);
      let hasNextPage = false;

      do {
        debug('fetch raw transactions from page');
        const rawTransactions = await (0, _elementsInteractions.pageEvalAll)(page, '#ctlMainGrid > tbody tr, #ctlSecondaryGrid > tbody tr', [], (items, billingDate) => {
          return items.map(el => {
            const columns = el.getElementsByTagName('td');

            if (columns.length === 6) {
              return {
                processedDate: columns[0].innerText,
                date: columns[1].innerText,
                description: columns[2].innerText,
                originalAmount: columns[3].innerText,
                chargedAmount: columns[4].innerText,
                memo: columns[5].innerText
              };
            }

            if (columns.length === 5) {
              return {
                processedDate: billingDate,
                date: columns[0].innerText,
                description: columns[1].innerText,
                originalAmount: columns[2].innerText,
                chargedAmount: columns[3].innerText,
                memo: columns[4].innerText
              };
            }

            return null;
          });
        }, billingDate);
        debug(`fetched ${rawTransactions.length} raw transactions from page`);
        accountTransactions.push(...convertTransactions(rawTransactions.filter(item => !!item)));
        debug('check for existance of another page');
        hasNextPage = await (0, _elementsInteractions.elementPresentOnPage)(page, nextPageSelector);

        if (hasNextPage) {
          debug('has another page, click on button next and wait for page navigation');
          await Promise.all([page.waitForNavigation({
            waitUntil: 'domcontentloaded'
          }), await (0, _elementsInteractions.clickButton)(page, '[id$=FormAreaNoBorder_FormArea_ctlGridPager_btnNext]')]);
        }
      } while (hasNextPage);
    }
  }

  debug('filer out old transactions');
  const txns = (0, _transactions2.filterOldTransactions)(accountTransactions, startDate, scraperOptions.combineInstallments || false);
  debug(`found ${txns.length} valid transactions out of ${accountTransactions.length} transactions for account ending with ${accountNumber.substring(accountNumber.length - 2)}`);
  return {
    accountNumber,
    txns
  };
}

async function getAccountNumbers(page) {
  return (0, _elementsInteractions.pageEvalAll)(page, '[id$=lnkItem]', [], elements => elements.map(e => e.text)).then(res => res.map(text => {
    var _$exec$, _$exec;

    return (_$exec$ = (_$exec = /\d+$/.exec(text.trim())) === null || _$exec === void 0 ? void 0 : _$exec[0]) !== null && _$exec$ !== void 0 ? _$exec$ : '';
  }));
}

async function setAccount(page, account) {
  await (0, _elementsInteractions.pageEvalAll)(page, '[id$=lnkItem]', null, (elements, account) => {
    for (const elem of elements) {
      const a = elem;

      if (a.text.includes(account)) {
        a.click();
      }
    }
  }, account);
}

async function fetchTransactions(page, startDate, scraperOptions) {
  const accountNumbers = await getAccountNumbers(page);
  const accounts = [];

  for (const account of accountNumbers) {
    debug(`setting account: ${account}`);
    await setAccount(page, account);
    await page.waitForTimeout(1000);
    accounts.push((await fetchTransactionsForAccount(page, startDate, account, scraperOptions)));
  }

  return accounts;
}

async function fetchFutureDebits(page) {
  const futureDebitsSelector = '.homepage-banks-top';
  const result = await (0, _elementsInteractions.pageEvalAll)(page, futureDebitsSelector, [], items => {
    const debitMountClass = 'amount';
    const debitWhenChargeClass = 'when-charge';
    const debitBankNumberClass = 'bankDesc';
    return items.map(currBankEl => {
      const amount = currBankEl.getElementsByClassName(debitMountClass)[0].innerText;
      const whenCharge = currBankEl.getElementsByClassName(debitWhenChargeClass)[0].innerText;
      const bankNumber = currBankEl.getElementsByClassName(debitBankNumberClass)[0].innerText;
      return {
        amount,
        whenCharge,
        bankNumber
      };
    });
  });
  const futureDebits = result.map(item => {
    var _$exec2, _$exec3;

    const amountData = getAmountData(item.amount);
    const chargeDate = (_$exec2 = /\d{1,2}[/]\d{2}[/]\d{2,4}/.exec(item.whenCharge)) === null || _$exec2 === void 0 ? void 0 : _$exec2[0];
    const bankAccountNumber = (_$exec3 = /\d+-\d+/.exec(item.bankNumber)) === null || _$exec3 === void 0 ? void 0 : _$exec3[0];
    return {
      amount: amountData.amount,
      amountCurrency: amountData.currency,
      chargeDate,
      bankAccountNumber
    };
  });
  return futureDebits;
}

class VisaCalScraper extends _baseScraperWithBrowser.BaseScraperWithBrowser {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "openLoginPopup", async () => {
      debug('open login popup, wait until login button available');
      await (0, _elementsInteractions.waitUntilElementFound)(this.page, '#ccLoginDesktopBtn', true);
      debug('click on the login button');
      await (0, _elementsInteractions.clickButton)(this.page, '#ccLoginDesktopBtn');
      debug('get the frame that holds the login');
      const frame = await getLoginFrame(this.page);
      debug('wait until the password login tab header is available');
      await (0, _elementsInteractions.waitUntilElementFound)(frame, '#regular-login');
      debug('navigate to the password login tab');
      await (0, _elementsInteractions.clickButton)(frame, '#regular-login');
      debug('wait until the password login tab is active');
      await (0, _elementsInteractions.waitUntilElementFound)(frame, 'regular-login');
      return frame;
    });
  }

  getLoginOptions(credentials) {
    return {
      loginUrl: `${LOGIN_URL}`,
      fields: createLoginFields(credentials),
      submitButtonSelector: 'button[type="submit"]',
      possibleResults: getPossibleLoginResults(),
      checkReadiness: async () => (0, _elementsInteractions.waitUntilElementFound)(this.page, '#ccLoginDesktopBtn'),
      preAction: this.openLoginPopup,
      userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36'
    };
  }

  async fetchData() {
    const defaultStartMoment = (0, _moment.default)().subtract(1, 'years').add(1, 'day');
    const startDate = this.options.startDate || defaultStartMoment.toDate();

    const startMoment = _moment.default.max(defaultStartMoment, (0, _moment.default)(startDate));

    debug(`fetch transactions starting ${startMoment.format()}`);
    debug('fetch future debits');
    const futureDebits = await fetchFutureDebits(this.page);
    debug('navigate to transactions page');
    await this.navigateTo(TRANSACTIONS_URL, undefined, 60000);
    debug('fetch accounts transactions');
    const accounts = await fetchTransactions(this.page, startMoment, this.options);
    debug('return the scraped accounts');
    return {
      success: true,
      accounts,
      futureDebits
    };
  }

}

var _default = VisaCalScraper;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zY3JhcGVycy92aXNhLWNhbC50cyJdLCJuYW1lcyI6WyJMT0dJTl9VUkwiLCJUUkFOU0FDVElPTlNfVVJMIiwiTE9OR19EQVRFX0ZPUk1BVCIsIkRBVEVfRk9STUFUIiwiSW52YWxpZFBhc3N3b3JkTWVzc2FnZSIsImRlYnVnIiwiZ2V0TG9naW5GcmFtZSIsInBhZ2UiLCJmcmFtZSIsImZyYW1lcyIsImZpbmQiLCJmIiwidXJsIiwiaW5jbHVkZXMiLCJQcm9taXNlIiwicmVzb2x2ZSIsIkVycm9yIiwiaGFzSW52YWxpZFBhc3N3b3JkRXJyb3IiLCJlcnJvckZvdW5kIiwiZXJyb3JNZXNzYWdlIiwiaXRlbSIsImlubmVyVGV4dCIsImdldFBvc3NpYmxlTG9naW5SZXN1bHRzIiwidXJscyIsIkxvZ2luUmVzdWx0cyIsIlN1Y2Nlc3MiLCJJbnZhbGlkUGFzc3dvcmQiLCJvcHRpb25zIiwiY3JlYXRlTG9naW5GaWVsZHMiLCJjcmVkZW50aWFscyIsInNlbGVjdG9yIiwidmFsdWUiLCJ1c2VybmFtZSIsInBhc3N3b3JkIiwiZ2V0QW1vdW50RGF0YSIsImFtb3VudFN0ciIsImFtb3VudFN0ckNsbiIsInJlcGxhY2UiLCJjdXJyZW5jeSIsImFtb3VudCIsIlNIRUtFTF9DVVJSRU5DWV9TWU1CT0wiLCJwYXJzZUZsb2F0IiwiU0hFS0VMX0NVUlJFTkNZIiwiRE9MTEFSX0NVUlJFTkNZX1NZTUJPTCIsIkRPTExBUl9DVVJSRU5DWSIsIkVVUk9fQ1VSUkVOQ1lfU1lNQk9MIiwiRVVST19DVVJSRU5DWSIsInBhcnRzIiwic3BsaXQiLCJnZXRUcmFuc2FjdGlvbkluc3RhbGxtZW50cyIsIm1lbW8iLCJwYXJzZWRNZW1vIiwiZXhlYyIsImxlbmd0aCIsIm51bWJlciIsInBhcnNlSW50IiwidG90YWwiLCJjb252ZXJ0VHJhbnNhY3Rpb25zIiwidHhucyIsIm1hcCIsInR4biIsIm9yaWdpbmFsQW1vdW50VHVwbGUiLCJvcmlnaW5hbEFtb3VudCIsImNoYXJnZWRBbW91bnRUdXBsZSIsImNoYXJnZWRBbW91bnQiLCJpbnN0YWxsbWVudHMiLCJ0eG5EYXRlIiwiZGF0ZSIsInByb2Nlc3NlZERhdGVGb3JtYXQiLCJwcm9jZXNzZWREYXRlIiwidHhuUHJvY2Vzc2VkRGF0ZSIsInJlc3VsdCIsInR5cGUiLCJUcmFuc2FjdGlvblR5cGVzIiwiSW5zdGFsbG1lbnRzIiwiTm9ybWFsIiwic3RhdHVzIiwiVHJhbnNhY3Rpb25TdGF0dXNlcyIsIkNvbXBsZXRlZCIsImFkZCIsInRvSVNPU3RyaW5nIiwib3JpZ2luYWxDdXJyZW5jeSIsImNoYXJnZWRDdXJyZW5jeSIsImRlc2NyaXB0aW9uIiwiZmV0Y2hUcmFuc2FjdGlvbnNGb3JBY2NvdW50Iiwic3RhcnREYXRlIiwiYWNjb3VudE51bWJlciIsInNjcmFwZXJPcHRpb25zIiwic3RhcnREYXRlVmFsdWUiLCJmb3JtYXQiLCJkYXRlU2VsZWN0b3IiLCJkYXRlSGlkZGVuRmllbGRTZWxlY3RvciIsImJ1dHRvblNlbGVjdG9yIiwibmV4dFBhZ2VTZWxlY3RvciIsImJpbGxpbmdMYWJlbFNlbGVjdG9yIiwic2Vjb25kYXJ5QmlsbGluZ0xhYmVsU2VsZWN0b3IiLCJub0RhdGFTZWxlY3RvciIsIml0ZW1zIiwiZWwiLCJzdGFydERhdGVJbmRleCIsImZpbmRJbmRleCIsIm9wdGlvbiIsImFjY291bnRUcmFuc2FjdGlvbnMiLCJjdXJyZW50RGF0ZUluZGV4Iiwid2FpdEZvclRpbWVvdXQiLCJhbGwiLCJ3YWl0Rm9yTmF2aWdhdGlvbiIsIndhaXRVbnRpbCIsInBhZ2VIYXNOb1RyYW5zYWN0aW9ucyIsImVsZW1lbnQiLCJzaXRlVmFsdWUiLCJiaWxsaW5nRGF0ZUxhYmVsIiwic2V0dGxlbWVudERhdGVSZWdleCIsImJpbGxpbmdEYXRlIiwiaGFzTmV4dFBhZ2UiLCJyYXdUcmFuc2FjdGlvbnMiLCJjb2x1bW5zIiwiZ2V0RWxlbWVudHNCeVRhZ05hbWUiLCJwdXNoIiwiZmlsdGVyIiwiY29tYmluZUluc3RhbGxtZW50cyIsInN1YnN0cmluZyIsImdldEFjY291bnROdW1iZXJzIiwiZWxlbWVudHMiLCJlIiwidGV4dCIsInRoZW4iLCJyZXMiLCJ0cmltIiwic2V0QWNjb3VudCIsImFjY291bnQiLCJlbGVtIiwiYSIsImNsaWNrIiwiZmV0Y2hUcmFuc2FjdGlvbnMiLCJhY2NvdW50TnVtYmVycyIsImFjY291bnRzIiwiZmV0Y2hGdXR1cmVEZWJpdHMiLCJmdXR1cmVEZWJpdHNTZWxlY3RvciIsImRlYml0TW91bnRDbGFzcyIsImRlYml0V2hlbkNoYXJnZUNsYXNzIiwiZGViaXRCYW5rTnVtYmVyQ2xhc3MiLCJjdXJyQmFua0VsIiwiZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSIsIndoZW5DaGFyZ2UiLCJiYW5rTnVtYmVyIiwiZnV0dXJlRGViaXRzIiwiYW1vdW50RGF0YSIsImNoYXJnZURhdGUiLCJiYW5rQWNjb3VudE51bWJlciIsImFtb3VudEN1cnJlbmN5IiwiVmlzYUNhbFNjcmFwZXIiLCJCYXNlU2NyYXBlcldpdGhCcm93c2VyIiwiZ2V0TG9naW5PcHRpb25zIiwibG9naW5VcmwiLCJmaWVsZHMiLCJzdWJtaXRCdXR0b25TZWxlY3RvciIsInBvc3NpYmxlUmVzdWx0cyIsImNoZWNrUmVhZGluZXNzIiwicHJlQWN0aW9uIiwib3BlbkxvZ2luUG9wdXAiLCJ1c2VyQWdlbnQiLCJmZXRjaERhdGEiLCJkZWZhdWx0U3RhcnRNb21lbnQiLCJzdWJ0cmFjdCIsInRvRGF0ZSIsInN0YXJ0TW9tZW50IiwibW9tZW50IiwibWF4IiwibmF2aWdhdGVUbyIsInVuZGVmaW5lZCIsInN1Y2Nlc3MiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBRUE7O0FBQ0E7O0FBR0E7O0FBUUE7O0FBR0E7O0FBQ0E7O0FBQ0E7Ozs7OztBQUVBLE1BQU1BLFNBQVMsR0FBRywrQkFBbEI7QUFDQSxNQUFNQyxnQkFBZ0IsR0FBRyx1RkFBekI7QUFDQSxNQUFNQyxnQkFBZ0IsR0FBRyxZQUF6QjtBQUNBLE1BQU1DLFdBQVcsR0FBRyxVQUFwQjtB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bnQgfSBmcm9tICdtb21lbnQnO1xuaW1wb3J0IHsgRnJhbWUsIFBhZ2UgfSBmcm9tICdwdXBwZXRlZXInO1xuaW1wb3J0IHsgQmFzZVNjcmFwZXJXaXRoQnJvd3NlciwgTG9naW5PcHRpb25zLCBMb2dpblJlc3VsdHMgfSBmcm9tICcuL2Jhc2Utc2NyYXBlci13aXRoLWJyb3dzZXInO1xuaW1wb3J0IHtcbiAgY2xpY2tCdXR0b24sIGVsZW1lbnRQcmVzZW50T25QYWdlLCBwYWdlRXZhbCwgcGFnZUV2YWxBbGwsIHNldFZhbHVlLCB3YWl0VW50aWxFbGVtZW50Rm91bmQsXG59IGZyb20gJy4uL2hlbHBlcnMvZWxlbWVudHMtaW50ZXJhY3Rpb25zJztcbmltcG9ydCB7XG4gIFRyYW5zYWN0aW9uLFxuICBUcmFuc2FjdGlvbkluc3RhbGxtZW50cyxcbiAgVHJhbnNhY3Rpb25zQWNjb3VudCxcbiAgVHJhbnNhY3Rpb25TdGF0dXNlcyxcbiAgVHJhbnNhY3Rpb25UeXBlcyxcbn0gZnJvbSAnLi4vdHJhbnNhY3Rpb25zJztcbmltcG9ydCB7IFNjcmFwZXJPcHRpb25zLCBTY2FwZXJTY3JhcGluZ1Jlc3VsdCwgU2NyYXBlckNyZWRlbnRpYWxzIH0gZnJvbSAnLi9iYXNlLXNjcmFwZXInO1xuaW1wb3J0IHtcbiAgRE9MTEFSX0NVUlJFTkNZLCBET0xMQVJfQ1VSUkVOQ1lfU1lNQk9MLCBFVVJPX0NVUlJFTkNZLCBFVVJPX0NVUlJFTkNZX1NZTUJPTCwgU0hFS0VMX0NVUlJFTkNZLCBTSEVLRUxfQ1VSUkVOQ1lfU1lNQk9MLFxufSBmcm9tICcuLi9jb25zdGFudHMnO1xuaW1wb3J0IHsgd2FpdFVudGlsIH0gZnJvbSAnLi4vaGVscGVycy93YWl0aW5nJztcbmltcG9ydCB7IGZpbHRlck9sZFRyYW5zYWN0aW9ucyB9IGZyb20gJy4uL2hlbHBlcnMvdHJhbnNhY3Rpb25zJztcbmltcG9ydCB7IGdldERlYnVnIH0gZnJvbSAnLi4vaGVscGVycy9kZWJ1Zyc7XG5cbmNvbnN0IExPR0lOX1VSTCA9ICdodHRwczovL3d3dy5jYWwtb25saW5lLmNvLmlsLyc7XG5jb25zdCBUUkFOU0FDVElPTlNfVVJMID0gJ2h0dHBzOi8vc2VydmljZXMuY2FsLW9ubGluZS5jby5pbC9DYXJkLUhvbGRlcnMvU2NyZWVucy9UcmFuc2FjdGlvbnMvVHJhbnNhY3Rpb25zLmFzcHgnO1xuY29uc3QgTE9OR19EQVRFX0ZPUk1BVCA9ICdERC9NTS9ZWVlZJztcbmNvbnN0IERBVEVfRk9STUFUID0gJ0REL01NL1lZJztcbmNvbnN0IEludmFsaWRQYXNzd29yZE1lc3NhZ2UgPSAn16nXnSDXlNee16nXqtee16kg15DXlSDXlNeh15nXodee15Qg16nXlNeV15bXoNeVINep15LXldeZ15nXnSc7XG5cbmNvbnN0IGRlYnVnID0gZ2V0RGVidWcoJ3Zpc2EtY2FsJyk7XG5cbmludGVyZmFjZSBTY3JhcGVkVHJhbnNhY3Rpb24ge1xuICBkYXRlOiBzdHJpbmc7XG4gIHByb2Nlc3NlZERhdGU6IHN0cmluZztcbiAgZGVzY3JpcHRpb246IHN0cmluZztcbiAgb3JpZ2luYWxBbW91bnQ6IHN0cmluZztcbiAgY2hhcmdlZEFtb3VudDogc3RyaW5nO1xuICBtZW1vOiBzdHJpbmc7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGdldExvZ2luRnJhbWUocGFnZTogUGFnZSkge1xuICBsZXQgZnJhbWU6IEZyYW1lIHwgbnVsbCA9IG51bGw7XG4gIGRlYnVnKCd3YWl0IHVudGlsIGxvZ2luIGZyYW1lIGZvdW5kJyk7XG4gIGF3YWl0IHdhaXRVbnRpbCgoKSA9PiB7XG4gICAgZnJhbWUgPSBwYWdlXG4gICAgICAuZnJhbWVzKClcbiAgICAgIC5maW5kKChmKSA9PiBmLnVybCgpLmluY2x1ZGVzKCdjYWxjb25uZWN0JykpIHx8IG51bGw7XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSghIWZyYW1lKTtcbiAgfSwgJ3dhaXQgZm9yIGlmcmFtZSB3aXRoIGxvZ2luIGZvcm0nLCAxMDAwMCwgMTAwMCk7XG5cbiAgaWYgKCFmcmFtZSkge1xuICAgIGRlYnVnKCdmYWlsZWQgdG8gZmluZCBsb2dpbiBmcmFtZSBmb3IgMTAgc2Vjb25kcycpO1xuICAgIHRocm93IG5ldyBFcnJvcignZmFpbGVkIHRvIGV4dHJhY3QgbG9naW4gaWZyYW1lJyk7XG4gIH1cblxuICByZXR1cm4gZnJhbWU7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGhhc0ludmFsaWRQYXNzd29yZEVycm9yKHBhZ2U6IFBhZ2UpIHtcbiAgY29uc3QgZnJhbWUgPSBhd2FpdCBnZXRMb2dpbkZyYW1lKHBhZ2UpO1xuICBjb25zdCBlcnJvckZvdW5kID0gYXdhaXQgZWxlbWVudFByZXNlbnRPblBhZ2UoZnJhbWUsICdkaXYuZ2VuZXJhbC1lcnJvciA+IGRpdicpO1xuICBjb25zdCBlcnJvck1lc3NhZ2UgPSBlcnJvckZvdW5kID8gYXdhaXQgcGFnZUV2YWwoZnJhbWUsICdkaXYuZ2VuZXJhbC1lcnJvciA+IGRpdicsICcnLCAoaXRlbSkgPT4ge1xuICAgIHJldHVybiAoaXRlbSBhcyBIVE1MRGl2RWxlbWVudCkuaW5uZXJUZXh0O1xuICB9KSA6ICcnO1xuICByZXR1cm4gZXJyb3JNZXNzYWdlID09PSBJbnZhbGlkUGFzc3dvcmRNZXNzYWdlO1xufVxuXG5mdW5jdGlvbiBnZXRQb3NzaWJsZUxvZ2luUmVzdWx0cygpIHtcbiAgZGVidWcoJ3JldHVybiBwb3NzaWJsZSBsb2dpbiByZXN1bHRzJyk7XG4gIGNvbnN0IHVybHM6IExvZ2luT3B0aW9uc1sncG9zc2libGVSZXN1bHRzJ10gPSB7XG4gICAgW0xvZ2luUmVzdWx0cy5TdWNjZXNzXTogWy9BY2NvdW50TWFuYWdlbWVudC9pXSxcbiAgICBbTG9naW5SZXN1bHRzLkludmFsaWRQYXNzd29yZF06IFthc3luYyAob3B0aW9ucz86IHsgcGFnZT86IFBhZ2V9KSA9PiB7XG4gICAgICBjb25zdCBwYWdlID0gb3B0aW9ucz8ucGFnZTtcbiAgICAgIGlmICghcGFnZSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICByZXR1cm4gaGFzSW52YWxpZFBhc3N3b3JkRXJyb3IocGFnZSk7XG4gICAgfV0sXG4gICAgLy8gW0xvZ2luUmVzdWx0cy5BY2NvdW50QmxvY2tlZF06IFtdLCAvLyBUT0RPIGFkZCB3aGVuIHJlYWNoaW5nIHRoaXMgc2NlbmFyaW9cbiAgICAvLyBbTG9naW5SZXN1bHRzLkNoYW5nZVBhc3N3b3JkXTogW10sIC8vIFRPRE8gYWRkIHdoZW4gcmVhY2hpbmcgdGhpcyBzY2VuYXJpb1xuICB9O1xuICByZXR1cm4gdXJscztcbn1cblxuZnVuY3Rpb24gY3JlYXRlTG9naW5GaWVsZHMoY3JlZGVudGlhbHM6IFNjcmFwZXJDcmVkZW50aWFscykge1xuICBkZWJ1ZygnY3JlYXRlIGxvZ2luIGZpZWxkcyBmb3IgdXNlcm5hbWUgYW5kIHBhc3N3b3JkJyk7XG4gIHJldHVybiBbXG4gICAgeyBzZWxlY3RvcjogJ1tmb3JtY29udHJvbG5hbWU9XCJ1c2VyTmFtZVwiXScsIHZhbHVlOiBjcmVkZW50aWFscy51c2VybmFtZSB9LFxuICAgIHsgc2VsZWN0b3I6ICdbZm9ybWNvbnRyb2xuYW1lPVwicGFzc3dvcmRcIl0nLCB2YWx1ZTogY3JlZGVudGlhbHMucGFzc3dvcmQgfSxcbiAgXTtcbn1cblxuXG5mdW5jdGlvbiBnZXRBbW91bnREYXRhKGFtb3VudFN0cjogc3RyaW5nKSB7XG4gIGNvbnN0IGFtb3VudFN0ckNsbiA9IGFtb3VudFN0ci5yZXBsYWNlKCcsJywgJycpO1xuICBsZXQgY3VycmVuY3k6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICBsZXQgYW1vdW50OiBudW1iZXIgfCBudWxsID0gbnVsbDtcbiAgaWYgKGFtb3VudFN0ckNsbi5pbmNsdWRlcyhTSEVLRUxfQ1VSUkVOQ1lfU1lNQk9MKSkge1xuICAgIGFtb3VudCA9IC1wYXJzZUZsb2F0KGFtb3VudFN0ckNsbi5yZXBsYWNlKFNIRUtFTF9DVVJSRU5DWV9TWU1CT0wsICcnKSk7XG4gICAgY3VycmVuY3kgPSBTSEVLRUxfQ1VSUkVOQ1k7XG4gIH0gZWxzZSBpZiAoYW1vdW50U3RyQ2xuLmluY2x1ZGVzKERPTExBUl9DVVJSRU5DWV9TWU1CT0wpKSB7XG4gICAgYW1vdW50ID0gLXBhcnNlRmxvYXQoYW1vdW50U3RyQ2xuLnJlcGxhY2UoRE9MTEFSX0NVUlJFTkNZX1NZTUJPTCwgJycpKTtcbiAgICBjdXJyZW5jeSA9IERPTExBUl9DVVJSRU5DWTtcbiAgfSBlbHNlIGlmIChhbW91bnRTdHJDbG4uaW5jbHVkZXMoRVVST19DVVJSRU5DWV9TWU1CT0wpKSB7XG4gICAgYW1vdW50ID0gLXBhcnNlRmxvYXQoYW1vdW50U3RyQ2xuLnJlcGxhY2UoRVVST19DVVJSRU5DWV9TWU1CT0wsICcnKSk7XG4gICAgY3VycmVuY3kgPSBFVVJPX0NVUlJFTkNZO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IHBhcnRzID0gYW1vdW50U3RyQ2xuLnNwbGl0KCcgJyk7XG4gICAgW2N1cnJlbmN5XSA9IHBhcnRzO1xuICAgIGFtb3VudCA9IC1wYXJzZUZsb2F0KHBhcnRzWzFdKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgYW1vdW50LFxuICAgIGN1cnJlbmN5LFxuICB9O1xufVxuXG5mdW5jdGlvbiBnZXRUcmFuc2FjdGlvbkluc3RhbGxtZW50cyhtZW1vOiBzdHJpbmcpOiBUcmFuc2FjdGlvbkluc3RhbGxtZW50cyB8IG51bGwge1xuICBjb25zdCBwYXJzZWRNZW1vID0gKC/Xqtep15zXldedIChcXGQrKSDXnteq15XXmiAoXFxkKykvKS5leGVjKG1lbW8gfHwgJycpO1xuXG4gIGlmICghcGFyc2VkTWVtbyB8fCBwYXJzZWRNZW1vLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBudW1iZXI6IHBhcnNlSW50KHBhcnNlZE1lbW9bMV0sIDEwKSxcbiAgICB0b3RhbDogcGFyc2VJbnQocGFyc2VkTWVtb1syXSwgMTApLFxuICB9O1xufVxuZnVuY3Rpb24gY29udmVydFRyYW5zYWN0aW9ucyh0eG5zOiBTY3JhcGVkVHJhbnNhY3Rpb25bXSk6IFRyYW5zYWN0aW9uW10ge1xuICBkZWJ1ZyhgY29udmVydCAke3R4bnMubGVuZ3RofSByYXcgdHJhbnNhY3Rpb25zIHRvIG9mZmljaWFsIFRyYW5zYWN0aW9uIHN0cnVjdHVyZWApO1xuICByZXR1cm4gdHhucy5tYXAoKHR4bikgPT4ge1xuICAgIGNvbnN0IG9yaWdpbmFsQW1vdW50VHVwbGUgPSBnZXRBbW91bnREYXRhKHR4bi5vcmlnaW5hbEFtb3VudCB8fCAnJyk7XG4gICAgY29uc3QgY2hhcmdlZEFtb3VudFR1cGxlID0gZ2V0QW1vdW50RGF0YSh0eG4uY2hhcmdlZEFtb3VudCB8fCAnJyk7XG5cbiAgICBjb25zdCBpbnN0YWxsbWVudHMgPSBnZXRUcmFuc2FjdGlvbkluc3RhbGxtZW50cyh0eG4ubWVtbyk7XG4gICAgY29uc3QgdHhuRGF0ZSA9IG1vbWVudCh0eG4uZGF0ZSwgREFURV9GT1JNQVQpO1xuICAgIGNvbnN0IHByb2Nlc3NlZERhdGVGb3JtYXQgPVxuICAgICAgdHhuLnByb2Nlc3NlZERhdGUubGVuZ3RoID09PSA4ID9cbiAgICAgICAgREFURV9GT1JNQVQgOlxuICAgICAgICB0eG4ucHJvY2Vzc2VkRGF0ZS5sZW5ndGggPT09IDkgfHwgdHhuLnByb2Nlc3NlZERhdGUubGVuZ3RoID09PSAxMCA/XG4gICAgICAgICAgTE9OR19EQVRFX0ZPUk1BVCA6XG4gICAgICAgICAgbnVsbDtcbiAgICBpZiAoIXByb2Nlc3NlZERhdGVGb3JtYXQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBwcm9jZXNzZWQgZGF0ZScpO1xuICAgIH1cbiAgICBjb25zdCB0eG5Qcm9jZXNzZWREYXRlID0gbW9tZW50KHR4bi5wcm9jZXNzZWREYXRlLCBwcm9jZXNzZWREYXRlRm9ybWF0KTtcblxuICAgIGNvbnN0IHJlc3VsdDogVHJhbnNhY3Rpb24gPSB7XG4gICAgICB0eXBlOiBpbnN0YWxsbWVudHMgPyBUcmFuc2FjdGlvblR5cGVzLkluc3RhbGxtZW50cyA6IFRyYW5zYWN0aW9uVHlwZXMuTm9ybWFsLFxuICAgICAgc3RhdHVzOiBUcmFuc2FjdGlvblN0YXR1c2VzLkNvbXBsZXRlZCxcbiAgICAgIGRhdGU6IGluc3RhbGxtZW50cyA/IHR4bkRhdGUuYWRkKGluc3RhbGxtZW50cy5udW1iZXIgLSAxLCAnbW9udGgnKS50b0lTT1N0cmluZygpIDogdHhuRGF0ZS50b0lTT1N0cmluZygpLFxuICAgICAgcHJvY2Vzc2VkRGF0ZTogdHhuUHJvY2Vzc2VkRGF0ZS50b0lTT1N0cmluZygpLFxuICAgICAgb3JpZ2luYWxBbW91bnQ6IG9yaWdpbmFsQW1vdW50VHVwbGUuYW1vdW50LFxuICAgICAgb3JpZ2luYWxDdXJyZW5jeTogb3JpZ2luYWxBbW91bnRUdXBsZS5jdXJyZW5jeSxcbiAgICAgIGNoYXJnZWRBbW91bnQ6IGNoYXJnZWRBbW91bnRUdXBsZS5hbW91bnQsXG4gICAgICBjaGFyZ2VkQ3VycmVuY3k6IGNoYXJnZWRBbW91bnRUdXBsZS5jdXJyZW5jeSxcbiAgICAgIGRlc2NyaXB0aW9uOiB0eG4uZGVzY3JpcHRpb24gfHwgJycsXG4gICAgICBtZW1vOiB0eG4ubWVtbyB8fCAnJyxcbiAgICB9O1xuXG4gICAgaWYgKGluc3RhbGxtZW50cykge1xuICAgICAgcmVzdWx0Lmluc3RhbGxtZW50cyA9IGluc3RhbGxtZW50cztcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9KTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZmV0Y2hUcmFuc2FjdGlvbnNGb3JBY2NvdW50KHBhZ2U6IFBhZ2UsIHN0YXJ0RGF0ZTogTW9tZW50LCBhY2NvdW50TnVtYmVyOiBzdHJpbmcsIHNjcmFwZXJPcHRpb25zOiBTY3JhcGVyT3B0aW9ucyk6IFByb21pc2U8VHJhbnNhY3Rpb25zQWNjb3VudD4ge1xuICBjb25zdCBzdGFydERhdGVWYWx1ZSA9IHN0YXJ0RGF0ZS5mb3JtYXQoJ01NL1lZWVknKTtcbiAgY29uc3QgZGF0ZVNlbGVjdG9yID0gJ1tpZCQ9XCJGb3JtQXJlYU5vQm9yZGVyX0Zvcm1BcmVhX2NsbmRyRGViaXREYXRlU2NvcGVfVGV4dEJveFwiXSc7XG4gIGNvbnN0IGRhdGVIaWRkZW5GaWVsZFNlbGVjdG9yID0gJ1tpZCQ9XCJGb3JtQXJlYU5vQm9yZGVyX0Zvcm1BcmVhX2NsbmRyRGViaXREYXRlU2NvcGVfSGlkZGVuRmllbGRcIl0nO1xuICBjb25zdCBidXR0b25TZWxlY3RvciA9ICdbaWQkPVwiRm9ybUFyZWFOb0JvcmRlcl9Gb3JtQXJlYV9jdGxTdWJtaXRSZXF1ZXN0XCJdJztcbiAgY29uc3QgbmV4dFBhZ2VTZWxlY3RvciA9ICdbaWQkPVwiRm9ybUFyZWFOb0JvcmRlcl9Gb3JtQXJlYV9jdGxHcmlkUGFnZXJfYnRuTmV4dFwiXSc7XG4gIGNvbnN0IGJpbGxpbmdMYWJlbFNlbGVjdG9yID0gJ1tpZCQ9Rm9ybUFyZWFOb0JvcmRlcl9Gb3JtQXJlYV9jdGxNYWluVG9vbEJhcl9sYmxDYXB0aW9uXSc7XG4gIGNvbnN0IHNlY29uZGFyeUJpbGxpbmdMYWJlbFNlbGVjdG9yID0gJ1tpZCQ9Rm9ybUFyZWFOb0JvcmRlcl9Gb3JtQXJlYV9jdGxTZWNvbmRhcnlUb29sQmFyX2xibENhcHRpb25dJztcbiAgY29uc3Qgbm9EYXRhU2VsZWN0b3IgPSAnW2lkJD1Gb3JtQXJlYU5vQm9yZGVyX0Zvcm1BcmVhX21zZ2JveEVycm9yTWVzc2FnZXNdJztcblxuICBkZWJ1ZygnZmluZCB0aGUgc3RhcnQgZGF0ZSBpbmRleCBpbiB0aGUgZHJvcGJveCcpO1xuICBjb25zdCBvcHRpb25zID0gYXdhaXQgcGFnZUV2YWxBbGwocGFnZSwgJ1tpZCQ9XCJGb3JtQXJlYU5vQm9yZGVyX0Zvcm1BcmVhX2NsbmRyRGViaXREYXRlU2NvcGVfT3B0aW9uTGlzdFwiXSBsaScsIFtdLCAoaXRlbXMpID0+IHtcbiAgICByZXR1cm4gaXRlbXMubWFwKChlbDogYW55KSA9PiBlbC5pbm5lclRleHQpO1xuICB9KTtcbiAgY29uc3Qgc3RhcnREYXRlSW5kZXggPSBvcHRpb25zLmZpbmRJbmRleCgob3B0aW9uKSA9PiBvcHRpb24gPT09IHN0YXJ0RGF0ZVZhbHVlKTtcblxuICBkZWJ1Zyhgc2NyYXBlICR7b3B0aW9ucy5sZW5ndGggLSBzdGFydERhdGVJbmRleH0gYmlsbGluZyBjeWNsZXNgKTtcbiAgY29uc3QgYWNjb3VudFRyYW5zYWN0aW9uczogVHJhbnNhY3Rpb25bXSA9IFtdO1xuICBmb3IgKGxldCBjdXJyZW50RGF0ZUluZGV4ID0gc3RhcnREYXRlSW5kZXg7IGN1cnJlbnREYXRlSW5kZXggPCBvcHRpb25zLmxlbmd0aDsgY3VycmVudERhdGVJbmRleCArPSAxKSB7XG4gICAgZGVidWcoJ3dhaXQgZm9yIGRhdGUgc2VsZWN0b3IgdG8gYmUgZm91bmQnKTtcbiAgICBhd2FpdCB3YWl0VW50aWxFbGVtZW50Rm91bmQocGFnZSwgZGF0ZVNlbGVjdG9yLCB0cnVlKTtcbiAgICBkZWJ1Zyhgc2V0IGhpZGRlbiB2YWx1ZSBvZiB0aGUgZGF0ZSBzZWxlY3RvciB0byBiZSB0aGUgaW5kZXggJHtjdXJyZW50RGF0ZUluZGV4fWApO1xuICAgIGF3YWl0IHNldFZhbHVlKHBhZ2UsIGRhdGVIaWRkZW5GaWVsZFNlbGVjdG9yLCBgJHtjdXJyZW50RGF0ZUluZGV4fWApO1xuICAgIGRlYnVnKCd3YWl0IGEgc2Vjb25kIHRvIHdvcmthcm91bmQgbmF2aWdhdGlvbiBpc3N1ZSBpbiBoZWFkbGVzcyBicm93c2VyIG1vZGUnKTtcbiAgICBhd2FpdCBwYWdlLndhaXRGb3JUaW1lb3V0KDEwMDApO1xuICAgIGRlYnVnKCdjbGljayBvbiB0aGUgZmlsdGVyIHN1Ym1pdCBidXR0b24gYW5kIHdhaXQgZm9yIG5hdmlnYXRpb24nKTtcbiAgICBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICBwYWdlLndhaXRGb3JOYXZpZ2F0aW9uKHsgd2FpdFVudGlsOiAnZG9tY29udGVudGxvYWRlZCcgfSksXG4gICAgICBjbGlja0J1dHRvbihwYWdlLCBidXR0b25TZWxlY3RvciksXG4gICAgXSk7XG4gICAgZGVidWcoJ2NoZWNrIGlmIG1vbnRoIGhhcyBubyB0cmFuc2FjdGlvbnMnKTtcbiAgICBjb25zdCBwYWdlSGFzTm9UcmFuc2FjdGlvbnMgPSBhd2FpdCBwYWdlRXZhbChwYWdlLCBub0RhdGFTZWxlY3RvciwgZmFsc2UsICgoZWxlbWVudCkgPT4ge1xuICAgICAgY29uc3Qgc2l0ZVZhbHVlID0gKChlbGVtZW50IGFzIEhUTUxTcGFuRWxlbWVudCkuaW5uZXJUZXh0IHx8ICcnKS5yZXBsYWNlKC9bXiDXkC3Xql0vZywgJycpO1xuICAgICAgcmV0dXJuIHNpdGVWYWx1ZSA9PT0gJ9ec15Ag16DXntem15DXlSDXoNeq15XXoNeZ150nO1xuICAgIH0pKTtcblxuICAgIGlmIChwYWdlSGFzTm9UcmFuc2FjdGlvbnMpIHtcbiAgICAgIGRlYnVnKCdwYWdlIGhhcyBubyB0cmFuc2FjdGlvbnMnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVidWcoJ2ZpbmQgdGhlIGJpbGxpbmcgZGF0ZScpO1xuICAgICAgbGV0IGJpbGxpbmdEYXRlTGFiZWwgPSBhd2FpdCBwYWdlRXZhbChwYWdlLCBiaWxsaW5nTGFiZWxTZWxlY3RvciwgJycsICgoZWxlbWVudCkgPT4ge1xuICAgICAgICByZXR1cm4gKGVsZW1lbnQgYXMgSFRNTFNwYW5FbGVtZW50KS5pbm5lclRleHQ7XG4gICAgICB9KSk7XG4gICAgICBsZXQgc2V0dGxlbWVudERhdGVSZWdleCA9IC9cXGR7MSwyfVsvXVxcZHsyfVsvXVxcZHsyLDR9LztcblxuICAgICAgaWYgKGJpbGxpbmdEYXRlTGFiZWwgPT09ICcnKSB7XG4gICAgICAgIGJpbGxpbmdEYXRlTGFiZWwgPSBhd2FpdCBwYWdlRXZhbChwYWdlLCBzZWNvbmRhcnlCaWxsaW5nTGFiZWxTZWxlY3RvciwgJycsICgoZWxlbWVudCkgPT4ge1xuICAgICAgICAgIHJldHVybiAoZWxlbWVudCBhcyBIVE1MU3BhbkVsZW1lbnQpLmlubmVyVGV4dDtcbiAgICAgICAgfSkpO1xuICAgICAgICBzZXR0bGVtZW50RGF0ZVJlZ2V4ID0gL1xcZHsxLDJ9Wy9dXFxkezIsNH0vO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBiaWxsaW5nRGF0ZSA9IHNldHRsZW1lbnREYXRlUmVnZXguZXhlYyhiaWxsaW5nRGF0ZUxhYmVsKT8uWzBdO1xuXG4gICAgICBpZiAoIWJpbGxpbmdEYXRlKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignZmFpbGVkIHRvIGZldGNoIHByb2Nlc3MgZGF0ZScpO1xuICAgICAgfVxuXG4gICAgICBkZWJ1ZyhgZm91bmQgdGhlIGJpbGxpbmcgZGF0ZSBmb3IgdGhhdCBtb250aCAke2JpbGxpbmdEYXRlfWApO1xuICAgICAgbGV0IGhhc05leHRQYWdlID0gZmFsc2U7XG4gICAgICBkbyB7XG4gICAgICAgIGRlYnVnKCdmZXRjaCByYXcgdHJhbnNhY3Rpb25zIGZyb20gcGFnZScpO1xuICAgICAgICBjb25zdCByYXdUcmFuc2FjdGlvbnMgPSBhd2FpdCBwYWdlRXZhbEFsbDwoU2NyYXBlZFRyYW5zYWN0aW9uIHwgbnVsbClbXT4ocGFnZSwgJyNjdGxNYWluR3JpZCA+IHRib2R5IHRyLCAjY3RsU2Vjb25kYXJ5R3JpZCA+IHRib2R5IHRyJywgW10sIChpdGVtcywgYmlsbGluZ0RhdGUpID0+IHtcbiAgICAgICAgICByZXR1cm4gKGl0ZW1zKS5tYXAoKGVsKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBjb2x1bW5zID0gZWwuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3RkJyk7XG4gICAgICAgICAgICBpZiAoY29sdW1ucy5sZW5ndGggPT09IDYpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBwcm9jZXNzZWREYXRlOiBjb2x1bW5zWzBdLmlubmVyVGV4dCxcbiAgICAgICAgICAgICAgICBkYXRlOiBjb2x1bW5zWzFdLmlubmVyVGV4dCxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogY29sdW1uc1syXS5pbm5lclRleHQsXG4gICAgICAgICAgICAgICAgb3JpZ2luYWxBbW91bnQ6IGNvbHVtbnNbM10uaW5uZXJUZXh0LFxuICAgICAgICAgICAgICAgIGNoYXJnZWRBbW91bnQ6IGNvbHVtbnNbNF0uaW5uZXJUZXh0LFxuICAgICAgICAgICAgICAgIG1lbW86IGNvbHVtbnNbNV0uaW5uZXJUZXh0LFxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNvbHVtbnMubGVuZ3RoID09PSA1KSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgcHJvY2Vzc2VkRGF0ZTogYmlsbGluZ0RhdGUsXG4gICAgICAgICAgICAgICAgZGF0ZTogY29sdW1uc1swXS5pbm5lclRleHQsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IGNvbHVtbnNbMV0uaW5uZXJUZXh0LFxuICAgICAgICAgICAgICAgIG9yaWdpbmFsQW1vdW50OiBjb2x1bW5zWzJdLmlubmVyVGV4dCxcbiAgICAgICAgICAgICAgICBjaGFyZ2VkQW1vdW50OiBjb2x1bW5zWzNdLmlubmVyVGV4dCxcbiAgICAgICAgICAgICAgICBtZW1vOiBjb2x1bW5zWzRdLmlubmVyVGV4dCxcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9LCBiaWxsaW5nRGF0ZSk7XG4gICAgICAgIGRlYnVnKGBmZXRjaGVkICR7cmF3VHJhbnNhY3Rpb25zLmxlbmd0aH0gcmF3IHRyYW5zYWN0aW9ucyBmcm9tIHBhZ2VgKTtcbiAgICAgICAgYWNjb3VudFRyYW5zYWN0aW9ucy5wdXNoKC4uLmNvbnZlcnRUcmFuc2FjdGlvbnMoKHJhd1RyYW5zYWN0aW9ucyBhcyBTY3JhcGVkVHJhbnNhY3Rpb25bXSlcbiAgICAgICAgICAuZmlsdGVyKChpdGVtKSA9PiAhIWl0ZW0pKSk7XG5cbiAgICAgICAgZGVidWcoJ2NoZWNrIGZvciBleGlzdGFuY2Ugb2YgYW5vdGhlciBwYWdlJyk7XG4gICAgICAgIGhhc05leHRQYWdlID0gYXdhaXQgZWxlbWVudFByZXNlbnRPblBhZ2UocGFnZSwgbmV4dFBhZ2VTZWxlY3Rvcik7XG4gICAgICAgIGlmIChoYXNOZXh0UGFnZSkge1xuICAgICAgICAgIGRlYnVnKCdoYXMgYW5vdGhlciBwYWdlLCBjbGljayBvbiBidXR0b24gbmV4dCBhbmQgd2FpdCBmb3IgcGFnZSBuYXZpZ2F0aW9uJyk7XG4gICAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgICAgICAgcGFnZS53YWl0Rm9yTmF2aWdhdGlvbih7IHdhaXRVbnRpbDogJ2RvbWNvbnRlbnRsb2FkZWQnIH0pLFxuICAgICAgICAgICAgYXdhaXQgY2xpY2tCdXR0b24ocGFnZSwgJ1tpZCQ9Rm9ybUFyZWFOb0JvcmRlcl9Gb3JtQXJlYV9jdGxHcmlkUGFnZXJfYnRuTmV4dF0nKSxcbiAgICAgICAgICBdKTtcbiAgICAgICAgfVxuICAgICAgfSB3aGlsZSAoaGFzTmV4dFBhZ2UpO1xuICAgIH1cbiAgfVxuXG4gIGRlYnVnKCdmaWxlciBvdXQgb2xkIHRyYW5zYWN0aW9ucycpO1xuICBjb25zdCB0eG5zID0gZmlsdGVyT2xkVHJhbnNhY3Rpb25zKGFjY291bnRUcmFuc2FjdGlvbnMsIHN0YXJ0RGF0ZSwgc2NyYXBlck9wdGlvbnMuY29tYmluZUluc3RhbGxtZW50cyB8fCBmYWxzZSk7XG4gIGRlYnVnKGBmb3VuZCAke3R4bnMubGVuZ3RofSB2YWxpZCB0cmFuc2FjdGlvbnMgb3V0IG9mICR7YWNjb3VudFRyYW5zYWN0aW9ucy5sZW5ndGh9IHRyYW5zYWN0aW9ucyBmb3IgYWNjb3VudCBlbmRpbmcgd2l0aCAke2FjY291bnROdW1iZXIuc3Vic3RyaW5nKGFjY291bnROdW1iZXIubGVuZ3RoIC0gMil9YCk7XG4gIHJldHVybiB7XG4gICAgYWNjb3VudE51bWJlcixcbiAgICB0eG5zLFxuICB9O1xufVxuXG5hc3luYyBmdW5jdGlvbiBnZXRBY2NvdW50TnVtYmVycyhwYWdlOiBQYWdlKTogUHJvbWlzZTxzdHJpbmdbXT4ge1xuICByZXR1cm4gcGFnZUV2YWxBbGwocGFnZSwgJ1tpZCQ9bG5rSXRlbV0nLCBbXSwgKGVsZW1lbnRzKSA9PiBlbGVtZW50cy5tYXAoKGUpID0+IChlIGFzIEhUTUxBbmNob3JFbGVtZW50KS50ZXh0KSkudGhlbigocmVzKSA9PiByZXMubWFwKCh0ZXh0KSA9PiAvXFxkKyQvLmV4ZWModGV4dC50cmltKCkpPy5bMF0gPz8gJycpKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gc2V0QWNjb3VudChwYWdlOiBQYWdlLCBhY2NvdW50OiBzdHJpbmcpIHtcbiAgYXdhaXQgcGFnZUV2YWxBbGwoXG4gICAgcGFnZSxcbiAgICAnW2lkJD1sbmtJdGVtXScsXG4gICAgbnVsbCxcbiAgICAoZWxlbWVudHMsIGFjY291bnQpID0+IHtcbiAgICAgIGZvciAoY29uc3QgZWxlbSBvZiBlbGVtZW50cykge1xuICAgICAgICBjb25zdCBhID0gZWxlbSBhcyBIVE1MQW5jaG9yRWxlbWVudDtcbiAgICAgICAgaWYgKGEudGV4dC5pbmNsdWRlcyhhY2NvdW50KSkge1xuICAgICAgICAgIGEuY2xpY2soKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgYWNjb3VudCxcbiAgKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZmV0Y2hUcmFuc2FjdGlvbnMocGFnZTogUGFnZSwgc3RhcnREYXRlOiBNb21lbnQsIHNjcmFwZXJPcHRpb25zOiBTY3JhcGVyT3B0aW9ucyk6IFByb21pc2U8VHJhbnNhY3Rpb25zQWNjb3VudFtdPiB7XG4gIGNvbnN0IGFjY291bnROdW1iZXJzOiBzdHJpbmdbXSA9IGF3YWl0IGdldEFjY291bnROdW1iZXJzKHBhZ2UpO1xuICBjb25zdCBhY2NvdW50czogVHJhbnNhY3Rpb25zQWNjb3VudFtdID0gW107XG5cbiAgZm9yIChjb25zdCBhY2NvdW50IG9mIGFjY291bnROdW1iZXJzKSB7XG4gICAgZGVidWcoYHNldHRpbmcgYWNjb3VudDogJHthY2NvdW50fWApO1xuICAgIGF3YWl0IHNldEFjY291bnQocGFnZSwgYWNjb3VudCk7XG4gICAgYXdhaXQgcGFnZS53YWl0Rm9yVGltZW91dCgxMDAwKTtcbiAgICBhY2NvdW50cy5wdXNoKFxuICAgICAgYXdhaXQgZmV0Y2hUcmFuc2FjdGlvbnNGb3JBY2NvdW50KFxuICAgICAgICBwYWdlLFxuICAgICAgICBzdGFydERhdGUsXG4gICAgICAgIGFjY291bnQsXG4gICAgICAgIHNjcmFwZXJPcHRpb25zLFxuICAgICAgKSxcbiAgICApO1xuICB9XG5cbiAgcmV0dXJuIGFjY291bnRzO1xufVxuXG5hc3luYyBmdW5jdGlvbiBmZXRjaEZ1dHVyZURlYml0cyhwYWdlOiBQYWdlKSB7XG4gIGNvbnN0IGZ1dHVyZURlYml0c1NlbGVjdG9yID0gJy5ob21lcGFnZS1iYW5rcy10b3AnO1xuXG4gIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHBhZ2VFdmFsQWxsKHBhZ2UsIGZ1dHVyZURlYml0c1NlbGVjdG9yLCBbXSwgKGl0ZW1zKSA9PiB7XG4gICAgY29uc3QgZGViaXRNb3VudENsYXNzID0gJ2Ftb3VudCc7XG4gICAgY29uc3QgZGViaXRXaGVuQ2hhcmdlQ2xhc3MgPSAnd2hlbi1jaGFyZ2UnO1xuICAgIGNvbnN0IGRlYml0QmFua051bWJlckNsYXNzID0gJ2JhbmtEZXNjJztcblxuICAgIHJldHVybiBpdGVtcy5tYXAoKGN1cnJCYW5rRWw6IGFueSkgPT4ge1xuICAgICAgY29uc3QgYW1vdW50ID0gY3VyckJhbmtFbC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKGRlYml0TW91bnRDbGFzcylbMF0uaW5uZXJUZXh0O1xuICAgICAgY29uc3Qgd2hlbkNoYXJnZSA9IGN1cnJCYW5rRWwuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShkZWJpdFdoZW5DaGFyZ2VDbGFzcylbMF0uaW5uZXJUZXh0O1xuICAgICAgY29uc3QgYmFua051bWJlciA9IGN1cnJCYW5rRWwuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShkZWJpdEJhbmtOdW1iZXJDbGFzcylbMF0uaW5uZXJUZXh0O1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgYW1vdW50LFxuICAgICAgICB3aGVuQ2hhcmdlLFxuICAgICAgICBiYW5rTnVtYmVyLFxuICAgICAgfTtcbiAgICB9KTtcbiAgfSk7XG4gIGNvbnN0IGZ1dHVyZURlYml0cyA9IHJlc3VsdC5tYXAoKGl0ZW0pID0+IHtcbiAgICBjb25zdCBhbW91bnREYXRhID0gZ2V0QW1vdW50RGF0YShpdGVtLmFtb3VudCk7XG4gICAgY29uc3QgY2hhcmdlRGF0ZSA9IC9cXGR7MSwyfVsvXVxcZHsyfVsvXVxcZHsyLDR9Ly5leGVjKGl0ZW0ud2hlbkNoYXJnZSk/LlswXTtcbiAgICBjb25zdCBiYW5rQWNjb3VudE51bWJlciA9IC9cXGQrLVxcZCsvLmV4ZWMoaXRlbS5iYW5rTnVtYmVyKT8uWzBdO1xuICAgIHJldHVybiB7XG4gICAgICBhbW91bnQ6IGFtb3VudERhdGEuYW1vdW50LFxuICAgICAgYW1vdW50Q3VycmVuY3k6IGFtb3VudERhdGEuY3VycmVuY3ksXG4gICAgICBjaGFyZ2VEYXRlLFxuICAgICAgYmFua0FjY291bnROdW1iZXIsXG4gICAgfTtcbiAgfSk7XG4gIHJldHVybiBmdXR1cmVEZWJpdHM7XG59XG5cbmNsYXNzIFZpc2FDYWxTY3JhcGVyIGV4dGVuZHMgQmFzZVNjcmFwZXJXaXRoQnJvd3NlciB7XG4gIG9wZW5Mb2dpblBvcHVwID0gYXN5bmMgKCkgPT4ge1xuICAgIGRlYnVnKCdvcGVuIGxvZ2luIHBvcHVwLCB3YWl0IHVudGlsIGxvZ2luIGJ1dHRvbiBhdmFpbGFibGUnKTtcbiAgICBhd2FpdCB3YWl0VW50aWxFbGVtZW50Rm91bmQodGhpcy5wYWdlLCAnI2NjTG9naW5EZXNrdG9wQnRuJywgdHJ1ZSk7XG4gICAgZGVidWcoJ2NsaWNrIG9uIHRoZSBsb2dpbiBidXR0b24nKTtcbiAgICBhd2FpdCBjbGlja0J1dHRvbih0aGlzLnBhZ2UsICcjY2NMb2dpbkRlc2t0b3BCdG4nKTtcbiAgICBkZWJ1ZygnZ2V0IHRoZSBmcmFtZSB0aGF0IGhvbGRzIHRoZSBsb2dpbicpO1xuICAgIGNvbnN0IGZyYW1lID0gYXdhaXQgZ2V0TG9naW5GcmFtZSh0aGlzLnBhZ2UpO1xuICAgIGRlYnVnKCd3YWl0IHVudGlsIHRoZSBwYXNzd29yZCBsb2dpbiB0YWIgaGVhZGVyIGlzIGF2YWlsYWJsZScpO1xuICAgIGF3YWl0IHdhaXRVbnRpbEVsZW1lbnRGb3VuZChmcmFtZSwgJyNyZWd1bGFyLWxvZ2luJyk7XG4gICAgZGVidWcoJ25hdmlnYXRlIHRvIHRoZSBwYXNzd29yZCBsb2dpbiB0YWInKTtcbiAgICBhd2FpdCBjbGlja0J1dHRvbihmcmFtZSwgJyNyZWd1bGFyLWxvZ2luJyk7XG4gICAgZGVidWcoJ3dhaXQgdW50aWwgdGhlIHBhc3N3b3JkIGxvZ2luIHRhYiBpcyBhY3RpdmUnKTtcbiAgICBhd2FpdCB3YWl0VW50aWxFbGVtZW50Rm91bmQoZnJhbWUsICdyZWd1bGFyLWxvZ2luJyk7XG5cbiAgICByZXR1cm4gZnJhbWU7XG4gIH07XG5cbiAgZ2V0TG9naW5PcHRpb25zKGNyZWRlbnRpYWxzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxvZ2luVXJsOiBgJHtMT0dJTl9VUkx9YCxcbiAgICAgIGZpZWxkczogY3JlYXRlTG9naW5GaWVsZHMoY3JlZGVudGlhbHMpLFxuICAgICAgc3VibWl0QnV0dG9uU2VsZWN0b3I6ICdidXR0b25bdHlwZT1cInN1Ym1pdFwiXScsXG4gICAgICBwb3NzaWJsZVJlc3VsdHM6IGdldFBvc3NpYmxlTG9naW5SZXN1bHRzKCksXG4gICAgICBjaGVja1JlYWRpbmVzczogYXN5bmMgKCkgPT4gd2FpdFVudGlsRWxlbWVudEZvdW5kKHRoaXMucGFnZSwgJyNjY0xvZ2luRGVza3RvcEJ0bicpLFxuICAgICAgcHJlQWN0aW9uOiB0aGlzLm9wZW5Mb2dpblBvcHVwLFxuICAgICAgdXNlckFnZW50OiAnTW96aWxsYS81LjAgKFgxMTsgTGludXggeDg2XzY0KSBBcHBsZVdlYktpdC81MzcuMzYgKEtIVE1MLCBsaWtlIEdlY2tvKSBDaHJvbWUvNzguMC4zOTA0LjEwOCBTYWZhcmkvNTM3LjM2JyxcbiAgICB9O1xuICB9XG5cbiAgYXN5bmMgZmV0Y2hEYXRhKCk6IFByb21pc2U8U2NhcGVyU2NyYXBpbmdSZXN1bHQ+IHtcbiAgICBjb25zdCBkZWZhdWx0U3RhcnRNb21lbnQgPSBtb21lbnQoKS5zdWJ0cmFjdCgxLCAneWVhcnMnKS5hZGQoMSwgJ2RheScpO1xuICAgIGNvbnN0IHN0YXJ0RGF0ZSA9IHRoaXMub3B0aW9ucy5zdGFydERhdGUgfHwgZGVmYXVsdFN0YXJ0TW9tZW50LnRvRGF0ZSgpO1xuICAgIGNvbnN0IHN0YXJ0TW9tZW50ID0gbW9tZW50Lm1heChkZWZhdWx0U3RhcnRNb21lbnQsIG1vbWVudChzdGFydERhdGUpKTtcbiAgICBkZWJ1ZyhgZmV0Y2ggdHJhbnNhY3Rpb25zIHN0YXJ0aW5nICR7c3RhcnRNb21lbnQuZm9ybWF0KCl9YCk7XG5cbiAgICBkZWJ1ZygnZmV0Y2ggZnV0dXJlIGRlYml0cycpO1xuICAgIGNvbnN0IGZ1dHVyZURlYml0cyA9IGF3YWl0IGZldGNoRnV0dXJlRGViaXRzKHRoaXMucGFnZSk7XG5cbiAgICBkZWJ1ZygnbmF2aWdhdGUgdG8gdHJhbnNhY3Rpb25zIHBhZ2UnKTtcbiAgICBhd2FpdCB0aGlzLm5hdmlnYXRlVG8oVFJBTlNBQ1RJT05TX1VSTCwgdW5kZWZpbmVkLCA2MDAwMCk7XG5cbiAgICBkZWJ1ZygnZmV0Y2ggYWNjb3VudHMgdHJhbnNhY3Rpb25zJyk7XG4gICAgY29uc3QgYWNjb3VudHMgPSBhd2FpdCBmZXRjaFRyYW5zYWN0aW9ucyh0aGlzLnBhZ2UsIHN0YXJ0TW9tZW50LCB0aGlzLm9wdGlvbnMpO1xuXG4gICAgZGVidWcoJ3JldHVybiB0aGUgc2NyYXBlZCBhY2NvdW50cycpO1xuICAgIHJldHVybiB7XG4gICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgYWNjb3VudHMsXG4gICAgICBmdXR1cmVEZWJpdHMsXG4gICAgfTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBWaXNhQ2FsU2NyYXBlcjtcbiJdfQ==