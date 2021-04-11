// Globals
let selectedSkills = {}, skillList = {}, resultsList = {}, decoList = {}, charmList = [], armorList = [];
let armorsBySkill = null;
let armorPieces = {
  "head": {},
  "chest": {},
  "arms": {},
  "waist": {},
  "legs": {}
};
let emptyCharm = {
  "skills": [],
  "slots": [],
  "defense": 0
}
let counter = 0;
let searchCap = 100;

// Flags
let inclSlotArmors = false, useDeco = false, charmsOpen = false, armorOpen = false;

// Init
initArmorSkills();
initArmorPieces();
initDecorations();

renderCharms();

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
  .then(data => armorPieces["head"] = data);
  fetch('https://skeola.github.io/js/chest.json')
  .then(response => response.json())
  .then(data => armorPieces["chest"] = data);
  fetch('https://skeola.github.io/js/arms.json')
  .then(response => response.json())
  .then(data => armorPieces["arms"] = data);
  fetch('https://skeola.github.io/js/waist.json')
  .then(response => response.json())
  .then(data => armorPieces["waist"] = data);
  fetch('https://skeola.github.io/js/legs.json')
  .then(response => response.json())
  .then(data => armorPieces["legs"] = data);
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
  // ADD
  let addSkill1 = document.getElementById("add-skill1-label");
  let clonedDropdown = dropdown.cloneNode(true);
  clonedDropdown.id = "add-skill1";
  // clonedDropdown.onchange = function() {updateAddCharm(this.id, this.value)}
  addSkill1.appendChild(clonedDropdown);

  let addSkill2 = document.getElementById("add-skill2-label");
  clonedDropdown = dropdown.cloneNode(true);
  clonedDropdown.id = "add-skill2";
  // clonedDropdown.onchange = function() {updateAddCharm(this.id, this.value)}
  addSkill2.appendChild(clonedDropdown);

  let addSkill1Level = document.getElementById("add-level1-label");
  let newSelect = document.createElement("select");
  newSelect.id = "add-level1";
  createLevelRange(newSelect, 7, 0);
  addSkill1Level.appendChild(newSelect);

  let addSkill2Level = document.getElementById("add-level2-label");
  newSelect = document.createElement("select");
  newSelect.id = "add-level2";
  createLevelRange(newSelect, 7, 0);
  addSkill2Level.appendChild(newSelect);

  let addSlot1Level = document.getElementById("add-slot1-label");
  newSelect = document.createElement("select");
  newSelect.id = "add-slot1";
  createLevelRange(newSelect, 3, 0);
  addSlot1Level.appendChild(newSelect);

  let addSlot2Level = document.getElementById("add-slot2-label");
  newSelect = document.createElement("select");
  newSelect.id = "add-slot2";
  createLevelRange(newSelect, 3, 0);
  addSlot2Level.appendChild(newSelect);

  let addSlot3Level = document.getElementById("add-slot3-label");
  newSelect = document.createElement("select");
  newSelect.id = "add-slot3";
  createLevelRange(newSelect, 3, 0);
  addSlot3Level.appendChild(newSelect);

  // EDIT
  let editSkill1 = document.getElementById("edit-skill1-label");
  clonedDropdown = dropdown.cloneNode(true);
  clonedDropdown.id = "edit-skill1";
  // clonedDropdown.onchange = function() {updateeditCharm(this.id, this.value)}
  editSkill1.appendChild(clonedDropdown);

  let editSkill2 = document.getElementById("edit-skill2-label");
  clonedDropdown = dropdown.cloneNode(true);
  clonedDropdown.id = "edit-skill2";
  // clonedDropdown.onchange = function() {updateeditCharm(this.id, this.value)}
  editSkill2.appendChild(clonedDropdown);

  let editSkill1Level = document.getElementById("edit-level1-label");
  newSelect = document.createElement("select");
  newSelect.id = "edit-level1";
  createLevelRange(newSelect, 7, 0);
  editSkill1Level.appendChild(newSelect);

  let editSkill2Level = document.getElementById("edit-level2-label");
  newSelect = document.createElement("select");
  newSelect.id = "edit-level2";
  createLevelRange(newSelect, 7, 0);
  editSkill2Level.appendChild(newSelect);

  let editSlot1Level = document.getElementById("edit-slot1-label");
  newSelect = document.createElement("select");
  newSelect.id = "edit-slot1";
  createLevelRange(newSelect, 3, 0);
  editSlot1Level.appendChild(newSelect);

  let editSlot2Level = document.getElementById("edit-slot2-label");
  newSelect = document.createElement("select");
  newSelect.id = "edit-slot2";
  createLevelRange(newSelect, 3, 0);
  editSlot2Level.appendChild(newSelect);

  let editSlot3Level = document.getElementById("edit-slot3-label");
  newSelect = document.createElement("select");
  newSelect.id = "edit-slot3";
  createLevelRange(newSelect, 3, 0);
  editSlot3Level.appendChild(newSelect);
  // Save data object for later use
  skillList = data;
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
    newSkill.className = "skill";
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

