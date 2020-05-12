function Metric (name, label)
{
  this.name = name;
  this.label = label;
  this.value = 0;
}

function Channel(id, name, label, metrics, media_value_func)
{
  this.id       = id;
  this.name     = name;
  this.label    = label;
  this.metrics  = metrics;
  this.url      = "";

  this.media_value_func = media_value_func;
}

// This function returns an object containing key-value fields where the key is the
// name of the metric, and the value contains the value of said metric.
// For example for metrics 'comments' with a value of 10 and 'likes' with a value of 20
// this function returns:
// {
//   comments: 10,
//   likes: 20
// }
// This is used in the compute_media_value function
Channel.prototype.get_metric_value_set = function()
{
  let set = {}
  for(let i=0; i< this.metrics.length; i++)
  {
    set[this.metrics[i].name] = this.metrics[i].value;
  }
  return set;
}


// This function will take a string like '{a} + {b}' and replace the tokens {a},{b} with the supplant function
// The supplant function receives as parameter an object with the following structure for this particular example:
//  {
//    a: 5,
//    b: 10
//  }
// The result of using the supplant function will be the string '5 + 10', which is then evaluated using the eval function
Channel.prototype.compute_media_value = function()
{
  let metric_value_set = this.get_metric_value_set();
  let interpolated_function = this.media_value_func.supplant(metric_value_set);
  return eval(interpolated_function)
}
Channel.prototype.get_metric_by_name = function(name)
{
  for(let i=0; i< this.metrics.length; i++)
  {
    if(this.metrics[i].name === name)
      return this.metrics[i];
  }
  return undefined;
}
Channel.prototype.set_metric_value = function(metric_name, value)
{
  this.get_metric_by_name(metric_name).value = value;
}
Channel.prototype.get_metric_value = function(metric_name)
{
  return this.get_metric_by_name(metric_name).value;
}
Channel.prototype.get_total_reach = function()
{
  let followers = this.get_metric_by_name(metric_name);
  if(followers)
  {
    return followers.value;
  }
  return 0;
}

String.prototype.supplant = function (o) {
    return this.replace(/{([^{}]*)}/g,
        function (a, b) {
            var r = o[b];
            return typeof r === 'string' || typeof r === 'number' ? r : a;
        }
    );
};
