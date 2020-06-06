// Grabs all photos and adds them to the photo div
let photos = document.getElementById("photos");

const prefix = "photos/img-";
let imgs = new Array();

for(i=1; i<=33; i++){
  let img = document.createElement("img");
  img.src = prefix.concat(i, ".jpg");
  img.id = "img".concat('', i);
  img.className = "photo";
  img.onclick = function(){zoomPhoto(img.id)};
  photos.appendChild(img);
}

function zoomPhoto(id){
  let img = document.getElementById("focus-image");
  img.src = document.getElementById(id).src;
  let modal = document.getElementById("modal");
  modal.style.display = "block";

//   img = document.getElementById(id);
//   newImg = document.createElement("img");
//   newImg.src = img.src;
//   newImg.id = img.id.concat('', "temp");
//   newImg.style.maxHeight = "90%";
//   newImg.style.maxWidth = "90%";
//   newImg.style.zIndex = "2";
//   newImg.style.position = "fixed";
//   // newImg.style.display = "block";
//   // newImg.style.marginLeft = "5%";
//   // newImg.style.marginRight = "5%";
//   // newImg.style.marginTop = "5%";
//   view = document.getElementById("right-col");
//   view.appendChild(newImg);
//   newImg.focus();
//   newImg.addEventListener("blur", function(){alert("weher"); view.removeChild(newImg);});
//   // Focus on element so we can reset the styling on unfocus
}

function close(){
  alert("ye");
  let modal = document.getElementById("modal");
  modal.style.display = "none";
}