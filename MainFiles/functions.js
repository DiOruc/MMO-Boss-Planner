//TOOD: Add jquery. - May not be necessary
//TODO: Pages: The main page that is currently being worked on. - This will be the only page
//TODO: Pages: Pick boss icon page (User may be able to pick their own image in the future) - Unsure
//TODO: pages: File explorer to find their own files (Perhaps just open the file explorer?) - Done
let numPhases = 1; //Number of phases. Defaults to 1.
let numSpells = 0; //Number of spells. defaults to 0. Becomes 1 during the onload function.
let latestSpell = 0; //TODO: Use this. Potentially not used. may not be used.
isBossSelected = false; //Is used to determine if a boss has been selected, or normal unit.
let currentlySelectedBoss = null; //is used to determine which boss has been selected.
let currentlySelectedTab = "spell0"; //Default tab that gets selected. Must always be a spell0.
//let currentlySelectedTab = ""; //Default tab that gets selected. Must always be a spell0.
let currentlySelectedImage; //The currently selected image for a unit. Boss images go here as well.
let phaseArrays = []; //An array which contains the arrays of objects for each phase. Contains a tabData array for each phase.
let tabs = []; //Contains every tab in a phase. Note: Deprecated.
let currentSpell = 0; //Currently selected spell.
let currentphase = 0; //Currently selectted phase.
let posyMinus = 0; // Used to account for user clicks.
let tabsData = []; //Contains every tab i a phase.
let hasScaled = 0; //Deprecated.
let holdingMode = false; //Used to determine if the user is going to be placing units or drag and drop them.
let heldUnit; // Used to determine which unit is held by the holdingMode.
let currentlySelectedUnit = null; //This is simply used to add custom colors to a unit button when it's

//for tabs
let currentTabIndex = 0; //May be used to avoid having to search for the current tab's index.

//For canvas
let heightPercent = window.innerHeight * 0.95; //These values are technically deprecated.
let widthPercent = window.innerWidth * 0.9; //These valuess are technically deprecated.
let requiredSetHeight = 0; //Used to determine how far the resize may go. Allows for user scrolling.
let requiredSetWidth = 0; //Used to determine how far the resize may go. Allows for user scrolling.
let objectPastWidth; //Deprecated
let objectPastHeight; //Deprecated
let canvasUnits = []; //The selected tab's array. This is primarily done to make it easier to work with the relevant array.
let unitID = 0; //A way to make it easy to get which unit is currently there. By all means, this one may be useless.
let isPaintingMode = false;
let paintingUnits = []; //An array of current strokes.
let latestUserMoves = [] //The latest moves done in a tab. This is here so the user can do a "ctrl-Z" function of their own.
let latestUndos = [] //Undo history, to make a redo history.
let latestUndoPainttype = [];
let moveTypes = {unitAddition : 1, drawStroke : 2}; //For the latestUserMoves

//Boss info
bossName = "NA!" //The values themselves are deprecated. But the variable is used.
phase = 1; //Deprecated
spell = "NA!" //Deprecated (?)


/* Phase functions start here */
/**************************************************** Phase Functions start here *****************************************************/

/**
 * @param {*} phase is the phase that has been selected. currentPhase is changed at the end. 
 * This function should only be called by "nextphase()" and "previousphase()", which calls currentPhase+1 or currentPhase-1, respectively.
 */
function selectPhase(upPhase){
    console.log("PHSE CHANGE");
    let phase = currentphase;
    console.log(upPhase);
    console.log(phase); 

    
    //Remove all tabs.
    for(i = 0; i < tabsData.length; i++){
        document.getElementById(tabsData[i].id).remove();
    }
    
    if(upPhase){
        ++phase;
    
        console.log(phaseArrays.length);
        if((phaseArrays.length-1) < phase){
            console.log((phaseArrays.length) + " Is smaller than " + phase);
            createPhase();
        }
        console.log("DOne with creating phase. length is now: "  + phaseArrays.length);
        
    }else{
        --phase;
    }

    let arrayIndex = findTabIndex(currentlySelectedTab);
    saveCanvasUnitsToTabsData(arrayIndex);
    saveCanvasStrokesToTabsData(arrayIndex);
    savePhaseTabsToPhase();
    console.log(phaseArrays);



    console.log(phaseArrays[phase]);
    //Add everything tabsData to phaseArray[currentPhase]
    phaseArrays[currentphase].splice(0, phaseArrays[currentphase].length);
    for(i = 0; i < tabsData.length; i++){
        phaseArrays[currentphase].push(tabsData[i]);
    }

    //import everything from phaseArrays[phase] to tabsData.
    currentphase = phase;

    //currentlySelectedTab = "spell0";
    tabsData.splice(0, tabsData.length);
    console.log(phase);
    console.log(phaseArrays[phase]);
    for(i = 0; i < phaseArrays[phase].length; i++){
        console.log(phaseArrays[phase]);
        console.log(phaseArrays[phase][i]);
        tabsData.push(phaseArrays[phase][i]);
    }
    console.log(tabsData);
    numSpells = 0;
    latestSpell = 0;

    canvasUnits.splice(0, canvasUnits.length);
    paintingUnits.splice(0, paintingUnits.length);
    //resizeCanvas();
    importTabsFromPhase(phase);
    selectTabFromPhaseFirstTime(tabsData[0].id);
    console.log("Selected spell0. Length is " + canvasUnits.length);
    //rePaintCanvas();
    //clearEntireCanvas();
    resizeCanvas();
    if(currentphase == 0){
        document.getElementById('prevPhaseButton').disabled=true;
        document.getElementById('prevPhaseButton').classList.add('bossButtonDisabled');
    }else{
        document.getElementById('prevPhaseButton').disabled = false;
        document.getElementById('prevPhaseButton').classList.remove('bossButtonDisabled');
    }

    document.getElementById('bossPhase').innerHTML= "Phase " + (phase+1);
    document.getElementById('phaseCounter').innerHTML = (currentphase + 1);
    //getUnitsFromTabsData

        //TODO: PHase counter affected
        //TODO: bossPhase affected       
}

/**
 * This function creates an empty array and pushes it to the phaseArray.
 * This only occurs if it doesn't have an array for this phase.
 */
function createPhase(){
    newArray = [];
    phaseArrays.push(newArray);
}

/**
 * Called by SelectPhase(phase). This function finds the current tab's index in tabsData.
 * It wipes the array at that index.
 * Finally, it fills the array with the new data in canvasUnits.
 */
function savePhaseTabsToPhase(){
    phaseArrays[currentphase].splice(0, phaseArrays[currentphase].length);
    for (i = 0; i<tabsData.length; i++){
        console.log(tabsData[i]);
        phaseArrays[currentphase].push(tabsData[i]);
    }
    phaseArrays[currentphase];
    console.log(phaseArrays[currentphase]);
}

