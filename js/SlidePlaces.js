let tinderCards = document.querySelector("#tinder--cards");
let tinderContainer = document.querySelector(".tinder");
let allCards = document.querySelectorAll(".tinder--card");
let yourFavorites = document.querySelector("#yourFavorites");
let yourFavoritesView = document.querySelector("#yourFavoritesView");
let favoritesPlacesBody = document.querySelector("#favoritesPlacesBody");
let love = document.querySelector("#love");
let buttonAddFavorite = document.querySelector("#addFavorite");
let backSlider = document.querySelector("#backSlider");
let backHome = document.querySelector("#backHome");

backSlider.style.display = "none";
yourFavoritesView.style.display = "none";

let favoritesPlaces = [];

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

    //start favorites places

    //function for save the productos in the storage
    buttonAddFavorite.addEventListener("click", function () {
      //push the favorites places in favoritePlaces array

      favoritesPlaces.push({
        id: bar.id,
        name: bar.barName,
        img: bar.barImage,
        direction: bar.BarMapUrl,
      });

      console.log(favoritesPlaces);

      //save all the favoritesPlaces array in the local storage

      const saveLocalStorage = (clave, valor) => {
        localStorage.setItem(clave, valor);
      };

      saveLocalStorage("listFavorites", JSON.stringify(favoritesPlaces));

      //alert say that the favorites was saved(Sweet alert library)
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Added Favorite",
        showConfirmButton: false,
        timer: 800,
        iconColor: "#f9433dcc",
      });

      //function to watch the favorites places!
      yourFavorites.addEventListener("click", function () {
        yourFavoritesView.style.display = "";
        yourFavorites.style.display = "none";
        backHome.style.display = "none";
        backSlider.style.display = "";
        tinderCards.innerHTML = "";
        love.style.display = "none";
        JSON.stringify(localStorage.getItem("listFavorites"));

        //clean the favorite places in dom before show the foreach in the new version of array
        favoritesPlacesBody.innerHTML = "";

        favoritesPlaces.forEach((places) => {
          //clean array before show the new favorite places
          let contentFavorites = document.createElement("div");

          contentFavorites.className = "card-product";

          contentFavorites.innerHTML = `
                <img src="${places.img}" >
                <div class="card-product-infos">
                <h2>${places.name}</h2>
                <a href="${places.direction}">Go on map</a>
                </div>
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
    card.style.transform = "scale(" + (20 - index) / 20 + ") translateY(-" + 30 * index + "px)";
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
      "translate(" + event.deltaX + "px, " + event.deltaY + "px) rotate(" + rotate + "deg)";
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
      let endX = Math.max(Math.abs(event.velocityX) * moveOutWidth, moveOutWidth);
      let toX = event.deltaX > 0 ? endX : -endX;
      let endY = Math.abs(event.velocityY) * moveOutWidth;
      let toY = event.deltaY > 0 ? endY : -endY;
      let xMulti = event.deltaX * 0.03;
      let yMulti = event.deltaY / 80;
      let rotate = xMulti * yMulti;

      event.target.style.transform =
        "translate(" + toX + "px, " + (toY + event.deltaY) + "px) rotate(" + rotate + "deg)";
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
      card.style.transform = "translate(" + moveOutWidth + "px, -100px) rotate(-30deg)";
    } else {
      card.style.transform = "translate(-" + moveOutWidth + "px, -100px) rotate(30deg)";
    }

    initCards();

    event.preventDefault();
  };
}

let loveListener = createButtonListener(true);

love.addEventListener("click", loveListener);

backSlider.addEventListener("click", () => {
  yourFavoritesView.style.display = "none";
  yourFavorites.style.display = "";
  favoritesPlacesBody.innerHTML = "";
  love.style.display = "";
  backHome.style.display = "";
  backSlider.style.display = "none";

  SlidePlaces();
});
