# electron-gauth

Get Google api access token using an electron window
to let the user authorize the app.

## Installation

```bash
npm install --save electron-gauth
```

## Usage

```javascript
  import electronGoogleOauth from 'electron-gauth';

  const browserWindowParams = {
      'use-content-size': true,
      center: true,
      show: false,
      resizable: false,
      'always-on-top': true,
      'standard-window': true,
      'auto-hide-menu-bar': true,
      'node-integration': false
  };

  const googleOauth = electronGoogleOauth(browserWindowParams);

  ( async () => {

    // retrieve  authorization code only
    const authCode = await googleOauth.getAuthorizationCode(
      ['https://www.google.com/m8/feeds'],
      'your-client-id',
      'your-client-secret',
      'your-redirect-uri'
    );
    console.dir(authCode);

    // retrieve access token and refresh token
    const result = await googleOauth.getAccessToken(
      ['https://www.google.com/m8/feeds'],
      'your-client-id',
      'your-client-secret',
      'your-redirect-uri'
    );
    console.dir(result);

  })();

```

## Testing
Build the app, then run it:
```
npm run build && electron dist/bin.js --scopes 'SCOPES' --clientId 'CLIENTID' --clientSecret 'CLIENTSECRET' --redirectUri 'REDIRECTURI'
```

## License
The MIT License (MIT)

Copyright (c) 2015 Andrea Parodi
Copyright (c) 2018 Milo Thompson
