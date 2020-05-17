function getSearchedValue() {
    return document.querySelector(".searchInput").value.split(" ");
}
function getSearchURL(tags) {
    return `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=dabfe18ef23b3be791871c8cacfded18&tags=${tags.join()}&format=json&nojsoncallback=1&content_type=1`
}
function getResults(url) {
    fetch(url).then(resp => {
        return resp.json();
    }).then(data => {
        createFeed(data);
        console.log(data)
    })
}
function getPhotoURL(photo) {
    return `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`
}
function createFeed(data) {
    let wrapper = document.querySelector(".results");
    data.photos.photo.forEach(element => {
        let photoCard = document.createElement("li");
        let image = document.createElement("img");
        image.src = getPhotoURL(element);
        photoCard.appendChild(image);
        wrapper.appendChild(photoCard);
    });
}

document.querySelector(".searchBtn").addEventListener('click', event => {
    event.preventDefault();

    let wrapper = document.querySelector(".results");
    while(wrapper.firstChild) {
        wrapper.removeChild(wrapper.firstChild);
    }

    let search = getSearchedValue();
    let url = getSearchURL(search);
    getResults(url);

    document.querySelector(".background").style.height = "100px";
    document.querySelector(".browser").style.height = "100%";
    document.querySelector("header").style.display = "none";
})