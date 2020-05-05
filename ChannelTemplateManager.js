function ChannelTemplateManager(json)
{
  // Templates are JSON representation of channels
  // They are used to instantiate Channel and Metrics objects
  this.templates = json.channels;
}


// Returns an array of objects containing name and label to be used for html select
ChannelTemplateManager.prototype.get_template_name_label_array = function()
{
  let name_label = [];
  for(let i=0; i< this.templates.length; i++)
  {
    name_label.push({
      name: this.templates[i].name,
      label: this.templates[i].label
    });
  }
  return name_label;
}



ChannelTemplateManager.prototype.get_channel_template = function (channel_name)
{
  for(let i=0; i< this.templates.length; i++)
  {
    if(this.templates[i].name === channel_name)
    {
      return this.templates[i];
    }
  }
  return undefined;
}