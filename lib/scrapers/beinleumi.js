"use strict";

require("core-js/modules/es.array.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _baseBeinleumiGroup = _interopRequireDefault(require("./base-beinleumi-group"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class BeinleumiScraper extends _baseBeinleumiGroup.default {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "BASE_URL", 'https://online.fibi.co.il');

    _defineProperty(this, "LOGIN_URL", `${this.BASE_URL}/MatafLoginService/MatafLoginServlet?bankId=FIBIPORTAL&site=Private&KODSAFA=HE`);

    _defineProperty(this, "TRANSACTIONS_URL", `${this.BASE_URL}/wps/myportal/FibiMenu/Online/OnAccountMngment/OnBalanceTrans/PrivateAccountFlow`);
  }

}

var _default = BeinleumiScraper;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zY3JhcGVycy9iZWlubGV1bWkudHMiXSwibmFtZXMiOlsiQmVpbmxldW1pU2NyYXBlciIsIkJlaW5sZXVtaUdyb3VwQmFzZVNjcmFwZXIiLCJCQVNFX1VSTCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7Ozs7OztBQUdBLE1BQU1BLGdCQUFOLFNBQStCQywyQkFBL0IsQ0FBeUQ7QUFBQTtBQUFBOztBQUFBLHNDQUM1QywyQkFENEM7O0FBQUEsdUNBRzFDLEdBQUUsS0FBS0MsUUFBUyxnRkFIMEI7O0FBQUEsOENBS25DLEdBQUUsS0FBS0EsUUFBUyxrRkFMbUI7QUFBQTs7QUFBQTs7ZUFRMUNGLGdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJlaW5sZXVtaUdyb3VwQmFzZVNjcmFwZXIgZnJvbSAnLi9iYXNlLWJlaW5sZXVtaS1ncm91cCc7XG5cblxuY2xhc3MgQmVpbmxldW1pU2NyYXBlciBleHRlbmRzIEJlaW5sZXVtaUdyb3VwQmFzZVNjcmFwZXIge1xuICBCQVNFX1VSTCA9ICdodHRwczovL29ubGluZS5maWJpLmNvLmlsJztcblxuICBMT0dJTl9VUkwgPSBgJHt0aGlzLkJBU0VfVVJMfS9NYXRhZkxvZ2luU2VydmljZS9NYXRhZkxvZ2luU2VydmxldD9iYW5rSWQ9RklCSVBPUlRBTCZzaXRlPVByaXZhdGUmS09EU0FGQT1IRWA7XG5cbiAgVFJBTlNBQ1RJT05TX1VSTCA9IGAke3RoaXMuQkFTRV9VUkx9L3dwcy9teXBvcnRhbC9GaWJpTWVudS9PbmxpbmUvT25BY2NvdW50TW5nbWVudC9PbkJhbGFuY2VUcmFucy9Qcml2YXRlQWNjb3VudEZsb3dgO1xufVxuXG5leHBvcnQgZGVmYXVsdCBCZWlubGV1bWlTY3JhcGVyO1xuIl19