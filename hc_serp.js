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
    init: function() {
      $('body').prepend('<div id="hc-stats"></div>')
    },
    checkSearchTime: function (){
        if(!this.searchStart) {
            this.searchStart = moment();
            console.log('search started');
        }
        
        if ($('#hc_sr_progress').css('display') == 'block') {
            setTimeout(checkSearchTime, 300);
        } else if ($('#hc_sr_progress').css('display') == 'none') {
            var duration = moment.duration(moment().diff(this.searchStart));
            console.log('search done in', duration.seconds(), 's');
            this.colorifyHotels();
        } else {
            console.warn('unknown hc_sr_progress state!', $('#hc_sr_progress').css('display'));
        }
    },
    colorifyHotels: function() {
        var obj = this;
        console.log('colorify hotels');
        $(".hc_sri").each(function (i, hotelNode) {
            console.log('colorifying', hotelNode.getAttribute('fn'));
            var hotelNode = $(hotelNode),
                dataNode = $(hotelNode).find('script'),
                data = JSON.parse(dataNode.text())
            ;
            _.find(data, function(item, i) {
                if (i === 0 && item.providerName == 'ostrovok.ru') {  //first
                    return hotelNode.addClass('hc-wins');
                } else if (item.providerName == 'ostrovok.ru') {
                    return hotelNode.addClass('hc-loses');
                } else if (i == data.length - 1) {  // last
                    return hotelNode.addClass('hc-nos');
                }
            });
        });
        // setup recolorifyers

        $('.hc_paging_btn_prev,.hc_paging_btn_next').on('click', function(e) {
            setTimeout($.proxy(obj.colorifyHotels, obj), 2000);
        });
    }
};
HC_SERP.init();
HC_SERP.checkSearchTime();
