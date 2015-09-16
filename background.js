
// from where to get notifications , can take multiple values
var senderIds = ["860303303146"];

function registerCallback(registrationId) {
    console.log('Registration completed' + registrationId);
    if (chrome.runtime.lastError) {
        // When the registration fails, handle the error and retry the
        // registration later.
        return;
    }
    // Send the registration token application server.
    sendRegistrationId(function (succeed) {
        //send to server successful
        if (succeed)
            chrome.storage.local.set({registered: true});
    });
}

function sendRegistrationId(callback) {
    //todo server side implementation for storing registration tokens of desktop apps
}

function registerForRemoteNotification() {
    chrome.storage.local.get("registered", function (result) {
        // If already registered, bail out.
        if (result["registered"]){
            console.log('already registered');
            return;
        }
        chrome.gcm.register(senderIds, registerCallback);
    });
}

function onLaunch () {
    chrome.app.window.create('index.html', {
        "bounds": {
            "width": 500,
            "height": 650
        }
    });
}

chrome.gcm.onMessage.addListener(function (message) {
    chrome.notifications.create(message.from, {
        title: message.data['gcm.notification.title'],
        message: message.data['gcm.notification.body'],
        type: 'basic',
        iconUrl: 'icon.jpeg'
    })
});

chrome.app.runtime.onLaunched.addListener(onLaunch);
chrome.runtime.onInstalled.addListener(registerForRemoteNotification);
chrome.runtime.onStartup.addListener(registerForRemoteNotification);