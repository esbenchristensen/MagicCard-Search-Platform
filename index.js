const cards = []; // Array til kortene fra API'en
const searchInput = document.getElementById("search"); // Henter inputfeltet til søgning
const suggestionsList = document.getElementById("suggestionsList"); // Henter listen til forslag
const cardResult = document.getElementById("cardResult"); // Henter resultatområdet til kortvisning
const yearSpan = document.getElementById("year"); // Henter elementet til visning af årstal
const uniqueSuggestions = []; //Unikke forslag
const uniqueCards = []; //Unikke kort til visning v. tilfæligt kort

// Tjekker efter submit i søgeformularen
document.getElementById("searchForm").addEventListener("submit", function (event) {
    // Forhindrer at siden genindlæses
    event.preventDefault();
    searchCards(); // Kalder søgefunktionen
});

// Tjekker input-begivenheden i søgefeltet
searchInput.addEventListener("input", function () {
    showSuggestions(); // Kalder funktionen til visning af forslag når der er input i søgefeltet
});

// Tjekker efter klik på knappen "Tilfældigt kort"
document.getElementById("randomCard").addEventListener("click", function () {
    randomCard(); // Kalder funktionen til visning af tilfældigt kort
});

// Henter automatisk kort fra API - Henter alle kort og tilføjer dem til cards-arrayet
fetch("https://api.magicthegathering.io/v1/cards")
    .then((response) => response.json())
    .then((data) => {
        cards.push(...data.cards);
    })
    .catch((error) => {
        console.error("Fejl ved hentning af kort:", error);
    });

// Funktion til visning af det aktuelle år
function displayYear() {
    const currentYear = new Date().getFullYear();
    yearSpan.textContent = currentYear;
}

displayYear(); // Kalder funktionen til visning af årstal

// Funktion til at oprette et kort-element
function createCardElement(card) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");

    let cardHTML = `<h2 class="cardTitle">${card.name}</h2>
    <img src="${card.imageUrl}" alt="${card.name}">
    <h3>Info</h3>
    <p class="cardText">${card.text}</p>`;

    if (card.type) {
        cardHTML += `<p>Type: <br/><span class="fw-bold">${card.type}</span></p>`;
    }

    if (card.rarity) {
        cardHTML += `<p>Rarity: <br/><span class="fw-bold">${card.rarity}</span></p>`;
    }

    if (card.manacost) {
        cardHTML += `<p>Mana: <br/><span class="fw-bold">${card.manacost}</span></p>`;
    }

    if (card.power) {
        cardHTML += `<p>Power: <br/><span class="fw-bold">${card.power}</span></p>`;
    }

    if (card.toughness) {
        cardHTML += `<p>Toughness: <br/><span class="fw-bold">${card.toughness}</span></p>`;
    }

    if (card.cmc) {
        cardHTML += `<p>Cmc: <br/><span class="fw-bold">${card.cmc}</span></p>`;
    }

    cardElement.innerHTML = cardHTML;
    return cardElement;
}

// Funktion til at oprette kort-elementer baseret på kortdata og vise dem som resultat
function createCards(cards) {
    // Funktion til at oprette kortene i DOM'en
    cards.forEach((card) => {
        const cardElement = createCardElement(card);
        cardResult.appendChild(cardElement);
    });
}

// Fjerner resultatet af søgningen ved f.eks ny søgning
function clearCards() {
    // Funktion til at fjerne kortene fra DOM'en
    cardResult.innerHTML = "";
}

// Funktion til søgning af kort
function searchCards() {
    clearCards(); // Rydder kortresultatområdet

    // Opretter et array til søgeresultater
    var searchTerm = searchInput.value.toLowerCase();
    var searchResults = cards.filter(function (card) {
        return card.name && card.name.toLowerCase().includes(searchTerm);
    });

    if (searchResults.length > 0) {
        createCards([searchResults[0]]); // Viser kun det første søgeresultat i tilfælde af duplikater
    } else {
        createCards([]); // Viser ingen kort hvis der ikke er nogen søgeresultater
    }

    // Efter der er søgt, skjules forslagslisten og søgefeltets border radius nulstilles
    searchInput.value = ""; // Nulstiller søgefeltet
    suggestionsList.innerHTML = ""; // Rydder forslagslisten
    suggestionsList.style.display = "none"; // Skjuler forslagslisten
    searchInput.style.borderRadius = "5px"; // Sætter søgefeltets border radius
}

// Funktion til visning af tilfældigt kort ved klik på Tilfældigt kort knappen
function randomCard() {
    clearCards(); // Rydder kortresultatområdet
    //Laver et array af unikke kort for at undgå duplikatkort og kort uden billede
    cards.map((card) => {
        if (!uniqueCards.includes(card.name) && card.imageUrl) {
            uniqueCards.push(card);
        }
    });
    // Opretter et tilfældigt kort fra cards-arrayet
    var randomCard = uniqueCards[Math.floor(Math.random() * uniqueCards.length)];
    console.log(randomCard);
    createCards([randomCard]); // Viser det tilfældige kort
}

function showSuggestions() {
    // Funktion til visning af forslag baseret på input
    const searchTerm = searchInput.value.toLowerCase();
    const suggestedCards = cards.filter(function (card) {
        return card.name && containsLetters(card.name.toLowerCase(), searchTerm);
    });

    // Funktion til at tjekke om et kort indeholder alle bogstaver i søgetermen
    function containsLetters(name, term) {
        //Splitter bogstaver op i et array
        const termLetters = term.split("");
        //Tjekker om hvert element i arrayet findes i kortnavnet - Hvis det er true vises kortet i suggestions
        return termLetters.every((letter) => name.includes(letter));
    }

    uniqueSuggestions.length = 0; // Nulstil unikke forslag-arrayet for hver input-begivenhed i søgefeltet så man ikke får forslag fra tidligere søgninger
    suggestionsList.innerHTML = "";

    if (searchTerm === "") {
        suggestionsList.style.display = "none"; // Skjuler forslagslisten, når søgefeltet er tomt
        searchInput.style.borderRadius = "5px"; // Sætter søgefeltets border radius
        return;
    }

    suggestionsList.style.display = suggestedCards.length > 0 ? "block" : "none"; // Viser forslagslisten, hvis der er forslag, ellers skjules den
    searchInput.style.borderBottomLeftRadius = suggestedCards.length > 0 ? "0" : "5px"; // Sætter border radius for søgefeltet baseret på forslagets tilstedeværelse
    searchInput.style.borderBottomRightRadius = suggestedCards.length > 0 ? "0" : "5px";

    // Opretter et array til unikke forslag

    suggestedCards.forEach((card) => {
        if (!uniqueSuggestions.includes(card.name)) {
            uniqueSuggestions.push(card.name);
        }
    });

    // Opretter et forslagselement for hvert unikke forslag
    uniqueSuggestions.forEach((suggestion) => {
        const suggestionItem = document.createElement("li");
        suggestionItem.classList.add("suggestion");
        suggestionItem.textContent = suggestion;
        suggestionItem.addEventListener("click", function () {
            searchInput.value = suggestion;
            searchCards();
        });
        suggestionsList.appendChild(suggestionItem);
    });
}
