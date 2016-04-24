// ==UserScript==
// @name  Ex.ua Remember Button
// @homepageURL https://github.com/quc
// @version  1.0.4
// @date   2015-08-25
// @description  Ex.ua Remember Button
// @author   quc
// @license   GNU GENERAL PUBLIC LICENSE
// @namespace   http://www.ex.ua/
// @include   http://www.ex.ua/*
// @match   http://www.ex.ua/*
// @grant  none
// @run-at   document-start
// ==/UserScript==

function exuarememberbutton(){
  var elements = document.getElementsByTagName('small'),
  pathname = window.location.pathname,
  i = 0,
  div,
  href,
  link,
  topicId;

    // find valid URL
    if (elements.length !== 0 && /\w+/.exec(pathname)[0] !== 'view_comments') {

      // add buttons for each topic
      while(i < elements.length) {
        div = document.createElement('div');
        div.setAttribute('class', 'r_button');
        div.setAttribute('style', 'margin-top:5px;');

        // check for valid URL
        if (/\w+/.exec(pathname)[0] === 'user'){
          href = elements[i].parentNode.childNodes[1].href;
        } else {
          href = elements[i].parentNode.firstChild.href;
        }

        // find ID of topic
        topicId = /\d+/.exec(href);

        if (topicId !== null) {
          link = document.createElement('a');
          link.setAttribute('href', '/add_link/'+ topicId + '?link_id=4');
          link.innerHTML = 'Запомнить';

          div.appendChild(link);

          // add buttons
          elements[i].parentNode.appendChild(div);
        }

        i++;
      }
    } else {
      return;
    }
}

if (location.origin == "http://www.ex.ua")
{
  document.addEventListener("DOMContentLoaded", exuarememberbutton, false);
}
