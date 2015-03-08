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


var HcTimer = React.createClass({
  getInitialState: function() {
    return {searchTime: 0, win: 0, lose: 0, no: 0, total: 0};
  },
  isOstrovok: function (item) {
      return item.providerName == 'ostrovok.ru';
  }
  tick: function() {
    var searchTime = moment.duration(moment().diff(this.props.searchStart)),
        hotelDataScripts = _.map(
            $(".hc_sri script"),
            function(el) {return JSON.parse(el.innerText)}
        );
        total = hotelDataScripts.length,
        wins = _.filter(hotelDataScripts, function (data) {
            return data && this.isOstrovok(data[0]);
        }),
        loses = _.filter(hotelDataScripts, function (data) {
            return data && !this.isOstrovok(data[0]) && _.any(data, isOstrovok);
        }),
        nos = total - wins - loses;
    ;
    this.setState({searchTime: searchTime.seconds(), win: wins, lose: loses, no: nos, total: total});

    if ($('#hc_sr_progress').css('display') == 'block') {
        setTimeout(this.tick, 500);
    } else if ($('#hc_sr_progress').css('display') == 'none') {
        console.log('search done in', searchTime.seconds(), 's');
        this.colorifyHotels();
    } else {
        console.warn('unknown hc_sr_progress state!', $('#hc_sr_progress').css('display'));
    }
  },
  componentDidMount: function() {
    // this.interval = setInterval(this.tick, 500);
    setTimeout(this.tick, 300);
  },
  componentWillUnmount: function() {
    // clearInterval(this.interval);
  },
  render: function() {
    return (
      <div>Search Time: {this.state.searchTime}s.</div>
      <div>Win: {this.state.win}</div>
      <div>Lose: {this.state.lose}</div>
      <div>No: {this.state.no}</div>
      <div>Total: {this.state.total}</div>
    );
  }
});

React.render(<HcTimer searchStart=moment() />, document.body);


var HC_SERP = {
    searchStart: undefined,
    init: function() {
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
                if (i === 0 && item.providerName == 'ostrovok.ru') {
                    return hotelNode.css('background-color', 'rgba(111, 255, 119, 0.4)');
                } else if (item.providerName == 'ostrovok.ru') {
                    return hotelNode.css('background-color', 'rgba(212, 218, 0, 0.23)');
                } else {
                    hotelNode.css('background-color', 'rgba(255, 129, 124, 0.35)');
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
