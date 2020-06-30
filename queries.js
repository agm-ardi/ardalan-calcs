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
  let followers_podc  = channel_manager.get_total_metric_value('podcast', 'followers'); 
  let followers_rad  = channel_manager.get_total_metric_value('radio', 'followers'); 
  let followers_magco  = channel_manager.get_total_metric_value('magazine_cover', 'followers'); 
  let followers_magin  = channel_manager.get_total_metric_value('magazine_interview', 'followers'); 
  let followers_prod  = channel_manager.get_total_metric_value('product_placement', 'followers');       

  return {
    name: "total_reach",
    label: 'Total Reach:',
    value: followers_fb+followers_tw+followers_ig+followers_igs+followers_pn+followers_yt+followers_sn+followers_ld+followers_web+followers_podc+followers_rad+followers_magco+followers_magin+followers_prod
   
  }
}



function combined_engagement()
{
  let likes_fb   = channel_manager.get_total_metric_value('facebook', 'likes');
  let comm_fb   = channel_manager.get_total_metric_value('facebook', 'comments');
  let share_fb   = channel_manager.get_total_metric_value('facebook', 'shares');

  let likes_tw  = channel_manager.get_total_metric_value('twitter', 'likes');
  let comm_tw  = channel_manager.get_total_metric_value('twitter', 'comments');
  let share_tw  = channel_manager.get_total_metric_value('twitter', 'shares');

  let likes_ig   = channel_manager.get_total_metric_value('instagram', 'likes');
  let comm_ig   = channel_manager.get_total_metric_value('instagram', 'comments');

  let likes_igs  = channel_manager.get_total_metric_value('stories', 'clicks');

  let likes_pn  = channel_manager.get_total_metric_value('pinterest', 'likes');
  let comm_pn  = channel_manager.get_total_metric_value('pinterest', 'comments');
  let share_pn  = channel_manager.get_total_metric_value('pinterest', 'shares');

  let likes_yt  = channel_manager.get_total_metric_value('youtube', 'likes');
  let comm_yt  = channel_manager.get_total_metric_value('youtube', 'comments');
  let share_yt  = channel_manager.get_total_metric_value('youtube', 'shares');

  let comm_ld  = channel_manager.get_total_metric_value('linkedin', 'comments');
  let comm_web  = channel_manager.get_total_metric_value('website', 'comments');       

  return {
    name: "total_engagement",
    label: 'Total Engagement:',
    value: likes_fb+comm_fb+share_fb+likes_tw+comm_tw+share_tw+likes_ig+comm_ig+likes_igs+likes_pn+comm_pn+share_pn+likes_yt+comm_yt+share_yt+comm_ld+comm_web
  }
}




var queries = [];
queries.push(absolute_media_value);
queries.push(combined_reach);
queries.push(combined_engagement);
