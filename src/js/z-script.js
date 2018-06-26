jQuery(document).ready(function($){

  $('.hamburger').click(function(e) {
      e.preventDefault();
      $(this).closest('.nav').find('.nav__list').slideToggle();
  });


});

