// ==UserScript==
// @name         SmartDoc Downloader
// @namespace    http://smartdoc.ua
// @version      2.0.0
// @date         November 2016.
// @description  Download documents for free
// @author       quc
// @license       MIT License
// @include       http://smartdoc.ua/*
// @match        http://smartdoc.ua/*
// @grant        none
// ==/UserScript==

function makeItFree(){
	'use strict';
	var iframe = document.querySelector('iframe');
	var btn = document.querySelector('.buy.button.yellow');

	btn.innerText = 'Скачать';

	btn.onclick = function(){
		window.open().document.write(iframe.contentDocument.body.innerHTML);
	}
}

document.addEventListener('DOMContentLoaded', makeItFree, false);
