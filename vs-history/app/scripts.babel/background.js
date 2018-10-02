'use strict';

chrome.runtime.onInstalled.addListener(details => {
  console.log('previousVersion', details.previousVersion);
});

chrome.runtime.onMessage.addListener(
function(request, sender, sendResponse) {
  if (request.command == 'getHistory') {
    if (sender.tab && sender.tab.url) {
        var url = sender.tab.url;
        chrome.history.getVisits({
          url: url
        }, (results) => {
          if (results.length > 1) {
            results.sort(function (a, b) {
              return a.visitTime < b.visitTime ? 1 : -1;
            })
            var current = new Date() - 60 * 1000;

            results = results.filter(function (result) {
              return result.visitTime < current;
            })


            sendResponse({
              lastVisitTime: results[0].visitTime
            });
          } else {
            sendResponse({
              lastVisitTime: null
            });
          }
        })
    }
  }
  return true;
});
