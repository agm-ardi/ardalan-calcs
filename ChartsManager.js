function ChartsManager() {
  this.charts = [];

}

ChartsManager.prototype.destroy_charts = function () {
  for (let i = 0; i < this.charts.length; i++) {
    this.charts[i].destroy();
  }
}

ChartsManager.prototype.add_chart = function (title, bar_type, canvas, chart_data) {
  var barChartData = {
    labels: chart_data.labels,
    datasets: [{
      backgroundColor: (a) => {
        return colors[a.dataIndex]
      },
      borderColor: "#222222",
      borderWidth: 2,
      data: chart_data.values,
      money_format: chart_data.money_format
    }]
  };

  let ctx_bar = canvas.getContext('2d');

  this.charts.push(new Chart(ctx_bar, {
    type: bar_type,
    data: barChartData,
    options: {
      showDatapoints: true,
      responsive: true,
      legend: {
        display : false
      },
      scales: {
        // make the Y axes to use money format
        yAxes: [{
          ticks: {
            beginAtZero: true,
            // callback: this.to_money
          }
        }],
        xAxes: [{
          gridLines: {
            display: false
          },
        }]
      },
      title: {
        display: true,
        fontSize: 30,
        text: title
      }
    }
  }));
}

ChartsManager.prototype.add_pie = function (title, bar_type, canvas, chart_data) {
  var barChartData = {
    labels: chart_data.labels,
    datasets: [{
      backgroundColor: (a) => {
        return colors[a.dataIndex]
      },
      borderColor: "#222222",
      borderWidth: 2,
      data: chart_data.values,
      money_format: chart_data.money_format
    }]
  };
  let ctx_bar = canvas.getContext('2d');

  this.charts.push(new Chart(ctx_bar, {
    type: bar_type,
    data: barChartData,
    options: {
      showDatapoints: true,
      responsive: true,
      legend: {
        position: 'top',
        display : true,
        labels: {
          //this function filters out channels that are not being used in the app from the legend
          filter: function(legendItem, data) {
            return data.datasets[0].data[legendItem.index] !== 0 
          }
        }
      },
      title: {
        display: true,
        fontSize: 30,
        text: title
      }
    }
  }));
}



ChartsManager.prototype.load_library = function () {
  //legend display is now handled on the chart type

  //add label above of the bar
  Chart.plugins.register({
    afterDraw: function (chartInstance) {
      if (chartInstance.config.options.showDatapoints && 
        (chartInstance.config.type === 'bar' || chartInstance.config.type === 'horizontalBar')) {
        var helpers = Chart.helpers;
        var ctx = chartInstance.chart.ctx;
        var fontColor = helpers.getValueOrDefault(chartInstance.config.options.showDatapoints.fontColor, chartInstance.config.options.defaultFontColor);

        // render the value of the chart above the bar
        ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, 'normal', Chart.defaults.global.defaultFontFamily);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillStyle = fontColor;

        chartInstance.data.datasets.forEach(function (dataset) {
          for (var i = 0; i < dataset.data.length; i++) {
            var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model;

            var yPos;
            var xPos;

            if (chartInstance.config.type === 'bar') {
              xPos = model.x;
              yPos = model.y - 10;
            } else {
              xPos = model.x + 30;
              yPos = model.y;
            }

            let text = dataset.money_format ? Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(dataset.data[i]) : dataset.data[i];
            ctx.fillText(text, xPos, yPos);
          }
        });
      }
    }
  });
}
