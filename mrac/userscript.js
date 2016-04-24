// ==UserScript==
// @name         MRAC
// @namespace    https://mail.ru
// @version      1.1.0
// @date				 July 2015.
// @description  Mail.ru Registration Autocomplete.
// @author       quc
// @license			 MIT License
// @include			 https://*.mail.ru/*
// @match        https://*.mail.ru/*
// @grant        none
// ==/UserScript==

document.addEventListener("DOMContentLoaded", function(){

	var btnEnter = document.createElement('input');
	btnEnter.setAttribute('type','button');
	btnEnter.setAttribute('value','Заполнить');
	btnEnter.setAttribute('style','height: 28px;');
	btnEnter.className = "btn btn_signup";

	document.getElementsByClassName('btn_signup')[0]
		.parentNode.insertBefore(btnEnter,
			document.getElementsByClassName('btn_signup')[0]);

	btnEnter.addEventListener('click', function(){

		var fName = '',
				lName = '',
				day,
				month,
				year,
				sex,
				randNum,
				password,
				i,
				j,
				inPut,
				symbArr = 'abcdefghijklmnopqrstuvwxyz'.split('');

		randNum = Math.floor(Math.random() * 1000);

		i = Math.floor(Math.random() * (15 - 4 + 1)) + 4;
			// Name Gen
			while(i !== 0){
				var a = Math.floor(Math.random() * symbArr.length);
				fName += symbArr[a];
				i--;
			}

		j = Math.floor(Math.random() * (15 - 4 + 1)) + 4;
			// Last Name Gen
			while(j !== 0){
				var b = Math.floor(Math.random() * symbArr.length);
				lName += symbArr[b];
				j--;
			}
		password = "Hdhdr87tFbd5sr-SrObvctN_d2";

		day = Math.floor(Math.random() * (28 - 1 + 1)) + 1;
		month = Math.floor(Math.random() * (12 - 1 + 1)) + 1;
		year = Math.floor(Math.random() * (1996 - 1960 + 1)) + 1960;
		sex = Math.floor(Math.random() * 2);
		//

		inPut = document.getElementsByClassName('inPut');

		inPut[0].value = fName; // First Name
		inPut[1].value = lName; // Last Name
		document.getElementsByClassName('days')[0].value = day; // Days
		document.getElementsByClassName('months')[0].value = month; // Month
		document.getElementsByClassName('years')[0].value = year; // Year
		document.getElementsByClassName('vtm')[sex].click(); // Sex
		inPut[3].value = fName + '_' + lName + randNum; // Mail Box
		inPut[4].value = password; // Password
		inPut[5].value = password; // Retype password
	});
});
