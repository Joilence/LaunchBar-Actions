#!/usr/local/Caskroom/miniconda/base/bin/python
#
# LaunchBar Action Script
#

from AppKit import NSPasteboard, NSStringPboardType
import pyperclip
import os
import requests
import re
from bs4 import BeautifulSoup
from urllib.parse import urlparse

def isPrefixHTTP(url):
    return re.match(re.compile(r'^https?:\/\/', re.IGNORECASE), url) is not None
def isValidURL(url):
    pattern = re.compile(
        r'^(?:http|ftp)s?://' # http:// or https://
        r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+(?:[A-Z]{2,6}\.?|[A-Z0-9-]{2,}\.?)|' #domain...
        r'localhost|' #localhost...
        r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})' # ...or ip
        r'(?::\d+)?' # optional port
        r'(?:/?|[/?]\S+)$', re.IGNORECASE)
    return re.match(pattern, url) is not None
def notify(title, text):
    os.system("""
              osascript -e 'display notification "{}" with title "{}"'
              """.format(text, title))
def ospaste():
    os.system("""
              osascript -e 'tell application "System Events" to keystroke "v" using command down'
              """)

pb = NSPasteboard.generalPasteboard()
url = pb.stringForType_(NSStringPboardType)

notify('LaunchBar: Paste as MD Link', 'Requesting: ' + url)

try:
    if not isPrefixHTTP(url): url = 'https://' + url
    if not isValidURL(url):
        raise Exception(url + ' is not a valid URL.')
    else:
        req = requests.get(url)
        if req.status_code == 200:
            soup = BeautifulSoup(req.text)
            title = soup.head.title.text
            mdlink = '[' + title + '](' + url + ')'
            notify('LaunchBar: Paste as MD Link', 'MDLink: ' + mdlink)
            pyperclip.copy(mdlink)
            ospaste()
        else:
            raise Exception('problem with request: ', req.status_code)
except Exception as e:
    notify('LaunchBar: Paste as MD Link', 'Error:' + e.args[0])