function importTabsFromPhase(phase){
    if(tabsData.length > 0){
        for(i = 0; i < tabsData.length; i++){
            console.log("Importing tab " + i + " With length of " + tabsData[i].array.length);
            //++numSpells;
            const newSpell = document.createElement("button");
            const idToPass = tabsData[i].id;
    
            newSpell.classList.add('tab');
            newSpell.classList.add('megaText');
            newSpell.setAttribute('id',idToPass);
            newSpell.addEventListener('click', (e) =>{selectSpell(idToPass)});
            let spellNumber = 0;
            if(isNaN(tabsData[i].name)){
                spellNumber = document.createTextNode(tabsData[i].name);
            }else{
                spellNumber = document.createTextNode("spell " + tabsData[i].name);                
            }

            newSpell.appendChild(spellNumber);
            document.getElementById('tabSection').appendChild(newSpell)
    
            console.log("added spell " + numSpells);
            spellArray = [];
            tempStrokes = [];
            //tabsData.push(Spellobject)
            //++latestSpell;
    
            //TODO: Remove this.
            for(l = 0; l<tabsData.length; l++){
                console.log(tabsData[l]);
            }
        }
        let latestID = tabsData[(tabsData.length-1)].id.match(/\d+/)[0];
        numSpells = (++latestID);
        console.log(numSpells);
        latestSpell = (latestID+1);
    }else{
        addSpell();
    }

}

function selectTabFromPhaseFirstTime(spellID){
    latestUserMoves.splice(0, latestUserMoves.length);
    latestUndos.splice(0, latestUndos.length);

    let newArrayIndex = findTabIndex(spellID);
    console.log("Tabsdata = " + newArrayIndex);
    getUnitsFromTabsData(newArrayIndex);
    getStrokesFromTabsData(newArrayIndex);
    console.log("Size of the array after import is: " + canvasUnits.length);
    console.log("Size of strokes is now " + paintingUnits.length);

    console.log("Selected tab " + newArrayIndex);
    checkScaling();
    resizeCanvas(0,0);
    
    console.log("Selected " + spellID);
    console.log("Previous tab was" + currentlySelectedTab)
    document.getElementById(spellID).classList.add('selectedTab');
    currentlySelectedTab = spellID;
    currentTabIndex = newArrayIndex;
    document.getElementById('bossSpell').innerHTML = document.getElementById(spellID).innerHTML;
}

/**************************************************** Phase functions end here *******************************************************************/

/**************************************************** Tab functions start here *****************************************************/

/**
 * This function is used to add a new spell to the tabs.
 */
function addSpell(){
    ++numSpells;
    const newSpell = document.createElement("button");
    const idToPass = "spell"+latestSpell;

    newSpell.classList.add('tab');
    newSpell.classList.add('megaText');
    newSpell.setAttribute('id',idToPass);
    newSpell.addEventListener('click', (e) =>{selectSpell(idToPass)});
    
    const spellNumber = document.createTextNode("spell " + (latestSpell+1));
    newSpell.appendChild(spellNumber);
    document.getElementById('tabSection').appendChild(newSpell)

    console.log("added spell " + numSpells);
    spellArray = [];
    tempStrokes = [];
    const Spellobject = {id: idToPass, name: (latestSpell + 1), strokes: tempStrokes, array: spellArray};
    tabsData.push(Spellobject)
    ++latestSpell;

    //TODO: Remove this.
    for(l = 0; l<tabsData.length; l++){
        console.log(tabsData[l]);
    }
    selectSpell(tabsData[tabsData.length-1].id);
}

function addSpellAndChangeSpellName(){
    addSpell();
    makeDialogueDivs(1,true);
}

/**
 * This function is called when the user clicks on a tab.
 * @param {*} spellID: The new Spell ID.
 */
function selectSpell(spellID){
    if(spellID == currentlySelectedTab){
        changeSpellname();
    }
    else{
        latestUserMoves.splice(0, latestUserMoves.length);
        latestUndos.splice(0, latestUndos.length);
    }


        let arrayIndex = findTabIndex(currentlySelectedTab); //=  currentlySelectedTab.match(/\d+/);
        console.log("array index was: " + arrayIndex);
        console.log("length of the tabsData = " + tabsData.length);
        saveTabByIndex(arrayIndex);
    
        let newArrayIndex = findTabIndex(spellID);
        console.log("Tabsdata = " + newArrayIndex);
        getUnitsFromTabsData(newArrayIndex);
        getStrokesFromTabsData(newArrayIndex);
        console.log("Size of the array after import is: " + canvasUnits.length);
        console.log("Size of strokes is now " + paintingUnits.length);
    
        console.log("Selected tab " + newArrayIndex);
        checkScaling();
        resizeCanvas(0,0);
        
        console.log("Selected " + spellID);
        console.log("Previous tab was" + currentlySelectedTab)
        if(document.getElementById(currentlySelectedTab) != undefined){
            document.getElementById(currentlySelectedTab).classList.remove('selectedTab');
        }
        document.getElementById(spellID).classList.add('selectedTab');
        currentlySelectedTab = spellID;
        currentTabIndex = newArrayIndex;
        document.getElementById('bossSpell').innerHTML = document.getElementById(spellID).innerHTML;


}

function reSelectSpell(spellID){
    document.getElementById(spellID).classList.add('selectedTab');
    document.getElementById('bossSpell').innerHTML = document.getElementById(spellID).innerHTML;
    currentlySelectedTab = spellID;

    let newArrayIndex = findTabIndex(spellID);
    getUnitsFromTabsData(newArrayIndex);
    getStrokesFromTabsData(newArrayIndex);

    checkScaling();
    resizeCanvas(0,0);
    currentTabIndex = newArrayIndex;
}

function deleteSpell(){
    let spellName = document.getElementById(currentlySelectedTab).innerText; 
    console.log("Number of tabs is: " + tabs.length);
    if(numSpells>1){
        if(confirm('Are you sure you want to delete ' + spellName)){
            console.log(spellName);
            console.log("Confirmed!");
            let spellToBeDeleted = document.getElementById(currentlySelectedTab);
            spellToBeDeleted.remove();

            console.log("About to loop. Number of spells is : " + tabsData.length);
            for(l = 0; l<tabsData.length; l++){
                console.log(tabsData[l]);
            }
            console.log("ID is " + currentlySelectedTab);
            if(tabsData[0].id == currentlySelectedTab){
                tabsData.splice(0,1);
                loopArray();
                reSelectSpell(tabsData[currentSpell].id);
            }else{
                console.log("Deleting " + currentlySelectedTab);
                arrayIndex = findTabIndex(currentlySelectedTab);
                tabsData.splice(arrayIndex,1);
                console.log("About to select  " + (arrayIndex-1) + " Which is " + tabsData[(arrayIndex-1)].id);
                reSelectSpell(tabsData[(arrayIndex-1)].id);
            }
            --numSpells;
        }
    }else{
        window.alert("Can't delete now.\nMust always have at least 1 spell.")
    }
}


/**
 * This function is inteded to save the tab 
 */