// Renders all armor sets
function renderArmorSets(){
  // Render message if no results
  let msg = document.getElementById("no-results");
  if(armorList.length == 0){
    msg.style.display = "flex";
  } else{
    msg.style.display = "none";
  }

  for(let set of armorList){
    renderArmorSet(set["pieces"], set["totalSlots"], set["emptySlots"], armorList.indexOf(set))
  }
  // Change to render 20 at a time later
}

// Renders a set of armors and decoration slots
// Needs to be passed a set of armor names and decoration info
function renderArmorSet(armors, slotsTotal, slotsAvailable, index){
  // Create div
  let div = document.getElementById("results");
  // Create basic information to display
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

  // Create details button
  let buttonWrap = document.createElement("div");
  buttonWrap.className = "armor-piece"
  let detailButton = document.createElement("button");
  detailButton.innerText = "Details";
  detailButton.onclick = function() { renderArmorDetails(index) }
  // detailButton.className = "armor-piece";
  buttonWrap.appendChild(detailButton);
  newArmorSet.appendChild(buttonWrap);

  newArmorSet.style.backgroundColor = getAlternatingColor();
  // newArmorSet.style.backgroundColor = "rgba(5, 17, 242, 0.1)";

  counter++;
  div.appendChild(newArmorSet);
}

// Renders all charms
function renderCharms(){
  // Remove the old list
  let div = document.getElementById("charms-list");
  while(div.firstChild){
    div.removeChild(div.firstChild);
  }

  // Create each charm
  for(charm in charmList){
    let newCharm = document.createElement("div");
    newCharm.className = "charm-display";
    // Index
    let newIndex = document.createElement("p");
    newIndex.innerText = parseInt(charm)+1;
    newIndex.style.flex = "1";
    newCharm.appendChild(newIndex);

    // Skill 1
    let newSkill1 = document.createElement("p");
    newSkill1.style.flex = "3";
    if(charmList[charm]["skills"][0]){
      newSkill1.innerText = charmList[charm]["skills"][0]["name"] + " - Level " + charmList[charm]["skills"][0]["level"]
    } else { newSkill1.innerText = "---"}
    newCharm.appendChild(newSkill1);

    // Skill 2
    let newSkill2 = document.createElement("p");
    newSkill2.style.flex = "3";
    if(charmList[charm]["skills"][1]){
      newSkill2.innerText = charmList[charm]["skills"][1]["name"] + " - Level " + charmList[charm]["skills"][0]["level"]
    } else { newSkill2.innerText = "---"}
    newCharm.appendChild(newSkill2);

    // Slots
    let decos = [0,0,0];
    for(let lev of charmList[charm]["slots"]){
      decos[lev-1] += 1;
    }
    for(let i=0; i<3; i++){
      let newSlot = document.createElement("p");
      newSlot.style.flex = "1";
      newSlot.innerText = decos[i];
      newCharm.appendChild(newSlot);
    }
    // Append new charm to the div
    div.appendChild(newCharm);
  }
}

function renderArmorDetails(index){
  // Open the armor tab
  toggleArmorTab();

  // Clear the old set details and render the new one
  clearSetDetails();
  renderSetDetails(index);
}

