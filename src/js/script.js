document.addEventListener("DOMContentLoaded", function(event) { 


  var renderingArray = [];
  var painterList = document.querySelector('.search-results__painters');

  /* get data from json */

  getJson("js/data.json", function(generated){
    var dataObject = {}; 
    dataObject = generated; 
    renderingArray = dataObject.data;
    renderingArray.forEach(function(item){
      item.visible = true;
    });
    createPainterList(renderingArray);  
  });
  function getJson(url, callback){
    var req  = new XMLHttpRequest();
    req.open("GET", url);
    req.addEventListener('load', function(){
      try {
        var responseJson = JSON.parse(this.responseText);
      } catch (err) {
        console.log( "Sorry, the data has error, we'll try to get it again" );
        console.log( err.name );
        console.log( err.message );
      }
      callback(responseJson)
    });
    req.send();
  }

  /* Create painters list */

  function createPainterList(arr){ 
    painterList.innerHTML = ''; 
    arr.forEach(function(item){
      createPainterItem(item)
    });  
  }
  function createPainterItem(item){
    var article = document.createElement('article');
    article.classList.add('painter');

    var cats = ''; 
    for (var i=0;i<item.categories.length;i++){
      cats += '<span>'+item.categories[i].title+'</span>';
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

    painterList.appendChild(article)
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
    createPainterList(renderingArray);
    filterRender();
  }
  function sortName(e){
    e.preventDefault();
    changeClasses(this);
    renderingArray.sort(function(a, b){
      if (a.title > b.title) return 1;
      if (a.title < b.title) return -1;
    });
    createPainterList(renderingArray);
    filterRender();
  }
  function sortFeedback(e){
    e.preventDefault();
    changeClasses(this);
    renderingArray.sort(function(a, b){
      return b.NumberOfFeedback - a.NumberOfFeedback;
    });
    createPainterList(renderingArray);
    filterRender();
  }

  function changeClasses(current){
    var sorts = document.querySelectorAll('.sort__item');
    for (var i=0;i<sorts.length;i++){
      sorts[i].classList.remove('sort__item--active'); 
    }
    current.classList.add('sort__item--active');
  }




  /* Categories filter */

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
    console.log(catList)
    showFilteredCatsPainters();
  }

  function showFilteredCatsPainters(e){
    var painters = document.querySelectorAll('.painter');
    renderingArray.forEach(function(item) {
      console.log(item.categories.id)
      if (catList.length == 0){
        item.visible = true;    
      } else {
        var visibilityFlag = false;
        for (var i=0;i<catList.length;i++){
          for (var j=0;j<item.categories.length;j++){
            if (item.categories[j].id == catList[i] ){
              visibilityFlag = true;
            }
          }
        }
        visibilityFlag == true ? item.visible = true : item.visible = false;
      }
    });
    filterRender();
  }


  /* Input filter */

  document.querySelector('.search__input').addEventListener('change', inputFiltering); 
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


  /* Hamburger */

  document.querySelector('.hamburger').addEventListener('click', function(e){
    e.preventDefault();
    this.closest('.nav').querySelector('.nav__list').classList.toggle('nav__list--shown')
  }); 


});
