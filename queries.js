// A bit primitive but these are queries that will show up in the results tab
// Each function must return an object with 
// - name (this one must be unique across queries)
// - label (what is going to be shown to the user)
// - value (the computed value of the query)
// After declaring the function you must add it at the end of this file to the queries array



function absolute_media_value()
{
  let channels = channel_manager.channels;

  let sum = 0;
  for (let i = 0; i < channels.length; i++) {
    sum += channels[i].compute_media_value();
  }

  return {
    name: "total_media_value",
    label: "Total media value",
    value: Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(sum)
  }
}



function combined_reach()
{
  let followers_fb   = channel_manager.get_total_metric_value('facebook', 'followers');
  let followers_tw  = channel_manager.get_total_metric_value('twitter', 'followers');
  let followers_ig   = channel_manager.get_total_metric_value('instagram', 'followers');
  let followers_igs  = channel_manager.get_total_metric_value('stories', 'followers');
  let followers_pn   = channel_manager.get_total_metric_value('pinterest', 'followers');
  let followers_yt  = channel_manager.get_total_metric_value('youtube', 'followers');  
  let followers_sn  = channel_manager.get_total_metric_value('snapchat', 'followers');  
  let followers_ld  = channel_manager.get_total_metric_value('linkedin', 'followers');
  let followers_web  = channel_manager.get_total_metric_value('website', 'followers');       

  return {
    name: "total_reach",
    label: 'Total Reach:',
    value: followers_fb+followers_tw+followers_ig+followers_igs+followers_pn+followers_yt+followers_sn+followers_ld+followers_web.toFixed(0)
   
  }
}


var queries = [];
queries.push(absolute_media_value);
queries.push(combined_reach);

