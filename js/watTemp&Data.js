//Water Temp

am4core.ready(function () {
  // Themes begin
  am4core.useTheme(am4themes_amcharts);
  am4core.useTheme(am4themes_animated);

  // Create chart
  var liveChart = am4core.create("chartdivTempGau", am4charts.GaugeChart);
  liveChart.innerRadius = am4core.percent(82);

  /*Normal axis*/

  var axis = liveChart.xAxes.push(new am4charts.ValueAxis());
  axis.min = 0;
  axis.max = 40;
  axis.strictMinMax = true;
  axis.renderer.radius = am4core.percent(82);
  axis.renderer.inside = true;
  axis.renderer.line.strokeOpacity = 0.0;
  axis.renderer.ticks.template.disabled = false;
  axis.renderer.ticks.template.strokeOpacity = 0;
  axis.renderer.ticks.template.length = 0;
  axis.renderer.grid.template.disabled = true;
  axis.renderer.labels.template.radius = 40;
  axis.renderer.labels.template.adapter.add("text", function (text) {
    return text;
  });

  /*Axis for ranges*/

  var colorSet = new am4core.ColorSet();

  var axis2 = liveChart.xAxes.push(new am4charts.ValueAxis());
  axis2.min = 0;
  axis2.max = 40;
  axis2.strictMinMax = true;
  axis2.renderer.labels.template.disabled = true;
  axis2.renderer.ticks.template.disabled = true;
  axis2.renderer.grid.template.disabled = true;

  var range0 = axis2.axisRanges.create();
  range0.value = 0;
  range0.endValue = 40;
  range0.axisFill.fillOpacity = 0.2;
  range0.axisFill.fill = colorSet.getIndex(6);
  range0.axisFill.zIndex = 1;

  var range1 = axis2.axisRanges.create();
  range1.value = 0;
  range1.endValue = 20;
  range1.axisFill.fillOpacity = 1;
  range1.axisFill.fill = colorSet.getIndex(1);
  range1.axisFill.zIndex = 0;

  var range2 = axis2.axisRanges.create();
  range2.value = 0;
  range2.endValue = 30;
  range2.axisFill.fillOpacity = 1;
  range2.axisFill.fill = colorSet.getIndex(2);
  range2.axisFill.zIndex = -1;

  var range3 = axis2.axisRanges.create();
  range3.value = 0;
  range3.endValue = 40;
  range3.axisFill.fillOpacity = 1;
  range3.axisFill.fill = colorSet.getIndex(3);
  range3.axisFill.zIndex = -2;

  let shadow = axis2.filters.push(new am4core.DropShadowFilter());
  shadow.dx = 10;
  shadow.dy = 10;
  shadow.blur = 20;
  shadow.opacity = 0.2;
  shadow.color = textColor;

  var label = liveChart.radarContainer.createChild(am4core.Label);
  label.isMeasured = false;
  label.fontSize = "4em";
  label.x = am4core.percent(50);
  label.paddingBottom = 50;
  label.horizontalCenter = "middle";
  label.verticalCenter = "bottom";
  label.text = " °C";
  label.fill = textColor;

  var label2 = liveChart.radarContainer.createChild(am4core.Label);
  label2.isMeasured = false;
  label2.fontSize = "1.75em";
  label2.horizontalCenter = "middle";
  label2.verticalCenter = "bottom";
  label2.text = "Temperatura da água";
  label2.fill = textColor;

  /*Hand*/

  var hand = liveChart.hands.push(new am4charts.ClockHand());
  hand.axis = axis2;
  hand.innerRadius = am4core.percent(45);
  hand.startWidth = 10;
  hand.pin.disabled = true;
  hand.value = 0;
  hand.fill = am4core.color(textColor);
  hand.stroke = am4core.color(textColor);

  hand.events.on("propertychanged", function (ev) {
    range0.endValue = ev.target.value;
    label.text = axis2.positionToValue(hand.currentPosition).toFixed(1);
    axis2.invalidate();
  });

  setInterval(function () {
    if (window.matchMedia("(max-width:800px)").matches) {
      label.fontSize = "2em";
      label.verticalCenter = "middle";
      label.horizontalCenter = "middle";
      label2.fontSize = "0em";
    } else {
      label.fontSize = "4em";
      label.verticalCenter = "bottom";
      label2.fontSize = "1.75em";
      label2.verticalCenter = "bottom";
    }

    if (window.matchMedia("(max-width:500px)").matches) {
      axis.renderer.labels.template.opacity = 0;
    } else if (window.matchMedia("(max-width:700px)").matches) {
      axis.renderer.labels.template.opacity = 1;
    }
  }, 500);

  setInterval(function () {
    var value = actWatTempMsg;

    var animation = new am4core.Animation(
      hand,
      {
        property: "value",
        to: value,
      },
      1000,
      am4core.ease.cubicOut
    ).start();
  }, 2000);
});

