(function () {
  let pageCounter = 1;

  function getSearchedValue() {
    return (
      (document.querySelector(".searchInput") &&
        document.querySelector(".searchInput").value.split(" ")) ||
      ""
    );
  }
  function getSearchURL(tags) {
    return `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=dabfe18ef23b3be791871c8cacfded18&tags=${tags.join()}&format=json&nojsoncallback=1&content_type=7&page=${pageCounter}&per_page=10`;
  }
  function getResults(url) {
    toggleLoader();
    fetch(url)
      .then((resp) => {
        return resp.json();
      })
      .then((data) => {
        createFeed(data);
      });
  }
  function getPhotoURL(photo) {
    return `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`;
  }
  function createFeed(data) {
    let wrapper = document.querySelector(".results");
    let counter = 0;
    wrapper &&
      data.photos.photo.forEach((element) => {
        let photoCard = document.createElement("li");

        let zoom = document.createElement("i");
        zoom.classList.add("material-icons");
        zoom.innerHTML = "zoom_in";

        let image = document.createElement("div");
        image.classList.add("image");

        let img = new Image();
        let photoUrl = getPhotoURL(element);
        img.addEventListener("load", (event) => {
          image.style.backgroundImage = `url(${photoUrl})`;
          counter++;
          counter == 9 && toggleLoader(false);
          img.remove();
        });
        img.src = photoUrl;

        image.addEventListener("click", (event) => {
          let imageURL = getPhotoURL(element);
          let image = document.createElement("img");
          image.classList.add("displayedImg");
          image.src = imageURL;
          let imageContainer = document.querySelector(".displayPhoto");
          if(imageContainer) {
              imageContainer.appendChild(image);
              imageContainer.style.display = "flex";
          }
        });

        photoCard.appendChild(zoom);
        photoCard.appendChild(image);
        wrapper.appendChild(photoCard);
      });
  }
  document.querySelector(".displayPhoto") &&
    document
      .querySelector(".displayPhoto")
      .addEventListener("click", (event) => {
        closeGallery();
      });

  function displayResults() {
    let search = getSearchedValue();
    let url = getSearchURL(search);
    getResults(url);
  }
  function closeGallery() {
    let imageContainer = document.querySelector(".displayPhoto");
    if (imageContainer) {
      let img = imageContainer.querySelector(".displayedImg");
      imageContainer.removeChild(img);
      imageContainer.style.display = "none";
    }
  }
  function toggleLoader(show = true) {
    if (document.querySelector(".overlayLoader")) {
      document.querySelector(".overlayLoader").style.display = show
        ? "flex"
        : "none";
    }
  }
  document.querySelector(".searchBtn").addEventListener("click", (event) => {
    event.preventDefault();

    let input = document.querySelector(".searchInput");

    if (!input.value) {
      document.querySelector(".errorMsg").style.display = "block";
    } else {
      let wrapper = document.querySelector(".results");
      while (wrapper.firstChild) {
        wrapper.removeChild(wrapper.firstChild);
      }

      displayResults();

      document.querySelector(".errorMsg").style.display = "none";
      document.querySelector(".background").style.height = "60px";
      document.querySelector(".browser").style.height = "100%";
      document.querySelector("header").classList.add("animate");
    }
  });
  document.querySelector(".loadBar").addEventListener("click", (event) => {
    pageCounter++;
    displayResults();
  });
})();
