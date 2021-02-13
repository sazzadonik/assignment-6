const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const searchInput = document.getElementById('search');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
// selected image 
let sliders = [];


// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
// const KEY = '15674931-a9d714b6e9d654524df198e00&q';
const KEY = '20265794-8ef354ab2905df4da358c2c97&q';

// Button click for enter

searchInput.addEventListener("keyup", function(event) {
  if (event.key === "Enter") {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    searchBtn.click();
  }
});


searchBtn.addEventListener('click', function () {
  document.querySelector('.main').style.display = 'none';
  document.getElementById("nothingFoundMsg").style.display = 'none';
  clearInterval(timer);
  const searchValue = searchInput.value;
  if(searchValue.trim() === ""){
    alert("Search Input Must Not Be Empty");
    return;
  }else{
    getImages(searchValue)
    sliders.length = 0;
  }
 
})

const getImages = (query) => {
  spinner();
  fetch(`https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`)
    .then(response => response.json())
    .then(data => {showImages(data.hits)})
    .catch(err => console.log(err))
}


// show images 
const showImages = (images) => {
  searchInput.value = "";
  if(images.length == 0){
    imagesArea.style.display = 'none';
    document.getElementById("nothingFoundMsg").style.display = "block";
  }else{
    imagesArea.style.display = 'block';
    gallery.innerHTML = '';
    // show gallery title
    galleryHeader.style.display = 'flex';
    images.forEach(image => {
      let div = document.createElement('div');
      div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
      div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
      gallery.appendChild(div);
    
    })
    
  }
spinner();
}


let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  element.classList.toggle('added');
 
  let item = sliders.indexOf(img);
  if (item === -1) {
    sliders.push(img);
  } else {
    sliders.splice(item, 1);
  }
}
var timer

const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {
    alert('Select at least 2 image.')
    return;
  }

  // check duration 
  const duration = +document.getElementById('duration').value || 1000;

  if(duration < 0){
    alert('Duration Must be Positive')
    return;
  }
  // crate slider previous next area
  sliderContainer.innerHTML = '';
  const prevNext = document.createElement('div');
  prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext)
  document.querySelector('.main').style.display = 'block';
  // hide image aria
  imagesArea.style.display = 'none';
  // const duration = +document.getElementById('duration').value || 1000;

  // if(duration < 0){
  //   return;
  // }
  
  sliders.forEach(slide => {
    let item = document.createElement('div')
    item.className = "slider-item";
    item.innerHTML = `<img class="w-100"
    src="${slide}"
    alt="">`;
    sliderContainer.appendChild(item)
  })
  changeSlide(0)
  timer = setInterval(function () {
    slideIndex++;
    changeSlide(slideIndex);
  }, duration);
}

// change slider index 
const changeItem = index => {
  changeSlide(slideIndex += index);
}

// change slide item
const changeSlide = (index) => {

  const items = document.querySelectorAll('.slider-item');
  if (index < 0) {
    slideIndex = items.length - 1
    index = slideIndex;
  };

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach(item => {
    item.style.display = "none"
  })

  items[index].style.display = "block"
}

sliderBtn.addEventListener('click', function () {
  createSlider()
})


// add spinner for loading the data
const spinner = ()=>{
  const spinner = document.getElementById("spinner");
  spinner.classList.toggle("d-none");
}