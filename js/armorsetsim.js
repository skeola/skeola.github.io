// Grabs all photos and adds them to the photo div
let selectedSkills = new Set();
loadArmorSkills();

async function loadArmorSkills(){
  fetch('https://skeola.github.io/js/skills.json')
  .then(response => response.json())
  .then(data => setArmorSkillDropdown(data));
}

function addSkill() {
  let select = document.getElementById("skill-select");
  let options = select.options;  
  let opt;
  for(let i=1; i<options.length; i++){
    opt = options[i];
    if(opt.selected) {
      let newSkill = {name: opt.innerText, current: 0, max: opt.value};
      selectedSkills.add(newSkill);
      updateSkillDisplay(opt.innerText, opt.value);
      break;
    }
  }
};

// This version removes all elements and updates them
function updateSkillDisplay_Old() {
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

// This version simply adds the new skill to the bottom of the list
function updateSkillDisplay(name, value) {
  let selected = document.getElementById("selected-skills");

  let newSkill = document.createElement("div");
  newSkill.className = "selected-skill";
  let newSkillText = document.createElement("p");
  newSkillText.innerText = name;
  let newSkillLevel = document.createElement("select");
  createLevelRange(newSkillLevel, value)
  newSkill.appendChild(newSkillText);
  newSkill.appendChild(newSkillLevel);
  selected.appendChild(newSkill);
}

function setArmorSkillDropdown(data){
  let dropdown = document.getElementById("skill-select");
  for(let sk of Object.keys(data).sort()){
    let newSkill = document.createElement("option");
    newSkill.innerText = sk;
    newSkill.value = data[sk];
    dropdown.appendChild(newSkill);
  }
}

function createLevelRange(elem, max){
  for(let i=0;i<=max; i++){
    let newLevel = document.createElement("option");
    newLevel.innerText = i;
    newLevel.value = i;
    elem.appendChild(newLevel);
  }
}

function search(){
  console.log(selectedSkills)
}

function collectLevels(){
  let selectedSkills = document.getElementById("selected-skills");
  
}