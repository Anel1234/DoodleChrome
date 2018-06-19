var mousePressed = false;
var lastX, lastY;
var ctx;
var lines = [];
var selected = 'select';
var selectedColor = '000000';
var selectedWidth = 25;


window.onload = function() {

    // $.get(chrome.extension.getURL('test.html'), function(data) {
    //     $(data).appendTo('body');
    //     // Or if you're using jQuery 1.8+:
    //     // $($.parseHTML(data)).appendTo('body');
    //     attachDrag();
    // });

    
    //$('body').append(string);

    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {

            if( request === "loaded" ) {
                resizeCanvas();
            }

            if( request === "popout" ) {
                resizeCanvas();
                if($('#pilavdiv').length) {
                    if($('#pilavdiv').is(":visible")) {
                        $('#pilavdiv').hide();
                    }
                    else $('#pilavdiv').show();
                }
                else{
                $.get(chrome.extension.getURL('popuptest.html'), function(data) {
                    $(data).appendTo('body');
                    // Or if you're using jQuery 1.8+:
                    // $($.parseHTML(data)).appendTo('body');
                    attachDrag();
                });
            }
            }

            if( request.includes('colorcode')) {
                selectedColor = request.replace('colorcode:','');
            }

            if( request.includes('rangechange')) {
                selectedWidth = request.replace('rangechange:','');
            }

            if( request === "select" ) {
                $("#pilavID").css('pointer-events', "none");
                selected = "select";
            }
            if( request === "draw") {
                //resizeCanvas();
                $("#pilavID").css('pointer-events', "auto");
                $("#pilavID").show();
                ctx.globalCompositeOperation="source-over";
                ctx.globalAlpha=1;
                selected = "draw";
            }
            // if( request === "paste") {
            //     //resizeCanvas();
            //     var event = new CustomEvent("paste");
            //     window.dispatchEvent(event);
            // }
            if( request === "highlight" ) {
                //resizeCanvas();
                $("#pilavID").css('pointer-events', "auto");
                $("#pilavID").show();
                ctx.globalCompositeOperation="xor";
                ctx.globalAlpha=0.5;
                selected = "highlight";
            }
            if( request === "erase") {
                lines = [];
                redrawCanvas();
            }

            if( request === "deleteImage"){
                $('.piloDragDivSelected').remove();    
            }
        }
    );

    this.document.onkeydown = function(){
        var key = event.keyCode || event.charCode;
        if( key == 8 || key == 46 ){
            $('.piloDragDivSelected').remove();
        }
    }

    var canv = document.createElement('canvas');
    canv.id = 'pilavID';
    canv.style.position = 'absolute';
    canv.style.left = '0px';
    canv.style.top = '0px';
    canv.style.zIndex = 1000001;
    //canv.style.pointerEvents = 'none';
    //canv.style.cursor = "url('pen48.png'), auto";
    canv.addEventListener("click", function(){
        console.log('A Click!');
    })

    window.addEventListener("paste", pasteHandler);
    //canv.style.backgroundColor = 'black';
    //canv.width = "100%";//$(document).width();//"auto";//document.documentElement.scrollWidth;//window.innerWidth//document.body.clientWidth;
    //canv.height = "100%";//$(document).height();//"auto"//document.documentElement.scrollHeight;//window.innerHeight;//document.body.clientHeight;
    document.body.appendChild(canv);
    ctx = canv.getContext("2d");

    $("#pilavID").bind( "mousedown", function (e) {
        mousePressed = true;
        Draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, false);
    });

    $("#pilavID").bind( "mousemove", (function (e) {
        if (mousePressed) {
            Draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, true);
        }
    }));

    $("#pilavID").bind( "mouseup mouseleave", (function (e) {
        if (mousePressed) {
            mousePressed = false;
        }
    }));

    $('#pilavID').hide();
    window.addEventListener('resize', resizeCanvas, false);
    $("#pilavID").css('pointer-events', "none");
    //resizeCanvas();

}

function resizeCanvas() {
    $('#pilavID').hide();
    $('#pilavID').width = 0;
    $('#pilavID').height = 0;
    var canvasWidth = $(document).width();
    var canvasHeight = $(document).height();
    ctx.canvas.width = canvasWidth;
    ctx.canvas.height = canvasHeight;
    $('#pilavID').width = canvasWidth;
    $('#pilavID').height = canvasHeight;
    //drawingAreaHeight = canvasHeight;
    //drawingAreaWidth = canvasWidth;
    redrawCanvas();
    $('#pilavID').show();
}

function Draw(x, y, isDown) {
    if (isDown) {
        ctx.beginPath();
        ctx.strokeStyle = selectedColor;
        //alert(parseInt($('#myRange').val()));
        ctx.lineWidth = selectedWidth;/*$('#selWidth').val();*/
        ctx.lineJoin = "round";
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.closePath();       
        ctx.stroke();

        // linelength++;

        var line = { strokeStyle: selectedColor, lineWidth: selectedWidth, lineJoin: "round", lastX: lastX, lastY: lastY, x: x, y: y, selected: selected }
        lines.push(line);

        
    }
    //canv.putImageData(colorLayerData, 0, 0);
    lastX = x; lastY = y;
};