//Graph

am4core.ready(function () {
  // Themes begin
  am4core.useTheme(am4themes_animated);
  // Themes end

  var chart = am4core.create("chartdivTempData", am4charts.XYChart);
  chart.hiddenState.properties.opacity = 0;

  chart.padding(0, 0, 0, 0);

  chart.zoomOutButton.disabled = true;

  var data = [];
  var visits = 0;
  var i = 0;

  for (i = 0; i <= 60; i++) {
    data.push({
      date: new Date().setSeconds(i - 60),
      value: parseFloat(actWatTempMsg).toFixed(1),
    });
  }

  chart.data = data;

  var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
  dateAxis.renderer.grid.template.location = 0;
  dateAxis.renderer.minGridDistance = 30;
  dateAxis.dateFormats.setKey("second", "ss");
  dateAxis.periodChangeDateFormats.setKey("second", "[bold]h:mm a");
  dateAxis.periodChangeDateFormats.setKey("minute", "[bold]h:mm a");
  dateAxis.periodChangeDateFormats.setKey("hour", "[bold]h:mm a");
  dateAxis.renderer.inside = true;
  dateAxis.renderer.axisFills.template.disabled = true;
  dateAxis.renderer.ticks.template.disabled = true;

  var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
  valueAxis.tooltip.disabled = false;
  valueAxis.interpolationDuration = 500;
  valueAxis.rangeChangeDuration = 500;
  valueAxis.renderer.inside = true;
  valueAxis.renderer.minLabelPosition = 0.05;
  valueAxis.renderer.maxLabelPosition = 0.95;
  valueAxis.renderer.axisFills.template.disabled = true;
  valueAxis.renderer.ticks.template.disabled = true;

  var series = chart.series.push(new am4charts.LineSeries());
  series.dataFields.dateX = "date";
  series.dataFields.valueY = "value";
  series.interpolationDuration = 500;
  series.defaultState.transitionDuration = 0;
  series.tensionX = 0.8;

  chart.events.on("datavalidated", function () {
    dateAxis.zoom({ start: 1 / 25, end: 1.2 }, false, true);
  });

  dateAxis.interpolationDuration = 500;
  dateAxis.rangeChangeDuration = 500;

  document.addEventListener(
    "visibilitychange",
    function () {
      if (document.hidden) {
        if (interval) {
          clearInterval(interval);
        }
      } else {
        startInterval();
      }
    },
    false
  );

  // add data
  var interval;
  function startInterval() {
    interval = setInterval(function () {
      visits = parseFloat(visits).toFixed(1) + parseFloat(actWatTempMsg).toFixed(1);
      var lastdataItem = series.dataItems.getIndex(series.dataItems.length - 1);
      chart.addData(
        {
          date: new Date(lastdataItem.dateX.getTime() + 1000),
          value: parseFloat(actWatTempMsg).toFixed(1),
        },
        1
      );
    }, 1000);
  }

  startInterval();

  // all the below is optional, makes some fancy effects
  // gradient fill of the series
  series.fillOpacity = 1;
  var gradient = new am4core.LinearGradient();
  gradient.addColor(chart.colors.getIndex(2), 0);
  gradient.addColor(chart.colors.getIndex(3), 0);
  series.fill = gradient;

  // this makes date axis labels to fade out
  dateAxis.renderer.labels.template.adapter.add(
    "fillOpacity",
    function (fillOpacity, target) {
      var dataItem = target.dataItem;
      return dataItem.position;
    }
  );

  // need to set this, otherwise fillOpacity is not changed and not set
  dateAxis.events.on("validated", function () {
    am4core.iter.each(dateAxis.renderer.labels.iterator(), function (label) {
      label.fillOpacity = label.fillOpacity;
    });
  });

  // this makes date axis labels which are at equal minutes to be rotated
  dateAxis.renderer.labels.template.adapter.add(
    "rotation",
    function (rotation, target) {
      var dataItem = target.dataItem;
      if (
        dataItem.date &&
        dataItem.date.getTime() ==
          am4core.time
            .round(new Date(dataItem.date.getTime()), "minute")
            .getTime()
      ) {
        target.verticalCenter = "middle";
        target.horizontalCenter = "left";
        return -90;
      } else {
        target.verticalCenter = "bottom";
        target.horizontalCenter = "middle";
        return 0;
      }
    }
  );

  // bullet at the front of the line
  var bullet = series.createChild(am4charts.CircleBullet);
  bullet.circle.radius = 5;
  bullet.fillOpacity = 1;
  bullet.fill = chart.colors.getIndex(0);
  bullet.isMeasured = false;

  chart.cursor = new am4charts.XYCursor();

  series.events.on("validated", function () {
    bullet.moveTo(series.dataItems.last.point);
    bullet.validatePosition();
  });
});
