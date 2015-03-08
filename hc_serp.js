console.log('hc_serp.js exexuted');


// function injectScript(source) {

//     var elem = document.createElement("script"); //Create a new script element
//     elem.type = "text/javascript"; //It's javascript
//     elem.innerHTML = source; //Assign the source
//     document.documentElement.appendChild(elem); //Inject it into the DOM
// }

// injectScript("("+(function() {

//     function bindResponse(request, response) {
//         request.__defineGetter__("responseText", function() {
//             console.warn('Something tried to get the responseText');
//             console.debug(response);
//             return response;
//         })
//     }

//     function processResponse(request,caller,method,path) {
//         bindResponse(request, request.responseText);
//     }

//     var proxied = window.XMLHttpRequest.prototype.open;
//     window.XMLHttpRequest.prototype.open = function(method, path, async) {
//             var caller = arguments.callee.caller;
//             this.addEventListener('readystatechange', function() {
//                 if (this.readyState === 4)
//                     processResponse(this,caller,method,path);
//             }, true);
//         return proxied.apply(this, [].slice.call(arguments));
//     };
// }).toString()+")()");


var HC_SERP = {
	searchStart: undefined,
	checkSearchTime: function (){
		if(!searchStart) {
			searchStart = moment();
			console.log('search started');
		}
		
		if ($('#hc_sr_progress').css('display') == 'block') {
			setTimeout(checkSearchTime, 300);
		} else if ($('#hc_sr_progress').css('display') == 'none') {
			var duration = moment.duration(moment().diff(searchStart));
			console.log('search done in', duration.seconds(), 's');
			this.colorifyHotels();
		} else {
			console.warn('unknown hc_sr_progress state!', $('#hc_sr_progress').css('display'));
		}
	},
	colorifyHotels: function() {	
		console.log('colorify hotels');
		$(".hc_sri").each(function (i, hotelNode) {
			console.log('colorifying', hotelNode.getAttribute('fn'));
			var hotelNode = $(hotelNode),
				dataNode = $(hotelNode).find('script'),
			    data = JSON.parse(dataNode.text())
			;
			_.find(data, function(item, i) {
				console.log(item.providerName);
				if (i === 0 && item.providerName == 'ostrovok.ru') {
					return hotelNode.css('background-color', 'rgba(111, 255, 119, 0.4)');
				} else if (item.providerName == 'ostrovok.ru') {
					return hotelNode.css('background-color', 'rgba(212, 218, 0, 0.23)');
				} else {
					hotelNode.css('background-color', 'rgba(255, 129, 124, 0.35)');
				}
			});
		});
	}
};
HC_SERP.checkSearchTime();
