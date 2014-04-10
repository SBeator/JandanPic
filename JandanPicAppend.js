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

function createImage(src, alt){
	var image = document.createElement("img");
	image.setAttribute("src", src);
	image.setAttribute("alt", alt);
	
	return image;
}

function createElement(type, className, childList, text){
	var element = document.createElement(type);
	
	if(className){
		element.className = className;
	}
	
	if(text){
		element.innerText = text;
	}
	
	if(childList && childList.length > 0){
		for(var i in childList){
			element.appendChild(childList[i]);
		}
	}
	return element;
}

function createElementById(type, id, childList){
	var element = document.createElement(type);
	element.id = id;
	
	if(childList && childList.length > 0){
		for(var i in childList){
			element.appendChild(childList[i]);
		}
	}
	
	return element;
}

function createTucaoPlace(list, id){
	return createElementById(
			"div", 
			"comment-box-comment-" + id, 
			[createElementById( 
				"div", 
				"ds-thread",
				[createElementById( 
					"div", 
					"ds-reset",  
					[list])])]);

}

function createTucaoList(){
	return createElement("ul", "ds-comments");
}

function createTucaoLi(tucao){

	var like = createElement("span", "ds-post-likes", null, tucao.likes? "OO(" + tucao.likes + ")" : null);
	var footer = createElement("div", "ds-comment-footer ds-comment-actions", [like]);
	var message = createElement("p", "", null, tucao.message);	
	var name = createElement("span", "ds-user-name ds-highlight", null, tucao.author.name);
	var header = createElement("div", "ds-comment-header", [name]);	
	var	bodyDiv = createElement("div", "ds-comment-body", [header, message, footer]);
	var image = tucao.author.avatar_url ? createImage(tucao.author.avatar_url, tucao.author.name) : createImage("http://static.duoshuo.com/images/noavatar_default.png", "");
	var	imageDiv = createElement("div", "ds-avatar", [image]);
	var totalDiv = createElement("div", "ds-post-self", [imageDiv, bodyDiv]);
	var li = createElement("li", "ds-post", [totalDiv]);
	
	return createElement(
			"li", 
			"ds-post", 
			[createElement(
				"div", 
				"ds-post-self", 
				[createElement(
					"div", 
					"ds-avatar", 
					[tucao.author.avatar_url 
						? createImage(tucao.author.avatar_url, tucao.author.name) 
						: createImage("http://static.duoshuo.com/images/noavatar_default.png", "")]), 
				createElement(
					"div", 
					"ds-comment-body", 
					[
						createElement(
							"div", 
							"ds-comment-header", 
							[createElement("span", "ds-user-name ds-highlight", null, tucao.author.name)]), 
						createElement("p", "", null, tucao.message), 
						createElement(
							"div", 
							"ds-comment-footer ds-comment-actions", 
							[createElement(
								"span", 
								"ds-post-likes", 
								null, 
								tucao.likes? "OO(" + tucao.likes + ")" : null)])])])]);
}

var loading = {};
function toggleTuCaoComments(id){
	var tucaoBox = document.getElementById("comment-box-comment-" + id);
	
	if(!tucaoBox && !loading[id]){
		loading[id] = true;
		var xhr = new XMLHttpRequest();
		xhr.open("GET", "http://jandan.duoshuo.com/api/threads/listPosts.json?thread_key=comment-" + id, true);
		xhr.onload = function(){
			var response = JSON.parse(xhr.responseText);
			
			var list = createTucaoList();
			
			var tucaos = response.parentPosts;
			for(var i in tucaos){
				list.appendChild(createTucaoLi(tucaos[i]));
			}
			
			var comment = document.getElementById("comment-" + id);
			comment.appendChild(createTucaoPlace(list, id));
			loading[id] = undefined;
		}
		xhr.send();
	} else {
		var display = tucaoBox.style.display
		if(display != "none"){
			tucaoBox.style.display = "none";
		}else{
			tucaoBox.style.display = "";
		}
	}

}

function createTuCaoButton(id){
	var button = document.createElement("span");
	button.classList.add("time");
	
	var link = document.createElement("a");
	link.href = "javascript:void(0);";
	link.onclick = function(){toggleTuCaoComments(id);}
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