// Globals
let selectedSkills = {}, skillList = {}, displayList = {};
let armorsBySkill = null;
let headArmor = {}, // Eventually condense this into a single object?
chestArmor = {},
armsArmor = {},
waistArmor = {},
legsArmor = {};

// Flags
let minPieces = false, maxDef = false, maxDeco = false;

// Init
initArmorSkills();
initArmorPieces();


///////////////////////////////
// -------INITIALIZERS-------//
///////////////////////////////

// Loads the full list of skills from the skills.json file
async function initArmorSkills(){
  fetch('https://skeola.github.io/js/skills.json')
  .then(response => response.json())
  .then(data => initArmorSkillDropdown(data));
}

// Loads armor pieces into our containers
async function initArmorPieces(){
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
function initArmorSkillDropdown(data){
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

///////////////////////////
// ------RENDERING------ //
///////////////////////////

// This version simply adds the new skill to the bottom of the list
function renderSelectedSkills() {
  // Get div
  let selected = document.getElementById("selected-skills");
  
  // Clear old skills
  while (selected.firstChild) {
    selected.removeChild(selected.firstChild);
  }

  // Create the skill name text and dropdown selector for each selected skill
  for(let name of Object.keys(selectedSkills)){
    // Create new skill div container
    let newSkill = document.createElement("div");
    newSkill.className = "selected-skill";
    let newSkillText = document.createElement("p");
    newSkillText.innerText = name;

    // Add level selector dropdown
    let newSkillLevel = document.createElement("select");
    newSkillLevel.onchange = function() {updateLevels(this)};
    createLevelRange(newSkillLevel, skillList[name]);
    
    // Append to the skill list
    newSkill.appendChild(newSkillText);
    newSkill.appendChild(newSkillLevel);
    selected.appendChild(newSkill);
  }


}

/////////////////////////
// ------BUTTONS------ //
/////////////////////////

// Called when "Add" button is pressed
// Adds the selected skill to the selectedSkills list
function addSkill() {
  let select = document.getElementById("skill-select");
  let options = select.options;  
  let opt;
  for(let i=1; i<options.length; i++){
    opt = options[i];
    if(opt.selected && !Object.keys(selectedSkills).includes(opt.innerText)) {
      selectedSkills[opt.innerText] = 0;
      renderSelectedSkills();
      break;
    }
  }
};

// Called when "Search" is pressed
// Searches for matching sets based on selected skills
function search(){
  // If this is the first search, we initialize armorsBySkill
  if(armorsBySkill == null){ setABS(); }

  // Reset old display list
  displayList = {
    "head": new Set(),
    "chest": new Set(),
    "arms": new Set(),
    "waist": new Set(),
    "legs": new Set()
  }

  // Reset results columns
  for(let key of Object.keys(displayList)){
    let idName = "results-" + key;
    let col = document.getElementById(idName);
    while (col.firstChild) {
      col.removeChild(col.firstChild);
    }
  }

  // Add each required skill's pieces to the set by name
  // For each armor type (head, chest, ...)
  for(let key of Object.keys(displayList)){
    // For each required armor skill
    for(let skill of Object.keys(selectedSkills)){
      // For each entry in the list of armor names
      for(let name of armorsBySkill[key][skill]){
        displayList[key].add(name)
      }
    }
  }

  // Display results in the corresponding columns
  for(let key of Object.keys(displayList)){
    let idName = "results-" + key;
    let col = document.getElementById(idName);
    for(let name of displayList[key].values()){
      let newRes = document.createElement("p");
      newRes.innerText = name;
      newRes.className = "result";
      col.appendChild(newRes);
    }
  }
}

// Called when a checkbox is pressed
// Flips the current value
function pressCheckbox(name){
  if(name = "minPieces"){
    minPieces = !minPieces;
  }
  if(name = "maxDeco"){
    maxDeco = !maxDeco;
  }
  if(name = "maxDef"){
    maxDef = !maxDef;
  }
}

/////////////////////////
// ------HELPERS------ //
/////////////////////////

// Called every time you change the selector for a skill
// Updates the level of the particular skill in selectedSkills
function updateLevels(elem){
  let name = elem.parentElement.getElementsByTagName("p")[0].innerText;
  selectedSkills[name] = parseInt(elem.value);
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

// Initializes the object containing each armor piece sorted by
// which armor skills it contains
// Called once when the first search is made
function setABS(){
  // Create a blank version of the skillList
  let newObj = Object.assign({}, skillList);
  for(let key of Object.keys(newObj)){
    newObj[key] = []
  }
  armorsBySkill = {
    "head": newObj
  };
  armorsBySkill["chest"] = JSON.parse(JSON.stringify(newObj));
  armorsBySkill["arms"] = JSON.parse(JSON.stringify(newObj));
  armorsBySkill["waist"] = JSON.parse(JSON.stringify(newObj));
  armorsBySkill["legs"] = JSON.parse(JSON.stringify(newObj));

  // Iterate through all armor pieces, adding them to their appropriate list
  for(key of Object.keys(headArmor)){
    for(skill of headArmor[key]["skills"]){
      armorsBySkill["head"][skill["name"]].push(key);
    }
  }
  for(key of Object.keys(chestArmor)){
    for(skill of chestArmor[key]["skills"]){
      armorsBySkill["chest"][skill["name"]].push(key);
    }
  }
  for(key of Object.keys(armsArmor)){
    for(skill of armsArmor[key]["skills"]){
      armorsBySkill["arms"][skill["name"]].push(key);
    }
  }
  for(key of Object.keys(waistArmor)){
    for(skill of waistArmor[key]["skills"]){
      armorsBySkill["waist"][skill["name"]].push(key);
    }
  }
  for(key of Object.keys(legsArmor)){
    for(skill of legsArmor[key]["skills"]){
      armorsBySkill["legs"][skill["name"]].push(key);
    }
  }
  console.log("Sorted armor loading complete")
}