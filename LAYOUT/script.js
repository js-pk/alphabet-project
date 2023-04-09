$( document ).ready(function() {
    $(".item").mouseenter(
      function() {
        $(this).addClass("hovered");
      }
    );
    
    $(".item").mouseleave(
      function() {
        $(this).removeClass("hovered");
      }
    )
    
    $(".item").click(
      function() {
        let display = $(this).parent().css("display");
        if( display == "grid") {
          $(this).parent().css("display", "block");
          $(".item").css("display", "flex");
          $(".item").css("padding", "0");
          $(".item").css("margin-bottom", "8px");
        } else if (display == "block") {
          $(this).parent().css("display", "inline-block");
          $(".item").css("display", "inline-block");
          $(".item").css("padding", "4px");
          $(".item").css("margin-bottom", "8px");
        } else {
          $(this).parent().css("display", "grid");
          $(".item").css("display", "flex");
          $(".item").css("padding", "0");
          $(".item").css("margin-bottom", "0");
        }
        
      }
    )
});