function saveTabByID(tabID){
    let arrayIndex = findTabIndex(tabID);
    if(arrayIndex > -1){
        tabsData[arrayIndex].array.splice(0, tabsData[arrayIndex].array.length);
        saveCanvasUnitsToTabsData(arrayIndex)
    }
}
function saveTabByIndex(arrayIndex){
    if(arrayIndex > -1){
        tabsData[arrayIndex].array.splice(0, tabsData[arrayIndex].array.length);
        saveCanvasUnitsToTabsData(arrayIndex);
        tabsData[arrayIndex].strokes.splice(0, tabsData[arrayIndex].strokes.length);
        saveCanvasStrokesToTabsData(arrayIndex);
    }
}
function getUnitsFromTabsData(newArrayIndex){
    canvasUnits.splice(0, canvasUnits.length);
    for(i = 0; i<tabsData[newArrayIndex].array.length; i++){
        canvasUnits.push(tabsData[newArrayIndex].array[i]);
    }
}
function getStrokesFromTabsData(newArrayIndex){
    paintingUnits.splice(0, paintingUnits.length);
    for(i = 0; i<tabsData[newArrayIndex].strokes.length; i++){
        paintingUnits.push(tabsData[newArrayIndex].strokes[i]);
    }
}

/**
 * This function is inteded to find a a specific ID.
 * @param {*} idToSearchFor: The ID to search for.
 * @returns The index of the object with the desired ID
 */
function findTabIndex(idToSearchFor){
    let arrayIndex = -1;
    for(i = 0; i<tabsData.length; i++){
        if(tabsData[i].id==idToSearchFor){
            arrayIndex = i;
            break;
        }
    }
    return arrayIndex;
}


/**
 * This is a helper function for SaveTab in order to improve readability.
 * @param {*} arrayIndex: Which index to push data to 
 */
function saveCanvasUnitsToTabsData(arrayIndex){
    tabsData[arrayIndex].array.splice(0, tabsData[arrayIndex].array.length);
    for(i = 0; i < canvasUnits.length; i++){
        tabsData[arrayIndex].array.push(canvasUnits[i]);
    }
}

function saveCanvasStrokesToTabsData(arrayIndex){
    console.log(paintingUnits.length);
    tabsData[arrayIndex].strokes.splice(0, tabsData[arrayIndex].strokes.length);
    for(i=0; i < paintingUnits.length; i++){

        tabsData[arrayIndex].strokes.push(paintingUnits[i]);
    }
    console.log("DOne saving strokes. " + paintingUnits.length + " have been moved to tabsData, which is " + tabsData[arrayIndex].strokes.length);
    console.log(tabsData[arrayIndex].strokes[0]);
}

/**************************************************** Tab functions end here *****************************************************/



/**************************************************** Dialogue box functions start here *****************************************************/
/**
 * This function creates a div that covers the entire screen, with a dialogue box inside of it.
 * It should allow the user to change a boss's name.
 */
function changeBossName(){
    makeDialogueDivs(0);
}

/**
 * This function creates a div that covers the entire screen, with a dialogue box inside of it.
 * It should allow the user to change a spell's name.
 */
function changeSpellname(){
    makeDialogueDivs(1);
}


function makeDialogueDivs(dialogueInt, askToCopy){
    let dialogueText = "";
    if(dialogueInt == 0){
        dialogueText = "change boss name: ";
    } else if(dialogueInt == 1){
        dialogueText = "change spell name of " + document.getElementById(currentlySelectedTab).innerHTML + ": ";
    }

    const backgroundElement = document.createElement("div");
    backgroundElement.classList.add("inputDialogueBackground");
    backgroundElement.setAttribute('id', 'infoArea');
    
    const dialogueBox = document.createElement("div");
    dialogueBox.classList.add("inputDialogueBoxStyling")
    dialogueBox.classList.add("megaText")
    dialogueBox.classList.add("whiteText")

    const textForDialogueBox = document.createElement("p");
    const theTextItself = document.createTextNode(dialogueText)
    
    
    if(askToCopy){
        const copyKey = document.createElement("button")
        copyKey.classList.add("bossButton");

    }

    const inputElement = document.createElement("input");
    inputElement.setAttribute("type", "text");
    inputElement.classList.add("inputTextBox");
    inputElement.setAttribute('id', 'theBossNameInput');

    const buttonContainer = document.createElement("div");
    buttonContainer.style.width = "50%";
    buttonContainer.style.height = "10%";
    buttonContainer.style.marginLeft = "25%";


    const cancelKey = document.createElement("button")
    cancelKey.classList.add("bossButton");
    cancelKey.classList.add("cancelKey");
    cancelKey.style.margin="0";
    cancelKey.setAttribute('id', 'doneButCancel');

    const textForCancelKey = document.createTextNode("Cancel");

    const doneKey = document.createElement("button");
    doneKey.classList.add("bossButton");
    doneKey.classList.add("doneKey");
    doneKey.style.margin="0";
    doneKey.setAttribute('id', 'doneWithInput');

    const textForDoneKey = document.createTextNode("Done");



    cancelKey.addEventListener('click', (e) => (formDone(false)));
    doneKey.addEventListener('click', (e) => (formDone(true,dialogueInt)));

    backgroundElement.appendChild(dialogueBox);
    dialogueBox.appendChild(textForDialogueBox);
    textForDialogueBox.appendChild(theTextItself);
    dialogueBox.appendChild(inputElement);
    dialogueBox.appendChild(buttonContainer);
    
    buttonContainer.appendChild(cancelKey);
    cancelKey.appendChild(textForCancelKey);
    buttonContainer.appendChild(doneKey);
    doneKey.appendChild(textForDoneKey);


    document.body.appendChild(backgroundElement);

    inputElement.addEventListener('keyup', function(event){
        event.preventDefault();
        if(event.key==="Enter"){
            document.getElementById('doneWithInput').click();
        }else if(event.key==="Escape"){
            document.getElementById('doneButCancel').click();
        }
    })
}

/**
 * This is a function which is only called by makeDialogueDivs().
 * This closes the makeDialogueDivs' divs.
 * @param {*} toComplete: A boolean which is used to determine if a name change should occur.
 * @param {*} divsToChange: An integer value, which determines which divs are going to be changed.
 */
//TODO: Add a isBoss variable. If not, it's a name change. Combines these functions.
function formDone(toComplete, divsToChange){
    if (toComplete){
        let bossName = "";
        switch(divsToChange){
            case 0:
                bossName = document.getElementById('theBossNameInput').value;
                document.getElementById("bossNameInfo").innerHTML = bossName
                document.getElementById('bossName').innerHTML = bossName;
                break
            case 1:
                let arrayIndex = findTabIndex(currentlySelectedTab);
                bossName = document.getElementById('theBossNameInput').value;
                document.getElementById("bossSpell").innerHTML = bossName
                document.getElementById(currentlySelectedTab).innerHTML = bossName;
                tabsData[arrayIndex].name=bossName;                
        }
    }
    const toDelete = document.getElementById('infoArea');
    toDelete.remove();
}


