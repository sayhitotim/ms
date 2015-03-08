console.log('hc_serp.js exexuted');

var HcSerp = {
    init: function() {
        if (!$('#hc-stats').length) $('body').prepend('<div id="hc-stats"></div>');
        React.render(<HcTimer />, document.getElementById('hc-stats'));
        $('.hc_paging_btn_prev,.hc_paging_btn_next').on('click', function(e) {
            setTimeout(this.init, 2000);
        });
    }
};

var HcTimer = React.createClass({
    getInitialState: function() {

        return {searchStart: moment(), searchTime: 0, win: [], lose: [], no: [], total: 0};
    },
    isOstrovok: function (item) {
      return item.providerName == 'ostrovok.ru';
    },
    colorifyHotels: function() {
        var self = this;
        console.log('colorify hotels');
        _.each(this.state.win, function(script) {
            $(script.el).closest('.hc_sri').addClass('hc-wins');
        });
        _.each(this.state.lose, function(script) {
            $(script.el).closest('.hc_sri').addClass('hc-loses');
        });
        _.each(this.state.no, function(script) {
            $(script.el).closest('.hc_sri').addClass('hc-nos');
        });
    },
    getSerpState: function() {

        var self = this,
            searchTime = moment.duration(moment().diff(this.state.searchStart)),
            hotelDataScripts = _.map(
                $(".hc_sri script"),
                function(el) {
                    var data = JSON.parse(el.innerText);
                    data.el = el
                    return data;
                }
            );
            total = hotelDataScripts.length,
            wins = _.filter(hotelDataScripts, function (data) {
                return data && self.isOstrovok(data[0]);
            }),
            loses = _.filter(hotelDataScripts, function (data) {
                return data && !self.isOstrovok(data[0]) && _.any(data, self.isOstrovok);
            }),
            nos = _.filter(hotelDataScripts, function (data) {
                return data && !_.any(data, self.isOstrovok);
            }),
            state = {searchTime: searchTime.seconds(), win: wins, lose: loses, no: nos, total: total}
        ;
        console.log('state', state);
        return state;
    },
    tick: function() {
        var state = this.getSerpState();
        console.log('state', state);
        this.setState(state);
        this.colorifyHotels();
        if ($('#hc_sr_progress').css('display') == 'block') {
            setTimeout(this.tick, 500);
        } else if ($('#hc_sr_progress').css('display') == 'none') {
            console.log('search done in', state.searchTime, 's');
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
            <div>
                <div>Search Time: {this.state.searchTime}s.</div>
                <div className="hc-green">Win: {this.state.win.length}</div>
                <div className="hc-yellow">Lose: {this.state.lose.length}</div>
                <div className="hc-red">No: {this.state.no.length}</div>
                <div>Total: {this.state.total}</div>
            </div>
        );
    }
});


HcSerp.init();


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
