'use strict';

(function () {

	var isTick = ~window.location.hostname.indexOf('help.ticktick.com')

	const jiraMenu = {
		topic: {}
	}

	const category2Component = {
		'Web': 10006,
		'Android': 10004,
		'iOS': 10005,
		'Chrome extension': 10006,
		'Other': 10016,
		'iPhone/iPad': 10005,
		'Web/网页插件': 10006
	}

	jiraMenu.initEvent = () => {
		$(document).on('contextmenu', function (e) {
			if (isTick) {
				var $comment = $(e.target).closest('.comment')
				jiraMenu.topic = {
					pid: 10005,
					issuetype: 10105,
					summary: encodeURIComponent($('.subtab.detail').text().trim()),
					components: category2Component[$('.category.active .title').text()] || category2Component['Other'],
					customfield_10205: 10224,
					priority: 10000
				}

				if ($comment.length) {
					var $message = $comment.find('.message')
					jiraMenu.topic.customfield_10103 = encodeURIComponent('https://help.ticktick.com/forum/topic/' + $message[0].id.replace('msg_', ''))
					jiraMenu.topic.description = encodeURIComponent($message.text().trim())
				} else {
					var topicId = window.location.pathname.match(/topic\/(\d+)/)[1]
					var $message = $('#msg_' + topicId)
					jiraMenu.topic.customfield_10103 = encodeURIComponent(window.location.href)
					jiraMenu.topic.description = encodeURIComponent($message.text().trim())
				}	
			} else {
				var $post = $(e.target).closest('[component="post"]').eq(0)

				if (!$post.length) {
					$post = $('[component="post"]').eq(0)
				}

				jiraMenu.topic = {
					pid: 10005,
					issuetype: 10105,
					summary: encodeURIComponent($('.topic-title').text().trim()),
					components: category2Component[$('.breadcrumb [itemprop="title"]').eq(1).text().trim()] || category2Component['Other'],
					customfield_10205: 10223,
					customfield_10103: encodeURIComponent('https://help.dida365.com/forum/post/' + $post.data('pid')),
					description: encodeURIComponent($post.find('.content p').text().trim()),
					priority: 10000
				}
			}
		})
	}

	jiraMenu.initEvent()
	
	chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {

		const serialize = (obj) => {
			var arr = []
			for (const key in obj) {
				arr.push(key + '=' + obj[key])
			}
			return arr.join('&')
		}


		jiraMenu.createIframe = () => {
			var url = 'https://p.dida365.com/secure/CreateIssueDetails!init.jspa?' + serialize(jiraMenu.topic);

			jiraMenu.iframeDiv = document.createElement("div");
			jiraMenu.iframeDiv.id = "tick2jira-iframe-div"

		  jiraMenu.iframe = document.createElement("iframe");
		  jiraMenu.iframe.src = url;

		  // jiraMenu.initResizeable();

		  // jiraMenu.iframe.src = 'chrome-extension://' + chrome.runtime.id + '/popup.html';
		  jiraMenu.iframe.id = "tick2jira-iframe";

			jiraMenu.iframeDiv.appendChild(jiraMenu.iframe)

		  document.body.appendChild(jiraMenu.iframeDiv);

		  jiraMenu.createCloseBtn();

		  jiraMenu.setIframePosition();
		  jiraMenu.listenMessage();
		}

		jiraMenu.initResizeable = () => {
			var resizeX = $('<div id="" style="position: absolute;left: 0;top: 50%;font-size: 14px;color: rgba(0,0,0,0.554);cursor: ew-resize;width: 10px;text-align: center;">||</div>')[0]
			// var resizeY = $('<div id="tick2jira-iframe-resize-y" style="position: absolute;left: 50%;bottom: 0;font-size: 14px;color: rgba(0,0,0,0.554);cursor: ns-resize;height: 10px;line-height: 10px">=</div>')[0]

			jiraMenu.iframeDiv.appendChild(resizeX)
			// jiraMenu.iframeDiv.appendChild(resizeY)

			resizeX.addEventListener('mousedown', initResize, false);

			//Window funtion mousemove & mouseup
			function initResize(e) {
				window.addEventListener('mousemove', Resize, false);
				window.addEventListener('mouseup', stopResize, false);
			}
			//resize the element
			function Resize(e) {
				jiraMenu.iframeDiv.style.width = (jiraMenu.iframeDiv.offsetLeft + jiraMenu.iframeDiv.clientWidth - e.clientX) + 'px';
				// jiraMenu.iframeDiv.style.height = (e.clientY - jiraMenu.iframeDiv.offsetTop) + 'px';
			}
			//on mouseup remove windows functions mousemove & mouseup
			function stopResize(e) {
		    window.removeEventListener('mousemove', Resize, false);
		    window.removeEventListener('mouseup', stopResize, false);
			}
		}

    jiraMenu.createCloseBtn = () => {
      jiraMenu.closeBtn = document.createElement('div')
      jiraMenu.closeBtn.innerText = 'x'
      jiraMenu.closeBtn.id = 'tick2jira-close-btn'
      document.body.appendChild(jiraMenu.closeBtn)
    }

		jiraMenu.setIframePosition = () => {
		  var top = document.body.clientTop + 20,
		      right = 60;
		  $('#' + jiraMenu.iframeDiv.id).css({
		    'position': 'fixed',
		    'padding': '10px',
		    'background': '#fff',
		    'z-index': 11111111111111111,
		    'height': '520px',
		    'width': '345px',
		    'border': 0,
		    'top': top + 'px',
		    'right': right + 'px',
		    'border': '1px solid #ececec',
		    'box-shadow': '0 0 10px rgba(0,0,0,.15)',
		    'resize': 'horizontal',
		    'overflow-x': 'auto',
    		'overflow-y': 'hidden'
		  });

		  $('#' + jiraMenu.closeBtn.id).css({
		    'position': 'fixed',
		    'z-index': 11111111111111112,
		    'width': '30px',
		    'height': '30px',
		    'background': '#fff',
		    'color': '#333',
		    'line-height': '30px',
		    'text-align': 'center',
		    'top': top + 10 + 'px',
		    'right': right + 20 + 'px',
		    'cursor': 'pointer',
		    'box-shadow': '1px 1px 1px 1px #eee',
		    'border-radius': '50%'
		  });

		  $('#' + jiraMenu.iframe.id).css({
		  	'width': '100%',
		  	'height': '100%',
		  	'border': 'none'
		  })
		}

		jiraMenu.listenMessage = () => {
		  window.addEventListener("message", (data) => {
		    if (data.data == 'load completed') {
		      jiraMenu.postMessageToIframe();
		    } else if (data.data.status == 'add success') {
		      // addTaskSuccess(data.data);
		      // data.data.from == 'frame' && removeIframe();
		    } else if (data.data.status == 'add failed') {
		      // addTaskFail()
		      // data.data.from == 'frame' && removeIframe();
		    } else if (data.data == 'close iframe') {
		      // removeIframe();
		    } else if (data.data.status == 'not_sign_on') {
		      // needLogin(data.data)
		      // removeIframe();
		    }
		  });

      $('#' + jiraMenu.closeBtn.id).on('click', function () {
        jiraMenu.removeIframe()
      })
		}

		jiraMenu.removeIframe = () => {
			if (jiraMenu.iframeDiv) {
				$('#' + jiraMenu.iframeDiv.id).remove()
      	$('#' + jiraMenu.closeBtn.id).remove()
			}
		}

		jiraMenu.postMessageToIframe = () => {
		  const sendIframe = jiraMenu.iframe.contentWindow;
		  request.status = 'init content';
		  request.topic = serialize(jiraMenu.topic)
		  sendIframe && sendIframe.postMessage(request, 'chrome-extension://' + chrome.runtime.id + '/popup.html');
		}

	  if (request.action === "showFrame") {
	  	jiraMenu.removeIframe()
			jiraMenu.createIframe()
	  }
	})	
})()

