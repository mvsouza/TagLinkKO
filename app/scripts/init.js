var init= function(){
debugger;
var url, title;
chrome.tabs.getSelected(null,function(tab) {
	url = tab.url;
	title = tab.title;
	document.getElementById("theFrame").src = ("index.html#"+url+"#"+title);
});}
init();