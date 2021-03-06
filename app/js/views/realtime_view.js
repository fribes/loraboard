
var MAX_SCREEN_LOGS = 100;

export class RealTimeView extends Backbone.View {

  constructor(options) {
    super(options);
    this.events = {
      "click #clear-logs-btn": "clearScreenLogs"
    };
    this.logsNumber = 0;
    this.setElement('#realtime-box');
    this.render();
    Backbone.Mediator.subscribe('data:newFrame', this.logFrame, this);
  }

  render() {
    var html = `<h4>Realtime data <button id="clear-logs-btn" type="button" class="btn btn-default">
                  <span id="clear-logs-btn-icon" class="glyphicon glyphicon-trash" aria-hidden="true"></span>
                </button></h4>
                <textarea id="realtime-window" class="form-control" rows="4"></textarea>`;
    this.$el.html(html);
    return this;
  }

  logFrame(raw, decoded) {
    var message = JSON.parse(raw);
    var data = `LoRa frame #${message.fcnt}: ${message.data} from: ${message.EUI}\nDecoded as: ${decoded}`;
    this.logData(data);
  }

  logData(message, separator) {
    this.logsNumber++;
    console.log(message);
    if (this.logsNumber <= MAX_SCREEN_LOGS) {
      this.appendToScreenLogs(message + (separator ? separator: ''));
    } else {
      var warning = `reached max logs number (${MAX_SCREEN_LOGS}), cleared log window!`;
      this.logsNumber = 0;
      this.clearScreenLogs();
      console.log(warning);
      this.appendToScreenLogs(warning);
    }
  }

  appendToScreenLogs(message) {
    $('#realtime-window').append(message + '\n');
    var realTimeWin = $('#realtime-window');
    if (realTimeWin.length) {
       realTimeWin.scrollTop(realTimeWin[0].scrollHeight - realTimeWin.height());
    }
  }

  clearScreenLogs() {
    $('#realtime-window').text('');
  }
}
