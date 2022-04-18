// capture the html tags
let places = document.querySelector("#places");
let bars = document.querySelector("#bars");
let clubs = document.querySelector("#clubs");
let yourFovites = document.querySelector("#yourFovites");
let favoritesPlacesBody = document.querySelector("#favoritesPlacesBody");
let favoritesPlaces = [];

//async function to get the json data
let fetchBar = async () => {
  const res = await fetch("dataBar.json");
  const data = await res.json();
  data.forEach((bar) => {
    let content = document.createElement("div");
    content.innerHTML = `
                <h4>${bar.barName}</h4>
                <img src="${bar.barImage}" >
                <a href="${bar.BarMapUrl}">check on map</a>
            `;

    places.append(content);

    let buttonAddFavorite = document.createElement("button");
    buttonAddFavorite.textContent = "add to favorite";

    content.appendChild(buttonAddFavorite);

    //push the favorites places in favoritePlaces array
    buttonAddFavorite.addEventListener("click", function () {
      favoritesPlaces.push({
        id: bar.id,
        name: bar.barName,
        img: bar.barImage,
        direction: bar.BarMapUrl,
      });
      console.log(favoritesPlaces);

    //function to watch the favorites places!
      yourFovites.addEventListener("click", function () {
        favoritesPlaces.forEach((places) => {
          let contentFavorites = document.createElement("div");
          contentFavorites.innerHTML = `
                <h4>${places.name}</h4>
                <img src="${places.img}" >
                <a href="${places.direction}">check on map</a>
            `;
          document.querySelector("#places").innerHTML = "";
          favoritesPlacesBody.append(contentFavorites);
        });
      });
    });
  });
};


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
