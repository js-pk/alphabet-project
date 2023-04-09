var api_state = 'loaded';

function loadDoc(zodiac, color) {
  api_state = 'loading';
  $("#result").html(`${zodiac}'s horoscope is now loading..`);
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4) {
      if (this.status == 200) {
        api_state = 'loaded';
        response = JSON.parse(this.responseText);
        console.log(response);
        $("#result").css('color', `${color}`);
        $('#result').html(`<h1>${response.sign} ${response.date}</h1>${response.horoscope}`);
      } else {
        api_state = 'loaded'
        $("#result").html('sorry there was an error.. please try agian')
      }
    } 
  };
  xhttp.open("GET", `https://cors-anywhere.herokuapp.com/https://ohmanda.com/api/horoscope/${zodiac}/`, true);
  xhttp.send();
}


// $.ajax({
//   url: "https://cors-anywhere.herokuapp.com/https://ohmanda.com/api/horoscope/aquarius/",
//   type: 'GET',
//   dataType: 'json', // added data type
//   success: function(res) {
//       console.log(res);
//       alert(res);
//   }
// });

function get_random_pastel_color() {
  pastel_color = tinycolor.mix(tinycolor.random().saturate(10), tinycolor('#fff'), amount = 20).toHexString();
  return pastel_color
}

function zodiac(day, month){
   // returns the zodiac sign according to day and month ( https://coursesweb.net/ )
   var zodiac =['', 'capricorn', 'aquarius', 'pisces', 'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn'];
   var last_day =['', 19, 18, 20, 20, 21, 21, 22, 22, 21, 22, 21, 20, 19];
   return (day > last_day[month]) ? zodiac[month*1 + 1] : zodiac[month];
  }

$(document).ready(function() {
  
  
  years_xx = ['196*', '197*', '198*', '199*', '200*'];
  years_xx.forEach((xx, i) => {
    menu_item = $("#parent").append(`<div class="menu-item" id="${i}">${xx}</div>`);
    next_menu = $(`#${i}`).append(`<div class="menu" id="${i}_menu"></div>`);
    [0,1,2,3,4,5,6,7,8,9].forEach((x, j) => {
      $(`#${i}_menu`).append(`<div class="menu-item" id="${i}_${j}">${years_xx[i].replace('*', x)}</div>`);
      $(`#${i}_${j}`).append(`<div class="menu" id="${i}_${j}_menu"></div>`);
      ['JAN', 'FAB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'].forEach((m, k) => {
        $(`#${i}_${j}_menu`).append(`<div class="menu-item" id="${i}_${j}_${k}">${m}</div>`)
        $(`#${i}_${j}_${k}`).append(`<div class="menu" id="${i}_${j}_${k}_menu"></div>`);
        if (['JAN', 'MAR', 'MAY', 'JUL', 'AUG', 'OCT', 'DEC'].includes(m)) {
          days = Array.from({length:31}, (element, index) => index);
          days.forEach((d, l) => {
            $(`#${i}_${j}_${k}_menu`).append(`<div class="menu-item" id="${i}_${j}_${k}_${l}">${d+1}</div>`)
          })
        } else {
          days = Array.from({length:30}, (element, index) => index);
          days.forEach((d, l) => {
            $(`#${i}_${j}_${k}_menu`).append(`<div class="menu-item" id="${i}_${j}_${k}_${l}">${d+1}</div>`)
          })
        }
      })
    })
  })
  

    $(".menu-item").mouseenter(function() {
      if (api_state == 'loaded') {
        color = get_random_pastel_color();
        $(this).addClass('hover');
        $(this).css('color', `${color}`);
        $(this).css('border-color', `${color}`);
        if ($(this).children().hasClass('menu')) {
          $(this).children().css('display', 'flex');
        } else {
          id = $(this).attr('id');
          matches = id.match(/(\d)_(\d)_(\d+)_(\d+)/);
          month = matches[3];
          day = matches[4];
          loadDoc(zodiac(day, month), color);
        }
      }
    })
    $(".menu-item").mouseleave(function() {
      if (api_state == 'loaded') {
        $(this).removeClass('hover');
        $(this).css('color', 'inherit');
        $(this).css('border-color', 'inherit');
        if ($(this).children().hasClass('menu')) {
          $(this).children().css('display', 'none');
        }
      }
    })


  
});