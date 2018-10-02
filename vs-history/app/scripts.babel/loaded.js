'use strict';

var vsNode = document.createElement('div');
var visitedText = '你在<br>%s<br>访问过当前页面';
var unvisiedText = '你未访问过当前页面';

var formatDigit = function (number) {
	return number < 10 ? '0' + number : number;
}

var formatTime = function (ms) {
	var date = new Date(ms);
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = formatDigit(date.getDate());
	var hour = formatDigit(date.getHours());
	var mins = formatDigit(date.getMinutes());
	var seconds = formatDigit(date.getSeconds());


	return [year, month, day].join('-') + ' ' + [hour, mins, seconds].join(':')
}

vsNode.className = 'vs-history-show-text';

document.body.appendChild(vsNode);


chrome.runtime.sendMessage({command: 'getHistory'}, function(response) {
  if (response) {
  	var lastVisitTime = response.lastVisitTime;
  	if (lastVisitTime) {
  		vsNode.innerHTML = visitedText.replace('%s', formatTime(lastVisitTime));
  	} else {
  		vsNode.innerHTML = unvisiedText;
  	}
  }
});