function redrawCanvas() {
    
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    var i;
    var len = lines.length;
    for (i = 0; i < len; i++) {

        var x = lines[i];
        //alert(x);
        
        if (x.selected == 'highlight') {
            ctx.globalCompositeOperation="xor";
            ctx.globalAlpha=0.5;
            console.log('testing');
        }
        else {
            ctx.globalCompositeOperation="source-over";
            ctx.globalAlpha=1;
        }
        ctx.beginPath();
        ctx.strokeStyle = x.strokeStyle;
        ctx.lineWidth = x.lineWidth;
        ctx.lineJoin = x.lineJoin;
        ctx.moveTo(x.lastX, x.lastY);
        ctx.lineTo(x.x,x.y);
        ctx.closePath();
        ctx.stroke();
    }
};

function pasteHandler(e){

    // var imageCanvas = document.createElement('canvas');
    // imageCanvas.style.position = 'absolute'
    // imageCanvas.style.zIndex = 999999;
    // imageCanvas.style.height = 1000;
    // imageCanvas.style.width = 1000;
    // //ctx.appendChild(imageCanvas);
    // document.body.appendChild(imageCanvas);

    if(e.clipboardData == false) return false; //empty
    var items = e.clipboardData.items;
    console.log(items);
    if(items == undefined) return false;
    for (var i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") == -1) continue; //not image
        var blob = items[i].getAsFile();
        var URLObj = window.URL || window.webkitURL;
        var source = URLObj.createObjectURL(blob);
        paste_createImage(source);
        }
    }

