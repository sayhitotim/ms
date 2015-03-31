console.log('hc_serp.js exexuted');

var TrivagoSerp = {
    init: function() {
        console.log('TrivagoSerp init');
        var obj = this;
        if ($('#hc-stats').length) {
            React.unmountComponentAtNode(document.getElementById('hc-stats'));
        } else {
            $('body').append('<div id="hc-stats"></div>');
        }
        React.render(<TrivagoTimer />, document.getElementById('hc-stats'));
        $('#js_go,.js_page').on('click', function(e) {
            console.log('page or search click');
            setTimeout($.proxy(obj.init, obj), 2000);
        });
    },
    percentage: function(a, b) {
        return Math.round(a / b * 100);
    }
};

var TrivagoTimer = React.createClass({
    getInitialState: function() {

        return {
            searchStart: moment(),
            searchTime: 0,
            win: [],
            lose: [],
            no: [],
            total: 0,
            shareDynamics: []
        };
    },
    isOstrovok: function (item) {
        var
            text = $.trim($(item).text());
        // console.log('CHECK', text, item);
        return text == 'Ostrovok.ru';
    },
    colorifyHotels: function() {
        console.log('colorify hotels');
        _.each(this.state.win, function(script) {
            $(script.el).closest('.hc_sri').css('background-color', 'rgba(111, 255, 119, 0.4)');
        });
        _.each(this.state.lose, function(script) {
            $(script.el).closest('.hc_sri').css('background-color', 'rgba(212, 218, 0, 0.23)');
        });
        _.each(this.state.no, function(script) {
            $(script.el).closest('.hc_sri').css('background-color', 'rgba(255, 129, 124, 0.35)');
        });
    },
    getSerpState: function() {

        var self = this,
            searchTime = moment.duration(moment().diff(this.state.searchStart)),
            hotelPricesEls = $(".item_prices"),
            total = hotelPricesEls.length,
            wins = _.filter(hotelPricesEls, function (el) {
                return self.isOstrovok($(el).find('.partner_name'));
            }),
            loses = _.filter(hotelPricesEls, function (el) {
                var prices = $(el).find('.hotel_prices em');
                return !self.isOstrovok(prices[0]) && _.any(prices, self.isOstrovok);
            }),
            nos = _.filter(hotelPricesEls, function (el) {
                return !_.any($(el).find('.hotel_prices em'), self.isOstrovok);
            }),
            state = {
                searchTime: searchTime.asSeconds().toFixed(1),
                win: wins,
                lose: loses,
                no: nos,
                total: total,
                shareDynamics: this.state.shareDynamics
            },
            share = total ? TrivagoSerp.percentage((wins.length + loses.length), total): 0,
            lastShare = _.last(this.state.shareDynamics)
        ;
        lastShare = lastShare && lastShare[1]
        if (lastShare !== share) {
            state.shareDynamics.push([state.searchTime, share, wins.length + loses.length]);
        }
        console.log('state', state);
        return state;
    },
    tick: function() {
        if (!this.isMounted()) return;
        var state = this.getSerpState();
        this.setState(state);
        this.colorifyHotels();
        if (state.searchTime < 30) {
            setTimeout(this.tick, 1000);
        }
    },
    componentDidMount: function() {
        this.tick();
    },
    render: function() {
        var
            winPercent = TrivagoSerp.percentage(this.state.win.length, this.state.total),
            losePercent = TrivagoSerp.percentage(this.state.lose.length, this.state.total),
            noPercent = TrivagoSerp.percentage(this.state.no.length, this.state.total)
        ;

        return (
            <div>
                <div>Search Time: {this.state.searchTime}s.</div>
                <div className="row">Total Hotels: {this.state.total}</div>
                <div className="hc-green">Win: {winPercent}% ({this.state.win.length})</div>
                <div className="hc-yellow">Lose: {losePercent}% ({this.state.lose.length})</div>
                <div className="row hc-red">No: {noPercent}% ({this.state.no.length})</div>
                <div className="share-dynamics">
                    <div>Share Dynamics</div>
                    {
                        _.map(this.state.shareDynamics, function(item) {
                            return (<div key={item.id}>{item[0]}s: {item[1]}% ({item[2]})</div>);
                        })
                    }
                </div>
            </div>
        );
    }
});

TrivagoSerp.init();
