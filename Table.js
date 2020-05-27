
function Table(html_element)
{
  this.container = html_element;
}

// Creates the metrics elements from a channel
Table.prototype.add_metrics = function (channel, cell)
{
  let metrics = channel.metrics;

  for (let i = 0; i < metrics.length; i++) {
    let metric_container = document.createElement('div');
    metric_container.className = 'channel__metric';

    let metric_label = document.createElement('div');
    metric_label.className = 'channel__metric-label';
    metric_label.innerHTML = metrics[i].label;
    metric_container.appendChild(metric_label);

    let metric_input = document.createElement('input');
    metric_input.className = 'channel__metric-input';
    metric_input.dataset.channel_id = channel.id;
    metric_input.dataset.metric_name = metrics[i].name;

    metric_input.setAttribute('type', 'number');
    metric_input.setAttribute('onchange', 'on_input_changed(this)')
    metric_input.setAttribute('onkeyup', 'on_input_changed(this)')

    if (metrics[i].value) {
      metric_input.value = metrics[i].value;
    }
    metric_container.appendChild(metric_input);

    cell.appendChild(metric_container);
  }
}

Table.prototype.add_media_value = function (channel, cell)
{
  let media_value_container = document.createElement('div');
  media_value_container.className = 'channel__media-value';

  let media_value_title = document.createElement('div');
  media_value_title.className = 'channel__media-value-title';
  media_value_title.innerHTML = '';

  media_value_container.appendChild(media_value_title);

  let media_value_value = document.createElement('div');
  media_value_value.className = `channel__media-value-value channel__${channel.id}`;
  media_value_value.innerHTML = Intl.NumberFormat(
    'en-US', 
    { 
      style: 'currency', 
      currency: 'USD' 
    }
  ).format(channel.compute_media_value());

  media_value_container.appendChild(media_value_value);

  cell.appendChild(media_value_container);
}

Table.prototype.add_actions = function (channel, cell) {
  let actions_container = document.createElement('div');
  actions_container.className = 'channel__actions';

  let remove_button = document.createElement('div');
  remove_button.className = "button remove";
  remove_button.innerHTML = "X";
  remove_button.dataset.channel_id = channel.id;

  remove_button.setAttribute('onclick', 'on_remove_row(this)')

  actions_container.appendChild(remove_button);

  cell.appendChild(actions_container);
}

Table.prototype.add_url = function(channel, cell)
{
  let url_input = document.createElement('input');
  url_input.className = 'channel__metric-input';
  url_input.dataset.channel_id = channel.id;
  url_input.value = channel.url;

  url_input.setAttribute('type', 'text');
  url_input.setAttribute('onchange', 'on_channel_url_changed(this)');
  url_input.setAttribute('onkeyup', 'on_channel_url_changed(this)');

  cell.appendChild(url_input);

}
Table.prototype.add_row = function(channel)
{
  let table_body = this.container.querySelector('.table__body');

  let channel_row = table_body.insertRow(-1);
  channel_row.className = `channel__row channel__${channel.id}`;
  channel_row.dataset.channel_id = channel.id;

  let channel_cell      = channel_row.insertCell(0);
  let url_cell          = channel_row.insertCell(1);
  let metrics_cell      = channel_row.insertCell(2);
  let media_value_cell  = channel_row.insertCell(3);
  let actions_cell      = channel_row.insertCell(4);

  channel_cell.innerHTML  = channel.label;
  url_cell.innerHTML      = channel.url;

  this.add_url(channel, url_cell);
  this.add_metrics(channel, metrics_cell);
  this.add_media_value(channel, media_value_cell);
  this.add_actions(channel, actions_cell)
}

Table.prototype.remove_row = function(channel_id) {
  let channel_row = document.querySelector(`.channel__row.channel__${channel_id}`);
  channel_row.parentNode.removeChild(channel_row);
}
