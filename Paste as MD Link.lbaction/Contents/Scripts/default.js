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

        LaunchBar.displayNotification({
            title: "Paste as MD Link",
            string: "Request title from " + url
        });
        LaunchBar.debugLog('Start requesting.');
        var result = HTTP.loadRequest(url, {
            timeout: 8,
            method: 'GET',
            resultType: 'text'
        });
        LaunchBar.debugLog('Finish requesting.');
        LaunchBar.debugLog("Result: ", Object.keys(result));
        if (result.data != undefined) {
            LaunchBar.debugLog(result.data);
            LaunchBar.debugLog("Start matching.");
            const matches = result.data.match(/<head[\s\S]*?>[\s\S]*?<title[\s\S]*?>\s*(.*)\s*<\/title>[\s\S]*?<\/head>/);
            LaunchBar.debugLog("Finish matching.");
            // LaunchBar.log('matches', matches[1]);
            const title = matches[1];
            const mdLink = '[' + title + '](' + url + ')';
            LaunchBar.debugLog('mdLink', mdLink);
            // LaunchBar.displayNotification({
            //     title: "Paste as MD Link",
            //     string: "Success!"
            // });
            LaunchBar.paste(mdLink);
        } else if (result.timedOut) {
            LaunchBar.displayNotification({
                title: "Paste as MD Link",
                string: "Error: " + 'Unable to load the LaunchBar page due to a timeout'
            });
        } else if (result.error != undefined) {
            LaunchBar.displayNotification({
                title: "Paste as MD Link",
                string: "Error: " + 'Unable to load the LaunchBar page:' + result.error
            });
        }
    } catch (e) {
        LaunchBar.displayNotification({
            title: "Paste as MD Link",
            string: "" + e
        });
        LaunchBar.debugLog('' + e);
    }
}