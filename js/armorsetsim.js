// Grabs all photos and adds them to the photo div
let selectedSkills = new Set();
loadArmorSkills();


function addSkill() {
  let select = document.getElementById("skill-select");
  let newSkills = [];
  let options = select && select.options;  
  let opt;
  for(let i=0, iLen=options.length; i<iLen; i++){
    opt = options[i];
    if(opt.selected) {
      console.log(opt.text)
      newSkills.push(opt.text);
    }
  }

  for(skill of newSkills) {
    console.log(skill);
    selectedSkills.add(skill);
  }
  updateSkillDisplay();
};

function updateSkillDisplay() {
  let selected = document.getElementById("selected-skills");
  while(selected.lastElementChild){
    selected.removeChild(selected.lastElementChild)
  }

  let tempArray = Array.from(selectedSkills).sort();

  for(let item of tempArray){
    let newSkill = document.createElement("p");
    newSkill.innerText = item;
    selected.appendChild(newSkill);
  }
}

function loadArmorSkills(){
  fetch('https://skeola.github.io/js/skills.json')
  .then(response => response.json())
  .then(data => console.log(data));
}