<!--
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'                               WX Gonkulator fore SOFs                             '
'                                                                                   '
'Author: Capt Andrew "Fore" Geist, 74 FS                                            '
'Contact: andrew.geist.1@us.af.mil <mailto:andrew.geist.1@us.af.mil>                '
'Version 2.0 CAO 20161230                                                           '
'1.2   = First working version, using only TAFs                                     '
'1.4   = METARs fully incorporated, added usage log                                 '
'1.4.1 = Migrated 1.4 to NIPR                                                       '
'1.4.2 = Added field info, date/time stamp turns red if over 30 minutes old on open '
'1.4.3 = Added sunrise/sunset times, changed to a 12-hour grid.                     '
'2.0   = Moved to HTML/CSS/JS                                                       '
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''  
Notes to self:

To Do
*http://www.w3schools.com/graphics/google_maps_intro.asp
*Favicon support for mobile/Apple peculiarities.
*Study cURL options
*https://validator.w3.org/
*make the home base options card dropdowns a la 
http://www.w3schools.com/w3css/w3css_dropdowns.asp...so fancy
http://www.w3schools.com/w3css/w3css_case.asp

*Unit testing
*Geo-locate users? http://diveintohtml5.info/geolocation.html 
*Assess performance: https://developers.google.com/web/fundamentals/performance/, https://developer.yahoo.com/performance/rules.html, https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Tips_for_authoring_fast-loading_HTML_pages 
*https://jscompress.com/
*Ensure files have Emacs and vim mode line comments? https://developer.mozilla.org/en-US/docs/Mozilla/Developer_guide/Coding_Style 
https://google.github.io/styleguide/javascriptguide.xml
*Make master linting config file/study options: http://eslint.org/docs/rules/. Line length to 80. Single vs. double quotes?
*Add Jsdoc: https://code.google.com/archive/p/jsdoc-toolkit/ 
*Figure out how to pre-compile/cache? --> https://www.nczonline.net/blog/2009/06/23/loading-javascript-without-blocking/ 
*Transpile to ES5?
*Learn about MEAN stack? -->http://www.tamas.io/what-is-the-mean-stack/ 









*Show current radar shot - determine which radar from ADDS is closest
to home base:
<div style="position: relative; height: 550px; clear: both">
<img id="img" src="http://radar.weather.gov/lite/NCR/VAX_0.png" style="position: absolute" usemap="#radarmap">
<canvas id="canvas" width="600" height="550" style="position: relative; pointer-events: none"></canvas>
</div>
<script language="javascript">
var loopDelay = 500;
var loopDwell = 1000;
var looping = false;
var num_images = -1;
var cur_image = -1;

var image_url = new Array();
var images = new Array();

function loadImages(){
    var ind;
    num_images = 8;
    for( var i = 0; i < num_images; i++ ){
	ind = 7-i;
	image_url[i] = "http://radar.weather.gov/lite/NCR/VAX_"+ind+".png";
    }
    for( i = 0; i < num_images; i++ ){
	images[i] = new Image();
	images[i].src = image_url[i];
    }
    cur_image = num_images-1;
}

function gotoImage( index ) {
    if( looping ) return true;
    if( num_images == -1 ) loadImages();
    document.getElementById("img").src=images[index].src;
    cur_image = index;
}

function changeImage() {
    if( !looping ) return true;
    cur_image++;
    if( cur_image == num_images ) cur_image = 0;
    document.getElementById("img").src=images[cur_image].src;
    if( cur_image == num_images-1 )
	setTimeout("changeImage()", loopDwell);
    else
	setTimeout("changeImage()", loopDelay);
}

function stepImage(i){
    if( num_images == -1 ) loadImages();
    if( looping ){
	if(( i < 0 ) && ( loopDelay < 1000 )){
	    loopDelay += 200;
	} else if(( i > 0 ) && (loopDelay > 100 )){
	    loopDelay -= 200;
	}
    } else {
	if( i < 0 ){
	    cur_image--;
	    if( cur_image == -1 ) cur_image = num_images-1;
	} else {
	    cur_image++;
	    if( cur_image == num_images ) cur_image = 0;
	}
	document.getElementById("img").src=images[cur_image].src;
    }
}

function toggle(){
    if( looping ){
	looping = false;
	var e = document.getElementById("loop");
	e.value = "Loop";
    } else {
	if( num_images == -1 ) loadImages();
	looping = true;
	var e = document.getElementById("loop");
	e.value = "Stop";
	changeImage();
    }
}

</script>
-->