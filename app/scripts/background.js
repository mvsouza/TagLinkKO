'use strict';

//chrome.runtime.onInstalled.addListener(function (details) {
//  console.log('previousVersion', details.previousVersion);
//});

//chrome.browserAction.setBadgeText({text: '\'Allo'});

//console.log('\'Allo \'Allo! Event Page for Browser Action');


debugger;
chrome.tabs.getSelected(null,function(tab) {
	var url, title;
	url = tab.url;
	title = tab.title;
	$("#theFrame").src = ("index.html#"+url+"#"+title);
});