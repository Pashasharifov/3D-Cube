var forward=document.getElementById('forward')
var left=document.getElementById('left')
var right=document.getElementById('right')
var bottom=document.getElementById('bottom')
var goPlanet=document.querySelector('#goPlanet')
var visible=document.getElementById('visible')
var invisible=document.getElementById('invisible')
var img = document.querySelector('canvas')
var normal=document.getElementById('normal')
var grow=document.getElementById('grow')
var shrink=document.getElementById('shrink')
var normalTwo=document.getElementById('normalTwo')
var stretch =document.getElementById('stretch')
var playMusic=document.getElementById('playMusic')
var audio= new Audio("superman.mp3")
var stopMusic=document.getElementById('stopMusic')

playMusic.onclick=function(){
     audio.play()
}
stopMusic.onclick=function(){
    audio.pause()
}

grow.onclick=function(){
    img.style.transform='scale(2)'
    img.style.transition='1s'
}
normal.onclick=function(){
    img.style.transform='scale(1)'
    img.style.transition='1s'
}
shrink.onclick=function(){
    img.style.transform='scale(0.5)'
    img.style.transition='1s'
}
normalTwo.onclick=function(){
    img.style.transform='skew(0)'
}
stretch.onclick=function(){
    img.style.transform='skew(15deg, 15deg)'
}


forward.onclick=function(){
    $('canvas').animate({
        top:'-=80px'
    },'fast')
}
left.onclick=function(){
    $('canvas').animate({
        left:'-=80px'
    },'fast')
}
right.onclick=function(){
    $('canvas').animate({
        left:'+=80px'
    },'fast')
}
bottom.onclick=function(){
    $('canvas').animate({
        top:'+=80px'
    },'fast')
}
goPlanet.onclick=function(){
    img.style.top="300px",
    img.style.left="1040px",
    img.style.height="200px",
    img.style.width="200px",
    img.style.position="absolute"
}
visible.onclick=function(){
 img.style.display='block'
}
invisible.onclick=function(){
    img.style.display='none'
   }
   
   "use strict";

   var canvas;
   var gl;
   
   var numPositions  = 36;
   
   var positions = [];
   var colors = [];
   
   var xAxis = 0;
   var yAxis = 1;
   var zAxis = 2;
   
   var axis = 0;
   var theta = [0, 0, 0];
   
   var thetaLoc;
   
   window.onload = function init()
   {
       canvas = document.getElementById("gl-canvas");
   
       gl = canvas.getContext('webgl2');
       if (!gl) alert("WebGL 2.0 isn't available");
   
       colorCube();
   
       gl.viewport(0, 0, canvas.width, canvas.height);
       gl.clearColor(1.0, 1.0, 1.0, 1.0);
   
       gl.enable(gl.DEPTH_TEST);
   
       //
       //  Load shaders and initialize attribute buffers
       //
       var program = initShaders(gl, "vertex-shader", "fragment-shader");
       gl.useProgram(program);
   
       var cBuffer = gl.createBuffer();
       gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
       gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);
   
       var colorLoc = gl.getAttribLocation( program, "aColor" );
       gl.vertexAttribPointer( colorLoc, 4, gl.FLOAT, false, 0, 0 );
       gl.enableVertexAttribArray( colorLoc );
   
       var vBuffer = gl.createBuffer();
       gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
       gl.bufferData(gl.ARRAY_BUFFER, flatten(positions), gl.STATIC_DRAW);
   
   
       var positionLoc = gl.getAttribLocation(program, "aPosition");
       gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
       gl.enableVertexAttribArray(positionLoc);
   
       thetaLoc = gl.getUniformLocation(program, "uTheta");
   
       //event listeners for buttons
   
       document.getElementById( "xButton" ).onclick = function () {
           axis = xAxis;
       };
       document.getElementById( "yButton" ).onclick = function () {
           axis = yAxis;
       };
       document.getElementById( "zButton" ).onclick = function () {
           axis = zAxis;
       };
   
       render();
   }
   
   function colorCube()
   {
       quad(1, 0, 3, 2);
       quad(2, 3, 7, 6);
       quad(3, 0, 4, 7);
       quad(6, 5, 1, 2);
       quad(4, 5, 6, 7);
       quad(5, 4, 0, 1);
   }
   
   function quad(a, b, c, d)
   {
       var vertices = [
           vec4(-0.5, -0.5,  0.5, 1.0),
           vec4(-0.5,  0.5,  0.5, 1.0),
           vec4(0.5,  0.5,  0.5, 1.0),
           vec4(0.5, -0.5,  0.5, 1.0),
           vec4(-0.5, -0.5, -0.5, 1.0),
           vec4(-0.5,  0.5, -0.5, 1.0),
           vec4(0.5,  0.5, -0.5, 1.0),
           vec4(0.5, -0.5, -0.5, 1.0)
       ];
   
       var vertexColors = [
           vec4(0.0, 0.0, 0.0, 1.0),  // black
           vec4(1.0, 0.0, 0.0, 1.0),  // red
           vec4(1.0, 1.0, 0.0, 1.0),  // yellow
           vec4(0.0, 1.0, 0.0, 1.0),  // green
           vec4(0.0, 0.0, 1.0, 1.0),  // blue
           vec4(1.0, 0.0, 1.0, 1.0),  // magenta
           vec4(0.0, 1.0, 1.0, 1.0),  // cyan
           vec4(1.0, 1.0, 1.0, 1.0)   // white
       ];
   
       // We need to parition the quad into two triangles in order for
       // WebGL to be able to render it.  In this case, we create two
       // triangles from the quad indices
   
       //vertex color assigned by the index of the vertex
   
       var indices = [a, b, c, a, c, d];
   
       for ( var i = 0; i < indices.length; ++i ) {
           positions.push( vertices[indices[i]] );
           //colors.push( vertexColors[indices[i]] );
   
           // for solid colored faces use
           colors.push(vertexColors[a]);
       }
   }
   
   function render()
   {
       gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
   
       theta[axis] += 2.0;
       gl.uniform3fv(thetaLoc, theta);
   
       gl.drawArrays(gl.TRIANGLES, 0, numPositions);
       requestAnimationFrame(render);
   }