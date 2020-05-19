(function () {
  function init() {
    document.querySelector(".searchBtn").addEventListener("click", (event) => {
      event.preventDefault();

      const value = getSearchedValue();
      const errorMsg = document.querySelector(".errorMsg");

      if (!value) {
        errorMsg && errorMsg.classList.add("show");
        return;
      }

      const wrapper = document.querySelector(".results");
      while (wrapper.firstChild) {
        wrapper.removeChild(wrapper.firstChild);
      }

      document.querySelector(".container").classList.add("searching");
      errorMsg && errorMsg.classList.remove("show");

      displayResults(value);

      document.querySelector(".loadBar").addEventListener("click", (event) => {
        pageCounter++;
        displayResults(value);
      });
    });
    document.querySelector(".displayPhoto") &&
      document.querySelector(".displayPhoto").addEventListener("click", (event) => {
        closeGallery();
      });
  }
  async function displayResults(value) {
    const url = getSearchURL(value);
    const results = await getResults(url);
    const err = document.querySelector(".errorPage");
    if (results.error) {
      err.classList.add("show");
      document.querySelector(".errorPageMsg").innerHTML =
        "Sorry, something went wrong. Please, try again later.";
      toggleLoadMore(false);
    } else {
      if (results.msg.photos.total == 0) {
        err.classList.add("show");
        document.querySelector(".errorPageMsg").innerHTML = "Sorry, no images found.";
        return;
      }
      (err.classList.contains("show") && err.classList.remove("show")) || "";
      createFeed(results.msg);
      toggleLoadMore();
    }
  }

  let pageCounter = 1;

  function getSearchedValue() {
    const value =
      document.querySelector(".searchInput") && document.querySelector(".searchInput").value.trim();

    if (value) {
      return value.split(" ");
    } else return false;
  }

  function getSearchURL(tags) {
    return `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=dabfe18ef23b3be791871c8cacfded18&tags=${tags.join()}&format=json&nojsoncallback=1&content_type=7&page=${pageCounter}&per_page=10`;
  }

  function getResults(url) {
    toggleLoader();
    return fetch(url)
      .then((resp) => {
        return resp.json();
      })
      .then((data) => {
        return {
          error: false,
          msg: data,
        };
      })
      .catch((err) => {
        return { error: true, msg: err };
      });
  }

  function getPhotoURL(photo) {
    return `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`;
  }

  function createFeed(data) {
    const wrapper = document.querySelector(".results");

    const readyTemplate = generateTemplate(data.photos.photo);

    readyTemplate.map((elem) => {
      wrapper.appendChild(elem);
    });
  }

  function generateTemplate(array) {
    let counter = 0;
    const templateArray = array.map((element) => {
      const photoCard = document.createElement("li");

      const zoom = document.createElement("i");
      zoom.classList.add("material-icons");
      zoom.innerHTML = "zoom_in";

      const image = document.createElement("div");
      image.classList.add("image");

      const img = new Image();
      const photoUrl = getPhotoURL(element);

      img.addEventListener("load", (event) => {
        image.style.backgroundImage = `url(${photoUrl})`;
        counter++;
        counter == 9 && toggleLoader(false);
        img.remove();
      });
      img.src = photoUrl;

      image.addEventListener("click", (event) => {
        let image = document.createElement("img");
        image.classList.add("displayedImg");
        image.src = photoUrl;
        let imageContainer = document.querySelector(".displayPhoto");
        if (imageContainer) {
          imageContainer.appendChild(image);
          imageContainer.classList.add("show");
        }
      });

      photoCard.appendChild(zoom);
      photoCard.appendChild(image);

      return photoCard;
    });
    return templateArray;
  }

  function closeGallery() {
    let imageContainer = document.querySelector(".displayPhoto");
    if (imageContainer) {
      let img = imageContainer.querySelector(".displayedImg");
      imageContainer.removeChild(img);
      imageContainer.classList.remove("show");
    }
  }

  function toggleLoadMore(show = true) {
    const loadMore = document.querySelector(".loadBar");
    if (loadMore) show ? loadMore.classList.add("show") : loadMore.classList.remove("show");
  }

  function toggleLoader(show = true) {
    const overlay = document.querySelector(".overlayLoader");
    if (overlay) {
      show ? overlay.classList.add("show") : overlay.classList.remove("show");
    }
  }

  init();
})();
