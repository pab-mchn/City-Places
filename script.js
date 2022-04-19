// capture the html tags
let places = document.querySelector("#places");
let bars = document.querySelector("#bars");
let clubs = document.querySelector("#clubs");
let yourFovites = document.querySelector("#yourFovites");

let slidePlaces = document.querySelector("#slidePlaces");
let tinderCards = document.querySelector("#tinder--cards");


//async function to get the jsonBar and show the places data
let fetchBar = async () => {
  const res = await fetch("dataBar.json");
  const data = await res.json();
  data.forEach((bar) => {
    let content = document.createElement("div");
    content.innerHTML = `
                <a href="slidePlaces.html">${bar.barName}</a>
                <img src="${bar.barImage}">
                <a href="${bar.BarMapUrl}">check on map</a>
            `;

    places.append(content);


    });
  }


//function to create slide Barplaces
let SlidePlaces = async () => {
  const res = await fetch("dataBar.json");
  const data = await res.json();
  data.forEach((bar) => {
    let content = document.createElement("div");
    content.className = "tinder--card";
    let tinderCard = document.createTextNode("tinder--card");
    content.appendChild(tinderCard);

    content.innerHTML = `
                <img src="${bar.barImage}">
                <h4 href="#slide">${bar.barName}</h4>
            `;

    tinderCards.append(content);
  });
};
SlidePlaces();

//still need to works in the clubs functionality
const fetchClub = async () => {
  const res = await fetch("dataClub.json");
  const data = await res.json();
  data.forEach((club) => {
    const content = document.createElement("div");
    content.innerHTML = `
                <h4>${club.clubName}</h4>
                <img src="${club.clubImage}" >
            `;
    places.append(content);
  });
};


bars.addEventListener("click", () => {
  document.querySelector("#places").innerHTML = "";
  document.querySelector("#favoritesPlacesBody").innerHTML = "";
  fetchBar();
});

clubs.addEventListener("click", () => {
  document.querySelector("#places").innerHTML = "";
  fetchClub();
});

slidePlaces.addEventListener("click", () => {
  document.querySelector("#places").innerHTML = "";
  SlidePlaces();
});