function copyFromOtherTabs(){
    let dialogueText = "Copy the layout from another spell";

    const backgroundElement = document.createElement("div");
    backgroundElement.classList.add("inputDialogueBackground");
    backgroundElement.setAttribute('id', 'infoArea');
    
    const dialogueBox = document.createElement("div");
    dialogueBox.style.height="35vh";
    dialogueBox.classList.add("inputDialogueBoxStyling")
    dialogueBox.style.paddingTop = "1vh";
    dialogueBox.classList.add("megaText")
    dialogueBox.classList.add("whiteText")

    const textForDialogueBox = document.createElement("p");
    textForDialogueBox.style.marginBottom="30px";
    const theTextItself = document.createTextNode(dialogueText)
    backgroundElement.appendChild(dialogueBox);
    textForDialogueBox.appendChild(theTextItself);
    dialogueBox.appendChild(textForDialogueBox);

    const containerForOptions = document.createElement("div");
    containerForOptions.classList.add("fillP90");
    containerForOptions.style.height = "75%";
    containerForOptions.style.marginLeft="5%";
    containerForOptions.style.overflow= "auto";
    containerForOptions.style.backgroundColor = "black";

    dialogueBox.appendChild(containerForOptions);


    
    let arrayIndex = findTabIndex(currentlySelectedTab);
    
    //TODO: Make it work with other phases.
    /*
    for(i = 0; i <  phaseArrays.length; i++){
        for(j = 0; j < phaseArrays[i].length; j++){
            const selectableOption = document.createElement("button");
            selectableOption.classList.add("bossButton");
            selectableOption.style.height = "40px";
            selectableOption.classList.add("fillP50");
            selectableOption.style.marginRight = "25%";
            selectableOption.style.marginLeft = "25%";
            const phaseToSend = i;
            const indexToSend = j;
            selectableOption.addEventListener('click', (e) => copyATab(phaseToSend, indexToSend));
            const selectableOptionName = document.createTextNode("Phase: " + (i+1) + " Spell: " + phaseArrays[i][j].name);

            selectableOption.appendChild(selectableOptionName);
            containerForOptions.appendChild(selectableOption);
                console.log(phaseArrays[i][j].name);
        }
    }*/
    arrayIndex = findTabIndex(currentlySelectedTab);
    for(i = 0; i <  tabsData.length; i++){
        console.log(arrayIndex +  " vs " + i )
        if(i != arrayIndex){
            console.log(tabsData);
            console.log(tabsData[i]);
                console.log(tabsData);
                const selectableOption = document.createElement("button");
                selectableOption.classList.add("bossButton");
                selectableOption.style.height = "40px";
                selectableOption.classList.add("fillP50");
                selectableOption.style.marginRight = "25%";
                selectableOption.style.marginLeft = "25%";
                const indexToSend = i;
                selectableOption.addEventListener('click', (e) => copyATab_temp(indexToSend));
                const selectableOptionName = document.createTextNode(" Spell: " + tabsData[i].name);
                
    
                selectableOption.appendChild(selectableOptionName);
                containerForOptions.appendChild(selectableOption);        
            
        }

                //console.log(phaseArrays[i][j].name);
        
    }

    const cancelKey = document.createElement("button")
    cancelKey.classList.add("bossButton");
    cancelKey.classList.add("cancelKey");
    cancelKey.style.width="20%";
    cancelKey.style.height="10%";
    cancelKey.style.margin="0";
    cancelKey.style.marginLeft="40%";
    cancelKey.style.marginRight="40%";
    cancelKey.setAttribute('id', 'doneButCancel');
    cancelKey.addEventListener('click', (e) => (formDone(false)));
    const textForCancelKey = document.createTextNode("Cancel");
    cancelKey.appendChild(textForCancelKey);
    dialogueBox.appendChild(cancelKey);

    document.body.appendChild(backgroundElement);

    

}

function copyATab(phase, index){

}

function copyATab_temp(index){
    latestUserMoves.splice(0, latestUserMoves.length);
    latestUndos.splice(0, latestUndos.length);
    console.log(index);
    console.log(tabsData);
    arrayIndex = findTabIndex(currentlySelectedTab);
    if(confirm("Do you want to delete the contents in current spell? \nkeeping them is Experimental")){
    
    canvasUnits.splice(0, canvasUnits.length);
    paintingUnits.splice(0, paintingUnits.length);
    clearEntireCanvas();
    
    }
    for(i = 0; i<tabsData[index].array.length; i++){
        canvasUnits.push(tabsData[index].array[i]);
    }
    for(i = 0; i<tabsData[index].strokes.length; i++){
        paintingUnits.push(tabsData[index].strokes[i]);
    }

    resizeCanvas();

    formDone(false);
}

/**************************************************** Dialogue box functions End here *****************************************************/


/**************************************************** Side-bar functions Start here *****************************************************/

/**
 * This function's purpose is to remove the disabling of the boss button.
 * @param {*} src: The relative path to the boss.
 * Unlike the standard units, this function gets the "full" relative path, and not just the file name.
 * This is because I intend to add custom boss images as a function for users. 
 */
function selectBoss(src){
    document.getElementById('bossButton').disabled=false;
    document.getElementById('bossButton').classList.remove('bossButtonDisabled');
    document.getElementById('bossButtonImage').src=src;
    currentlySelectedBoss=src;
    holdBoss();
    cycleBossButtonDisplay();
}

/**
 * This function shows and hides the boss selection tab.
 */
function cycleBossButtonDisplay(){
    if(document.getElementById('bossIconsButton').classList.contains('hiddenBossIcons')){
        document.getElementById('bossIconsButton').classList.remove('hiddenBossIcons');
        document.getElementById('bossIconsButton').classList.add('displayedBossIcons');
    }else{
        document.getElementById('bossIconsButton').classList.remove('displayedBossIcons');
        document.getElementById('bossIconsButton').classList.add('hiddenBossIcons');
    }
}

/**
 * This function is used during selectBoss(src). It sets certain parameters that holdUnit(image) does not.
 */
function holdBoss(){
    //document.getElementById('NavBarUndoPaintStroke').classList.add('hiddenButton');
    //document.getElementById("NavBarUndoUnit").classList.remove('hiddenButton');
    isPaintingMode = false;
    document.getElementById('canvasSection').classList.remove("beforeHolding");
    document.getElementById('canvasSection').classList.remove("whileHolding");
    clearSelectedUnit("bossButton");
    if(posyMinus == 0){
        posyMinus = 300;
    }
    isBossSelected = true;
    currentlySelectedImage = currentlySelectedBoss
    console.log("SELECTED " + currentlySelectedBoss);
}

/**
 * This function is used to tell which image is currently going to be used when the user clicks/ taps on the canvas.
 * @param {*} image : The unit image.
 */
