let tinderCards = document.querySelector("#tinder--cards");
let tinderContainer = document.querySelector(".tinder");
let allCards = document.querySelectorAll(".tinder--card");
let yourFavorites = document.querySelector("#yourFavorites");
let favoritesPlacesBody = document.querySelector("#favoritesPlacesBody");
let bars = document.querySelector("#bars");
let love = document.querySelector("#love");
let buttonAddFavorite = document.querySelector("#addFavorite");

bars.style.display = "none";


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

    let buttonAddFavorite = document.createElement("i");

    buttonAddFavorite.className = "fa-solid fa-heart";
    content.appendChild(buttonAddFavorite);

    let favoritesPlaces = [];
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
      yourFavorites.addEventListener("click", function () {
        bars.style.display = "";
        tinderCards.innerHTML = "";
        love.style.display = "none";

        favoritesPlaces.forEach((places) => {
          //clean array before show the new favorite places
          let contentFavorites = document.createElement("div");
          contentFavorites.innerHTML = `
                <h4>${places.name}</h4>
                <img src="${places.img}" >
                <a href="${places.direction}">check on map</a>
            `;
          favoritesPlacesBody.append(contentFavorites);
        });
      });
    });
  });
};
SlidePlaces();


//implementation of the hammer.js library for slider
function initCards(card, index) {
  let newCards = document.querySelectorAll(".tinder--card:not(.removed)");

  newCards.forEach(function (card, index) {
    card.style.zIndex = allCards.length - index;
    card.style.transform =
      "scale(" + (20 - index) / 20 + ") translateY(-" + 30 * index + "px)";
    card.style.opacity = (10 - index) / 10;
  });

  tinderContainer.classList.add("loaded");
}

initCards();

allCards.forEach(function (el) {
  let hammertime = new Hammer(el);

  hammertime.on("pan", function (event) {
    el.classList.add("moving");
  });

  hammertime.on("pan", function (event) {
    if (event.deltaX === 0) return;
    if (event.center.x === 0 && event.center.y === 0) return;

    tinderContainer.classList.toggle("tinder_love", event.deltaX > 0);

    let xMulti = event.deltaX * 0.03;
    let yMulti = event.deltaY / 80;
    let rotate = xMulti * yMulti;

    event.target.style.transform =
      "translate(" +
      event.deltaX +
      "px, " +
      event.deltaY +
      "px) rotate(" +
      rotate +
      "deg)";
  });

  hammertime.on("panend", function (event) {
    el.classList.remove("moving");
    tinderContainer.classList.remove("tinder_love");

    let moveOutWidth = document.body.clientWidth;
    let keep = Math.abs(event.deltaX) < 80 || Math.abs(event.velocityX) < 0.5;

    event.target.classList.toggle("removed", !keep);

    if (keep) {
      event.target.style.transform = "";
    } else {
      let endX = Math.max(
        Math.abs(event.velocityX) * moveOutWidth,
        moveOutWidth
      );
      let toX = event.deltaX > 0 ? endX : -endX;
      let endY = Math.abs(event.velocityY) * moveOutWidth;
      let toY = event.deltaY > 0 ? endY : -endY;
      let xMulti = event.deltaX * 0.03;
      let yMulti = event.deltaY / 80;
      let rotate = xMulti * yMulti;

      event.target.style.transform =
        "translate(" +
        toX +
        "px, " +
        (toY + event.deltaY) +
        "px) rotate(" +
        rotate +
        "deg)";
      initCards();
    }
  });
});

function createButtonListener(love) {
  return function (event) {
    let cards = document.querySelectorAll(".tinder--card:not(.removed)");
    let moveOutWidth = document.body.clientWidth * 1.5;

    if (!cards.length) return false;

    let card = cards[0];

    card.classList.add("removed");

    if (love) {
      card.style.transform =
        "translate(" + moveOutWidth + "px, -100px) rotate(-30deg)";
    } else {
      card.style.transform =
        "translate(-" + moveOutWidth + "px, -100px) rotate(30deg)";
    }

    initCards();

    event.preventDefault();
  };
}

let loveListener = createButtonListener(true);

love.addEventListener("click", loveListener);

bars.addEventListener("click", () => {
  favoritesPlacesBody.innerHTML = ""
  bars.style.display = "none";
  love.style.display = "";

  SlidePlaces();
});
