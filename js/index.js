//Variáveis
let mqtt,
  actWatTempMsg,
  actAmbTempMsg,
  actUmMsg,
  actNivMsg,
  actVazMsg,
  actLitMsg,
  watTime1,
  watTime2,
  watTime3;
let reconnectTimeout = 2000;
let host = "broker.hivemq.com";
let port = 8000;

function onConnect() {
  console.log("Conectado!");

  //Topicos para receber
  mqtt.subscribe("hidroponia/node/#");

  ok = new Paho.MQTT.Message("1");
  ok.destinationName = "hidroponia/node/confirm";
  ok.qos = 1;
  mqtt.send(ok);
}

function onError(message) {
  //Faz um log do erro
  console.log("Falha: " + message.errorCode + " " + message.errorMessage);

  //Reconecta ao broker
  setTimeout(MQTTConnect, reconnectTimeout);
}

function onMessageArrived(msg) {
  //Faz um log da mensagem recebida
  /*console.log(
    "Tópico: " + msg.destinationName + "\nPayload: " + msg.payloadString
  );*/
  if (msg.destinationName == "hidroponia/node/watTemp") {
    actWatTempMsg = parseFloat(msg.payloadString);
  } else if (msg.destinationName == "hidroponia/node/ambTemp") {
    actAmbTempMsg = parseFloat(msg.payloadString);
  } else if (msg.destinationName == "hidroponia/node/um") {
    actUmMsg = parseFloat(msg.payloadString);
  } else if (msg.destinationName == "hidroponia/node/nivel") {
    actNivMsg = parseFloat(msg.payloadString);
    statusNivel();
  } else if (msg.destinationName == "hidroponia/node/rele") {
    actBombMsg = parseFloat(msg.payloadString);
    statusBomba();
  } else if (msg.destinationName == "hidroponia/node/vazao") {
    actVazMsg = parseFloat(msg.payloadString);
  } else if (msg.destinationName == "hidroponia/node/litros") {
    actLitMsg = parseFloat(msg.payloadString);
  }
}

function MQTTConnect() {
  console.log("Conectando " + host + ":" + port);

  //Cria e configura o client
  mqtt = new Paho.MQTT.Client(
    host,
    port,
    "IeCJSClient" + parseInt(Math.random() * 1e5)
  );
  let options = {
    timeout: 10,
    keepAliveInterval: 10,
    onSuccess: onConnect,
    onFailure: onError,
  };

  //Return padrão
  mqtt.onMessageArrived = onMessageArrived;
  mqtt.onConnectionLost = onError;

  //Finalizando a conexão
  mqtt.connect(options);
}

//Iniciando a conexão

window.onload = MQTTConnect();

//Dark Mode

let textColor = "#262626";

let buttonsWatTime = document.querySelectorAll(".watTime button");

buttonsWatTime[0].addEventListener("click", () => {
  watTime1 = new Paho.MQTT.Message("2");
  watTime1.destinationName = "hidroponia/node/watTime";
  watTime1.qos = 1;
  mqtt.send(watTime1);
});
buttonsWatTime[1].addEventListener("click", () => {
  watTime2 = new Paho.MQTT.Message("3");
  watTime2.destinationName = "hidroponia/node/watTime";
  watTime2.qos = 1;
  mqtt.send(watTime2);
});
buttonsWatTime[2].addEventListener("click", () => {
  watTime3 = new Paho.MQTT.Message("4");
  watTime3.destinationName = "hidroponia/node/watTime";
  watTime3.qos = 1;
  mqtt.send(watTime3);
});
