 
var renderingArray = [];
var tableBody = document.querySelector('.search-results__painters');

/* get data from json */

getJson("js/data.json", function(generated){
  var dataObject = {}; 
  dataObject = generated; 
  renderingArray = dataObject.data;
  renderingArray.forEach(function(item){
    item.visible = true;
  });
  createTable(renderingArray);  
});
function getJson(url, callback){
  var req  = new XMLHttpRequest();
  req.open("GET", url);
  req.addEventListener('load', function(){
    try {
      var responseJson = JSON.parse(this.responseText);
    } catch (err) {
      console.log( "Извините, в данных ошибка, мы попробуем получить их ещё раз" );
      console.log( err.name );
      console.log( err.message );
    }
    callback(responseJson)
  });
  req.send();
}

/* Create painters list */

function createTable(arr){ 
  tableBody.innerHTML = ''; 
  arr.forEach(function(item){
    createTableRow(item)
  });  
}
function createTableRow(item){
  var article = document.createElement('article');
  article.classList.add('painter');

  var cats = ''; 
  for (var i=0;i<item.categories.length;i++){
    cats += '<span>'+item.categories[i]+'</span>';
    article.setAttribute('data-'+item.categories[i].split(' ')[0], true);
  }

  article.innerHTML = 
  '<div class="painter__wrapper">'+
    '<div class="painter__logo">'+
      '<div class="painter__img">'+
        '<img src="img/'+item.image+'">'+
      '</div>'+
    '</div>'+
    '<div class="painter__text-wrapper">'+
      '<h2 class="painter__title">'+
        '<a href="#">'+item.title+'</a>'+
      '</h2>'+
      '<address class="painter__address">'+
        '<div class="painter__location">'+
          '<svg width="10" height="16">'+
            '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#pin"></use>'+
          '</svg>'+
          '<span>'+item.city+'</span>'+
        '</div>'+
        '<div class="painter__tel">'+
          '<svg width="12" height="16">'+
            '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#tel"></use>'+
          '</svg>'+
          '<a href="tel:'+item.telephone +'">'+item.telephone +'</a>'+
        '</div>'+
        '<div class="painter__email">'+
          '<svg width="18" height="11">'+
            '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#email"></use>'+
          '</svg>'+
          '<a href="mailto:'+item.email +'">'+item.email +'</a>'+
        '</div>'+
      '</address>'+
      '<div class="painter__text">'+item.text+'</div>'+
      '<div class="painter__categories">'+cats+'</div>'+
    '</div>'+
    '<div class="painter__request">'+
      '<a class="btn" href="#">Pyydä tarjous!</a>'+
      '<div class="painter__projects-count">'+
        '<svg width="14" height="16">'+
          '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#house"></use>'+
        '</svg>'+
        '<span>'+item.NumberOfProjects+'</span>'+
      '</div>'+
    '</div>'+
  '</div>';

  tableBody.appendChild(article)
}



/* Sorting */

document.querySelector('.sort-projects').addEventListener('click', sortProjects); 
document.querySelector('.sort-name').addEventListener('click', sortName); 
document.querySelector('.sort-feedback').addEventListener('click', sortFeedback); 

function sortProjects(e) {  
  e.preventDefault();
  changeClasses(this);
  renderingArray.sort(function(a, b){
    return b.NumberOfProjects - a.NumberOfProjects;
  });
  createTable(renderingArray);
  filterRender();
}
function sortName(e){
  e.preventDefault();
  changeClasses(this);
  renderingArray.sort(function(a, b){
    if (a.title > b.title) return 1;
    if (a.title < b.title) return -1;
  });
  createTable(renderingArray);
  filterRender();
}
function sortFeedback(e){
  e.preventDefault();
  changeClasses(this);
  renderingArray.sort(function(a, b){
    return b.NumberOfFeedback - a.NumberOfFeedback;
  });
  createTable(renderingArray);
  filterRender();
}

function changeClasses(current){
  var sorts = document.querySelectorAll('.sort__item');
  for (var i=0;i<sorts.length;i++){
    sorts[i].classList.remove('sort__item--active'); 
  }
  current.classList.add('sort__item--active');
}




/* categories filter */

var catLinks = document.querySelectorAll('.categories__item a')

for (var i=0;i<catLinks.length;i++){
  catLinks[i].addEventListener('click', catFiltering); 
}

var catList = [];

function catFiltering(e){
  e.preventDefault();
  this.closest('.categories__item').classList.toggle("categories__item--active")
  var currentCat = this.closest('.categories__item').getAttribute('data-cat');
  if (catList.indexOf(currentCat) == -1){
    catList.push(currentCat);
  } else {
    catList.splice(catList.indexOf(currentCat), 1);
  }
  showFilteredCatsPainters();
}


function showFilteredCatsPainters(e){
  var painters = document.querySelectorAll('.painter');
  renderingArray.forEach(function(item) {
    if (catList.length == 0){
      item.visible = true;    
    } else {
      var visibilityFlag = false;
      for (var i=0;i<catList.length;i++){
        if (item.categories.indexOf(catList[i]) != -1 ){
          visibilityFlag = true;
        }
      }
      visibilityFlag == true  ? item.visible = true : item.visible = false;
    }
  });
  filterRender();
}




/* Input filter */

document.querySelector('.search__button').addEventListener('click', inputFiltering); 

function inputFiltering(e) {
  e.preventDefault();
  var str = document.querySelector('.search__input').value.toLowerCase();  
  renderingArray.forEach(function(item) {
    if (item.title.toLowerCase().indexOf(str) != -1 ){
      item.visible = true;
    } else {
      item.visible = false;
    }
  });
  filterRender();
}
function filterRender(){
  var painters = document.querySelectorAll('.painter');
  for (var i=0;i<renderingArray.length;i++){
    if(renderingArray[i].visible){
      painters[i].style.display = 'block';
    } else{
      painters[i].style.display = 'none';
    }
  }
}
