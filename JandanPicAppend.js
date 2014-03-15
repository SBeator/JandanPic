function removeElementsByClass(className){
	var elements = document.getElementsByClassName(className);
	while(elements.length > 0){
		elements[0].remove();
	}
}

function removeElementsById(id){
	document.getElementById(id).remove();
}

function clearOtherDivs(){
	removeElementsByClass("comments");	
	removeElementsByClass("post");	
	removeElementsById("commentform");	
	removeElementsById("sidebar");	
}

function checkPic(pic){
	if(pic.tagName == "LI" && pic.id.match(/comment-\d*/)){
		picId = pic.id.match(/comment-\d*/).toString().replace("comment-","");
		pic.picId = picId;
		
		var oo = parseInt(document.getElementById("cos_support-" + picId).innerText);
		var xx = parseInt(document.getElementById("cos_unsupport-" + picId).innerText);
				
		if(oo > xx + 100 || oo > 300 || xx < 10){
			return "good";
		} 
	}
	
	return 'bad';
}

function refreshPics(){
	var pics = currentList.getElementsByClassName("row");

	for(var i = 0; i< pics.length; i++){
		var pic = pics[i];
		if(checkPic(pic) == "bad"){
			currentList.removeChild(pic);
			i -= 1;
		}
	}
}

function toggleTuCaoComments(id){
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "http://jandan.net/pic/page-" + currentPageIndex, true);
	xhr.onload = function(){
		var htmlText = xhr.responseText;

		var start = htmlText.indexOf('<ol class="commentlist" style="list-style-type: none;">');
		var end = htmlText.indexOf('<\/ol>');

		var listHTML = htmlText.substring(start, end + '<\/ol>'.length);
		hiddenListContent.innerHTML = listHTML;
		var newList = hiddenListContent.getElementsByClassName("commentlist")[0];
		addPics(newList)
		
		isCheckLoading = true;
	}
	xhr.send();
}

function createTuCaoButton(id){
	var button = document.createElement("span");
	button.classlist.add("time");
	
	var link = document.createElement("a");
	link.href = "javascript:void(0);";
	// link.onclick = "toggleTuCaoComments(id);";
	link.onclick = function (){alert("click")};
	link.innerText = " ↓吐槽";
	
	button.appendChild(link);
	
	return button;
}

function AddTuCaoButton(pic){
	var voteContent = pic.getElementsByClassName("vote")[0];
	
	var button = createTuCaoButton(pic.picId);
	voteContent.appendChild(button);
}

function addPics(list){
	var pics = list.getElementsByClassName("row");

	for(var i = 0; i< pics.length; i++){
		var pic = pics[i];
		if(checkPic(pic) == "good"){
			AddTuCaoButton(pic);
			currentList.appendChild(pic);
			i -= 1;
		}
	}
}

function loadNextPage(){
	currentPageIndex --;
	
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "http://jandan.net/pic/page-" + currentPageIndex, true);
	xhr.onload = function(){
		var htmlText = xhr.responseText;

		var start = htmlText.indexOf('<ol class="commentlist" style="list-style-type: none;">');
		var end = htmlText.indexOf('<\/ol>');

		var listHTML = htmlText.substring(start, end + '<\/ol>'.length);
		hiddenListContent.innerHTML = listHTML;
		var newList = hiddenListContent.getElementsByClassName("commentlist")[0];
		addPics(newList)
		
		isCheckLoading = true;
	}
	xhr.send();
}

function checkIfLoadNextPage(){
	if(isCheckLoading){
		var checkHeight = 3000;

		if(window.scrollY > document.body.scrollHeight - checkHeight){
			isCheckLoading = false;
			loadNextPage();
		}
	}
}


var currentPageDiv = document.getElementsByClassName("current-comment-page")[0];
var currentPageIndex = currentPageDiv.innerText.substring(1, currentPageDiv.innerText.length-1);

var picContent = document.getElementById("comments");
var currentList = picContent.getElementsByClassName("commentlist")[0];

refreshPics();
clearOtherDivs();

var hiddenListContent = document.createElement("lo");
hiddenListContent.style.display = "none";
picContent.appendChild(hiddenListContent);

var isCheckLoading = true;
window.onscroll = checkIfLoadNextPage;