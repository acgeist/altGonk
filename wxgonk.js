//http://www.albionresearch.com/misc/urlencode.php
function reqXmlFromProxy(recUrl) {
	document.getElementById("p3").innerHTML = "localhost:81/altGonk/proxy.php?url=" + encodeURIComponent(recUrl);

	var xhr = (window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP"));
	xhr.onreadystatechange = function () {
		if (xhr.readyState == 4) {
			document.getElementById("xml").innerHTML = xhr.responseText;
		}
	}

	var usedUrl = "proxy.php?url=" + encodeURIComponent(recUrl);
	xhr.open("GET", usedUrl, true);
	xhr.send(null);
}