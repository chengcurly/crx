if (location.href.indexOf('mail.google') !== -1) {

window.addEventListener ("load", function () {

    var TT = {};

    // var protocol = "https://";
    // var domain = res.domain;
    // var isCnSites = !!domain.match(/ticktick/) ? false : true;
    var language = navigator.language.replace('_', '-').toLowerCase();
    var iscnlang = /zh\Scn/i.test(language);

    var user = document.querySelector("title").innerText.match(/\-\s(\w+@\w+\.\w+)\s\-/)[1]
    var isValid = ~['support@gtasks.me', 'support@dida365.com'].indexOf(user);

    if (!isValid) {
      return;
    }

    var isTick = (user == 'support@gtasks.me')

    var category2Component = {
      'Web': 10006,
      'Android': 10004,
      'iOS': 10005,
      'Windows': 10100,
      'Server': 10201,
      'Other': 10016
    }


    // var productName = isCnSites ? '滴答清单' : 'TickTick';
    // var site_domain = protocol + domain;


    if (!iscnlang) {
      var add_to_jira = "Add To JIRA",
          issue_has_been_saved = "Task has been saved in ",
          check_here = "check here"
    } else {
      var add_to_jira = "添加至JIRA",
          issue_has_been_saved = "任务已经被添加到",
          check_here = "点击查看"
    }

    // add button 
    checkGmailHolder();
    
    if ('onhashchange' in window) {
      $(window).on('hashchange', function() {
        // check when url change
        checkGmailHolder();
        // 
        hideIframe();
      })
    }


    function createGmailButton () {
      var $button = $("<div id='gmail-extension' class='G-Ni J-J5-Ji'>"
               + "<div id='tick2jira-button' class='T-I J-J5-Ji ar7 nf T-I-ax7 L3' data-tooltip='Add this thread' role='button'>"
               + "<div class='inner'><span class='Ykrj7b'>"
               + add_to_jira + "</span>"
               + "<div class='G-asx T-I-J3 J-J5-Ji'>&nbsp;</div></div></div></div>");
      return $button;
    }

    function createStatus () {
      var $statusbar = $('.nH > .UC');
      TT.$status = $('<div id="tick2jira-status"><div class="status"></div></div>');
      $statusbar.after(TT.$status);
      TT.$status.css({
        'visibility': 'hidden',
        'position': 'absolute',
        'width': '100%',
        'text-align': 'center',
        'margin-top': '-20px',
        'z-index': 999999
      }).find('.status').css({
        'display': 'inline-block',
        'font-size': '14px',
        'font-weight': 'bold',
        'border': '1px solid #f0c36d',
        'background-color': '#f9edbe',
        'padding': '0 10px',
        'border-radius': '2px',
        'box-shadow': '0 2px 4px rgba(0,0,0,0.2)'
      })
    }

    function checkGmailHolder () {
      // why "run_at": "document_end" and 'load' event don't work
      var timer = setTimeout(function () {
        checkGmailHolder();
      }, 500);

      var $target = $('.iH > div');

      // check if we should add a button
      if ($target.length && $('#tick2jira-button').length == 0) {
        clearTimeout(timer);
        var $newButton = createGmailButton();
        $target.append($newButton);

        // bind event
        $('#tick2jira-button').click(function (event) {
          toggleMenu();
          event.stopPropagation();
        });

        $('body').click(function () {
          hideIframe();
        });

      }
    }

    // toggle 
    function toggleMenu () {
      // check if logined
      if ($('#tick2jira-gmail-iframe').length) {
        hideIframe();
      } else {
        createIframe();
      }
    }

    function serialize (obj) {
      var arr = []
      for (const key in obj) {
        arr.push(key + '=' + obj[key])
      }
      return arr.join('&')
    }

    function buildComponents () {
      var list = []
      $('.J-J5-Ji table .hN').each(function (index, el) {
        var text = el.innerText
        if (category2Component[text]) {
          list.push('components=' + category2Component[text])
        }
      })
      return '&' + (list.join('&') || 'components=' + category2Component['Other'])
    }

    function preloadData () {
      var data = {
        pid: 10005,
        issuetype: 10105,
        summary: encodeURIComponent($('.hP').text().trim()),
        // components: category2Component[$('div.zw > div > div.aim.ain').text().match(/(\w+)/)[1]] || category2Component['Other'],
        customfield_10205: isTick ? 10224 : 10223,
        priority: 10000,
        description: encodeURIComponent($('blockquote').last().text().split('---------')[0].trim()),
        customfield_10103: encodeURIComponent(window.location.href)
      }

      var dateString = serialize(data)
      dateString = dateString.concat(buildComponents())
      return dateString;
    }

    // Crate the iframe
    function createIframe () {
      var topic = preloadData();
      var html = 'https://p.dida365.com/secure/CreateIssueDetails!init.jspa?' + topic

      TT.iframe = document.createElement("iframe");
      TT.iframe.src = html;
      TT.iframe.id = "tick2jira-gmail-iframe";
      document.body.appendChild(TT.iframe);

      createCloseBtn();

      setIframePosition();

      listenMessage();
    }

    // listen message
    function listenMessage () {
      window.addEventListener("message", function(data) {
        if (data.data == 'load completed') {
          postMessageToIframe();
        } else if (data.data.status == 'add sucess') {
          // addSuccess(data.data);
          hideIframe();
        } else if (data.data == 'add failed') {
          showLoginFirst();
        }
      });

      $('#tick2jira-close-btn').on('click', function () {
        hideIframe()
      })
    }

    // show add task sucess
    // function addSuccess (res) {
    //   TT.$status.css('visibility', 'visible').find('.status').html("" + issue_has_been_saved + productName + ", <a href='"
    //     + protocol + domain + "/#p/" + res.projectId + "/tasks/" + res.taskId
    //     + "' target='_blank'  style='color: #222; text-decoration: underline;'>"+ check_here +"</a>");
    //   setTimeout(function() {
    //     TT.$status.css('visibility', 'hidden');
    //   }, 3000);

    // }
    function createCloseBtn () {
      TT.closeBtn = document.createElement('div')
      TT.closeBtn.innerText = 'x'
      TT.closeBtn.id = 'tick2jira-close-btn'
      document.body.appendChild(TT.closeBtn)
    }

    function setIframePosition () {
      var top = $('#gmail-extension').offset().top + $('#gmail-extension').height();
      var left = $('#gmail-extension').offset().left;

      $('#tick2jira-gmail-iframe').css({
        'position': 'fixed',
        'z-index': 11111111111111111,
        'height': '400px',
        'width': '315px',
        'border': 0,
        'top': top,
        'left': left,
        'border': '1px solid #ececec',
        'box-shadow': '0 0 10px rgba(0,0,0,.15)'
      });


      $('#tick2jira-close-btn').css({
        'position': 'fixed',
        'z-index': 11111111111111112,
        'width': '30px',
        'height': '30px',
        'background': '#fff',
        'color': '#333',
        'line-height': '30px',
        'text-align': 'center',
        'top': top + 10,
        'left': left + 280,
        'cursor': 'pointer',
        'box-shadow': '1px 1px 1px #eee',
        'border-radius': '50%'
      });

    }

    function hideIframe () {
      $('#tick2jira-gmail-iframe').remove();
      $('#tick2jira-close-btn').remove()
    }
  }, false);
}