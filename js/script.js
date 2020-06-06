// Grabs all photos and adds them to the photo div
let photos = document.getElementById("photos");

const prefix = "photos/img-";
let imgs = new Array();
for(i=1; i<=33; i++){
  let img = document.createElement("img");
  img.src = prefix.concat(i, ".jpg");
  img.className = "photo";
  imgs.push(img);
}
console.log(imgs.length);

for(i=0; i<imgs.length; i++){
  console.log(i);
  photos.appendChild(imgs[i]);
}