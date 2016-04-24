// ==UserScript==
// @name EX.UA Page Multiplier
// @homepageURL https://github.com/quc
// @author quc
// @version 1.0.1
// @date 2015-08-25
// @namespace http://www.ex.ua/
// @include http://ex.ua/*
// @include https://ex.ua/*
// @include http://www.ex.ua/*
// @include https://www.ex.ua/*
// @match http://www.ex.ua/*
// @match https://www.ex.ua/*
// @license GNU GENERAL PUBLIC LICENSE
// @grant GM_xmlhttpRequest
// @grant GM_getValue
// @grant GM_setValue
// @run-at document-start
// ==/UserScript==

var exuamultiplier = (function(window, document){

	/**
	* private
	*/

	var _doc,
		_bodyElement,
		_href,
		_multiplier,
		_pageToLoad,
		_navPanel,
		_viewId,
		_validUrl,
		_elementsPerPage,
		_maxPage,
		_maxElements,
		_indicatorCounter,
		_indicatorPosition;

	function _createCSSrules()
	{
		try
		{
			var style = _doc.createElement("style");
			var styleTxt =
			_doc.createTextNode('.exuam_block {' +
			'display: block;' +
			'width: 100%;' +
			'height: 1em;' +
			'text-align: center;' +
		'}' +
		'.exuam_dot {' +
			'display: inline-block;' +
			'height: 0.5em;' +
			'width: 0.5em;' +
			'margin: 0.5em;' +
			'border-radius: 50%;' +
			'background-color: #3B83D3;' +
			'opacity: 0.1;' +
  			'-webkit-transition: all .8s linear;' +
  			'-moz-transition: all .8s linear;' +
  			'transition: all .8s linear;' +
  		'}');
			style.appendChild(styleTxt);
			_doc.body.appendChild(style);
		}
		catch(e)
		{
			console.log(e);
		}
	}


	function _createIndicators()
	{
		try
		{
			var exuam_block = _doc.createElement('div');
			exuam_block.setAttribute('class', 'exuam_block');
			_bodyElement.replaceChild(exuam_block, _bodyElement.children[_indicatorPosition]);

				for(var i=0;i<_multiplier;i++)
				{
					var exuam_dot = _doc.createElement('div');
					exuam_dot.setAttribute('class', 'exuam_dot');
					exuam_block.appendChild(exuam_dot);
				}
			_doc.getElementsByClassName('exuam_dot')[0].style.opacity = 1;
		}
		catch(e)
		{
			console.log(e);
		}
	}

	function _moveDots(trigger)
	{
		if(_indicatorCounter < _multiplier && trigger === true)
		{
			var dots = _doc.getElementsByClassName('exuam_dot');

			dots[_indicatorCounter].style.opacity = 1;
			_indicatorCounter++;
		}
		else
		{
			setTimeout(function()
			{
			var dots = document.getElementsByClassName('exuam_dot');
				for (var i=0; i<dots.length; i++)
				{
					dots[i].style.opacity = 0;
				}
			}, 1000);
		}
	}

	function _getPanel()
	{
		try
		{
			for(var i=0; i<_bodyElement.children.length; i++)
			{
				if(_bodyElement.children[i].getAttribute('cellpadding') == '5')
				{
					_indicatorPosition = i+1;
					_navPanel = _bodyElement.children[i];
					return true;
				}
			}
		}
		catch(e)
		{
			return false;
		}
	}

	function _getMultiplier()
	{
		if(typeof(Storage) !== "undefined")
		{
			if(localStorage.getItem('exuamultiplier'))
			{
    			_multiplier = Number(localStorage.getItem('exuamultiplier'));
			}
			else
			{
				_multiplier = 1;
				localStorage.setItem('exuamultiplier', _multiplier.toString());
			}
		}
		else
		{
			if(/multi=/.test(_doc.cookie))
			{
    			_multiplier = Number(_doc.cookie.match(/(?:multi=)([0-9]+)/)[1]);
			}
			else
			{
				_multiplier = 1;
				_doc.cookie = "multi=" + _multiplier + "; expires=Mon, 01 Jan 2020 12:00:00 UTC; path=/";
			}
		}

    	if(_multiplier < 1 || _multiplier > 50) // maximux multiply is 50
    	{
    		_multiplier = 1;
    	}
	}

	function _maxPageFinder()
	{
		var img = _navPanel.getElementsByTagName('img');
		var i = 0;
			for(;i<img.length;i++)
			{
				if(img[i].getAttribute('src') == "/t3/arr_e.gif")
				{
					return Number(/\d+/.exec(img[i].alt)[0]);
				}
			}
		_moveDots(false);
		return null;
	}

	function _createSelect()
	{
		var parent = _navPanel.getElementsByTagName('select')[0].parentNode;
		var newElementSelect = document.createElement('select');

			for(var i=1;i<51;i++) // options from x1 to x50
			{
				var newElementOption = document.createElement('option');
				newElementOption.setAttribute('value', i.toString());

					if(i == _multiplier)
					{
						newElementOption.setAttribute('selected', 'true');
					}

				var newTextOption = document.createTextNode('X' + i);
				newElementOption.appendChild(newTextOption);
				newElementSelect.appendChild(newElementOption);
			}

		newElementSelect.setAttribute('class', 'small');
		newElementSelect.setAttribute('style', 'margin-left: 5px;');

		var dataToSet = "var req=''; if(/v=/.test(location.href)) " +
		"{if(/v=1-0/.test(location.href)){req='&v=1-0'} " +
		"else if(/v=1-1/.test(location.href)){req='&v=1-1'} " +
		"else if(/v=0-1/.test(location.href)){req='&v=0-1'};}" +
		"else{}if(/p=/.test(location.href)){var tempnum=Number" +
		"(/(?:p=)([0-9]+)/.exec(location.href)[1]),negnum; " +
		"if(tempnum>this.value){negnum=tempnum%this.value; " +
		"tempnum-=negnum;}else{negnum=this.value%tempnum; " +
		"tempnum+=negnum;}location.href=location.origin + " +
		"location.pathname+'?p='+tempnum+req;}else"+
		"{location.reload();};";

			if(typeof(Storage) !== "undefined")
			{
				newElementSelect.setAttribute("onchange",
					"localStorage.setItem('exuamultiplier', this.value);" +
					dataToSet);
			}
			else
			{
				newElementSelect.setAttribute("onchange",
					"document.cookie = \"multi=\" + this.value + \"; " +
					"expires=Mon, 01 Jan 2020 12:00:00 UTC; path=/\"; " +
					dataToSet);
			}

		parent.appendChild(newElementSelect);
	}

	function _createRequest()
	{
		if (window.XMLHttpRequest)
		{
        	return new XMLHttpRequest();
		}
		else if (window.ActiveXObject)
		{
			return new ActiveXObject("Microsoft.XMLHTTP");
		}
			return null;
	}

	function _sendRequest()
	{
		if(_pageToLoad < _multiplier)
		{
			var urlToSend;

				if(_validUrl)
				{
					var match = _href.match(/(?:p=)([0-9]+)/);
					var pageNumber = Number(match[1]);
					pageNumber += _pageToLoad;

						if(pageNumber >= _maxPage)
						{
							_moveDots(false);
							return;
						}
						else
						{
							urlToSend = _href.replace(match[0], 'p=' + pageNumber);
						}
				}
				else
				{
					urlToSend = location.search.length === 0 ?
						_href+'?p=' + _pageToLoad : _href+'&p=' + _pageToLoad;
				}

			var xhr = _createRequest();

				if(xhr)
				{
					xhr.onreadystatechange = function()
					{
					   	if (xhr.readyState == 4 && xhr.status == 200)
					   	{
					   		var buffer = _doc.createElement('p'),
								response = xhr.responseText,
								list;

							buffer.innerHTML = response;
							list = buffer.getElementsByClassName('include_' + _viewId)[0].children[0];

							for(var i=0; i<list.children.length; i++)
							{
								_doc.getElementsByClassName('include_' + _viewId)[0].children[0].appendChild(list.children[i]);
							}

							_pageToLoad++;
							_moveDots(true);
							_sendRequest();
						}
					};
					xhr.open('GET', urlToSend, true);
					xhr.send(null);
				}
		}
		else
		{
			if(_multiplier !== 1)
			{
				_moveDots(false);
			}
			return;
		}
	}

	function _urlParser(url, suffix)
	{
		var prevUrl,
				newUrl;

		if(/p=[0-9]+/.test(url))
		{
			if(suffix < _maxPage)
			{
				prevUrl = /p=[0-9]+/.exec(url.slice(url.indexOf('p='), url.length))[0];
				newUrl = url.replace(prevUrl, 'p=' + suffix);
				return newUrl;
			}
			else
			{
				prevUrl = /p=[0-9]+/.exec(url.slice(url.indexOf('p='), url.length))[0];
				newUrl = url.replace(prevUrl, 'p=' + _maxPage);
				return newUrl;
			}
		}
		else
		{
			return url;
		}
	}

	function _newPageCount()
	{
		var tr = _navPanel.getElementsByTagName('tr')[0],
			td = tr.getElementsByTagName('td'),
			tdsmall;

			if(_validUrl)
			{
				pagenumber = Number(/(?:p=)([0-9]+)/.exec(_href)[1]);
			}
			else
			{
				pagenumber = 0;
			}

		var	step = _elementsPerPage * _multiplier,
			firstCount = step * pagenumber / _multiplier,
			lastCount = firstCount + step,
			futureOffset,
			currentOffset;

			if(pagenumber === 0)
			{
				firstCount = 1;
			}
			else
			{
				firstCount += 1;
			}

			for(var i=0; i<td.length;i++)
			{
				if(td[i].className == 'small')
				{
					tdsmall = i;
					break;
				}
			}

			if(pagenumber === 0)
			{
				currentOffset = 2;
			}
			else if(pagenumber/_multiplier == 1)
			{
				futureOffset = 2;
				currentOffset = 4;
				moveNum(futureOffset);
			}
			else if(pagenumber/_multiplier == 2)
			{
				futureOffset = 3;
				currentOffset = 5;
				moveNum(futureOffset);
			}
			else if(pagenumber/_multiplier > 2)
			{
				if(td.length === 13)
				{
					currentOffset = 5;
				}
				else if (td.length === 12)
				{
					currentOffset = 7;
				}
				else
				{
					currentOffset = 6;
				}
			}

	function moveNum(futureOffset)
	{
		_getPanel();
		var ntr = _navPanel.getElementsByTagName('tr')[0];

		for(var i=0; i<5; i++, futureOffset++, tdsmall++)
		{
			var ia = ntr.children[futureOffset];
			var ib = ntr.children[futureOffset].cloneNode(true);
			var ic = ntr.children[tdsmall].cloneNode(true);
			var id = ntr.children[tdsmall];
			ntr.insertBefore(ic, ia);
			ntr.insertBefore(ib, id);
			ntr.removeChild(ia);
			ntr.removeChild(id);
		}
	}

	_getPanel();
	var tr = _navPanel.getElementsByTagName('tr')[0];
	var td = tr.getElementsByTagName('td');

	if(_maxElements === null)
	{
		_maxElements = Number(_navPanel.getElementsByTagName('b')[0].textContent.match(/\d+$/)[0]);
	}

	lastCount = (lastCount >= _maxElements) ? _maxElements : lastCount;

	tr.getElementsByTagName('b')[0].textContent = firstCount + ".." + lastCount;

		for(var i=0,
				x=currentOffset,
				y=currentOffset,
				xz=_multiplier,
				yz=_multiplier,
				xlin = firstCount-1,
				xfin=xlin-step+1,
				yfin=lastCount+1,
				ylin = yfin+step-1; i<td.length-1; i++)
		{
			if(td[i].firstChild.nodeName == "A")
			{
				if(i<currentOffset && currentOffset !=2)
				{
					x -= 1;
						if(td[x].firstChild.href)
						{
							td[x].firstChild.href = _urlParser(td[x].firstChild.href, pagenumber-xz);

								if(td[x-1].firstChild.nodeName == "#text")
								{
									// nothing
								}
								else
								{
									xz += _multiplier;
								}

								if(td[x].firstChild.textContent.length !== 0)
								{
									td[x].firstChild.textContent = xfin + ".." + xlin;
									xfin -= step;
									xlin -= step;
								}
						}
				}
				else
				{
					y += 1;
						if(td[y].firstChild.href)
						{
							td[y].firstChild.href = _urlParser(td[y].firstChild.href, pagenumber+yz);

								if(td[y+1].firstChild.nodeName == "#text")
								{
									// nothing
								}
								else
								{
									yz += _multiplier;
								}

								if(td[y].firstChild.textContent.length !== 0)
								{
									if(ylin >= _maxElements)
									{
										ylin = _maxElements;
									}
									if(yfin >= _maxElements)
									{
										yfin = _maxElements;
									}

										td[y].firstChild.textContent = yfin + ".." + ylin;

									if(ylin + step <= _maxElements || yfin + step <= _maxElements)
									{
										yfin += step;
										ylin += step;
									}
									else
									{
										yfin = _maxElements;
										ylin = _maxElements;
									}
								}
						}
				}
			}
		}
	// replace bottom panel
	for(var i=0, ia=0, ib=true; i<_bodyElement.children.length; i++)
		{
			try
			{
				if(_bodyElement.children[i].getAttribute('cellpadding') == '5')
				{
					if(ib)
					{
						ia = i;
						ib = false;
					}
					else
					{
						var firstNavPanel = _bodyElement.children[ia],
							secondNavPanel = _bodyElement.children[i],
							cloneFirstNavPanel = firstNavPanel.cloneNode(true);

							_bodyElement.insertBefore(cloneFirstNavPanel, secondNavPanel);
							_bodyElement.removeChild(secondNavPanel);
						break;
					}
				}
			}
			catch(e)
			{
				break;
			}
		}
	}

        ////////////////////////////////////////////////////////////////////////
        /// public /////////////////////////////////////////////////////////////

	return {

		onDOMReady: function()
		{
				try
				{
					_doc = document;
					_bodyElement = _doc.getElementById("body_element");
					_href = _doc.location.href;
					_multiplier = 1;
					_pageToLoad = 1;
					_indicatorCounter = 1;
					_navPanel,
					_validUrl = /p=/.test(_href) === true;

					_viewId = _doc.getElementsByName('view_id')[0].selectedIndex;

					_getPanel();

					_elementsPerPage = Number(_navPanel.getElementsByTagName('select')[0].value);
					_maxElements = _maxPageFinder();

						if(_maxElements !== null)
						{
							_maxPage = _maxElements / _elementsPerPage | 0;
						}
						else
						{
							_maxPage = Number(_href.match(/(?:p=)([0-9]+)/)[1]);
						}

					_getMultiplier();

						if(_multiplier > 1)
						{
							_createCSSrules();
							_createIndicators();
						}

					_createSelect();
					_newPageCount();
					_sendRequest();

					console.log('EXX it!');
				}
				catch(e)
				{
					_moveDots(false);
					console.log('Nothing multiply...');
				}
		}
	};
})(window, document);

if(	location.origin == "http://www.ex.ua" ||
	location.origin == "http://ex.ua" ||
	location.origin == "https://www.ex.ua" ||
	location.origin == "https://ex.ua")
{
document.addEventListener("DOMContentLoaded", exuamultiplier.onDOMReady, false);
}