function holdUnit(image){
    //document.getElementById('NavBarUndoPaintStroke').classList.add('hiddenButton');
    //document.getElementById("NavBarUndoUnit").classList.remove('hiddenButton');
    isPaintingMode = false;
    clearSelectedUnit(image.substr(0, image.length-4) + "UnitButton");
    document.getElementById('canvasSection').classList.remove("beforeHolding");
    document.getElementById('canvasSection').classList.remove("whileHolding");
    if(posyMinus == 0){
        posyMinus=100;
    }
    if(isBossSelected == true){
        posyMinus = posyMinus-300;
    }
    currentlySelectedImage = image;
    isBossSelected = false;   
}

/**
 * This function initiate the drag and drop functionality.
 */
function selectMoving(){
    //document.getElementById('NavBarUndoPaintStroke').classList.add('hiddenButton');
    //document.getElementById("NavBarUndoUnit").classList.remove('hiddenButton');
    isPaintingMode = false;
    currentlySelectedImage = null;
    clearSelectedUnit("MovingUnitButton");
    holdingMode = true;
    document.getElementById('canvasSection').classList.add("beforeHolding");
}

function toggleDrawingModeOn(bool){
    clearSelectedUnit("DrawingModeToolButton");
    //document.getElementById("NavBarUndoUnit").classList.add('hiddenButton');
    //document.getElementById('NavBarUndoPaintStroke').classList.remove('hiddenButton');
    if(bool){
        holdingMode = false;
        currentlySelectedImage=null;
        isPaintingMode = true;
    }else{
        isPaintingMode = false;
    }
}

//TODO: DEPRECATED
function toggleDrawingModeOff(){
    isPaintingMode = false;

    document.getElementById('canvasSection').removeEventListener('mousedown', (e) => {
        console.log("HEY");
        var rect = e.target.getBoundingClientRect();
        var x = e.clientX - rect.left; //x position within the element.
        var y = e.clientY - rect.top;  //y position within the element.
        isPainting = true;
        startX = x;
        startY = y;
    });
    document.getElementById('canvasSection').removeEventListener('mouseOver', (e)  =>{
        console.log("DONE!")
        var rect = e.target.getBoundingClientRect();
        var x = e.clientX - rect.left; //x position within the element.
        var y = e.clientY - rect.top;  //y position within the element.
        isPainting = false;
        ctx.stroke();
        ctx.beginPath();
    });
    document.getElementById('canvasSection').removeEventListener('mousemove', draw);

}

function erease(){
    console.log("POP!");
    paintingUnits.pop();
    resizeCanvas()
    //rePaintCanvas;
}

function ereaseUnit(){
    canvasUnits.pop();
    resizeCanvas();
}

/**
 * This button changes an element's class in order to make it clear which unit has been selected.
 * @param {*} idOfUnit: The ID OF the unit that will be modified.
 */
function clearSelectedUnit(idOfUnit){
    console.log(idOfUnit);
    if(currentlySelectedUnit != null || currentlySelectedUnit != undefined){
        if(currentlySelectedUnit == "bossButton"){
            document.getElementById('bossButton').classList.add('bossButton');
            document.getElementById("bossButton").classList.remove('bossButtonSelected');
        }else{
            document.getElementById(currentlySelectedUnit).classList.remove('selectedUnit');
            document.getElementById(currentlySelectedUnit).classList.add('unit');
        }

    }
    if(idOfUnit == "bossButton"){
        document.getElementById("bossButton").classList.add('bossButtonSelected');
        document.getElementById('bossButton').classList.remove('bossButton');

    }else{
        document.getElementById(idOfUnit).classList.add('selectedUnit');
        document.getElementById(idOfUnit).classList.remove('unit');
    }

    currentlySelectedUnit=idOfUnit;
}

function clearEntireCanvas(){
    latestUserMoves.splice(0, latestUserMoves.length);
    latestUndos.splice(0, latestUndos.length);
    paintingUnits.splice(0, paintingUnits.length);
    canvasUnits.splice(0, canvasUnits.length);
    requiredSetHeight = 0;
    requiredSetWidth = 0;
    //checkScaling()
    resizeCanvas();
}

/**************************************************** Side-bar functions End here *****************************************************/


/**************************************************** Unit/Canvas functions Start here *****************************************************/

/**
 * This function places a unit at a specific spot on the canvas.
 * Should only be used when a user clicks on the canvas, and it holds an unit (Boss or standard unit).
 * @param {*} posX: The X coordinates relative to the div.
 * @param {*} posY: The Y coordinates relative to the div.
 */
function placeUnit(posX, posY){
    console.log(posyMinus);
    
    var canvasSection = document.getElementById("canvasSection");
    var ctx = canvasSection.getContext("2d");
    unit_image = new Image();

    if(isBossSelected){
        unit_image.src = currentlySelectedBoss;
        unit_image.width=800;
        unit_image.height=800;
        posY = posY-100;
        posX = posX-80;
        if(requiredSetWidth<(posX+600)){
            requiredSetWidth = (posX+600);
        }
        if(requiredSetHeight<(posY+600)){
            requiredSetHeight = (posY+600);
        }

        let unitObject = {id: unitID, isBoss: true, imgSrc: currentlySelectedBoss, posx: posX, posy: posY};
        canvasUnits.push(unitObject);
    }else{
        unit_image.src = 'PNGs/ForCanvas/' + currentlySelectedImage;
        unit_image.width=100;
        unit_image.height=100;
        posX = posX-50;
        posY = posY-50;
        if(requiredSetWidth<(posX+100)){
            requiredSetWidth = (posX+100);
        }
        if(requiredSetHeight<(posY+100)){
            requiredSetHeight = (posY+100);
        }
        let unitObject = {id: unitID, isBoss: false, imgSrc: 'PNGs/ForCanvas/' + currentlySelectedImage, posx: posX, posy: posY};
        canvasUnits.push(unitObject);
    }
    latestUserMoves.push(moveTypes.unitAddition);
    ++unitID;
    iterateUnits();    

    ctx.imageSmoothningEnabled=false;
    unit_image.onload = function(){
        console.log(posX);
        console.log(posY);
        //ctx.drawImage(unit_image, 0, 0, 100, 100);
        ctx.drawImage(unit_image, 0, 0, 600,600, posX,posY, this.width, this.height);
    console.log("ready");
    }
}


/**
 * This function is meant to find the nearest unit to the mouse click.
 * It removes the unit from the array, clears the area around the mouse click, and finally repaints the entire canvas in case of overlapping.
 * This allows the user move units around 
 * @param {*} x: The X coordinates relative to the div. 
 * @param {*} y: The Y coordinates relative to the div.
 * 
 */
