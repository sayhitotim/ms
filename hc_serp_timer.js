var HcTimer = React.createClass({displayName: "HcTimer",
  getInitialState: function() {

    return {searchStart: moment(), searchTime: 0, win: 0, lose: 0, no: 0, total: 0};
  },
  isOstrovok: function (item) {
      return item.providerName == 'ostrovok.ru';
  },
  tick: function() {
    var self = this,
        searchTime = moment.duration(moment().diff(this.state.searchStart)),
        hotelDataScripts = _.map(
            $(".hc_sri script"),
            function(el) {return JSON.parse(el.innerText)}
        );
        total = hotelDataScripts.length,
        wins = _.filter(hotelDataScripts, function (data) {
            return data && self.isOstrovok(data[0]);
        }).length,
        loses = _.filter(hotelDataScripts, function (data) {
            return data && !self.isOstrovok(data[0]) && _.any(data, self.isOstrovok);
        }).length,
        nos = total - wins - loses,
        state = {searchTime: searchTime.seconds(), win: wins, lose: loses, no: nos, total: total}
    ;
    console.log('state', state);
    this.setState(state);

    if ($('#hc_sr_progress').css('display') == 'block') {
        setTimeout(this.tick, 500);
    } else if ($('#hc_sr_progress').css('display') == 'none') {
        console.log('search done in', searchTime.seconds(), 's');
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
        React.createElement("div", null, 
            React.createElement("div", null, "Search Time: ", this.state.searchTime, "s."), 
            React.createElement("div", {className: "hc-green"}, "Win: ", this.state.win), 
            React.createElement("div", {className: "hc-yellow"}, "Lose: ", this.state.lose), 
            React.createElement("div", {className: "hc-red"}, "No: ", this.state.no), 
            React.createElement("div", null, "Total: ", this.state.total)
        )
    );
  }
});

React.render(React.createElement(HcTimer, null), document.getElementById('hc-stats'));
