const ENDPOINT = "https://api.gotinder.com/v2/fast-match/teasers";

var blurEl = document.createElement("div");
blurEl.id = "blur";

(function() {
    var cors_api_host = "cors-anywhere.herokuapp.com";
    var cors_api_url = "https://" + cors_api_host + "/";
    var slice = [].slice;
    var origin = window.location.protocol + "//" + window.location.host;
    var open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
        var args = slice.call(arguments);
        var targetOrigin = /^https?:\/\/([^\/]+)/i.exec(args[1]);
        if (targetOrigin && targetOrigin[0].toLowerCase() !== origin &&
            targetOrigin[1] !== cors_api_host) {
            args[1] = cors_api_url + args[1];
        }
        return open.apply(this, args);
    };
})();

function submit() {
    var sessionId = document.querySelector("#session-id").value;
    if (document.querySelector("#remember-me").checked) setCookie("X-Auth-Token", sessionId);
    window.location.href = "/previews?authToken=" + sessionId;
}

function getLikes() {

    if (getCookie("X-Auth-Token")) {
        var sessionId = getCookie("X-Auth-Token");
    } else {
        if (window.location.href.indexOf("authToken=") === -1) window.location.href = "/";
        sessionId = window.location.href.split("authToken=")[1];
    }

    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onload = e => {
        try {
            var data = JSON.parse(xmlhttp.response).data;
            
            displayProfiles(data);
        } catch(err) {
            alert("Couldn't use Auth-Token \"" + sessionId + "\". Please try again with a new one");
            window.location.href = "/";
        }
    }

    xmlhttp.open("GET", ENDPOINT);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.setRequestHeader("platform", "ios");
    xmlhttp.setRequestHeader("X-Auth-Token", sessionId);
    xmlhttp.send();
}

function displayProfiles(data) {
    var cards = document.querySelector("#cards");
    for (i in data.results) {
        var card = document.createElement("div")
        card.classList.add("card");

        var img = document.createElement("img");
        img.src = data.results[i].user.photos[0].url;
        
        card.setAttribute("onclick", "zoom(this.children[0].src);");

        card.appendChild(img);

        cards.appendChild(card);
    }
}

function zoom(src) {
    var zoomed = document.createElement("img");
    zoomed.src = src;

    var x = document.createElement("div");
    x.id = "unzoom";
    x.setAttribute("onclick", "unzoom();");
    x.innerHTML = "<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' height='25px' style='enable-background:new 0 0 25 25; fill: lightgrey' viewBox='0 0 512 512' width='25px' xml:space='preserve'><path d='M443.6,387.1L312.4,255.4l131.5-130c5.4-5.4,5.4-14.2,0-19.6l-37.4-37.6c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4  L256,197.8L124.9,68.3c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4L68,105.9c-5.4,5.4-5.4,14.2,0,19.6l131.5,130L68.4,387.1  c-2.6,2.6-4.1,6.1-4.1,9.8c0,3.7,1.4,7.2,4.1,9.8l37.4,37.6c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1L256,313.1l130.7,131.1  c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1l37.4-37.6c2.6-2.6,4.1-6.1,4.1-9.8C447.7,393.2,446.2,389.7,443.6,387.1z'/></svg>";

    blurEl.appendChild(x);

    blurEl.appendChild(zoomed);

    document.body.appendChild(blurEl);
}

function unzoom() {
    var blurEl = document.querySelector("#blur");
    if (blurEl != undefined) {
        blurEl.remove();
    }
}

var showTimeout;
function showScrollbar() {
    var blurEl = document.querySelector("#blur");
    if (blurEl != undefined) return;
    clearTimeout(showTimeout);
    ruleForScroll.selectorText = "body::-webkit-scrollbar-thumb";
    ruleForScroll.style.boxShadow = "inset 0 0 10px 10px rgba(0, 0, 0, 0.75)";
    showTimeout = setTimeout(hideScrollbar, 1000);

}

function hideScrollbar() {
    ruleForScroll.selectorText = "body::-webkit-scrollbar-thumb";
    var opacity = 0.75;
    var fadeOut = setInterval(() => {
        if (opacity <= 0) return clearInterval(fadeOut);
        ruleForScroll.style.boxShadow = "inset 0 0 10px 10px rgba(0, 0, 0, " + opacity + ")";
        opacity -= 0.05;
    }, 10)
}

function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return false;
}