//Vazao

am4core.ready(function () {
  // Themes begin
  am4core.useTheme(am4themes_amcharts);
  am4core.useTheme(am4themes_animated);

  // Create chart
  var liveChart = am4core.create("chartdivVaz", am4charts.GaugeChart);
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
  range1.endValue = 5;
  range1.axisFill.fillOpacity = 1;
  range1.axisFill.fill = colorSet.getIndex(3);
  range1.axisFill.zIndex = 0;

  var range2 = axis2.axisRanges.create();
  range2.value = 0;
  range2.endValue = 100;
  range2.axisFill.fillOpacity = 1;
  range2.axisFill.fill = colorSet.getIndex(5);
  range2.axisFill.zIndex = -1;

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
  label2.text = "Litros por minuto";
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
    var value = actVazMsg;

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

//Litros

am4core.ready(function () {
  // Themes begin
  am4core.useTheme(am4themes_amcharts);
  am4core.useTheme(am4themes_animated);
  // Themes end

  var capacity = 10000;
  var value = 0;
  var valueGen = () => {
    if (actLitMsg == undefined) {
      value = value;
    } else {
      value = actLitMsg;
    }
  };

  valueGen();

  var circleSize = 0.8;

  var component = am4core.create("chartdivLitro", am4core.Container);
  component.width = am4core.percent(100);
  component.height = am4core.percent(100);

  var chartContainer = component.createChild(am4core.Container);
  chartContainer.x = am4core.percent(50);
  chartContainer.y = am4core.percent(50);

  var circle = chartContainer.createChild(am4core.Circle);
  circle.fill = am4core.color("#3269D915");

  var circleMask = chartContainer.createChild(am4core.Circle);

  let shadowCirc = component.filters.push(new am4core.DropShadowFilter());
  shadowCirc.dx = 5;
  shadowCirc.dy = 5;
  shadowCirc.blur = 10;
  shadowCirc.opacity = 0.3;
  shadowCirc.color = textColor;

  var waves = chartContainer.createChild(am4core.WavedRectangle);
  waves.fill = am4core.color("#3269D9");
  waves.mask = circleMask;
  waves.horizontalCenter = "middle";
  waves.waveHeight = 10;
  waves.waveLength = 30;
  waves.y = 500;
  circleMask.y = -500;

  component.events.on("maxsizechanged", function () {
    var smallerSize = Math.min(component.pixelWidth, component.pixelHeight);
    var radius = (smallerSize * circleSize) / 2;

    circle.radius = radius;
    circleMask.radius = radius;
    waves.height = smallerSize;
    waves.width = Math.max(component.pixelWidth, component.pixelHeight);

    //capacityLabel.y = radius;

    var labelRadius = radius + 20;

    capacityLabel.path =
      am4core.path.moveTo({ x: -labelRadius, y: 0 }) +
      am4core.path.arcToPoint(
        { x: labelRadius, y: 0 },
        labelRadius,
        labelRadius
      );
    capacityLabel.locationOnPath = 0.5;

    setValue(value);

    setInterval(() => {
      valueGen();
      setValue(value);
    }, 4000);
  });

  var formattedValue;

  function setValue(value) {
    var y =
      -circle.radius -
      waves.waveHeight +
      (1 - value / capacity) * circle.pixelRadius * 2;
    waves.animate(
      [
        { property: "y", to: y },
        { property: "waveHeight", to: 5, from: 15 },
        { property: "x", from: -30, to: 0 },
      ],
      3000,
      am4core.ease.elasticOut
    );
    circleMask.animate(
      [
        { property: "y", to: -y },
        { property: "x", from: 50, to: 0 },
      ],
      3000,
      am4core.ease.elasticOut
    );
    var formattedValue = component.numberFormatter.format(value, "#.#a");
    formattedValue = formattedValue.toUpperCase();
    label.text = formattedValue + " Litros";
  }

  var label = chartContainer.createChild(am4core.Label);

  label.fill = am4core.color(textColor);
  label.fontSize = "2.5em";
  label.horizontalCenter = "middle";
  label.verticalCenter = "middle";

  var capacityLabel = chartContainer.createChild(am4core.Label);

  /* var formattedCapacity = component.numberFormatter
           .format(capacity, "#.#a")
           .toUpperCase();
   
       capacityLabel.text = "Capacidade " + formattedCapacity + " Litros";
       capacityLabel.fill = am4core.color("#34a4eb");
       capacityLabel.fontSize = 26;
       capacityLabel.textAlign = "middle";
       capacityLabel.padding(5, 0, 0, 0);*/

  setInterval(function () {
    if (window.matchMedia("(max-width:800px)").matches) {
      label.fontSize = "1.5em";
      label.horizontalCenter = "middle";
      label.verticalCenter = "middle";
    } else {
      label.fontSize = "2.5em";
      label.horizontalCenter = "middle";
      label.verticalCenter = "middle";
    }
  }, 500);
});