//draw pasted object
function paste_createImage(source) {

    var someDiv = document.createElement('div');
    someDiv.style.display = 'inline-block';
    someDiv.className = 'piloDragDiv';
    var someImg = new Image();
    //someImg.style.border = '1px solid red';
    someImg.src = source;
    //$('.piloImgSelected').removeClass('piloImgSelected');
    someImg.className = 'piloResizeImg'; //piloImgSelected';
    someImg.onload=function() {
        someImg.style.height = someImg.naturalHeight + 'px';
        someImg.style.width = someImg.naturalWidth + 'px';
        someImg.parentNode.style.height = someImg.style.height;
        someImg.parentNode.style.width = someImg.style.width;
        someImg.style.zindex = '999999';
    }

    

    someImg.onkeydown = function(){
        //alert('you pressed delete!!!DSdasd')
        $('.piloResizeImgSelected').remove();
        var key = event.keyCode || event.charCode;
        if( key == 8 || key == 46 ){
            //alert('2hshsahha');
            this.remove();
        }
    }

    // someImg.click(function(){
    //     $('.piloImgSelected').removeClass('piloImgSelected');
    //     this.className += 'piloImgSelected';
    // });

    someDiv.style.top = $(window).scrollTop() + (window.innerHeight / 2) + "px";
    someDiv.style.left = (window.innerWidth / 2) + "px";
    someDiv.style.position = 'absolute';


    someDiv.appendChild(someImg);
    document.body.appendChild(someDiv);

    $('.piloResizeImg').resizable();
    $('.piloDragDiv').draggable({
        appendTo: 'body',
        start: function(event, ui) {
            isDraggingMedia = true;
        },
        stop: function(event, ui) {
            isDraggingMedia = false;
        }
    });

    $('.piloDragDiv').hover(
        function(){ $(this).addClass('piloDragDivSelected') },
        function(){ $(this).removeClass('piloDragDivSelected') }
    )

//     var interact1 = document.createElement('div');
//     var interact2 = new Image();
//     interact2.src = source;
//     interact2.style.border = '1px solid red';

//     interact1.className = 'resize-container';
//     interact2.className = 'resize-drag';

//     document.body.appendChild(interact2);
//     //document.body.appendChild(interact1);

//     $('.resize-drag').draggable();
//     interact('.resize-drag')
// //   .draggable({
// //     onmove: window.dragMoveListener
// //     // ,restrict: {
// //     //   restriction: 'parent',
// //     //   elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
// //     // },
// //   })
//   .resizable({
//     // resize from all edges and corners
//     edges: { left: true, right: true, bottom: true, top: true },

//     // keep the edges inside the parent
//     // restrictEdges: {
//     //   outer: 'parent',
//     //   endOnly: true,
//     // },

//     // minimum size
//     restrictSize: {
//       min: { width: 100, height: 50 },
//     },

//     inertia: true,
//   })
//   .on('resizemove', function (event) {
//     var target = event.target,
//         x = (parseFloat(target.getAttribute('data-x')) || 0),
//         y = (parseFloat(target.getAttribute('data-y')) || 0);

//     // update the element's style
//     target.style.width  = event.rect.width + 'px';
//     target.style.height = event.rect.height + 'px';

//     // translate when resizing from top or left edges
//     x += event.deltaRect.left;
//     y += event.deltaRect.top;

//     target.style.webkitTransform = target.style.transform =
//         'translate(' + x + 'px,' + y + 'px)';

//     target.setAttribute('data-x', x);
//     target.setAttribute('data-y', y);
//     target.textContent = Math.round(event.rect.width) + '\u00D7' + Math.round(event.rect.height);
//   });

    // var somediv = document.createElement('div');
    // somediv.classname = "somepiloname";
    // //somediv.style.height = 100;
    // //somediv.style.width = 100;
    // somediv.style.display = "inline-block";
    // somediv.style.backgroundColor = 'red';
    // somediv.style.resize = "both";
    // somediv.style.overflow = "auto";
    // document.body.appendChild(somediv);
    // $('.somepiloname').draggable();
    
    //somediv.className = 'testID';


    // somediv.style.top = $(window).scrollTop() + (window.innerHeight / 2) + "px" //$(window).scrollTop() / 2 + "px"; //document.documentElement.scrollHeight + "px";
    // somediv.style.left = (window.innerWidth / 2) + "px";
    // somediv.style.position = 'absolute';

    // var imageCanvas = document.createElement('canvas');
    // imageCanvas.style.position = 'absolute'
    // imageCanvas.style.zIndex = 999999;
    // imageCanvas.style.background = 'transparent';
    // imageCanvas.class = 'piloCanvas';

    //var imagectx = imageCanvas.getContext("2d");
    // var pastedImage = new Image();
    // // pastedImage.className = 'piloPastedImage'
    // $(".resizebleImage").resizable();

	// pastedImage.onload = function(){
    //     //console.log(this.width);
    //     //imagectx.canvas.height = this.height;
    //     //imagectx.canvas.width = this.width;
    //     //somediv.height = this.height;
    //     //somediv.width = this.width;
    //     //console.log(somediv.height);
    //     //console.log(somediv.width);
    //     //imagectx.drawImage(pastedImage, 0, 0);
    // 	}






    // var pastedImage = new Image();
    // pastedImage.className = ("piloPastedImage")
    // pastedImage.src = source;
    // pastedImage.style.top = $(window).scrollTop() + (window.innerHeight / 2) + "px"
    // pastedImage.style.left = (window.innerWidth / 2) + "px";
    // pastedImage.style.position = 'absolute !important';
    // pastedImage.style.zIndex = 999999;
    // //pastedImage.style.resize = 'both';
    // //pastedImage.style.overflow = 'auto';
    // document.body.appendChild(pastedImage);
    // $(".piloPastedImage").draggable().find("img").resizable();







    //pastedImage.style.height = 1000;
    //pastedImage.style.width = 1000;
    //document.body.appendChild(pastedImage);
    //$(".piloPastedImage").draggable();
    
    //$(".piloPastedImage").selectable();
    // somediv.appendChild(imageCanvas);
    // document.body.appendChild(somediv);
    // somediv.height = imagectx.canvas.height;
    // somediv.width = imagectx.canvas.width;
    // somediv.appendChild(imageCanvas);

    // imageCanvas.onresize = function() {
    //     console.log(imagectx.canvas.height);
    //     console.log(imagectx.canvas.width);
    //     imagectx.canvas.height = 100;//somediv.height;
    //     imagectx.canvas.width = 100;//somediv.width;
    // }

    // imageCanvas.onclick = function(){

    //     var data=this.toDataURL();
    //     var ctx = this.getContext("2d");
    //     this.width = 1000;
    //     this.height = 1000;

    //     var img = new Image();
    //     img.onload=function(){
    //         ctx.canvas.height = 1000;
    //         ctx.canvas.width = 1000;
    //         ctx.drawImage(img,0,0,img.width*0.5,img.height*0.5,0,0,this.width,this.height);
    //     }
    //     img.src = data;

    //     // var tempctx = this.getContext("2d");
    //     // var image = new Image();
    //     // image.src = this.toDataURL();
    //     // tempctx.canvas.height = 1000;
    //     // tempctx.canvas.width = 1000;
    //     // tempctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, 1000, 1000);
    
    // };
    // $('.testID').click(function() {
    //     console.log('resizing');
    //     var image = new Image();
    //     image.src = imageCanvas.toDataURL();
    //     imageCanvas.height = 500;
    //     imageCanvas.Width = 500;
    //     imagectx.canvas.height = 500;
    //     imagectx.canvas.width = 500;
    //     imagectx.drawImage(image, 0, 0);
    // });
    // $('.piloCanvas').resize(function() {
    //     console.log('imageresizedwhah');
    //     var image = new Image();
    //     image.src = this.toDataURL();
    //     this.drawImage(image, 0, 0);
    // });
	// }






function attachDrag() {
    dragElement(document.getElementById(("pilavdiv")));
    
    function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    /* if present, the header is where you move the DIV from:*/
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    /* otherwise, move the DIV from anywhere inside the DIV:*/
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
}
}
}
}
