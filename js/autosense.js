$(document).ready(function () {
  
  'use strict';
  
  var c, 
      currentScrollTop = 0,
      navbar = $('nav'),
      headerHeight = 130;


  // Hide/show navigation on scroll down
  $(window).scroll(function () {
    var a = $(window).scrollTop();
    var b = navbar.height();
    
    currentScrollTop = a;
    // console.log("a: " + a);
    // console.log("c: " + c);

    if (c < currentScrollTop && a > b + b) {
      navbar.addClass("scrollUp");
      // console.log("first part");
    } else if (c > currentScrollTop && !(a <= b) ) {
      navbar.removeClass("scrollUp");
      // console.log("second part");
    }
    c = currentScrollTop;
  });
  
  
  
  // Lifts the navigation when B2B/B2C banner closed
  $('.close').click(function(){
    navbar.addClass('lift');
  });



  // Corner checkmark of the price card under the Price page
  $('.dongle-no-wifi').click(function() {
    $('.dongle-wifi').removeClass('selected')
    $('.dongle-no-wifi').addClass('selected');
  });

  $('.dongle-wifi').click(function() {
    $('.dongle-no-wifi').removeClass('selected')
    $('.dongle-wifi').addClass('selected');
  });


  // Animate/scroll to in page hash links 
  $('.nav-link').click(function() {
    $('html, body').stop(true, true).animate({
        scrollTop: $(this.hash).offset().top - headerHeight - 50
    }, 750);
    return false;
  });


  // Repositions hash when coming from a subpage
  var hashScrollFix = function() {
    if (window.location.hash) {
      $('html, body').scrollTop( $(window.location.hash).offset().top - headerHeight - 50 );
    }
  };

  setTimeout(hashScrollFix, 250);
  
  // setCookie
  function setCookie(cname,cvalue,exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

  // sets cookie for fleet-banner 
  $('.close').click(function(){
    setCookie("fleet-banner", "true", {expires: 365});
  });

    
  // checks if cookie is available
  var isCookieSet = function (name) {
    return document.cookie.indexOf(name) > -1;
  };

  
  // checks if fleet-banner cookie is false, if not, displays the banner and pushes down the navbar with lift css class
  if (!isCookieSet('fleet-banner')) {
    var fleetBanner = document.getElementById('fleet-banner').style.display = "block";
    navbar.removeClass('lift');
  }
  
});
