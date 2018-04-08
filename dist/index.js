'use strict';

var _Promise = require('babel-runtime/core-js/promise')['default'];

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = electronGoogleOauth;

var _googleapis = require('googleapis');

var _googleapis2 = _interopRequireDefault(_googleapis);

var _querystring = require('querystring');

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

const electron = require('electron')

const BrowserWindow = electron.BrowserWindow;

var _browserWindow =  BrowserWindow;

var _browserWindow2 = _interopRequireDefault(_browserWindow);

var OAuth2 = _googleapis2['default'].auth.OAuth2;

function getAuthenticationUrl(scopes, clientId, clientSecret) {
  var redirectUri = arguments.length <= 3 || arguments[3] === undefined ? 'urn:ietf:wg:oauth:2.0:oob' : arguments[3];

  var oauth2Client = new OAuth2(clientId, clientSecret, redirectUri);
  var url = oauth2Client.generateAuthUrl({
    access_type: 'offline', // 'online' (default) or 'offline' (gets refresh_token)
    scope: scopes // If you only need one scope you can pass it as string
  });
  return url;
}

function authorizeApp(url, __unused_BrowserWindow, browserWindowParams) {

  return new _Promise(function (resolve, reject) {

    var win = new _browserWindow2['default'](browserWindowParams || { 'use-content-size': true });

    win.loadURL(url);

    win.on('closed', function () {
      reject(new Error('User closed  the window'));
    });

    win.on('page-title-updated', function () {
      setImmediate(function () {
        var title = win.getTitle();
        if (title.startsWith('Denied')) {
          reject(new Error(title.split(/[ =]/)[2]));
          win.removeAllListeners('closed');
          win.close();
        } else if (title.startsWith('Success')) {
          resolve(title.split(/[ =]/)[2]);
          win.removeAllListeners('closed');
          win.close();
        }
      });
    });
  });
}

function electronGoogleOauth(__unused_BrowserWindow, browserWindowParams, httpAgent) {
  // to keep compatibility, if browserwindow arg is supplied
  // we ignore it
  if (__unused_BrowserWindow && browserWindowParams) {
    browserWindowParams = __unused_BrowserWindow;
  }

  var exports = {
    getAuthorizationCode: function getAuthorizationCode(scopes, clientId, clientSecret) {
      var redirectUri = arguments.length <= 3 || arguments[3] === undefined ? 'urn:ietf:wg:oauth:2.0:oob' : arguments[3];

      var url = getAuthenticationUrl(scopes, clientId, clientSecret, redirectUri);
      return authorizeApp(url, _browserWindow2['default'], browserWindowParams);
    },

    getAccessToken: function getAccessToken(scopes, clientId, clientSecret) {
      var redirectUri = arguments.length <= 3 || arguments[3] === undefined ? 'urn:ietf:wg:oauth:2.0:oob' : arguments[3];
      var authorizationCode, data, res;
      return _regeneratorRuntime.async(function getAccessToken$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            context$2$0.next = 2;
            return _regeneratorRuntime.awrap(exports.getAuthorizationCode(scopes, clientId, clientSecret, redirectUri));

          case 2:
            authorizationCode = context$2$0.sent;
            data = (0, _querystring.stringify)({
              code: authorizationCode,
              client_id: clientId,
              client_secret: clientSecret,
              grant_type: 'authorization_code',
              redirect_uri: redirectUri
            });
            context$2$0.next = 6;
            return _regeneratorRuntime.awrap((0, _nodeFetch2['default'])('https://accounts.google.com/o/oauth2/token', {
              method: 'post',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              body: data,
              agent: httpAgent
            }));

          case 6:
            res = context$2$0.sent;
            context$2$0.next = 9;
            return _regeneratorRuntime.awrap(res.json());

          case 9:
            return context$2$0.abrupt('return', context$2$0.sent);

          case 10:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }

  };

  return exports;
}

module.exports = exports['default'];