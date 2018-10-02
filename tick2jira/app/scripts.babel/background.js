'use strict';

chrome.runtime.onInstalled.addListener(details => {
  console.log('previousVersion', details.previousVersion);
});

chrome.browserAction.onClicked.addListener(function(tabs) {
  jiraWindow.popOut()
})

var jiraWindow = {
  popOut: function () {
    var id = localStorage.getItem('jira_window_id')
    id ? jiraWindow.update(Number(id)) : jiraWindow.create()
  },
  update: function (id) {
    chrome.windows.update(id, {
      focused: true
    }, function () {
      if(chrome.runtime.lastError) {
        localStorage.setItem('jira_window_id', '')
      }
    })
  },
  create: function () {
    chrome.windows.create({
        url: 'https://p.dida365.com',
        top: 140,
        left: 1000,
        width: 385,
        height: 689,
        focused: true,
        type: "panel"
    }, function(w) {
        localStorage.setItem('jira_window_id', w.id)
    })
  }
}

var jiraMenu = {
  createMenu: () => {
    chrome.contextMenus.create({
      "title": "添加到JIRA",
      "contexts": ["all"],
      "onclick": jiraMenu.clickHandle
    })
  },
  clickHandle: (info, tab) => {
    if (~tab.url.indexOf('help.ticktick.com/forum/topic') || ~tab.url.indexOf('help.dida365.com/forum/topic')) {
      chrome.tabs.sendMessage(tab.id , {'action': 'showFrame'}, function(res){})
    }
  }
}

jiraMenu.createMenu()

