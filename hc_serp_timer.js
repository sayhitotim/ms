var HcTimer = React.createClass({displayName: "HcTimer",
  getInitialState: function() {

    return {searchStart: moment(), searchTime: 0, win: 0, lose: 0, no: 0, total: 0};
  },
  isOstrovok: function (item) {
      return item.providerName == 'ostrovok.ru';
  },
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
        React.createElement("div", null, 
            React.createElement("div", null, "Search Time: ", this.state.searchTime, "s."), 
            React.createElement("div", null, "Win: ", this.state.win), 
            React.createElement("div", null, "Lose: ", this.state.lose), 
            React.createElement("div", null, "No: ", this.state.no), 
            React.createElement("div", null, "Total: ", this.state.total)
        )
    );
  }
});

React.render(React.createElement(HcTimer, null), document.body);
