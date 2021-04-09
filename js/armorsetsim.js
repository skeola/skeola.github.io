// Globals
let selectedSkills = {}, skillList = {}, resultsList = {}, decoList = {}, charmList = {};
let armorsBySkill = null;
let headArmor = {}, // Eventually condense this into a single object?
chestArmor = {},
armsArmor = {},
waistArmor = {},
legsArmor = {};

let counter = 0;
let searchCap = 100;

// Flags
let inclSlotArmors = false, useDeco = false, charmsOpen = false;

// Init
initArmorSkills();
initArmorPieces();
initDecorations();

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

// Initializes the skillList and skill list dropdowns
function initArmorSkillDropdown(data){
  let dropdown = document.getElementById("skill-select");
  for(let sk of Object.keys(data).sort()){
    // Create dropdown option
    let newSkill = document.createElement("option");
    newSkill.innerText = sk;
    newSkill.value = sk;
    dropdown.appendChild(newSkill);
  }
  // Create charm dropdowns
  let addSkill1 = document.getElementById("add-skill1-label");
  let clonedDropdown = dropdown.cloneNode(true);
  clonedDropdown.id = "add-skill1";
  clonedDropdown.onchange = function() {updateAddCharm(this.id, this.value)}
  addSkill1.appendChild(clonedDropdown);

  let addSkill2 = document.getElementById("add-skill2-label");
  clonedDropdown = dropdown.cloneNode(true);
  clonedDropdown.id = "add-skill2";
  clonedDropdown.onchange = function() {updateAddCharm(this.id, this.value)}
  addSkill2.appendChild(clonedDropdown);

  let addSkill1Level = document.getElementById("add-level1-label");
  let newSelect = document.createElement("select");
  newSelect.id = "add-level1";
  createLevelRange(newSelect, 3, 0);
  addSkill1Level.appendChild(newSelect);

  let addSkill2Level = document.getElementById("add-level2-label");
  newSelect = document.createElement("select");
  newSelect.id = "add-level2";
  createLevelRange(newSelect, 3, 0);
  addSkill2Level.appendChild(newSelect);
  // Save data object for later use
  skillList = data;
}

function updateAddCharm(id, name){
  console.log(id)
  console.log(name)
}

// Initializes the decoration object
async function initDecorations(){
  fetch('https://skeola.github.io/js/decorations.json')
  .then(response => response.json())
  .then(data => decoList = data);
}

///////////////////////////
// ------RENDERING------ //
///////////////////////////

// Renders the selectedSkills as a scrolling box in the search section
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
    newSkillLevel.className = "selected-level";
    newSkillLevel.onchange = function() {updateLevels(this)};
    createLevelRange(newSkillLevel, skillList[name], selectedSkills[name]);
    
    // Append to the skill list
    newSkill.appendChild(newSkillText);
    newSkill.appendChild(newSkillLevel);
    selected.appendChild(newSkill);
  }
}

// Renders a set of armors and decoration slots
// Needs to be passed a set of armor names and decoration info
function renderArmorSet(armors, slotsTotal, slotsAvailable){
  let div = document.getElementById("results");
  let newArmorSet = document.createElement("div");
  newArmorSet.className = "armor-set";
  let newHead = document.createElement("p");
  let newChest = document.createElement("p");
  let newArms = document.createElement("p");
  let newWaist = document.createElement("p");
  let newLegs = document.createElement("p");
  let newDeco = document.createElement("p");
  newHead.innerText = armors[0];
  newChest.innerText = armors[1];
  newArms.innerText = armors[2];
  newWaist.innerText = armors[3];
  newLegs.innerText = armors[4];
  newDeco.innerText = decosAvailable(slotsTotal, slotsAvailable);
  newHead.className = "armor-piece";
  newChest.className = "armor-piece";
  newArms.className = "armor-piece";
  newWaist.className = "armor-piece";
  newLegs.className = "armor-piece";
  newDeco.className = "armor-piece";
  newArmorSet.appendChild(newHead);
  newArmorSet.appendChild(newChest);
  newArmorSet.appendChild(newArms);
  newArmorSet.appendChild(newWaist);
  newArmorSet.appendChild(newLegs);
  newArmorSet.appendChild(newDeco);
  // Alternate background colors
  if(counter%2==0){
    newArmorSet.style.backgroundColor = "rgba(5, 17, 242, 0.1)";
  }
  else{
    newArmorSet.style.backgroundColor = "rgba(191, 144, 4, 0.1)";
  }
  counter++;
  div.appendChild(newArmorSet);
}

