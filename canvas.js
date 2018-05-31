var mousePressed = false;
var lastX, lastY;
var ctx;
var lines = [];
var selected = 'select';


window.onload = function() {

    $.get(chrome.extension.getURL('test.html'), function(data) {
        $(data).appendTo('body');
        // Or if you're using jQuery 1.8+:
        // $($.parseHTML(data)).appendTo('body');
    });

    //$('body').append(string);

    // dragElement(document.getElementById(("mydiv")));

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

    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {

            if( request === "popout" ) {
                console.log('hello');
                var div = document.createElement("div");
                var textnode = document.createTextNode("Water"); 
                div.appendChild(textnode);
                document.body.appendChild(div);
                div.draggable = true;
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
        }
    );

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
    resizeCanvas();

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
        var width = 10;
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255,255,0)';
        //alert(parseInt($('#myRange').val()));
        ctx.lineWidth = width;/*$('#selWidth').val();*/
        ctx.lineJoin = "round";
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.closePath();       
        ctx.stroke();
        // linelength++;

        var line = { strokeStyle: $('#selColor').css("background-color"), lineWidth: width, lineJoin: "round", lastX: lastX, lastY: lastY, x: x, y: y }
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

var string = `<div id="mydiv">
<div id="mydivheader">Click here to move</div>
<p>Move</p>
<p>this</p>
<p>DIV</p>
</div>`


