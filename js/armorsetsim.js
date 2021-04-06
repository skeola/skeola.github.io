let selectedSkills = {};
let headArmor = {};
let chestArmor = {};
let armsArmor = {};
let waistArmor = {};
let legsArmor = {};
let skillList = {};
let armorsBySkill = null;
loadArmorSkills();
loadArmorPieces();


// Loads the full list of skills from the skills.json file
async function loadArmorSkills(){
  fetch('https://skeola.github.io/js/skills.json')
  .then(response => response.json())
  .then(data => setArmorSkillDropdown(data));
}

// Loads armor pieces into our containers
async function loadArmorPieces(){
  fetch('https://skeola.github.io/js/head.json')
  .then(response => response.json())
  .then(data => headArmor = data);
  fetch('https://skeola.github.io/js/chest.json')
  .then(response => response.json())
  .then(data => chestArmor = data);
  fetch('https://skeola.github.io/js/arms.json')
  .then(response => response.json())
  .then(data => armsArmor = data);
  fetch('https://skeola.github.io/js/waist.json')
  .then(response => response.json())
  .then(data => waistArmor = data);
  fetch('https://skeola.github.io/js/legs.json')
  .then(response => response.json())
  .then(data => legsArmor = data);
}

// Initializes the full skill list
function setArmorSkillDropdown(data){
  let dropdown = document.getElementById("skill-select");
  for(let sk of Object.keys(data).sort()){
    // Create dropdown option
    let newSkill = document.createElement("option");
    newSkill.innerText = sk;
    newSkill.value = data[sk];
    dropdown.appendChild(newSkill);
  }
  // Save data object for later use
  skillList = data;
}

// Adds the selected skill to the selectedSkills list
function addSkill() {
  let select = document.getElementById("skill-select");
  let options = select.options;  
  let opt;
  for(let i=1; i<options.length; i++){
    opt = options[i];
    if(opt.selected && !Object.keys(selectedSkills).includes(opt.innerText)) {
      selectedSkills[opt.innerText] = 0;
      updateSkillDisplay(opt.innerText, opt.value);
      break;
    }
  }
};

// This old version removes all elements and updates them
// Potentially useful later?
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

  // Create the skill name text and dropdown selector
  let newSkill = document.createElement("div");
  newSkill.className = "selected-skill";
  let newSkillText = document.createElement("p");
  newSkillText.innerText = name;
  let newSkillLevel = document.createElement("select");
  newSkillLevel.onchange = function() {updateLevels(this)};
  createLevelRange(newSkillLevel, value)

  // Append to the skill list
  newSkill.appendChild(newSkillText);
  newSkill.appendChild(newSkillLevel);
  selected.appendChild(newSkill);
}

// Called every time you change the selector for a skill
// Updates the level of the particular skill in selectedSkills
function updateLevels(elem){
  let name = elem.parentElement.getElementsByTagName("p")[0].innerText;
  selectedSkills[name] = elem.value;
}

// Creates a dropdown menu under elem ranging from 0 - max
function createLevelRange(elem, max){
  for(let i=0;i<=max; i++){
    let newLevel = document.createElement("option");
    newLevel.innerText = i;
    newLevel.value = i;
    elem.appendChild(newLevel);
  }
}

// 
function search(){
  // If this is the first search, we initialize armorsBySkill
  if(armorsBySkill == null){

  }
}