/**
 * @fileoverview メイン部分。
 */
window.onload = function() {
    
    var socketio = null;
    // socketio = io.connect('http://localhost:8080');
    var port = 8080;
    socketio = io.connect('/', { port: port });
    
    var user = {};
    var participantInfo = [];
    var participantID = [];

    var imageURLs = ["./images/baby.png", "./images/girl.png", "./images/old-woman.png", "./images/person-curly-hair.png", "./images/person-red-hair.png", "./images/woman-white-hair.png" ];

    // 接続通知（これでPOSTされた名前などが返却される）
    socketio.emit('connected', {});
    
    var init = function() {

    }();
    
    //-------------------------------------------------------------------------
    // tmlib
    var tmCanvasElement = tm.dom.Element('#canvas');
    var tmCanvas = tm.graphics.Canvas(tmCanvasElement.element);
    
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    
    var input = null;
    tmCanvasElement.event.pointstart(function(e) {
        input = {x: e.pointX, y: e.pointY};
        e.stop();
        socketio.emit('pointstart', {id: user.id, pointX: input.x, pointY: input.y});
    });
    tmCanvasElement.event.pointmove(function(e) {
        if (input === null) return ;
        input = {x: e.pointX, y: e.pointY};
        e.stop();
        socketio.emit('pointmove', {id: user.id, pointX: input.x, pointY: input.y});
        var canvas = document.getElementById('canvas');
        var canvasDataUrl = canvas.toDataURL();
        socketio.emit('canvas', canvasDataUrl);
    });
    tmCanvasElement.event.pointend(function(e) {
        input = null;
        e.stop();
        socketio.emit('pointend', {id: user.id});
        
        // Canvas の内容を丸々送信する
        var canvas = document.getElementById('canvas');
        var canvasDataUrl = canvas.toDataURL();
        socketio.emit('canvas', canvasDataUrl);
    });
    tmCanvasElement.event.hover(function(e) {
        input = null;

        e.stop();
    });
    //-------------------------------------------------------------------------
    var checkDrawInfo = function(id) {
        if (false === (id in participantInfo)) {
            return false;
        }
        if ('undefined' === typeof participantInfo[id].drawInfo) {
            return false;
        }
        return true;
    }
    // socket.io
    socketio.on('connected', function(object) {
        user.name = object.name;
        user.id = object.id;
        user.drawInfo = {pointX: null, pointY: null};
        user.imageIndex = object.imageIndex;
        
        let image = new Image();
        image.src = imageURLs[object.imageIndex];
        image.onload = function() {
            user.image = image;
        };
        
        // キャンバスの内容を復元
        {
            var imageObj = new Image();
            imageObj.onload = function() {
                context.drawImage(this, 0, 0);
            };
            //console.log(object.canvasDataUrl);
            imageObj.src = object.canvasDataUrl;
        }
        
        participantInfo[object.id] = user;
        participantID.push(user.id);    
        updateParticipantList();  
        
        let font = new FontFace('Hatton-Variable', 'url(Hatton-Variable.woff2) format("woff2")');
        font.load().then(function() {
            console.log(font);
            context.font = 'bold 20px Hatton-Variable'
            context.textAlign = 'center';
            tmCanvas.context.setText(context.font, context.textAlign)
        });
   
    });
    socketio.on('join', function(object) {
        var otheruser = {};
        otheruser.name = object.name;
        otheruser.id = object.id;
        otheruser.drawInfo = {pointX: null, pointY: null};
        console.log(object);
        otheruser.imageIndex = object.imageIndex;
        
        let image = new Image();
        image.src = imageURLs[object.imageIndex];
        image.onload = function() {
            otheruser.image = image;
        };
        
        participantInfo[object.id] = otheruser;  
        participantID.push(otheruser.id);      
        updateParticipantList();
    });
    socketio.on('leave', function(object) {
        delete participantInfo[object.id];
        updateParticipantList();
    });

    socketio.on('pointstart', function(object) {
        if (false === checkDrawInfo(object.id)) {
            return;
        }
        participantInfo[object.id].drawInfo.pointX = object.pointX - 40;
        participantInfo[object.id].drawInfo.pointY = object.pointY - 40;
    });
    socketio.on('pointmove', function(object) {
        if (false === checkDrawInfo(object.id)) {
            return;
        }
        tmCanvas.context.clearRect(0, 0, canvas.width, canvas.height);
        
        participantID.each(id => {
            tmCanvas.context.drawImage(
                participantInfo[id].image,
                participantInfo[id].drawInfo.pointX - 40, 
                participantInfo[id].drawInfo.pointY - 40
            );
            tmCanvas.context.fillText(
                participantInfo[id].name,
                participantInfo[id].drawInfo.pointX,
                participantInfo[id].drawInfo.pointY + 60
            );
        })
        
       
        participantInfo[object.id].drawInfo.pointX = object.pointX;
        participantInfo[object.id].drawInfo.pointY = object.pointY;
    });
    socketio.on('pointend', function(object) {
        if (false === checkDrawInfo(object.id)) {
            return;
        }
        // participantInfo[object.id].drawInfo.pointX = null;
        // participantInfo[object.id].drawInfo.pointY = null;
    });
    // socketio.on('canvas', function(dataUrl) {
    //     // if (false === checkDrawInfo(object.id)) {
    //     //     return;
    //     // }
    //     {
    //         var imageObj = new Image();
    //         imageObj.onload = function() {
    //             context.drawImage(imageObj, 0, 0);
    //         };
    //         //console.log(object.canvasDataUrl);
    //         imageObj.src = dataUrl;
    //     }
    // });
    
    
    var updateParticipantList = function() {
    //     var element = document.getElementById('participantList');
    //     element.innerHTML = '';
    // 
    //     for (var i in participantInfo) {
    //         var li = document.createElement("li");
    //         li.appendChild(document.createTextNode(participantInfo[i].name));
    //         element.appendChild(li);
    //     }
    }

};
