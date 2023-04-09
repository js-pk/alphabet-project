import bottle
from bottle import route, run, template, request, static_file, BaseTemplate
from plupload import plupload
import os
from scripts import maincolor 

app = bottle.default_app()
BaseTemplate.defaults['get_url'] = app.get_url  # reference to function

@route('/upload')
def index():
  return template('upload')

@route('/upload', method='POST')
def upload():
  image = request.files.get('image')

  name, ext = os.path.splitext(image.filename)
  if ext not in ('.png','.jpg','.jpeg'):
    return 'File extension not allowed.'  
    
  save_path = './images/' 
  image.save(save_path, True) # appends image.filename automatically
  colors = maincolor.get_main_color(save_path + image.filename)
  return template('result', path=image.filename, colors=colors)

@route('/images/<filename:path>', name='images')
def serve_static(filename):
  return static_file(filename, root='images')
  
run(host='localhost', port=8080)