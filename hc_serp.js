console.log('hc_serp.js exexuted');


function injectScript(source) {

    var elem = document.createElement("script"); //Create a new script element
    elem.type = "text/javascript"; //It's javascript
    elem.innerHTML = source; //Assign the source
    document.documentElement.appendChild(elem); //Inject it into the DOM
}

injectScript("("+(function() {

    function bindResponse(request, response) {
        request.__defineGetter__("responseText", function() {
            console.warn('Something tried to get the responseText');
            console.debug(response);
            return response;
        })
    }

    function processResponse(request,caller,method,path) {
        bindResponse(request, request.responseText);
    }

    var proxied = window.XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function(method, path, async) {
            var caller = arguments.callee.caller;
            this.addEventListener('readystatechange', function() {
                if (this.readyState === 4)
                    processResponse(this,caller,method,path);
            }, true);
        return proxied.apply(this, [].slice.call(arguments));
    };
}).toString()+")()");


var start;
(
	function checkSearchTime(){
		if(!start) {
			start = moment();
			console.log('search started');
		}
		
		if ($('#hc_sr_progress').css('display') == 'block') {
			setTimeout(checkSearchTime, 100);
		} else if ($('#hc_sr_progress').css('display') == 'none') {
			var duration = moment.duration(moment().diff(start));
			console.log('search done in', duration.seconds(), 's');
		} else {
			console.warn('unknown hc_sr_progress state!', $('#hc_sr_progress').css('display'));
		}
	}
)();