<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="./style.css"/>
  </head>
  <body style="margin:0; padding:0; width:1280px; height:720px; display:flex; flex-direction:row">
    %for color in colors:
      <div style="background-color:{{color}}; height:720px; flex:1"></div>
    %end
    <div style='position:absolute; width:1280px; height:720px; display:flex; align-items:center; justify-content:center'>
      <img style="height:70%" src={{get_url('images', filename=path)}} />
    </div>
  </body>
</html>