function renderSetDetails(index){
  // Get set data
  let set = armorList[parseInt(index)];
  console.log(set)

  // Sort skills and decorations
  let skillScroll = document.getElementById("skills-col");
  for(let skill of Object.keys(set["skills"]).sort()){
    skillScroll.appendChild(createSkillPair(skill, set["skills"][skill]))
  }
  let decoScroll = document.getElementById("deco-col");
  for(let skill of Object.keys(set["decoList"]).sort()){
    decoScroll.appendChild(createSkillPair(skill, set["decoList"][skill]))
  }
  
  // Print out armor piece names
  let armorBox = document.getElementById("armor-col");
  armorBox.appendChild(createArmorPair(set["pieces"][0], "Head"));
  armorBox.appendChild(createArmorPair(set["pieces"][1], "Chest"));
  armorBox.appendChild(createArmorPair(set["pieces"][2], "Arms"));
  armorBox.appendChild(createArmorPair(set["pieces"][3], "Waist"));
  armorBox.appendChild(createArmorPair(set["pieces"][4], "Legs"));

  // Print out charm info
  let charmBox = document.getElementById("charm-col");
  if(set["charmIndex"] != "---"){
    let currCharmSkills = charmList[set["charmIndex"]]["skills"];
    for(let skill of currCharmSkills){
      let newDiv = document.createElement("div");
      newDiv.className = "set-armor";
  
      let newSkillName = document.createElement("p");
      newSkillName.innerText = skill["name"];
      newSkillName.className = "set-armor-base border-right-light";
      newSkillName.style.flex = "3";
  
      let newSkillLevel = document.createElement("p");
      newSkillLevel.innerText = skill["level"];
      newSkillLevel.className = "set-armor-base";
      newSkillLevel.style.flex = "1";
  
      newDiv.appendChild(newSkillName);
      newDiv.appendChild(newSkillLevel);
      charmBox.append(newDiv);  
    }
    // Add slot info
    let currCharmSlots = charmList[set["charmIndex"]]["slots"];
    let newDiv = document.createElement("div");
    newDiv.className = "set-armor";
    let newSlotName = document.createElement("p");
    newSlotName.innerText = "Slots";
    newSlotName.className = "set-armor-base border-right-light";
    newSlotName.style.flex = "3";
    newDiv.appendChild(newSlotName)
  
    for(let i=0; i<3; i++){
      if(i<currCharmSlots.length){
        let newSlotLevel = document.createElement("p");
        newSlotLevel.innerText = currCharmSlots[i];
        newSlotLevel.className = "set-armor-base";
        newSlotLevel.style.flex = "1";
        newDiv.appendChild(newSlotLevel)
      } else{
        let newSlotLevel = document.createElement("p");
        newSlotLevel.innerText = "---";
        newSlotLevel.className = "set-armor-base";
        newSlotLevel.style.flex = "1";
        newDiv.appendChild(newSlotLevel)
      }
    }
    charmBox.append(newDiv);
  }
}

// Clears resulting armor sets
function clearOldResults(){
  // Clear rendered sets
  let children = document.getElementsByClassName("armor-set");
  while(children.length > 0){
    children[0].remove();
  }
  armorList = [];
}

