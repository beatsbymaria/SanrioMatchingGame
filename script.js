// audio sounds
let clickAudio = new Audio('audio/click.wav');
let matchAudio = new Audio('audio/match.wav');
let winAudio = new Audio('audio/win.wav');

function flipCardWhenClicked(cardObject){
    // adds an "onclick" attribute/listener to element
    cardObject.element.onclick = function(){
        // card is already flipped
        if(cardObject.element.classList.contains("flipped")){
            return;
        }
        
        // play the "click" sound.
        clickAudio.play();
    
        // add flipped class immediately after a card is clicked
        cardObject.element.classList.add("flipped");
    
        setTimeout(function() {
            onCardFlipped(cardObject);
        }, 500);
    };
}

// set up game
function setUpGame(){
    let cardObjects = createCards(document.getElementById("card-container"), shuffleCardImageClasses());
  
    if (cardObjects != null) {
        for (let i = 0; i < cardObjects.length; i++) {
            flipCardWhenClicked(cardObjects[i]);
        }
    }
}

function createNewCard(){
    // create new div element
    let cardElement = document.createElement("div");

    // add card class to variable
	cardElement.classList.add("card");

    // write html for children of card element
    cardElement.innerHTML = 
    `<div class="card-down"></div> 
    <div class="card-up"></div>`;

    // return card element
    return cardElement;
}

function appendNewCard(parentElement){
    // create new card
	let cardElement = createNewCard();

    // append card to parent element
	parentElement.appendChild(cardElement);

    // retuen card element
	return cardElement;
}

function shuffleCardImageClasses(){
    // create a new array that contains two of each image class string in order
	let cardClasses = ["image-1", "image-1", "image-2", "image-2", "image-3", "image-3", "image-4", "image-4", "image-5", "image-5", "image-6", "image-6"]; 
  
	// return shuffled array of class names
    return _.shuffle(cardClasses);
}

function createCards(parentElement, shuffledImageClasses){
	// empty array to hold card objects
    let cardObjects = [];

    // loops 12 times to create the 12 cards
    for(let i = 0; i < 12; i++){
        // create/append a new card and store result in a variable
        let newCard = appendNewCard(parentElement);

		// add image class to new card element
        newCard.classList.add(shuffledImageClasses[i]);

        // append a new object to card object array	
	    cardObjects.push({
            index: i,
            element: newCard,
            imageClass: shuffledImageClasses[i]
        });
    }

    // return the array of card objects
    return cardObjects;
}

function doCardsMatch(cardObject1, cardObject2){
	// determine if two cards match
    let match = true;

    if(cardObject1.imageClass == cardObject2.imageClass){
        match = true;
    } 
    else{
        match = false;
    }

	return match;
}

// dictionary to store our counter names and their respective values
let counters = {};


function incrementCounter(counterName, parentElement){
    // if 'counterName' property is not defined in 'counters' object, initialize it with a value of 0
	if(counters[counterName] == undefined){
        counters[counterName] = 0;
    }
  
    // increment counter
	counters[counterName] += 1;

    // change the HTML within 'parentElement' to display new counter value
	parentElement.innerHTML = counters[counterName];
}

// used to remember the first card flipped until user flips another card
let lastCardFlipped = null;


function onCardFlipped(newlyFlippedCard){
    // use the 'incrementCounter' function to add one to the flip counter UI
    incrementCounter("flips", document.getElementById("flip-count"));

    // if 'lastCardFlipped' is null (this is the first card flipped)
    if(lastCardFlipped == null){
        lastCardFlipped = newlyFlippedCard;
        return;
    }

    // if the cards don't match
    if(!doCardsMatch(newlyFlippedCard, lastCardFlipped)){
        newlyFlippedCard.element.classList.remove("flipped");
        lastCardFlipped.element.classList.remove("flipped");
        lastCardFlipped = null;
        return;
    }
        
    // increment the match counter
    incrementCounter("matches", document.getElementById("match-count"));

    // add glow to matched cards
    newlyFlippedCard.element.classList.add("border-glow");
    lastCardFlipped.element.classList.add("border-glow");

    // play either the win audio or match audio
    if(counters["matches"] == 6){
        winAudio.play();
    } 
    else{
        matchAudio.play();
    }

    // reset 'lastCardFlipped' to null
    lastCardFlipped = null;
}

// reset and set up a new game
function resetGame() {
	// get the card container by its id and store it in a variable
    let cardContainer = document.getElementById("card-container");
	
	// clear all the cards
    while(cardContainer.firstChild){
        cardContainer.removeChild(cardContainer.firstChild);
    }
	
	// get the HTML elements that display flip and match counts and reset their inner text to 0 
    let flips = document.getElementById("flip-count");
    flips.innerHTML = 0;
    let matches = document.getElementById("match-count");
    matches.innerHTML = 0;
	
	// reassign `counters` dictionary that stores counter names and their values to be an empty object
    counters = {};
	
	// set lastCardFlipped back to null
    lastCardFlipped = null;
	
	// set up a new game
    setUpGame();
}

setUpGame();