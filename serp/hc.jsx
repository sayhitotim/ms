console.log('hc_serp.js exexuted');

var HcSerp = {
    init: function() {
        console.log('HcSerp init');
        var obj = this;
        if ($('#hc-stats').length) {
            React.unmountComponentAtNode(document.getElementById('hc-stats'));
        } else {
            $('body').append('<div id="hc-stats"></div>');
        }
        React.render(<HcTimer />, document.getElementById('hc-stats'));
        $('.hc_paging_btn_prev,.hc_paging_btn_next').on('click', function(e) {
            console.log('page click');
            setTimeout($.proxy(obj.init, obj), 2000);
        });
    },
    percentage: function(a, b) {
        return Math.round(a / b * 100);
    }
};

var HcTimer = React.createClass({
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
            state = {
                searchTime: searchTime.asSeconds().toFixed(1),
                win: wins,
                lose: loses,
                no: nos,
                total: total,
                shareDynamics: this.state.shareDynamics
            },
            share = total ? HcSerp.percentage((wins.length + loses.length), total): 0;
        ;
        state.shareDynamics.push([state.searchTime, share, wins.length + loses.length]);
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
        this.tick();
    },
    render: function() {
        var
            winPercent = HcSerp.percentage(this.state.win.length, this.state.total),
            losePercent = HcSerp.percentage(this.state.lose.length, this.state.total),
            noPercent = HcSerp.percentage(this.state.no.length, this.state.total)
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

HcSerp.init();
