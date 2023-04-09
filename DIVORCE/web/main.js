$(document).ready(function() {
  
  const SINGLE_PERCENTAGE = 0.07;
  const MAX_LEVEL = 6; 
  const SINGLE = false;
  const COUPLE = true;
  
  let count = 0;
  let level = 0;
  let totalSinglesVolume = 0;
  let volume = 0;

  function divideOnHover(box) {        
    totalSinglesVolume = getVolume($("#container"));
    volume = 0; //reset volume. refactoring maybe later..

    box.css('background-image', '');
    box.css('background-color', '');
    if (box.data('level') < MAX_LEVEL) {
      if (totalSinglesVolume < SINGLE_PERCENTAGE) {
        append(box, SINGLE, level);
        append(box, SINGLE, level);
        append(box, COUPLE, level);
        append(box, SINGLE, level);
      } else {
        append(box, COUPLE, level);
        append(box, COUPLE, level);
        append(box, COUPLE, level);
        append(box, COUPLE, level);
      }
    }
    
    addText(count%11);
    count++;
  }
  
  function getVolume(box) {
    if (box.children().length > 0) {
      box.children().each( function() {
        getVolume($(this));
      });
    } else {
      box.hasClass('single') ? volume += (1/2**box.data('level'))**2 : 0;
    }
    return volume;
  }

  function append(parent, isMarried, level) {   
    type = isMarried ? 'couple' : 'single'; 

    let randomImageNumber = Math.floor(Math.random() * 8) + 1;
    box = $("<div></div>", {
      "class": `grid toHover ${type}`,
      "css": {
        'background-image':`url(\'./images/${type}/${randomImageNumber}.png\')`,
        'background-color':'#ffffff'
      }
    })
    box.data('level', parent.data('level') + 1);
    parent.append(box);
  }
  
  function addText(index) {
    texts = ['2019년, ', '대한민국 ', '전체 ', '가구수는 ', '20,891가구이며, ', '한부모가구의 ', '수는 ', '1,529가구으로, ', '한부모가구 ', '비율은 ', '7.3%이다. '];
    currentText = $('#background').text();
    if (currentText.length > 122) {
      $('#background').text(currentText.substr(currentText.indexOf(" ") + 1) + texts[index]);
    } else {
      $('#background').text(currentText + texts[index]);
    }
  }

  // set default level
  $("#container").data('level', 0);
  
  //divide the boxes when mouse hover
  $(document.body).on("mouseenter", ".toHover", function(e) {
    e.preventDefault();
    e.stopPropagation();
    $(this).removeClass('toHover');
    divideOnHover($(this))
  })
  
  $(document.body).on("click", "#container", function() {
    volume = 0; //reset volume
  })
});