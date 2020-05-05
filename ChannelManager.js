function ChannelManager()
{
  this.channels = [];

  this.last_generated_id = 0;
}

ChannelManager.prototype.get_new_id = function()
{
  this.last_generated_id++;
  return this.last_generated_id;
}
ChannelManager.prototype.create_metrics_from_template = function (metrics_template)
{
  let metrics = [];
  for(let i=0; i< metrics_template.length; i++)
  {
    let name  = metrics_template[i].name;
    let label = metrics_template[i].label;

    metrics.push(new Metric(name, label));
  }
  return metrics;
}

ChannelManager.prototype.create_channel_from_template = function (channel_template)
{
  let id                = this.get_new_id();
  let name              = channel_template.name;
  let label             = channel_template.label;
  let media_value_func  = channel_template.media_value_func;
  let metrics           = this.create_metrics_from_template(channel_template.metrics);

  let new_channel = new Channel(id, name, label, metrics, media_value_func);
  this.channels.push(new_channel);
  return new_channel;
}

ChannelManager.prototype.get_channels_by_name = function(channel_name)
{
  let channels = [];
  for(let i=0; i< this.channels.length; i++)
  {
    if(this.channels[i].name === channel_name)
    {
      channels.push(this.channels[i]);
    }
  }
  return channels;
}

// This will sum up all metric values for all channels with the same name
ChannelManager.prototype.get_total_metric_value = function(channel_name, metric_name)
{
  let sum = 0;
  let channels = this.get_channels_by_name(channel_name);
  for(let i=0; i< channels.length; i++)
  {
    sum += channels[i].get_metric_value(metric_name);
  }
  return sum;
}

// This function sums all media_values for a given channel type.
// For example if the channel_name is 'facebook', it will search for all
// rows where the channel_name is 'facebook', compute their media_value and add it to the total
ChannelManager.prototype.total_media_values_for_channel_name = function (channel_name) {
  let sum = 0;
  for (let i = 0; i < this.channels.length; i++) {
    if (this.channels[i].name === channel_name)
      sum += this.channels[i].compute_media_value();
  }
  return sum;
}

ChannelManager.prototype.get_channel_by_id = function (channel_id) {
  for (let i = 0; i < this.channels.length; i++) {
    if (this.channels[i].id === Number(channel_id))
      return this.channels[i];
  }
  return undefined;
}

ChannelManager.prototype.remove_channel_by_id = function (channel_id)
{
  // The filter function returns a new array of items that matches the condition.
  // This filter function returns all elements that have a different id of the one that
  // should be deleted.
  this.channels = this.channels.filter(function(channel, index, arr)
    {
      return channel.id !== channel_id;
    }
  );
}
