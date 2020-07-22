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

      tooltips: {
        callbacks: {
          label: function(tooltipItem, data) {

            var label = tooltipItem.yLabel;
            let text = chart_data.money_format ? Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(label) : label;
            return text;
          }
        }
      },

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

    events: false,
    tooltips: {
        //enabled: false
    },
    hover: {
        //animationDuration: 0
    },
    animation: {
        duration: 1,
        // this logic here takes care of having the labels always visible
        onComplete: function () {
          let chartInstance = this.chart;
          let ctx = chartInstance.ctx;
          ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          ctx.strokeStyle = "#454545";

          this.data.datasets.forEach(function (dataset, i) {

            let meta = chartInstance.controller.getDatasetMeta(i);
            meta.data.forEach(function (bar, index) {
              if (dataset.data[index] === 0) return;

              let data = dataset.data[index];
              //middle between inner and outer radious
              let _x = (bar._model.innerRadius + bar._model.outerRadius) * 0.35
              let _y = (bar._model.innerRadius + bar._model.outerRadius) * 0.35
              // starts on -0.5 * PI
              let _angle = (bar._model.endAngle - bar._model.startAngle) * 0.5 + bar._model.startAngle - 0.25 * Math.PI;
              let _cos = Math.cos(_angle);
              let _sin = Math.sin(_angle);
              let _x2 = bar._model.x + _x * _cos - _y * _sin;
              let _y2 = bar._model.y + 5 + _x * _sin + _y * _cos;

              let  __textHeight = null
              let getFontHeight = (fontStyle = "Arial") => {

                if(__textHeight == null)
                {
                  var body = document.getElementsByTagName('body')[0];
                  var dummy = document.createElement('div');
                  var dummyText = document.createTextNode('MÉqgOLAKTAL');
                  dummy.appendChild(dummyText);
                  dummy.setAttribute('style', `font:${ fontStyle };position:absolute;top:0;left:0`);
                  body.appendChild(dummy);
                  __textHeight = dummy.offsetHeight;
                  body.removeChild(dummy);
                }
                return __textHeight;
              }

              let get_text_size = (text) => {
                let size = {x : 0, y : 0};
                ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
                size.x = Math.ceil(ctx.measureText(text).width);
                size.y = Math.ceil(getFontHeight(ctx.font));
                return size;
              }

              let size = get_text_size(bar._model.label + ' : ' + data)
              size.x += 6
              size.y += 5

              ctx.fillStyle = "#ddd";
              ctx.globalAlpha = 0.8;
              ctx.fillRect(_x2 - size.x * 0.5, _y2 - size.y + 3, size.x, size.y);

              ctx.fillStyle = "#000";
              ctx.globalAlpha = 1;

              ctx.fillText(bar._model.label + ' : ' + data, _x2, _y2);
              ctx.strokeText(bar._model.label + ' : ' + data, _x2, _y2);

            });
          });
        }
    },

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
