window.onload = function() {
    var canv = document.createElement('canvas');
    canv.id = 'someId';
    canv.style.position = 'absolute';
    canv.style.left = '0px';
    canv.style.top = '0px';
    canv.style.pointerEvents = 'none';
    //canv.style.cursor = "url('pen48.png'), auto";
    canv.addEventListener("click", function(){
        console.log('A Click!');
    })
    //canv.style.backgroundColor = 'black';
    canv.width = document.documentElement.scrollWidth;//window.innerWidth//document.body.clientWidth;
    canv.height = document.documentElement.scrollHeight;//window.innerHeight;//document.body.clientHeight;
    document.body.appendChild(canv);
}