function clearSetDetails(){
  // Clear skill details
  let skills = document.getElementsByClassName("set-skill");

  while(skills.length > 0){
    skills[0].remove();
  }

  skills = document.getElementsByClassName("set-armor");

  while(skills.length > 0){
    skills[0].remove();
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
  // Toggle back to normal menu
  if(charmsOpen){
    toggleCharmTab();
  }
  if(armorOpen){
    toggleArmorTab();
  }

  // If this is the first search, we initialize armorsBySkill
  if(armorsBySkill == null){ setABS(); }

  // Init sets for matching armor piece names
  let matchingPieceList = getMatchingPieces();

  // Clear old results
  clearOldResults();

  // Add an empty charm to the list
  charmList.push(emptyCharm);

  // Get the weapon slots as our baseline
  let baseDecos = getWeaponDecos();

  // Brute force search every combination lol hopefully I find a better way later
  let count = 0;
  for(let head of matchingPieceList["head"].keys()){
    for(let chest of matchingPieceList["chest"].keys()){
      for(let arms of matchingPieceList["arms"].keys()){
        for(let waist of matchingPieceList["waist"].keys()){
          for(let legs of matchingPieceList["legs"].keys()){
            for(let charm in charmList){
              // Calculate the total skills this set will give
              let newSet = {
                //"pieces": [],
                "skills": {},
                "totalSlots": [...baseDecos],
                //"emptySlots": [],
                "decoList": {},
                //"charmIndex": 0
              }
              // newSet["totalSlots"] = [...baseDecos];

              for(let skill of armorPieces["head"][head]["skills"]){
                if(skill["name"] in newSet["skills"]){
                  newSet["skills"][skill["name"]] += skill["level"];
                }
                else{
                  newSet["skills"][skill["name"]] = skill["level"];
                }
              }
              for(let skill of armorPieces["chest"][chest]["skills"]){
                if(skill["name"] in newSet["skills"]){
                  newSet["skills"][skill["name"]] += skill["level"];
                }
                else{
                  newSet["skills"][skill["name"]] = skill["level"];
                }
              }
              for(let skill of armorPieces["arms"][arms]["skills"]){
                if(skill["name"] in newSet["skills"]){
                  newSet["skills"][skill["name"]] += skill["level"];
                }
                else{
                  newSet["skills"][skill["name"]] = skill["level"];
                }
              }
              for(let skill of armorPieces["waist"][waist]["skills"]){
                if(skill["name"] in newSet["skills"]){
                  newSet["skills"][skill["name"]] += skill["level"];
                }
                else{
                  newSet["skills"][skill["name"]] = skill["level"];
                }
              }
              for(let skill of armorPieces["legs"][legs]["skills"]){
                if(skill["name"] in newSet["skills"]){
                  newSet["skills"][skill["name"]] += skill["level"];
                }
                else{
                  newSet["skills"][skill["name"]] = skill["level"];
                }
              }
              for(let skill of charmList[charm]["skills"]){
                if(skill["name"] in newSet["skills"]){
                  newSet["skills"][skill["name"]] += parseInt(skill["level"]);
                }
                else{
                  newSet["skills"][skill["name"]] = parseInt(skill["level"]);
                }
              }

              // Calculate decoration slots
              for(let val of armorPieces["head"][head]["slots"]){ newSet["totalSlots"][val-1] += 1; }
              for(let val of armorPieces["chest"][chest]["slots"]){ newSet["totalSlots"][val-1] += 1; }
              for(let val of armorPieces["arms"][arms]["slots"]){ newSet["totalSlots"][val-1] += 1; }
              for(let val of armorPieces["waist"][waist]["slots"]){ newSet["totalSlots"][val-1] += 1; }
              for(let val of armorPieces["legs"][legs]["slots"]){ newSet["totalSlots"][val-1] += 1; }
              for(let val of charmList[charm]["slots"]){ newSet["totalSlots"][val-1] += 1; }

              // Compare to required criteria
              let decoCopy = [...newSet["totalSlots"]];
              let success = true;
              for(let skill of Object.keys(selectedSkills)){
                // If skill was set to 0 then it is no longer needed
                if(selectedSkills[skill] == 0){ continue; }

                // Runs when the current skills are not satisfactory
                if(!(skill in newSet["skills"]) || newSet["skills"][skill] < selectedSkills[skill]){
                  // Runs when decorations can fill the deficit
                  if(useDeco && skill in decoList){
                    // If the skill isn't in the set yet, add it
                    newSet["skills"][skill] = 0;
                    let deficit = selectedSkills[skill] - newSet["skills"][skill];
                    let deficitFilled = false;

                    // Try to insert decorations into a slot one at a time
                    while(deficit>0){
                      let slotWasFilled = false;
                      // Check if there are open slots available starting with the 'cheapest'
                      for(let cost=decoList[skill]; cost<=3; cost++){
                        // Slot can be filled
                        if(decoCopy[cost-1] > 0){
                          // Decrement from the available slots and deficit
                          decoCopy[cost-1] -= 1;
                          deficit -= 1;
                          // Increment our decoration counter
                          if(skill in newSet["decoList"]){ 
                            newSet["decoList"][skill] += 1; 
                          }
                          else{ newSet["decoList"][skill] = 1; }
                          slotWasFilled = true;
                          break;
                        }
                      }
                      // If no slots are available and deficit still exists, this set fails
                      if(!slotWasFilled){
                        break;
                      }
                      // Success check for this skill
                      if(deficit == 0){
                        // Add the selected skill to the current list and update the flag
                        newSet["skills"][skill] = selectedSkills[skill]
                        deficitFilled = true;
                        break; 
                      }
                    }

                    // Check for filled deficit
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
                if(charm == charmList.length-1) {
                  newSet["charmIndex"] = "---";
                } else{
                  newSet["charmIndex"] = parseInt(charm);
                }
                newSet["pieces"] = [head, chest, arms, waist, legs];
                newSet["emptySlots"] = decoCopy;
                armorList.push(newSet);

                if(count>searchCap){
                  window.alert("Over "+searchCap+"+ results for this search, please narrow the criteria!");
                  renderArmorSets();

                  // Remove empty charm from the list
                  charmList.pop();
                  return;
                }
              }
            }
          }
        }
      }
    }
  }
  renderArmorSets();

  // Remove empty charm from the list
  charmList.pop();
}

// Adds the new charm to the charm list
function addNewCharm(){
  let sk1 = document.getElementById("add-skill1").value;
  let sk2 = document.getElementById("add-skill2").value;
  let sk1level = document.getElementById("add-level1").value;
  let sk2level = document.getElementById("add-level2").value;
  let sl1 = parseInt(document.getElementById("add-slot1").value); //parse might be unnecessary
  let sl2 = parseInt(document.getElementById("add-slot2").value); //but just to be safe
  let sl3 = parseInt(document.getElementById("add-slot3").value);
  let newCharm = {
    "skills": [],
    "slots": [],
    "defense": 0
  };
  if(sk1 != "" && sk1level>0){
    let newSkill = {
      "name": sk1,
      "level": sk1level
    }
    newCharm["skills"].push(newSkill);
  }
  if(sk2 != "" && sk2level>0){
    let newSkill = {
      "name": sk2,
      "level": sk2level
    }
    newCharm["skills"].push(newSkill);
  }
  if(sl1>0){
    newCharm["slots"].push(sl1);
  }
  if(sl2>0){
    newCharm["slots"].push(sl2);
  }
  if(sl3>0){
    newCharm["slots"].push(sl3);
  }
  charmList.push(newCharm);
  renderCharms();
}

// Export charms to a JSON
function exportCharms(){
  let expString = JSON.stringify(charmList);
  let box = document.getElementById("export");
  box.textContent = expString;
}

// Import charms from text as JSON
function importCharms(){
  let textArea = document.getElementById("import");
  if(textArea.value == ""){ return; }
  try{
    let parsedText = JSON.parse(textArea.value);
    for(let charm of parsedText){
      if(!charm["skills"]){
        throw "Missing skills"
      }
      if(!charm["slots"]){
        throw "Missing slots"
      }
      charmList.push(charm);
    }
    renderCharms();
    textArea.value = "";
  } catch(err){
    window.alert("Invalid JSON string!\n"+err)
  }
}

// Toggles visibility of charm info
function toggleCharmTab(){
  // Flip flag
  charmsOpen = !charmsOpen;    

  let resultsSec = document.getElementById("results-section");
  let charmSec = document.getElementById("charms-section");
  let armorSec = document.getElementById("armor-section");
  // Render accordingly
  if(charmsOpen){
    armorOpen = false;
    // toggleButton.innerText = "Hide";
    resultsSec.style.display = "none";
    charmSec.style.display = "flex";
    armorSec.style.display = "none";
  } else{
    // toggleButton.innerText = "Show";
    resultsSec.style.display = "flex";
    charmSec.style.display = "none";
    armorSec.style.display = "none";
  }
}

// Toggles visibility of charm info
function toggleArmorTab(){
  // Flip flag
  armorOpen = !armorOpen;    

  let resultsSec = document.getElementById("results-section");
  let charmSec = document.getElementById("charms-section");
  let armorSec = document.getElementById("armor-section");
  // Render accordingly
  if(armorOpen){
    charmsOpen = false;
    // toggleButton.innerText = "Hide";
    resultsSec.style.display = "none";
    charmSec.style.display = "none";
    armorSec.style.display = "flex";
  } else{
    // toggleButton.innerText = "Show";
    resultsSec.style.display = "flex";
    charmSec.style.display = "none";
    armorSec.style.display = "none";
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

// Increments the slot level to from 0-3 (cyclicly)
function incrementSlot(elem){
  if(elem.innerText == "0"){
    elem.innerText = "1";
  } else if(elem.innerText == "1"){
    elem.innerText = "2";
  } else if(elem.innerText == "2"){
    elem.innerText = "3";
  } else if(elem.innerText == "3"){
    elem.innerText = "0";
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
  for(key of Object.keys(armorPieces["head"])){
    for(skill of armorPieces["head"][key]["skills"]){
      armorsBySkill["head"][skill["name"]].push(key);
    }
  }
  for(key of Object.keys(armorPieces["chest"])){
    for(skill of armorPieces["chest"][key]["skills"]){
      armorsBySkill["chest"][skill["name"]].push(key);
    }
  }
  for(key of Object.keys(armorPieces["arms"])){
    for(skill of armorPieces["arms"][key]["skills"]){
      armorsBySkill["arms"][skill["name"]].push(key);
    }
  }
  for(key of Object.keys(armorPieces["waist"])){
    for(skill of armorPieces["waist"][key]["skills"]){
      armorsBySkill["waist"][skill["name"]].push(key);
    }
  }
  for(key of Object.keys(armorPieces["legs"])){
    for(skill of armorPieces["legs"][key]["skills"]){
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

// Gets weapon decorations from the options buttons
function getWeaponDecos(){
  let btns = document.getElementsByName("weaponSlots");
  let ret = [0,0,0];
  for(let btn of btns){
    if(btn.innerText != "0"){
      ret[parseInt(btn.innerText)-1] += 1;
    }
  }
  return ret;
}

// Uses armorBySkill to get all pieces that match selectedSkills
function getMatchingPieces(){
  let ret = {
    "head": new Set(),
    "chest": new Set(),
    "arms": new Set(),
    "waist": new Set(),
    "legs": new Set()
  }
  
  // Add each required skill's pieces to the set by name
  // For each armor type (head, chest, ...)
  let realSearch = false;
  for(let key of Object.keys(ret)){
    // Add placeholder item (imitates an empty/unneeded piece)

    // For each armor skill in this armor piece
    for(let skill of Object.keys(selectedSkills)){
      // Check if the skill level has been set to 0
      if(selectedSkills[skill] != "0"){
        realSearch = true;
        // For each entry in the list of armor names
        for(let name of armorsBySkill[key][skill]){
          ret[key].add(name)
        }
      }
    }

    if(!realSearch){
      return ret;
    } else{
      ret["head"].add("---")
      ret["chest"].add("---");
      ret["arms"].add("---");
      ret["waist"].add("---");
      ret["legs"].add("---");
    }

    // Include slot-only armors if checked
    if(inclSlotArmors && realSearch){
      ret["head"].add("Skull")
      ret["chest"].add("Vaik");
      ret["arms"].add("Jyura");
      ret["waist"].add("Chrome Metal");
      ret["legs"].add("Arzuros");
    }
  }

  return ret;
}

function createSkillPair(name, level){
  let newSkill = document.createElement("div");
  newSkill.className = "set-skill";
  newSkill.style.backgroundColor = getAlternatingColor();
  let newSkillName = document.createElement("p");
  newSkillName.innerText = name;
  newSkillName.style.flex = "3";
  newSkillName.className = "set-skill-base";
  let newSkillLevel = document.createElement("p");
  newSkillLevel.innerText = level;
  newSkillLevel.style.flex = "1";
  newSkillLevel.className = "set-skill-base";
  newSkill.appendChild(newSkillName);
  newSkill.appendChild(newSkillLevel);
  return newSkill;
}

function createArmorPair(name, piece){
  let newPiece = document.createElement("div");
  newPiece.className = "set-armor";
  let newPieceName = document.createElement("p");
  newPieceName.innerText = piece;
  newPieceName.style.flex = "1";
  newPieceName.className = "set-armor-base border-right-light";
  let newPieceLevel = document.createElement("p");
  newPieceLevel.innerText = name;
  newPieceLevel.style.flex = "2";
  newPieceLevel.className = "set-armor-base";
  newPiece.appendChild(newPieceName);
  newPiece.appendChild(newPieceLevel);
  return newPiece;
}

// Returns one of two alternating background colors
// used for rendering rows
let getAlternatingColor = (function(){
  let counter = 0;
  return function(){
    counter++;
    if(counter%2==0){
      return "rgb(255, 199, 248, 0.15)";
      // newArmorSet.style.backgroundColor = "rgba(5, 17, 242, 0.1)";
    }
    else{
      return "rgb(255, 165, 243, 0.15)";
      // newArmorSet.style.backgroundColor = "rgba(191, 144, 4, 0.1)";
    }
  }
}());