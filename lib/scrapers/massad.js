"use strict";

require("core-js/modules/es.array.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _baseBeinleumiGroup = _interopRequireDefault(require("./base-beinleumi-group"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class MassadScraper extends _baseBeinleumiGroup.default {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "BASE_URL", 'https://online.bankmassad.co.il');

    _defineProperty(this, "LOGIN_URL", `${this.BASE_URL}/MatafLoginService/MatafLoginServlet?bankId=MASADPRTAL&site=Private&KODSAFA=HE`);

    _defineProperty(this, "TRANSACTIONS_URL", `${this.BASE_URL}/wps/myportal/FibiMenu/Online/OnAccountMngment/OnBalanceTrans/PrivateAccountFlow`);
  }

}

var _default = MassadScraper;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zY3JhcGVycy9tYXNzYWQudHMiXSwibmFtZXMiOlsiTWFzc2FkU2NyYXBlciIsIkJlaW5sZXVtaUdyb3VwQmFzZVNjcmFwZXIiLCJCQVNFX1VSTCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7Ozs7OztBQUdBLE1BQU1BLGFBQU4sU0FBNEJDLDJCQUE1QixDQUFzRDtBQUFBO0FBQUE7O0FBQUEsc0NBQ3pDLGlDQUR5Qzs7QUFBQSx1Q0FHdkMsR0FBRSxLQUFLQyxRQUFTLGdGQUh1Qjs7QUFBQSw4Q0FLaEMsR0FBRSxLQUFLQSxRQUFTLGtGQUxnQjtBQUFBOztBQUFBOztlQVF2Q0YsYSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCZWlubGV1bWlHcm91cEJhc2VTY3JhcGVyIGZyb20gJy4vYmFzZS1iZWlubGV1bWktZ3JvdXAnO1xuXG5cbmNsYXNzIE1hc3NhZFNjcmFwZXIgZXh0ZW5kcyBCZWlubGV1bWlHcm91cEJhc2VTY3JhcGVyIHtcbiAgQkFTRV9VUkwgPSAnaHR0cHM6Ly9vbmxpbmUuYmFua21hc3NhZC5jby5pbCc7XG5cbiAgTE9HSU5fVVJMID0gYCR7dGhpcy5CQVNFX1VSTH0vTWF0YWZMb2dpblNlcnZpY2UvTWF0YWZMb2dpblNlcnZsZXQ/YmFua0lkPU1BU0FEUFJUQUwmc2l0ZT1Qcml2YXRlJktPRFNBRkE9SEVgO1xuXG4gIFRSQU5TQUNUSU9OU19VUkwgPSBgJHt0aGlzLkJBU0VfVVJMfS93cHMvbXlwb3J0YWwvRmliaU1lbnUvT25saW5lL09uQWNjb3VudE1uZ21lbnQvT25CYWxhbmNlVHJhbnMvUHJpdmF0ZUFjY291bnRGbG93YDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgTWFzc2FkU2NyYXBlcjtcbiJdfQ==