function holdMoving(x, y ){
    //x = x+50;
    //x = y+50;
    let xFound = - 1;
    let yFound = - 1;
    console.log(canvasUnits.length);
    for (i = 0; i<canvasUnits.length;i++){
        const objectX = canvasUnits[i].posx;
        const objectY  = canvasUnits[i].posy;
        //console.log(canvasUnits[i]);
        console.log("at x:" + x + " y:" + y + " Checking x:" + objectX +  " y:" + objectY);
        if((x - objectX) > -100 && (x-objectX) < 100){
            xFound = i;
            console.log("Found a potential match. x-objectX = " + (x-objectX))
            if((y - objectY) > -100 && (y-objectY) < 100){
                console.log("Another part matched. y-objectY = " + (y-objectY));
                yFound = i;
                console.log("FOUND");
                break
            } 
        }
    }
    console.log("Done with the loop");
        if(xFound !=-1){
            if(yFound != -1){
                if(xFound == yFound){
                    console.log("About to remove the unit");
                    document.getElementById('canvasSection').classList.remove("beforeHolding");
                    document.getElementById('canvasSection').classList.add("whileHolding");
                    heldUnit = canvasUnits[xFound];
                    var canvasSection = document.getElementById("canvasSection");
                    var ctx = canvasSection.getContext("2d");
                    if(heldUnit.isBoss){
                        ctx.clearRect(heldUnit.posx,heldUnit.posy, 200, 200 );
                    }else{
                        ctx.clearRect(heldUnit.posx,heldUnit.posy, 100, 100 );
                    }
                    canvasUnits.splice(xFound,1);
                    rePaintCanvas();
                    console.log("Removed the image. Canvas units is now: " + canvasUnits.length);
                }
            }
        }
}

/**
 * This function happens after holdMoving(x,y).
 * It drops a unit where the user click on the canvas.
 * @param {*} x 
 * @param {*} y 
 */
function releaseMoving(x, y){
    console.log("Releasing!");
    document.getElementById('canvasSection').classList.remove("whileHolding");
    document.getElementById('canvasSection').classList.add("beforeHolding");
    
    var canvasSection = document.getElementById("canvasSection");
    var ctx = canvasSection.getContext("2d");

    let image  = new Image();
    image.src = heldUnit.imgSrc;
    if(heldUnit.isBoss){
        image.width=800;
        image.height=800;
        y=y-100;
        x=x-80;
        console.log("posy was : " + heldUnit.posy);
        heldUnit.posy=y;
        heldUnit.posX=x;
        console.log("posy is now: " + heldUnit.posy);
        if(requiredSetWidth<(x+600)){
            requiredSetWidth = (x+600);
        }
        if(requiredSetHeight<(y+600)){
            requiredSetHeight = (y+600);
        }
    }else{
        image.width=100;
        image.height=100;
        x=x-50;
        y=y-50;
        console.log("posy was : " + heldUnit.posy);
        heldUnit.posy=y;
        heldUnit.posX=x;
        console.log("posy is now: " + heldUnit.posy);

        if(requiredSetWidth<(x+100)){
            requiredSetWidth = (x+100);
        }
        if(requiredSetHeight<(y+100)){
            requiredSetHeight = (y+100);
        }
    }
    let newHeldUnit = {id: heldUnit.id, isBoss: heldUnit.isBoss, imgSrc: heldUnit.imgSrc, posx: x, posy: y};
    image.onload = function(){
        ctx.drawImage(image, 0, 0, 600, 600, x, y, this.width, this.height)
    }
    canvasUnits.push(newHeldUnit);
    heldUnit = null;
    
    for(i = 0; i<canvasUnits.length; i++){
        console.log(canvasUnits[i]);
    }
}

/**
 * 
 * @param {*} x: Start posiition X 
 * @param {*} y: Start position Y.
 */
function draw(x, y){

}

function stopDrawing(){
    var canvasSection = document.getElementById("canvasSection");
    var ctx = canvasSection.getContext("2d");
    ctx.
    ctx.stroke();
    ctx.beginPath();
}



function rePaintCanvas(){
    var canvasSection = document.getElementById("canvasSection");
    var ctx = canvasSection.getContext("2d");
    var posX = 0;
    var posY = 0;

    //For strokes
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    console.log("About to repaint. Length is "  + paintingUnits.length);
    for(i = 0; i < paintingUnits.length; i++){
        
        console.log(paintingUnits[i]);
        ctx.strokeStyle=paintingUnits[i].color;
        console.log(paintingUnits[i]);
        for(j = 1; j < paintingUnits[i].stroke.length; j++){
            console.log("PAINTED");
            //console.log(paintingUnits[i][j]);
            //console.log("Painting unit object x : " + paintingUnits[i][j].x);
            //ctx.strokeStyle=paintingUnits[i][j].color
            ctx.beginPath();
            ctx.moveTo(paintingUnits[i].stroke[j-1].x, paintingUnits[i].stroke[j-1].y);
            ctx.lineTo(paintingUnits[i].stroke[j].x, paintingUnits[i].stroke[j].y);
            ctx.stroke();
            ctx.beginPath();
        }
    }


    //For units
    let posImage = [];
    console.log("REDRAWING ARRAY WITH LENGTH OF : " + canvasUnits.length);
    posImage.length = canvasUnits.length;
    for(i = 0; i<canvasUnits.length; i++){
        console.log("Posx = " + canvasUnits[i].posx);
        console.log("Posy = " + canvasUnits[i].posy);
        
        posImage[i] = new Image();
        console.log(posX);
        console.log(posY);
        posImage[i].src = canvasUnits[i].imgSrc;

        if(canvasUnits[i].isBoss){
            console.log("On a boss unit");
            posImage[i].width=800;
            posImage[i].height=800;
        }else{
            console.log("NOT on a boss unit");
            posImage[i].width=100;
            posImage[i].height=100;
        }
        posImage[i].dx=canvasUnits[i].posx;
        posImage[i].dy=canvasUnits[i].posy;

        ctx.imageSmoothningEnabled=false;
        posImage[i].onload = function(i){
            ctx.drawImage(posImage[i], 0, 0, 600,600, posImage[i].dx, posImage[i].dy, posImage[i].width, posImage[i].height);
            console.log("Drawn image");
        }.bind(this, i);
    }
}

/**
 * This function goes through the canvasunits array.
 * It sets the required height and width for the canvas.
 * This should make it possible to scroll to the units, regardless of monitor resolution
 */
function checkScaling(){
    requiredSetHeight = 0;
    requiredSetWidth = 0;
        for(i = 0; i < canvasUnits.length; i++){
                if(canvasUnits[i].isBoss){

                    if((canvasUnits[i].posy+200) > requiredSetHeight){
                        requiredSetHeight = (canvasUnits[i].posy + 200);
                    }
                    if((canvasUnits[i].posx + 200) > requiredSetWidth){
                        requiredSetWidth = (canvasUnits[i].posx + 200);
                    }

                }else{
                    if((canvasUnits[i].posy + 100) > requiredSetHeight){
                        requiredSetHeight = (canvasUnits[i].posy + 100);
                    }

                    if((canvasUnits[i].posx + 100) > requiredSetWidth){
                        requiredSetWidth = (canvasUnits[i].posx+100);
                    }
                }
                console.log("Done with this loop. Biggestwidth = " + requiredSetWidth + " And biggest height is " + requiredSetHeight);
        }

}

