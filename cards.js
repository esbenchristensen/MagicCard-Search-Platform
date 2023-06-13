const cards = []; // Opretter et tomt array til kortene
const uniqueCards = []; // Opretter et tomt array til unikke kort
const cardsList = document.getElementById("cardsList"); // Henter HTML-elementet med id'et "cardsList"
let selectedSortingOption = ""; // Variabel til at gemme den valgte sorteringsmulighed
const yearSpan = document.getElementById("year"); // Henter elementet til visning af årstal

// Tjekker efter ændringer i sorterings-elementet
document.getElementById("sortingOptions").addEventListener("change", (event) => {
    // Opdaterer den valgte sorteringsmulighed med værdien fra eventet
    selectedSortingOption = event.target.value;
    // Rydder kortene inden de vises igen sorteret
    clearCards();
    // Viser kortene igen med den nye sorteringsmulighed
    displayCards();
});

// Funktion til at oprette et kort-element baseret på kortdata
function createCardElement(card) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");

    let cardHTML = `<h2 class="cardTitle">${card.name}</h2>
    <img src="${card.imageUrl}" alt="${card.name}">
    <h3>Info</h3>
    <p class="cardText">${card.text}</p>`;

    // Tilføjer kortets type, sjældenhed, manaomkostning, power, toughness og cmc (converted mana cost) til kortets HTML
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

    // Sætter kortets HTML som indholdet af kortets element og returnerer det
    cardElement.innerHTML = cardHTML;
    return cardElement;
}

// Funktion til at tilføje orange ramme til kortet, hvis det er "Rare"
function setCardBorder(cardElement, rarity) {
    if (rarity === "Rare") {
        cardElement.style.border = "5px solid orange";
    } else if (rarity === "Uncommon") {
        cardElement.style.border = "5px solid lightgrey";
    }
}

// Funktion til at oprette kort-elementer baseret på kortdata og vise dem som resultat
// Denne funktion kaldes også hvis der vælges sortering
function createCards(cards) {
    // Sorterer kortene baseret på den valgte sorteringsmulighed
    if (selectedSortingOption === "rarity") {
        cards.sort((a, b) => {
            // Opretter et objekt med rækkefølgen af sjældenheder da API'en returnerer dem i tekstformat
            const rarityOrder = {
                Common: 1,
                Uncommon: 2,
                Rare: 3,
                "Mythic Rare": 4,
                Special: 5,
                "Basic Land": 6,
            };
            // Sammenligner kortene baseret på deres sjældenhed
            return rarityOrder[b.rarity] - rarityOrder[a.rarity];
        });
    } else if (selectedSortingOption === "manacost") {
        cards.sort((a, b) => a.manaCost - b.manaCost);
    } else if (selectedSortingOption === "power") {
        cards.sort((a, b) => a.power - b.power);
    } else if (selectedSortingOption === "toughness") {
        cards.sort((a, b) => a.toughness - b.toughness);
    }

    // Itererer over kortene og opretter kort-elementer for hvert kort
    // Tjekker om kortet allerede er oprettet, og tilføjer det kun, hvis det ikke er grundet duplikater i API'en
    cards.map((card) => {
        if (!uniqueCards.includes(card.name)) {
            const cardElement = createCardElement(card);
            setCardBorder(cardElement, card.rarity); // Anvender orange ramme, hvis kortet er "Rare"
            cardsList.appendChild(cardElement);
            uniqueCards.push(card.name);
        }
    });
}

// Funktion til at rydde kortene fra kortlisten
function clearCards() {
    // Fjerner alt indhold fra kortlisten
    cardsList.innerHTML = "";
    // Rydder arrayet af unikke kort
    uniqueCards.length = 0;
}

// Funktion til at vise kortene
function displayCards() {
    // Opretter kortene og viser dem
    createCards(cards);
}

// Funktion til at vise året i HTML-dokumentet
function displayYear() {
    const currentYear = new Date().getFullYear();
    yearSpan.textContent = currentYear;
}

// Viser det aktuelle år
displayYear();

// Henter kortene fra API'en og tilføjer dem til "cards" arrayet
fetch("https://api.magicthegathering.io/v1/cards")
    .then((response) => response.json())
    .then((data) => {
        cards.push(...data.cards);
        displayCards(); // Kald displayCards efter kortene er blevet hentet
    })
    .catch((error) => {
        console.error("Fejl ved hentning af kort:", error);
    });
