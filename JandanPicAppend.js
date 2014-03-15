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

function addPics(list){
	var pics = list.getElementsByClassName("row");

	for(var i = 0; i< pics.length; i++){
		var pic = pics[i];
		if(checkPic(pic) == "good"){
			currentList.appendChild(pic);
			i -= 1;
		}
	}
}

var currentPageDiv = document.getElementsByClassName("current-comment-page")[0];
var currentPageIndex = currentPageDiv.innerText.substring(1, currentPageDiv.innerText.length-1);

var picContent = document.getElementById("comments");
var currentList = picContent.getElementsByClassName("commentlist")[0];

refreshPics();
clearOtherDivs();

// var newList = document.createElement("lo");
// newList.classList.add("commentlist");
// newList.style.listStyleType = "none";
// addPics(currentList);

//picContent.replaceChild(newList, currentList);


// var xhr = new XMLHttpRequest();
// xhr.open("GET", this.searchOnFlickr_, true);
// xhr.onload = function(){
	// var list = xhr.responseText.match(/<ol class="commentlist" style="list-style-type: none;">.* <\/ol>/);
	// addPics(list)
// }
// xhr.send();
