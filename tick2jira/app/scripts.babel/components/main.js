
$(function () {
  // const popup = new Popup();
  var inFrame = window.self !== window.top;
  if (inFrame) {
    const ancestorOrigin = location.ancestorOrigins[0];
    window.frames.top.postMessage('load completed', ancestorOrigin);
  }

  var $iframe = $('iframe')
  window.addEventListener("message", function (data) {
    if (data.data.status == 'init content') {
      var topic = data.data.topic;
      var url = 'https://p.dida365.com/secure/CreateIssueDetails!init.jspa?' + topic
      $iframe.attr('src', url)
    }
  });

  // $iframe[0].onload = function () {
  //   var cssLink = document.createElement("link");
  //   cssLink.href = "styles/iframe.css"; 
  //   cssLink.rel = "stylesheet"; 
  //   cssLink.type = "text/css"; 
  //   this.contentWindow.document.body.appendChild(cssLink);
  // }
})