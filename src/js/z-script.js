jQuery(document).ready(function($){

  $('.hamburger').click(function(e) {
      e.preventDefault();
      $(this).closest('.nav').find('.nav__list').slideToggle();
  });


  $(window).resize(function(){
    if ($(window).width() > 768) {
      $('.nav__list').show();
      $('.nav__hamburger').hide();
    } else {
      $('.nav__list').hide();
      $('.nav__hamburger').show();
    }
  });


});

