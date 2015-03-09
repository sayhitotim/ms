console.log('options.js exexuted');


var Options = React.createClass({
    getInitialState: function() {
        return {enabled: this.props.enabled};
    },
    handleChange: function() {
        var self = this,
            state = {
                enabled: this.refs.enabledInput.getDOMNode().checked
            }
        ;
        chrome.storage.sync.set(state, function() {
            self.setState(state);
        });
    },
    render: function() {
        return (
            <div>
                <input
                    type="checkbox"
                    checked={this.state.enabled}
                    ref="enabledInput"
                    onChange={this.handleChange}
                />
                Metasearch Sniffer Enabled
            </div>
        );
    }
});

chrome.storage.sync.get({enabled: true}, function(items) {
    React.render(<Options enabled={items.enabled}/>, document.body);
});
