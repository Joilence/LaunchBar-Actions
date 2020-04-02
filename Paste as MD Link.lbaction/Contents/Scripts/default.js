// LaunchBar Action Script
function run(argument) {
    // Get URL from the clipboard
    url = LaunchBar.getClipboardString()
    // Check if it's valid URL
    function isValidUrl(url) {
        var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
        return !!pattern.test(url);
    }
    // Get title from the URL
    try {
        if (!isValidUrl(url)) throw new Error(url + ' is not a URL.');
        
        if (!/^https?:\/\//i.test(url)) url = 'http://' + url;
        
        const result = HTTP.get(url);
        LaunchBar.debugLog("Result: ", Object.keys(result));
        if (result.data != undefined) {
            const matches = result.data.match(/<head>[\s\S]*<title>\s*(.*)\s*<\/title>[\s\S]*<\/head>/);
            LaunchBar.debugLog('matches', matches[1]);
            const title = matches[1];
            const mdLink = '[' + title + '](' + url + ')';
            LaunchBar.paste(mdLink);
        } else if (result.timedOut) {
            return ['Unable to load the LaunchBar page due to a timeout']
        } else if (result.error != undefined) {
            return ['Unable to load the LaunchBar page:' + result.error]
        }
    } catch (e) {
        LaunchBar.log('ERROR: ' + e);
        LaunchBar.alert('ERROR: ' + e);
    }
}