const _0x175387 = _0x9e80;
(function (_0x41ae6f, _0x3e84b4) {
  const _0x12fd8c = _0x9e80,
    _0xd42647 = _0x41ae6f();
  while (!![]) {
    try {
      const _0x1a90f1 =
        -parseInt(_0x12fd8c(0x1df)) / 0x1 +
        (-parseInt(_0x12fd8c(0x1d9)) / 0x2) *
          (parseInt(_0x12fd8c(0x1d3)) / 0x3) +
        (-parseInt(_0x12fd8c(0x1e1)) / 0x4) *
          (parseInt(_0x12fd8c(0x1cb)) / 0x5) +
        parseInt(_0x12fd8c(0x1dc)) / 0x6 +
        parseInt(_0x12fd8c(0x1c9)) / 0x7 +
        (parseInt(_0x12fd8c(0x1d0)) / 0x8) *
          (parseInt(_0x12fd8c(0x1cf)) / 0x9) +
        (parseInt(_0x12fd8c(0x1e0)) / 0xa) * (parseInt(_0x12fd8c(0x1d2)) / 0xb);
      if (_0x1a90f1 === _0x3e84b4) break;
      else _0xd42647["push"](_0xd42647["shift"]());
    } catch (_0x448462) {
      _0xd42647["push"](_0xd42647["shift"]());
    }
  }
})(_0x2081, 0xab514);
const LAMBDA_API_URL = _0x175387(0x1d1),
  SECRET_PASSWORD = _0x175387(0x1cd);
function _0x2081() {
  const _0x90be80 = [
    "2374402RxhdbT",
    "value",
    "❌\x20네트워크\x20오류\x20또는\x20서버\x20오류\x20발생.",
    "3022068fnCMoD",
    "json",
    "stringify",
    "894917WnNfDk",
    "164390dvKzpH",
    "344frBykI",
    "trim",
    "✅\x20성공:\x20",
    "6916742YnlZqw",
    "novelIdInput",
    "75530BSzset",
    "⚠️\x20오류:\x20",
    "myosu_arcalive",
    "error",
    "92187pyNBZv",
    "8aXlTgJ",
    "https://trnhljdlorinqoc3i4ogvndtu40xmfym.lambda-url.ap-northeast-2.on.aws/",
    "1727enblZP",
    "3TlfbOE",
    "getElementById",
    "❗\x20소설\x20ID와\x20비밀번호를\x20모두\x20입력하세요.",
    "❌\x20비밀번호가\x20올바르지\x20않습니다.",
    "요청\x20실패",
    "textContent",
  ];
  _0x2081 = function () {
    return _0x90be80;
  };
  return _0x2081();
}
function _0x9e80(_0x110142, _0x2649c6) {
  const _0x208180 = _0x2081();
  return (
    (_0x9e80 = function (_0x9e8098, _0x3509e7) {
      _0x9e8098 = _0x9e8098 - 0x1c7;
      let _0x4c327d = _0x208180[_0x9e8098];
      return _0x4c327d;
    }),
    _0x9e80(_0x110142, _0x2649c6)
  );
}
async function submitId() {
  const _0x215a22 = _0x175387,
    _0xd02a48 = document[_0x215a22(0x1d4)](_0x215a22(0x1ca))[_0x215a22(0x1da)][
      _0x215a22(0x1c7)
    ](),
    _0x4f168a =
      document[_0x215a22(0x1d4)]("passwordInput")[_0x215a22(0x1da)]["trim"](),
    _0x547464 = document[_0x215a22(0x1d4)]("resultBox");
  if (!_0xd02a48 || !_0x4f168a) {
    _0x547464[_0x215a22(0x1d8)] = _0x215a22(0x1d5);
    return;
  }
  if (_0x4f168a !== SECRET_PASSWORD) {
    _0x547464[_0x215a22(0x1d8)] = _0x215a22(0x1d6);
    return;
  }
  try {
    const _0x48a332 = await fetch(
        LAMBDA_API_URL + "?id=" + encodeURIComponent(_0xd02a48)
      ),
      _0x3c4b39 = await _0x48a332[_0x215a22(0x1dd)]();
    _0x48a332["ok"]
      ? (_0x547464[_0x215a22(0x1d8)] =
          _0x215a22(0x1c8) + JSON[_0x215a22(0x1de)](_0x3c4b39, null, 0x2))
      : (_0x547464[_0x215a22(0x1d8)] =
          _0x215a22(0x1cc) + (_0x3c4b39[_0x215a22(0x1ce)] || _0x215a22(0x1d7)));
  } catch (_0x3887fc) {
    (_0x547464[_0x215a22(0x1d8)] = _0x215a22(0x1db)),
      console["error"](_0x3887fc);
  }
}
