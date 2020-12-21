//Ports mapping
#define D0 16
#define D1 5
#define D2 4
#define D3 0
#define D4 2
#define D5 14
#define D6 12
#define D7 13
#define D8 15
#define D9 3
#define D10 1

//Fluxo
uint8_t GPIO_Pin = D5;

float vazao;          //Variável para armazenar o valor em L/min
float media = 0;      //Variável para fazer a média
int contaPulso;       //Variável para a quantidade de pulsos
int cnt = 0;          //Variável para segundos
int Min = 00;         //Variável para minutos
float Litros = 0;     //Variável para Quantidade de agua
float MiliLitros = 0; //Variavel para Conversão

//One Wire Lib Definition
#define ONE_WIRE_BUS 2 //Pin D4

//MQTT Libs
#include <ESP8266WiFi.h>
#include <PubSubClient.h>

//Temp Libs
#include <OneWire.h>
#include <DallasTemperature.h>
#include <DHT.h>

//Temp Config
DHT dht(D3, DHT22);

//WiFi Config
const char *ssid = "---";
const char *password = "---";

//Broker Config
const char *mqtt_server = "broker.hivemq.com";
int broker_port = 1883;

//Client Config
WiFiClient espClient;
PubSubClient client(espClient);

//One Wire //Temperature sensor
OneWire oneWire(ONE_WIRE_BUS);

//Dalas Init
DallasTemperature sensors(&oneWire);

//Msg Sending
long lastMsg = 0;
char msg[50];
int value = 0;

//Temp
float t; //Temp
float h; // Umid

//Ports
int nivel = D0;
int nivelVal = 0;
int ledVerm = D6;
int ledAma = D8;
int ledVerd = D7;
int bomba = D2;
int i = 0;
int zero = 0;

void setup_wifi()
{
  delay(100);

  Serial.println("");
  Serial.print("Connecting to: ");
  Serial.println(ssid);

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
    i = i + 1;
    if (i == 15)
    {
      Serial.println(".");
      i = 0;
    }
  }

  randomSeed(micros());

  Serial.println(" ");
  Serial.println("WiFi connected");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
  Serial.println(" ");
}

void callback(char *topic, byte *payload, unsigned int length)
{
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");

  for (int i = 0; i < length; i++)
  {
    Serial.print((char)payload[i]);
  }

  Serial.println(" ");

  //In case of the first digit beeing a 1
  if ((char)payload[0] == '1')
  {
    char litString[5];
    dtostrf(Litros, 1, 2, litString);
    client.publish("hidroponia/node/litros", litString);

    if (digitalRead(bomba) == LOW)
    {
      client.publish("hidroponia/node/rele", "1");
    }
    else if (digitalRead(bomba) == HIGH)
    {
      client.publish("hidroponia/node/rele", "0");
    }
  }
}

void reconnect()
{
  while (!client.connected())
  {
    Serial.println("Attempting MQTT connection...");
    //Random ID
    String clientId = "ESP8266Client-";
    clientId += String(random(0xffff), HEX);

    if (client.connect(clientId.c_str()))
    {
      Serial.print("Connected to: ");
      Serial.print(mqtt_server);
      Serial.print(":");
      Serial.println(broker_port);
      Serial.println(" ");

      //Once connected, publish an announcement...
      client.publish("check/node", "true");

      client.subscribe("hidroponia/node/confirm");
    }
    else
    {
      Serial.print("Failed, rc=");
      Serial.print(client.state());
      Serial.println(" Try again in 5 seconds");
      delay(5000);
    }
  }
}

void pump()
{
  if (digitalRead(bomba) == LOW)
  {
    digitalWrite(bomba, HIGH);
    digitalWrite(ledVerd, LOW);
    client.publish("hidroponia/node/rele", "0");
  }
  else if (digitalRead(bomba) == HIGH)
  {
    digitalWrite(bomba, LOW);
    digitalWrite(ledVerd, HIGH);
    client.publish("hidroponia/node/rele", "1");
  }
}

