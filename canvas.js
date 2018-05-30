var mousePressed = false;
var lastX, lastY;
var ctx;



window.onload = function() {

    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            console.log(request);
          if( request === "draw" ) {
              
          }
      
          if( request.message === "Not Existing" ) {
              console.log('hello');
          }
        }
      );

    var canv = document.createElement('canvas');
    canv.id = 'pilavID';
    canv.style.position = 'absolute';
    canv.style.left = '0px';
    canv.style.top = '0px';
    //canv.style.pointerEvents = 'none';
    //canv.style.cursor = "url('pen48.png'), auto";
    canv.addEventListener("click", function(){
        console.log('A Click!');
    })
    //canv.style.backgroundColor = 'black';
    //canv.width = "100%";//$(document).width();//"auto";//document.documentElement.scrollWidth;//window.innerWidth//document.body.clientWidth;
    //canv.height = "100%";//$(document).height();//"auto"//document.documentElement.scrollHeight;//window.innerHeight;//document.body.clientHeight;
    document.body.appendChild(canv);
    $('#pilavID').hide();
    ctx = canv.getContext("2d");

    window.addEventListener('resize', resizeCanvas, false);
    resizeCanvas();

    $("#pilavID").bind( "mousedown", function (e) {
        //alert("hello");
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

    // $("#pilavID").mouseleave(function (e) {
    //     if (mousePressed) {
    //         mousePressed = false;
    //     }
    // });


    /*
    canv.addEventListener("mousedown", function(e) {
        //alert("hello");
        mousePressed = true;
        Draw(e.pageX - canv.offset().left, e.pageY - $(this).offset().top, false);
    });

    canv.addEventListener("mousemove", function(e) {
        //alert("hello");
        if (mousePressed) {
            Draw(e.pageX - canv.offset().left, e.pageY - $(this).offset().top, true);
        }
    });
    

    canv.addEventListener("mouseup mouseleave", function(e) {
        //alert("hello");
        if (mousePressed) {
            mousePressed = false;
            // undoArray.push(linelength)
            // linelength = 0;
        }
    });
    */

}

function resizeCanvas() {
    $('#pilavID').hide();
    $('#pilavID').width = 0;
    $('#pilavID').height = 0;
    var canvasWidth = $(document).width();//document.documentElement.scrollWidth;
    var canvasHeight = $(document).height();//document.documentElement.scrollHeight;
    ctx.canvas.width = canvasWidth;
    ctx.canvas.height = canvasHeight;
    $('#pilavID').width = canvasWidth;
    $('#pilavID').height = canvasHeight;
    //console.log(canvasWidth);
    //console.log(canvasHeight);
    drawingAreaHeight = canvasHeight;
    drawingAreaWidth = canvasWidth;
    
    redrawCanvas();
}

function Draw(x, y, isDown) {
    if (isDown) {
        var width = 5;
        ctx.beginPath();
        ctx.strokeStyle = "black";
        //alert(parseInt($('#myRange').val()));
        ctx.lineWidth = width;/*$('#selWidth').val();*/
        ctx.lineJoin = "round";
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.closePath();       
        ctx.stroke();
        console.log($(document).width());console.log($(document).height());
        // linelength++;

        //lines.push(canv);
        // var line = { strokeStyle: $('#selColor').css("background-color"), lineWidth: width, lineJoin: "round", lastX: lastX, lastY: lastY, x: x, y: y }
        // lines.push(line);

        
    }
    //canv.putImageData(colorLayerData, 0, 0);
    lastX = x; lastY = y;
};

function allowedit() {
    $('#pilavID').css("pointer-events", "auto");
}
