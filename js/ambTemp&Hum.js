//Amb Temp

am4core.ready(function () {
  // Themes begin
  am4core.useTheme(am4themes_amcharts);
  am4core.useTheme(am4themes_animated);

  // Create chart
  var liveChart = am4core.create("chartdivAmbTempGau", am4charts.GaugeChart);
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
  axis.renderer.ticks.template.strokeOpacity = 0.8;
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
  label2.text = "Temperatura ambiente";
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
    var value = actAmbTempMsg;

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

  setInterval(function () {
    if (window.matchMedia("(max-width:800px)").matches) {
      document.querySelector("p.chartTitle").style.display = "grid";
      label.fontSize = "2em";
      label.verticalCenter = "middle";
      label.horizontalCenter = "middle";
      label2.fontSize = "0em";
    } else {
      label.fontSize = "4em";
      label.verticalCenter = "bottom";
      label2.fontSize = "1.75em";
      label2.verticalCenter = "bottom";
      document.querySelector("p.chartTitle").style.display = "none";
    }

    if (window.matchMedia("(max-width:500px)").matches) {
      axis.renderer.labels.template.opacity = 0;
    } else if (window.matchMedia("(max-width:700px)").matches) {
      axis.renderer.labels.template.opacity = 1;
    }
  }, 500);
});

//Umidade

am4core.ready(function () {
  // Themes begin
  am4core.useTheme(am4themes_amcharts);
  am4core.useTheme(am4themes_animated);

  //Create chart
  var liveChart = am4core.create("chartdivUmGau", am4charts.GaugeChart);
  liveChart.innerRadius = am4core.percent(82);

  /*Normal axis*/

  var axis = liveChart.xAxes.push(new am4charts.ValueAxis());
  axis.min = 0;
  axis.max = 100;
  axis.strictMinMax = true;
  axis.renderer.radius = am4core.percent(82);
  axis.renderer.inside = true;
  axis.renderer.line.strokeOpacity = 0.0;
  axis.renderer.ticks.template.disabled = false;
  axis.renderer.ticks.template.strokeOpacity = 0.8;
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
  axis2.max = 100;
  axis2.strictMinMax = true;
  axis2.renderer.labels.template.disabled = true;
  axis2.renderer.ticks.template.disabled = true;
  axis2.renderer.grid.template.disabled = true;

  var range0 = axis2.axisRanges.create();
  range0.value = 0;
  range0.endValue = 100;
  range0.axisFill.fillOpacity = 0.2;
  range0.axisFill.fill = colorSet.getIndex(6);
  range0.axisFill.zIndex = 1;

  var range1 = axis2.axisRanges.create();
  range1.value = 0;
  range1.endValue = 70;
  range1.axisFill.fillOpacity = 1;
  range1.axisFill.fill = colorSet.getIndex(1);
  range1.axisFill.zIndex = 0;

  var range2 = axis2.axisRanges.create();
  range2.value = 0;
  range2.endValue = 90;
  range2.axisFill.fillOpacity = 1;
  range2.axisFill.fill = colorSet.getIndex(2);
  range2.axisFill.zIndex = -1;

  var range3 = axis2.axisRanges.create();
  range3.value = 0;
  range3.endValue = 100;
  range3.axisFill.fillOpacity = 1;
  range3.axisFill.fill = colorSet.getIndex(3);
  range3.axisFill.zIndex = -2;

  var range4 = axis2.axisRanges.create();
  range4.value = 0;
  range4.endValue = 30;
  range4.axisFill.fillOpacity = 1;
  range4.axisFill.fill = colorSet.getIndex(2);
  range4.axisFill.zIndex = 0;

  var range5 = axis2.axisRanges.create();
  range5.value = 0;
  range5.endValue = 10;
  range5.axisFill.fillOpacity = 1;
  range5.axisFill.fill = colorSet.getIndex(3);
  range5.axisFill.zIndex = 0;

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
  label2.text = "Umidade do ar";
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
    var value = actUmMsg;

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
});
