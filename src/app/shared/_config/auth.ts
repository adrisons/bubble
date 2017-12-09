
export const facebook_secret = {
    appId: '783972521727543',
    status: false, // the SDK will attempt to get info about the current user immediately after init
    cookie: true, // enable cookies to allow the server to access the session
    xfbml: false, // With xfbml set to true, the SDK will parse your page's DOM to find and
    // initialize any social plugins that have been added using XFBML
    version: 'v2.8' // use graph api version 2.5
};

export const twitter_secret = {
    consumerKey: '7tzkiBa91NLuF481vPWd024e4',
    consumerSecret: 'Upra5sxzePcfVy2gNLNlolxrUM9YHsZdTHON8TLmDY4sZ5K8kx',
    callbackURL: 'http://127.0.0.1:3000/api/social/tw/access-token'
};

export const auth0_secret = {
    clientID: 'MHoFMOs24vBj8T-xbZT5GTGWU_GeRLPS',
    domain: 'pepino.eu.auth0.com',
    responseType: 'token id_token',
    audience: 'https://pepino.eu.auth0.com/userinfo',
    redirectUri: 'http://localhost:4200/user/config',
    scope: 'openid profile'
};