function resizeCanvas(x, y){
    console.log("In resize canvas. Got " + x + " AND " + y);
    heightPercent = document.getElementById('containerForCanvas').offsetHeight;
    widthPercent = document.getElementById('containerForCanvas').offsetWidth;
    if(requiredSetHeight > heightPercent){
        console.log(requiredSetHeight + " Is tallr than " + heightPercent)
        heightPercent = requiredSetHeight;
    }
    if(requiredSetWidth > widthPercent){
        console.log(requiredSetWidth + " Is wider than " + widthPercent)
        widthPercent = requiredSetWidth;
    }
    console.log("Required height is : " + requiredSetHeight);
    console.log("Canvas height is : " + heightPercent);
    console.log("Required width is: " + requiredSetWidth);
    console.log("Canvas width is: " + widthPercent);

    console.log("event resize")
    var canvasSection = document.getElementById("canvasSection");
    var ctx = canvasSection.getContext("2d");
    ctx.canvas.width=widthPercent;
    ctx.canvas.height=heightPercent;
    rePaintCanvas()
}


function undoLatestMove(){
    let latestMove = latestUserMoves.pop();
    if(latestMove == undefined){
        return;
    }else{
        console.log("UNDO!")
        let tempUndoData;
        let undoType;
        switch (latestMove){
            case moveTypes.unitAddition:
                 tempUndoData = canvasUnits.pop();
                 undoType = {undoType: moveTypes.unitAddition, unitData: tempUndoData};
                latestUndos.push(undoType);
                break
            case moveTypes.drawStroke:
                tempUndoData = paintingUnits.pop();
                undoType = {undoType: moveTypes.drawStroke, unitData: tempUndoData};
                latestUndos.push(undoType);
                console.log(latestUndos[latestUndos.length-1]);
        }
        resizeCanvas();
    }
}

function redoLatestMove(){
    let latestUndo = latestUndos.pop();
    if(latestUndo == undefined){
        return;
    }
    else{
        switch(latestUndo.undoType){
            case moveTypes.unitAddition:
                console.log("Unit!");
                canvasUnits.push(latestUndo.unitData);
                latestUserMoves.push(moveTypes.unitAddition);///
                break
            case moveTypes.drawStroke:
                console.log("DRAWSTROKE");
                paintingUnits.push(latestUndo.unitData);
                latestUserMoves.push(moveTypes.drawStroke);
                break
        }
        resizeCanvas();
    }
}

/**
 * This function handles keybinds and shortcuts that are used in general. This does NOT include keybinds for naming tabs etc.
 * @param {*} e : Input to handle. 
 */
function shortcutHandling (e){
    console.log("HERE" + e.keyCode);
    
    switch (e.keyCode){
        case 90: //Button "z";
            undoLatestMove();
            break;    
        case 49: //Button 1
            holdUnit("MainTank.png");
            break;
        case 50: //Button 2
            holdUnit("OffTank.png");
            break;
        case 51: //Button 3
            holdUnit("Tank.png");
            break;
        case 52: //Button 4
            holdUnit("CDPS.png");
            break;
        case 53: //Button 5
            holdUnit("RDPS.png");
            break;
        case 81: //Button q
            holdUnit("Healer.png");
            break;
        case 87: //Button w
            holdUnit("MeeleeStack.png");
            break;
        case 69: // Button e
            holdUnit("HealersStack.png");
            break;
        case 82: //Button r
            holdUnit("RangesStack.png");
            break;
        case 65: //button a
            holdUnit("RangesAndHealersStack.png");
            break;
        case 83: //button s
            holdUnit("AllStack.png");
            break;
        case 68: //Button d
            selectMoving();
            break;
        case 70: //Button f
            toggleDrawingModeOn(true);
            break;
        case 71: //button g
            clearEntireCanvas();
            break;
        case 89: //button y
            redoLatestMove();
            break;
        }
        
        
}
/**************************************************** Unit/canvas functions end here *****************************************************/

function getBossInfo(){
//TODO: Make this the import function.
}















/**************************************************** Logging and debugging functions Start here *****************************************************/

/**
 * As the name implies. It goes through the units that are currently in the canvasUnits array.
 * Should only be used during debugging and testing.
 */
function iterateUnits(){
    console.log("Will now go through units")
    for(i = 0; i<canvasUnits.length; i++){
        console.log("unit " + i);
        console.log(canvasUnits[i].id);
        console.log(canvasUnits[i].isBoss);
        console.log(canvasUnits[i].imgSrc);
        console.log(canvasUnits[i].posx);
        console.log(canvasUnits[i].posy);
    }
    console.log("Done looping");
}

/**
 * Old function. tabs is no longer used.
 * It is simply there because I am uncertain if I will reuse tabs at some point.
 */
function loopArray(){
    for(i = 0; i < tabs.length; i++){
        console.log("i is: " + tabs[i]);
    }
}



/**************************************************** Logging and debugging functions End here *****************************************************/


/**************************************************** File manipulation functions start here *****************************************************/

function createJsonFile(){

    for(i = 0; i < tabsData.length; i++){
        console.log(tabsData[i]);
    }

    let arrayIndex = findTabIndex(currentlySelectedTab);
    saveCanvasUnitsToTabsData(arrayIndex);
    saveCanvasStrokesToTabsData(arrayIndex);
    savePhaseTabsToPhase();
    convertedArray = JSON.stringify(phaseArrays);
    console.log(convertedArray);
    nameOfFile = document.getElementById('bossNameInfo').innerHTML;

    var a = document.createElement("a");
    var file = new Blob([convertedArray], {type: 'json'});
    a.href = URL.createObjectURL(file);
    a.download = nameOfFile+".txt";
    a.click();
    URL.revokeObjectURL(a.href);
    a.remove();
}

