function getNewLi(tucao, li){
	var newLi = li.cloneNode();
	
	
	if(tucao.avatar_url){
		var headImage = newLi.getElementsByClass("tucao-headImage")[0];
		headImage.setAttribute("src", tucao.avatar_url);
		headImage.setAttribute("alt", tucao.name);
	} 
	
	var name = newLi.getElementsByClass("tucao-name")[0];
	name.innerText = tucao.name;
	
	var message = newLi.getElementsByClass("tucao-message")[0];
	message.innerText = tucao.message;	
	
	var likes = newLi.getElementsByClass("tucao-likes")[0];
	likes.innerText = tucao.likes;
	
	return newLi;
}

function addTucao(eventValue){
	var id = eventValue.id;
	var response = eventValue.response;
	
	var ul = document.getElementById("tuCaoCommintList");
	var li = document.getElementById("tuCaoCommint");
	var tucaos = response.parentPosts;

	var newUl = ul.cloneNode();
	
	for(var i in tucaos){
		newUl.appendChild(getNewLi(tucaos[i], li));
	}
	
	var window = chrome.extension.getViews()[0];
	
	var comment = window.document.getElementById("comment-" + id);
	comment.appendChild(newUl);
}

var eventType = {
  "addTuCao": addTucao
};

function contentScriptHandler(request) {
  if (eventType[request.eventName]) {
    eventType[request.eventName](request.eventValue);
  }
}

chrome.extension.onRequest.addListener(contentScriptHandler);