// Clears resulting armor sets
function clearResults(){
  // Clear rendered sets
  let res = document.getElementById("results");
  while(res.firstChild){
    res.removeChild(res.firstChild);
  }
  // Clear array
  resultsList = {};
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

  // Reset results columns
  clearResults();

  // Init sets for matching armor piece names
  let matchingPieceList = {
    "head": new Set(),
    "chest": new Set(),
    "arms": new Set(),
    "waist": new Set(),
    "legs": new Set()
  }
  // Init array for full sets that match criteria
  let matchingSetList = [];

  // Add each required skill's pieces to the set by name
  // For each armor type (head, chest, ...)
  for(let key of Object.keys(matchingPieceList)){
    // Add placeholder item (imitates an empty/unneeded piece)
    matchingPieceList[key].add("---");
    // Include slot-only armors if checked
    if(inclSlotArmors){
      matchingPieceList["chest"].add("Vaik");
      matchingPieceList["arms"].add("Jyura");
      matchingPieceList["waist"].add("Chrome Metal");
      matchingPieceList["legs"].add("Arzuros");
    }

    // For each armor skill in this armor piece
    for(let skill of Object.keys(selectedSkills)){
      // Check if the skill level has been set to 0
      if(selectedSkills[skill] != 0){
        // For each entry in the list of armor names
        for(let name of armorsBySkill[key][skill]){
          matchingPieceList[key].add(name)
        }
      }
    }
  }

  // Brute force search every combination lol hopefully I find a better way later
  let count = 0;
  for(let head of matchingPieceList["head"].keys()){
    for(let chest of matchingPieceList["chest"].keys()){
      for(let arms of matchingPieceList["arms"].keys()){
        for(let waist of matchingPieceList["waist"].keys()){
          for(let legs of matchingPieceList["legs"].keys()){
            // Calculate the total skills this set will give
            let currentSkills = {};
            let decoCount = [0, 0, 0];

            for(let skill of headArmor[head]["skills"]){
              if(skill["name"] in currentSkills){
                currentSkills[skill["name"]] += skill["level"];
              }
              else{
                currentSkills[skill["name"]] = skill["level"];
              }
            }
            for(let skill of chestArmor[chest]["skills"]){
              if(skill["name"] in currentSkills){
                currentSkills[skill["name"]] += skill["level"];
              }
              else{
                currentSkills[skill["name"]] = skill["level"];
              }
            }
            for(let skill of armsArmor[arms]["skills"]){
              if(skill["name"] in currentSkills){
                currentSkills[skill["name"]] += skill["level"];
              }
              else{
                currentSkills[skill["name"]] = skill["level"];
              }
            }
            for(let skill of waistArmor[waist]["skills"]){
              if(skill["name"] in currentSkills){
                currentSkills[skill["name"]] += skill["level"];
              }
              else{
                currentSkills[skill["name"]] = skill["level"];
              }
            }
            for(let skill of legsArmor[legs]["skills"]){
              if(skill["name"] in currentSkills){
                currentSkills[skill["name"]] += skill["level"];
              }
              else{
                currentSkills[skill["name"]] = skill["level"];
              }
            }

            // Calculate decoration slots
            for(let val in headArmor[head]["slots"]){ decoCount[val-1] += 1; }
            for(let val in chestArmor[chest]["slots"]){ decoCount[val-1] += 1; }
            for(let val in armsArmor[arms]["slots"]){ decoCount[val-1] += 1; }
            for(let val in waistArmor[waist]["slots"]){ decoCount[val-1] += 1; }
            for(let val in legsArmor[legs]["slots"]){ decoCount[val-1] += 1; }

            // Compare to required criteria
            let decoCopy = [...decoCount];
            let success = true;
            for(let skill of Object.keys(selectedSkills)){
              // If skill was set to 0 then it is no longer needed
              if(selectedSkills[skill] == 0){ continue; }

              // Runs when the current skills are not satisfactory
              if(!(skill in currentSkills) || currentSkills[skill] < selectedSkills[skill]){
                // Runs when decorations can fill the deficit
                if(useDeco && skill in decoList){
                  let deficit = selectedSkills[skill] - currentSkills[skill];
                  let deficitFilled = false;

                  // Check if there are open slots available starting with the 'cheapest'
                  for(let cost=decoList[skill]; cost<=3; cost++){
                    // Slot can be filled
                    if(deficit <= decoCopy[cost-1]){
                      decoCopy[cost-1] -= deficit;
                      deficitFilled = true;
                      break;
                    }
                  }
                  // Success check for this skill
                  if(!deficitFilled){
                    success = false;
                    break; 
                  }
                } 
                // Runs when decorations cannot be used
                else{
                  success = false;
                  break;
                }
              }
            }
            
            if(success == true){
              count += 1;
              if(count>searchCap){
                window.alert("Over "+searchCap+"+ results for this search, please narrow the criteria!");
                return;
              }
              renderArmorSet([head, chest, arms, waist, legs], decoCount, decoCopy);
            }
          }
        }
      }
    }
  }
}

function toggleCharmTab(){
  // Flip flag
  charmsOpen = !charmsOpen;    

  let toggleButton = document.getElementById("toggleCharm");
  let resultsSec = document.getElementById("results-section");
  let charmSec = document.getElementById("charms-section");
  // Render accordingly
  if(charmsOpen){
    // toggleButton.innerText = "Hide";
    resultsSec.style.display = "none";
    charmSec.style.display = "flex";
  } else{
    // toggleButton.innerText = "Show";
    resultsSec.style.display = "flex";
    charmSec.style.display = "none";
  }
}

// Called when a checkbox is pressed
// Flips the current value
function pressCheckbox(id){
  if(id = "inclSlotArmors"){
    if(document.getElementById(id).checked){
      inclSlotArmors = true;
    }else{ inclSlotArmors = false; }
  }
  if(id = "useDeco"){
    if(document.getElementById(id).checked){
      useDeco = true;
    }else{ useDeco = false; }
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

// Called every time the result cap is changed
function updateResultCap(elem){
  searchCap = elem.value;
}

// Creates a dropdown menu under elem ranging from 0 - max
function createLevelRange(elem, max, current){
  for(let i=0;i<=max; i++){
    let newLevel = document.createElement("option");
    newLevel.innerText = i;
    newLevel.value = i;
    if(i==current){
      newLevel.selected = true;
    }
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

// Quick function for displaying/debugging decoration calculations
function decosAvailable(slotsTotal, slotsAvailable){
  let str = "1 - ";
  str += slotsAvailable[0] + "/" + slotsTotal[0] + ", 2 - ";
  str += slotsAvailable[1] + "/" + slotsTotal[1] + ", 3 - ";  
  str += slotsAvailable[2] + "/" + slotsTotal[2]
  return str;
}