async function getJsonFile(file){
    console.log(file);
    console.log(file.name);
    if(file.name.substr((file.name.length-4)) == ".txt"){
        console.log("YEES. It is!" + file.name.substr((file.name.length-4)));
        // let reader = new FileReader();
        //reader.readAsText(file, "UTF-8");
        const text = await file.text();
        const convertedText  = JSON.parse(text);
        console.log(convertedText.length);
        phaseArrays.splice(0,phaseArrays.length);
        console.log("BEFORE IMPORTING: " + phaseArrays.length);
        for(i = 0; i < convertedText.length; i++){
            //console.log(convertedText[i]);
            //if(convertedText[i][0] != undefined){
            //    createPhase();
            //}
            createPhase();
            for(j = 0; j < convertedText[i].length; j++){
                //This is here because something went weird with the conversion, and this weeds it out.
                if(convertedText[i][j] != undefined){
                    console.log(convertedText[i][j]);
                    phaseArrays[i].push(convertedText[i][j]);
                }

            }
        }

        console.log("DONE IMPORTING");
        console.log(phaseArrays.length);
        for(i  = 0; i < phaseArrays.length; i++){
            console.log(phaseArrays[i])
        }
        

        console.log("PHSE CHANGE");
        let phase = 0;
        
        //Remove all tabs.
        for(i = 0; i < tabsData.length; i++){
            document.getElementById(tabsData[i].id).remove();
        }
    
    
        console.log(phaseArrays[phase]);
        //Add everything tabsData to phaseArray[currentPhase]
    
        //import everything from phaseArrays[phase] to tabsData.
        tabsData.splice(0, tabsData.length);
        for(i = 0; i < phaseArrays[phase].length; i++){
            tabsData.push(phaseArrays[phase][i]);
        }
        numSpells = 0;
        latestSpell = 0;
    
        canvasUnits.splice(0, canvasUnits.length);
        paintingUnits.splice(0, canvasUnits.length);
        //resizeCanvas();
        importTabsFromPhase(phase);
        //selectTabFromPhaseFirstTime("spell0");
        selectTabFromPhaseFirstTime(tabsData[0].id);
        console.log("Selected spell0. Length is " + canvasUnits.length);
        //rePaintCanvas();
        resizeCanvas();
        currentphase = phase;
        document.getElementById("phaseCounter").innerHTML = 1;
        if(currentphase == 0){
            document.getElementById('prevPhaseButton').disabled=true;
            document.getElementById('prevPhaseButton').classList.add('bossButtonDisabled');
        }else{
            document.getElementById('prevPhaseButton').disabled = false;
            document.getElementById('prevPhaseButton').classList.remove('bossButtonDisabled');
        }
    
        document.getElementById('bossPhase').innerHTML= "Phase " + (phase+1);
        document.getElementById('bossNameInfo').innerHTML = file.name.substr(0, file.name.length-4);
    }else{
        window.alert("This is not a valid file!");
    }

}

function getFileExplorer(){
    const fileExplorerWindow = document.getElementById('fileExplorerForJsons');
    fileExplorerWindow.click();
    fileExplorerWindow.onchange = e =>{
        let file = e.target.files[0];
        getJsonFile(file);
    }

}

function exportImage(){
    window.alert("To save the canvas, just right click the canvas, and select 'save image as'.\nI ain't making any redundant functions ¯\\_(ツ)_/¯ ");
}

/**************************************************** File manipulation functions end here *****************************************************/










function findJsonFile(){
    //TODO: Open a file explorer and open the file.
    //TODO: Check if the file is parsed as we expect. Give an error code if it isn't!
}






function checkEssentialStatuses(){
    console.log(heightPercent);
    console.log(widthPercent);
    
    //TOOD: FIx this. Needs a delay that actually works...
    window.addEventListener('resize', function(event){
        var loop = setInterval(resizeCanvas(0, 0), 1000);
        clearInterval(loop);
      });
    document.getElementById('bossPhase').innerHTML = "Phase " +  (currentphase + 1);
    var canvasSection = document.getElementById("canvasSection");
    var ctx = canvasSection.getContext("2d");
    ctx.canvas.width=widthPercent;
    ctx.canvas.height=heightPercent;
    if(currentlySelectedBoss == null){
        document.getElementById('bossButton').disabled=true;
        document.getElementById('bossButton').classList.add('bossButtonDisabled');
    }
    if(currentphase == 0){
        document.getElementById('prevPhaseButton').disabled=true;
        document.getElementById('prevPhaseButton').classList.add('bossButtonDisabled');
    }
    addSpell();
    //selectSpell(currentlySelectedTab);
    createPhase();

    //document.getElementById('canvasSection').addEventListener('keypress', Event)
    document.onkeyup=function(e){
        
        let checkIfInMenuExists = document.getElementsByClassName('inputDialogueBackground');
        if(checkIfInMenuExists.length == 0){
            console.log(checkIfInMenuExists);
            shortcutHandling(e);
        }

    }
    document.getElementById('canvasSection').addEventListener('keypress', function(){
        console.log("SADAAD");
    })

    let colorPickedRightNow;

    document.getElementById('canvasSection').onclick = function getPosition(e) {
        var rect = e.target.getBoundingClientRect();
        var x = e.clientX - rect.left; //x position within the element.
        var y = e.clientY - rect.top;  //y position within the element.
        if(currentlySelectedImage != null){
        holdingMode = false;
        // e = Mouse click event.
        placeUnit(x,y);
        console.log("Left? : " + x + " ; Top? : " + y + ".");
        }else if(holdingMode){
            console.log("IN holding unit!");
            if(heldUnit != null){
                releaseMoving(x, y);
            }else{
                console.log("Going to find the nearest unit");
                holdMoving(x,y);
            }
        }
    }
    let isPainting = false;
    var currentStroke = []; // An which is filled by the points in a stroke.
    var paintInfo =  {color: colorPickedRightNow, stroke: currentStroke};
    document.getElementById('canvasSection').addEventListener('mousedown', (e) =>{
        //console.log("Painting part 1.");
        if(isPaintingMode){
            currentStroke.splice(0, currentStroke.length);

            var rect = e.target.getBoundingClientRect();
            var x = e.clientX - rect.left; //x position within the element.
            var y = e.clientY - rect.top;  //y position within the element.
            ctx.strokeStyle = document.getElementById("colorSelectionTool").value;
            colorPickedRightNow = document.getElementById("colorSelectionTool").value;
            console.log(document.getElementById("colorSelectionTool").value);
            isPainting = true;
            startX = x;
            startY = y;

            //let strokePoint = {x:x, y:y};
            //currentStroke.push(strokePoint);
        }
    });
    document.getElementById('canvasSection').addEventListener('mouseup', (e) =>{
        if(isPaintingMode){
            //console.log("Painting part 3.");
            var rect = e.target.getBoundingClientRect();
            var x = e.clientX - rect.left; //x position within the element.
            var y = e.clientY - rect.top;  //y position within the element.
            isPainting = false;
            ctx.stroke();
            //let strokePoint = {x:x, y:y};
            //currentStroke.push(strokePoint);
            paintInfo.color = colorPickedRightNow;
            ctx.beginPath();
            //paintingUnits.push(currentStroke);
            paintingUnits.push(paintInfo);
            latestUserMoves.push(moveTypes.drawStroke);

            //for( i = 0; i<paintingUnits.length; i++){
                console.log(paintingUnits);
            //}
            let newArray = [];
            currentStroke = newArray;
            let newInfo = {color: colorPickedRightNow, stroke: currentStroke};
            paintInfo = newInfo;


        }
    });
    document.getElementById('canvasSection').addEventListener('mousemove', (e) => {
        if(isPaintingMode){
            if(!isPainting){
                return;
            }
            //console.log("Painting part 2.");
            var rect = e.target.getBoundingClientRect();
            var x = e.clientX - rect.left; //x position within the element.
            var y = e.clientY - rect.top;  //y position within the element.
            ctx.lineWidth = 5;
            ctx.lineCap = 'round';
            ctx.lineTo(x, y);
            ctx.stroke();
            let strokePoint = {x:x, y:y};
            currentStroke.push(strokePoint);
    }});
}




document.addEventListener("DOMContentLoaded", function(){
    checkEssentialStatuses();
})