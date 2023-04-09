$(document).ready(function() {
  $(".young").hover(function(e) {
    if ( $(".background").css("display") != "flex") {
      $(".background").css("display", "flex")
    } else {
      $(".background").css("display", "none")
    }
    
  })
})

