// ==UserScript==
// @name FS.TO / BRB.TO Page Multiplier
// @description Load more files per page
// @homepageURL https://github.com/quc
// @updateURL https://raw.githubusercontent.com/quc/userscripts/master/fs.to/userscript.meta.js
// @downloadURL https://raw.githubusercontent.com/quc/userscripts/master/fs.to/userscript.js
// @version 1.1.0
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

var fstomultiplier = function() {

  'use strict';

  var list = document.querySelector('.b-section-list');

  if (list === null) return;

  var currentPage = document.querySelector('.b-pager .selected').innerHTML - 1;
  var PAGE_TO_LOAD = 10;
  var PAGE_VISIBLE = 5;
  var PAGE_OFFSET = Math.floor(PAGE_VISIBLE / 2);
  var LAZY_LOAD = false;
  var pageLoaded = 0;
  var isStyleSet = false;
  var nextRequest = true;

  var URLModify = function(options) {
    var href = location.href,
      page = options.page || 0;

    page += currentPage;
    if (/page=/.test(href)) {
      href = href.replace(/page=\d+/, 'page=' + page);
    } else {
      href += /\?/.test(href) ? '&page=' + page : '?page=' + page;
    }

    return href;
  };

  var pageModify = function() {
    var pages = document.querySelector('.b-pager'),
      links = '',
      firstPage = '<li><a href="' + location.origin + location.pathname + '">1</a></li>',
      dots = '<li><a>...</a></li>',
      pageOffset,
      page;

    links = firstPage + dots;

    if (currentPage / PAGE_TO_LOAD < 3) {
      pageOffset = 0;
    } else {
      pageOffset = PAGE_OFFSET;
    }

    for (var i = 0; i < PAGE_VISIBLE; i++) {
      links += '<li><a href="' +
        location.origin + location.pathname + '?page=' +
        ((currentPage / PAGE_TO_LOAD + i - pageOffset) * PAGE_TO_LOAD) + '">' +
        (i - pageOffset + (Math.ceil(currentPage / PAGE_TO_LOAD))) +
        '</a></li>';
    }

    pages.innerHTML = '<ul>' + links + '</ul>';

    page = (/page=(\d+)/.exec(location.href) || [null, '/'])[1];
    document.querySelector('.b-pager a[href$="' + page + '"]').className = 'selected';
  };

  var ajax = function(options) {
    var xhr = new XMLHttpRequest();
    var url = URLModify({
      page: ++pageLoaded
    });
    if (!nextRequest) return;
    nextRequest = false;
    xhr.onreadystatechange = function() {
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
          nextRequest = true;
          if (pageLoaded < PAGE_TO_LOAD && !LAZY_LOAD) ajax();
        } else {
          console.error('BAD AJAX REQUEST', xhr.status, url);
        }
      }
    };

    xhr.open('GET', url, true);
    xhr.send(null);
  };

  var settings = {
    prefix: 'fsto_userscript_',
    master: {
      multiply: 10,
      lazyLoad: false,
      position: 0,
      href: ''
    },
    settings: {

    },

    save: function() {
      localStorage.setItem(this.prefix + 'settings', JSON.stringify(this.settings));
    },
    restore: function() {
      this.settings = JSON.parse(localStorage.getItem(this.prefix + 'settings') || '{}');

      if (Object.keys(this.settings).length === 0) this.reset();

      this.setSettings();
    },
    reset: function() {
      this.settings = this.master;
    },
    update: function(el) {
      if (this.settings[el.name] === el.value) return;

      this.settings[el.name] = el.value;
      this.save();
      this.setSettings();
      if (el.name !== 'position' || el.name !== 'href') location.reload();
    },
    setSettings: function() {
      PAGE_TO_LOAD = this.settings.multiply;
      LAZY_LOAD = this.settings.lazyLoad;
      if (this.settings.href === location.href && this.settings.position > 0) {
        window.scrollTo(0, this.settings.position);
      }
    }
  };

  var setButtons = function() {

    if (isStyleSet) return;
    isStyleSet = true;

    var select = document.querySelector('.b-section-controls__sort');
    var values = [5, 10, 15, 20];
    var html = '';

    var mainWrapperTemplate = function(inner) {
      return '<div class="fsto_multiplier_menu">' +
        '<input id="fsto_multiplier_menu_selected" type="checkbox" ' +
        'class="fsto_multiplier_menu_input">' +
        '<label for="fsto_multiplier_menu_selected"></label>' +
        '<ul class="fsto_multiplier_options">' +
        inner +
        '</ul></div>';
    };
    var listTemplate = function(n) {
      return '<li class="fsto_multiplier_options_select">' +
        '<input id="fsto_multiplier_menu_x' + n + '" type="radio" value="' + n + '" ' +
        'name="multiply" class="fsto_multiplier_menu_input">' +
        '<label for="fsto_multiplier_menu_x' + n + '">X' + n + '</label>' +
        '</li>';
    };
    var lazyLoadTemplate = function() {
      return '<li class="fsto_multiplier_lazyload">' +
        '<input id="fsto_multiplier_lazyload" type="checkbox" ' +
        'name="lazyLoad" class="fsto_multiplier_menu_input">' +
        '<label for="fsto_multiplier_lazyload">Lazy load</label>' +
        '</li>';
    };

    for (var i = 0; i < values.length; i++) {
      html += listTemplate(values[i]);
    }

    html += lazyLoadTemplate();
    html = mainWrapperTemplate(html);
    var el = document.createElement('div');
    el.innerHTML = html;
    select.appendChild(el);

    document.head.innerHTML += '<link id="_fsto_custom_style_" rel="stylesheet" type="text/css" ' +
      'href="https://cdn.rawgit.com/quc/userscripts/master/fs.to/userscript.css">';

    var linkStyle = document.head.querySelector('#_fsto_custom_style_');

    var menu = select.querySelector('.fsto_multiplier_menu');
    var inputs = select.querySelectorAll('.fsto_multiplier_menu input');
    var selected = select.querySelector('#fsto_multiplier_menu_selected');
    var selectedLabel = selected.nextSibling;
    var lazyLoad = select.querySelector('#fsto_multiplier_lazyload');

    selectedLabel.innerText = LAZY_LOAD ? 'Lazy load' : 'x' + PAGE_TO_LOAD;

    linkStyle.onload = function() {
      menu.hidden = false;
    };

    menu.hidden = true;

    if (LAZY_LOAD) lazyLoad.checked = true;
    for (i = 0; i < inputs.length; i++) {
      if (PAGE_TO_LOAD == inputs[i].value && !LAZY_LOAD) inputs[i].checked = true;
      inputs[i].addEventListener('change', function(e) {
        if (e.target.name === 'multiply') {
          selectedLabel.innerHTML = 'x' + e.target.value;
          selected.checked = false;
          lazyLoad.checked = false;
          settings.update({
            name: lazyLoad.name,
            value: lazyLoad.checked
          });
          settings.update(e.target);
        } else if (e.target === lazyLoad) {
          settings.update({
            name: e.target.name,
            value: e.target.checked
          });
          selected.checked = false;
        }
      });
    }
  };

  settings.restore();

  window.addEventListener("beforeunload", function(event) {
    settings.update({
      name: 'position',
      value: window.scrollY
    });
    settings.update({
      name: 'href',
      value: location.href
    });
  });

  setButtons();
  if (LAZY_LOAD) {
    window.onscroll = function(e) {
      var tables = list.querySelectorAll('table');
      if (document.body.scrollTop > tables[tables.length - 2].offsetTop) {
        ajax();
        nextRequest = false;
      }
    };

    document.querySelector('.b-pager').hidden = true;
  } else {
    ajax();
    pageModify();
  }
};
//fstomultiplier();
document.addEventListener("DOMContentLoaded", fstomultiplier, true);