void setup()
{
  Serial.begin(115200);

  pinMode(nivel, INPUT);
  pinMode(ledVerm, OUTPUT);
  pinMode(ledAma, OUTPUT);
  pinMode(ledVerd, OUTPUT);
  pinMode(bomba, OUTPUT);
  pinMode(2, INPUT);

  attachInterrupt(digitalPinToInterrupt(GPIO_Pin), inpulso, RISING);

  setup_wifi();

  client.setServer(mqtt_server, broker_port);
  client.setCallback(callback);

  sensors.begin();
  dht.begin();

  digitalWrite(bomba, HIGH);
  pump();
}

void loop()
{
  if (!client.connected())
  {
    reconnect(); //Checks Connection
  }

  contaPulso = 0; //Zera a variável
  sei();          //Habilita interrupção

  //Enviar as coisas
  long now = millis();

  if (now - lastMsg > 2000)
  {
    lastMsg = now;

    //Request for all the devices on the bus
    sensors.requestTemperatures();
    h = dht.readHumidity();
    t = dht.readTemperature();

    //Water temp
    float tempC = sensors.getTempCByIndex(0); //The 0 refers to the first device

    //Water temp to char
    char watTempString[5];
    dtostrf(tempC, 1, 2, watTempString);
    Serial.print("Temperatura da agua: ");
    Serial.println(watTempString);
    client.publish("hidroponia/node/watTemp", watTempString);

    //Amb Temp to char
    char ambTempString[5];
    dtostrf(t, 1, 2, ambTempString);
    Serial.print("Temperatura do ambiente: ");
    Serial.println(ambTempString);
    client.publish("hidroponia/node/ambTemp", ambTempString);

    //Umd to char
    char umString[5];
    dtostrf(h, 1, 2, umString);
    Serial.print("Umidade do ambiente: ");
    Serial.println(umString);
    client.publish("hidroponia/node/um", umString);

    //Read Water
    Serial.println("");
    nivelVal = !digitalRead(nivel);
    Serial.print("Nivel: ");
    Serial.println(nivelVal);
    Serial.println("");

    //Send Water Signal
    if (nivelVal == 1)
    {
      client.publish("hidroponia/node/nivel", "1");
    }
    else
    {
      client.publish("hidroponia/node/nivel", "0");
    }

    //Rele countdown
    zero++;

    if (zero == 450)
    {
      zero = 0;
      pump();
    }

    //Fluxo
    cli(); //Desabilita interrupção

    vazao = contaPulso / 5.5; //Converte para L/min
    media = media + vazao;    //Soma a vazão para o calculo da media
    cnt = cnt + 2;

    Serial.print(vazao);       //Escreve no display o valor da vazão
    Serial.println(" L/min "); //Escreve L/min

    MiliLitros = vazao / 60;
    Litros = Litros + MiliLitros;

    Serial.print(Litros);
    Serial.println("L ");

    if (vazao > 0.00)
    {
      char vazString[5];
      dtostrf(vazao, 1, 2, vazString);
      client.publish("hidroponia/node/vazao", vazString);
      char litString[5];
      dtostrf(Litros, 1, 2, litString);
      client.publish("hidroponia/node/litros", litString);
    }
    else
    {
      client.publish("hidroponia/node/vazao", "0");
    }

    //aaa//
    if (nivelVal == 1 && digitalRead(bomba) == LOW)
    {
      digitalWrite(bomba, HIGH);
      client.publish("hidroponia/node/rele", "0");
      digitalWrite(ledVerd, LOW);
      digitalWrite(ledAma, LOW);
      digitalWrite(ledVerm, HIGH);
    }

    if (nivelVal == 0 && digitalRead(bomba) == HIGH)
    {
      digitalWrite(ledAma, HIGH);
    }

    if (digitalRead(bomba) == LOW)
    {
      digitalWrite(ledAma, LOW);
      digitalWrite(ledVerm, LOW);
    }
  }
  client.loop(); //Checks Connection
}

ICACHE_RAM_ATTR void inpulso()
{
  contaPulso++; //Incrementa a variável de pulsos
}