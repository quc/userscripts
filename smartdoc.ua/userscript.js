// ==UserScript==
// @name         SmartDoc Downloader
// @namespace    http://smartdoc.ua
// @version      1.0.1
// @date				 October 2015.
// @description  Download documents for free
// @author       quc
// @license			 MIT License
// @include			 http://smartdoc.ua/*
// @match        http://smartdoc.ua/*
// @grant        none
// ==/UserScript==

function makeItFree(){

	'use strict';

	var dependencies = [
		'https://rawgit.com/evidenceprime/html-docx-js/master/dist/html-docx.js',
		'https://rawgit.com/eligrey/FileSaver.js/master/FileSaver.min.js'
	],
	scriptElement,
	download,
	newButton,
	oldButton;

	for (var i = 0; i < dependencies.length; i++) {
		scriptElement = document.createElement('script');
		scriptElement.setAttribute("type","text/javascript");
		scriptElement.setAttribute("src", dependencies[i]);
		document.head.appendChild(scriptElement);
	}

	download = function(){
		var iframeDocument = document.querySelector('iframe').contentWindow.document,
				nameOfDocument = iframeDocument.body.querySelector('td').innerText,
				content = iframeDocument.body.innerHTML,
				converted = htmlDocx.asBlob(content);

		saveAs(converted, nameOfDocument + '.docx');
	};

	newButton = document.createElement('a');
	oldButton = document.querySelector('.buy-block a');

	newButton.className = oldButton.className + " free";
	newButton.style.width = '196px';
	newButton.innerHTML = 'Скачать';

	newButton.addEventListener('click', download, false);

	oldButton.parentNode.insertBefore(newButton, oldButton);
	oldButton.parentNode.removeChild(oldButton);
}

document.addEventListener('DOMContentLoaded', makeItFree, false);
