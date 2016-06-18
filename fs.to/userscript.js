// ==UserScript==
// @name FS.TO / BRB.TO Page Multiplier
// @description Load more files per page
// @homepageURL https://github.com/quc
// @updateURL https://rawgit.com/quc/userscripts/blob/master/fs.to/userscript.meta.js
// @version 1.0.1
// @author quc
// @date 2016-06-18
// @namespace http://fs.to/
// @include http://brb.to/*
// @include https://brb.to/*
// @include http://fs.to/*
// @include https://fs.to/*
// @license GNU GENERAL PUBLIC LICENSE
// @grant GM_xmlhttpRequest
// @grant GM_getValue
// @grant GM_setValue
// @run-at document-start
// ==/UserScript==

fstomultiplier = function() {
  var list = document.querySelector('.b-section-list');
  var currentPage = document.querySelector('.b-pager .selected').innerHTML - 1;

  var PAGE_TO_LOAD = 10;
  var PAGE_VISIBLE = 5;
  var PAGE_OFFSET = Math.floor(PAGE_VISIBLE / 2);
  var LAZY_LOAD = false;

  var pageLoaded = 0;

  var URLModify = function(options) {
    var href = location.href,
        page = options.page || 0;

    page += currentPage;
    if (/page=/.test(href)){
      href = href.replace(/page=\d+/, 'page=' + page);
    } else {
      href += '?page=' + page;
    }

    return href;
  };

  var pageModify = function() {
    var pages = document.querySelector('.b-pager'),
        links = '',
        firstPage = '<li><a href="'+location.origin + location.pathname+'">1</a></li>',
        dots = '<li><a>...</a></li>',
        pageOffset;

    links = firstPage + dots;

    if (currentPage / PAGE_TO_LOAD < 3) {
      pageOffset = 0;
    } else {
      pageOffset = PAGE_OFFSET;
    }

      for (var i = 0; i < PAGE_VISIBLE; i++) {
        links += '<li><a href="' +
            location.origin + location.pathname + '?page=' +
            ((currentPage / PAGE_TO_LOAD + i - pageOffset) * PAGE_TO_LOAD)+'">'+
            (i - pageOffset + (currentPage / PAGE_TO_LOAD)) +
            '</a></li>';
      }

    pages.innerHTML = '<ul>'+links+'</ul>';
    document.querySelector('.b-pager a[href="'+location.href+'"]').className = 'selected';
  };

  var ajax = function(options){
    var xhr = new XMLHttpRequest();
    var url = URLModify({
      page : ++pageLoaded
    });

    xhr.onreadystatechange = function(){
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          var newList, tables, p;
          p = document.createElement('p');

          p.innerHTML = xhr.response;
          newList = p.querySelectorAll('.b-section-list table');

          for (var i = 0; i < newList.length; i++) {
            tables = list.querySelectorAll('table');
            list.insertBefore(newList[i], list.children[tables.length]);
          }
          if (pageLoaded < PAGE_TO_LOAD && !LAZY_LOAD) ajax();
        } else {
          console.error('BAD AJAX REQUEST', xhr.status, url);
        }
      }
    };

  xhr.open('GET', url, true);
  xhr.send(null);
 };
/*
   var settings = {
     quantity : 10,
     lazyLoad : false,
     prefix : 'fsto_userscript_',
     save: function () {
       localStorage.setItem(this.prefix + 'quantity', this.quantity);
       localStorage.setItem(this.prefix + 'lazyLoad', this.lazyLoad);
     },
     restore: function () {
       this.quantity = localStorage.getItem(this.prefix + 'quantity');
       this.lazyLoad = localStorage.getItem(this.prefix + 'lazyLoad');

       if (this.quantity === null || this.quantity === '') { this.quantity = 10;}
       else {this.quantity = JSON.parse(this.quantity);}
       if (this.lazyLoad === null) { this.lazyLoad = false;}
       else {this.lazyLoad = JSON.parse(this.lazyLoad);}
     },
     reset : function () {
       this.quantity = 10;
       this.lazyLoad = false;
     },
     update: function (el) {
       this[el.name] = el.value;
       this.save();
     }
   };

   var controlls = function() {
     var select = document.querySelector('.b-section-controls');
     var el = document.createElement('div');
     var optionsTepmlate = '';
     var selectedOptionsTepmlate = '';
     var variations = 5;

     for (var i = 1; i < variations; i++) {
       selectedOptionsTepmlate += '<span class="b-section-controls__sort-selected-item "' +
       'name="sq'+ (i * variations) +'">x'+ (i * variations) +'</span>';
       optionsTepmlate += '<a name="sq'+ (i * variations) +'" class="b-section-controls__sort-popup-item "><span class="b-section-controls__sort-popup-item-text">x'+ (i * variations) +'</span></a>';
     }

     var template = '<div class="b-section-controls__sort">' +
        '<div class="b-section-controls__sort-selected">' + selectedOptionsTepmlate +
        '</div>' +
        '<div class="b-section-controls__sort-popup" style="display: none;">' +
        optionsTepmlate +'</div></div>';

    el.innerHTML = template;
    el.querySelector('span[name="sq'+ 10 +'"]').classList.add('selected');
    el.addEventListener('click', function(e) {
      var popup = this.querySelector('.b-section-controls__sort-popup');
      var select = this.querySelector('.b-section-controls__sort');

      select.classList.toggle('m-section-controls__sort_state_open');
      popup.style.display = popup.style.display === 'block' ? 'none' : 'block';
    });
    el.querySelector('.b-section-controls__sort-popup').addEventListener('click', function(e) {
      var value = /\d+/.exec(e.target.innerText);
      el.querySelector('span.selected').classList.remove('selected');
      el.querySelector('span[name="sq'+ value +'"]').classList.add('selected');
      settings.update({
        name : 'quantity',
        value : value
      });
    });

    select.appendChild(el);
   };
*/
   if (LAZY_LOAD) {
     window.onscroll = function(e){
       var tables = list.querySelectorAll('table');
       if (document.body.scrollTop > tables[tables.length-2].offsetTop) {
         ajax();
       }
     };

     document.querySelector('.b-pager').hidden = true;
   } else {
     pageModify();
     ajax();
   }
};

document.addEventListener("DOMContentLoaded", fstomultiplier, false);
