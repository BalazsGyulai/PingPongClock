#include <WiFi.h>
#include <WebServer.h>
#include <ArduinoJson.h>
extern MainScreen myScreen;

// StaticJsonDocument<1024> doc;
// StaticJsonDocument<256> inputDoc;

class _WifiGuide
{
private:
    const char *ssid = "Gyuzo";
    const char *password = "Indulagorogaludni70020579";
    wifi_mode_t wifiMode = WIFI_STA;
    int timeout = 60000;
    int wifiStatus = WL_IDLE_STATUS;
    int currTime;
    int prevTime;
    WebServer server;

public:
    _WifiGuide() : server(80) {}

    void change_mode()
    {
        if (this->wifiMode == WIFI_STA)
        {
            this->wifiMode = WIFI_AP;
        }
        else if (this->wifiMode == WIFI_AP)
        {
            this->wifiMode = WIFI_STA;
        }
    }

    void init_setup()
    {
        WiFi.mode(this->wifiMode);
    }

    void init_connection()
    {

        if (this->wifiStatus != WL_CONNECTED && this->isThereTheRightNetwork())
        {
            this->scan_ssid();

            WiFi.begin(this->ssid, this->password);

            this->prevTime = millis();
            while (this->wifiStatus != WL_CONNECTED && this->currTime - this->prevTime <= this->timeout)
            {
                this->currTime = millis();
                this->update_status();
            }

            if (this->currTime - this->prevTime >= this->timeout)
            {
                Serial.println("Connection timeout");
            }
            else
            {
                Serial.println(this->get_status());
                Serial.println(WiFi.localIP());
            }
        }
    }

    void init_webserver()
    {
        this->server.on("/", [this]()
                        { this->handleRoot(); });
        this->server.begin();
        Serial.println("Server started");
    }

    void handleClientRequests()
    {
        this->server.handleClient();
    }

    void handleRoot()
    {
        this->server.sendHeader("Access-Control-Allow-Origin", "*");
        this->server.sendHeader("Content-Type", "application/json");
        StaticJsonDocument<1024> doc;

        if (this->server.method() == HTTP_GET)
        {

            if (this->server.hasArg("message"))
            {
                String myMessage = this->server.arg("message");
                doc["status"] = "ok";
                doc["message"] = myMessage;
                Serial.println(myMessage);
            }

            String json;
            serializeJson(doc, json);
            this->server.send(200, "application/json", json);
        }
        else if (this->server.method() == HTTP_POST)
        {
            StaticJsonDocument<256> inputDoc;
            DeserializationError error = deserializeJson(inputDoc, this->server.arg("plain"));

            if (!error)
            {

                int led_id;
                int column;
                int row;
                int color;
                int saturation;
                int brightness;
                int mycase;

                if (inputDoc.containsKey("led_id"))
                {
                    led_id = inputDoc["led_id"];
                }
                if (inputDoc.containsKey("column"))
                {
                    column = inputDoc["column"];
                }
                if (inputDoc.containsKey("row"))
                {
                    row = inputDoc["row"];
                }
                if (inputDoc.containsKey("color"))
                {
                    color = inputDoc["color"];
                }
                if (inputDoc.containsKey("saturation"))
                {
                    saturation = inputDoc["saturation"];
                }
                if (inputDoc.containsKey("brightness"))
                {
                    brightness = inputDoc["brightness"];
                }
                if (inputDoc.containsKey("mycase"))
                {
                    mycase = inputDoc["mycase"];
                }

                if (mycase == 0)
                {
                    MainScreenData(&screen)[7][20] = myScreen.getMainScreen();

                    if (row >= 0 && row < 7)
                    {
                        JsonArray rowArr = doc.createNestedArray("screen_row");
                        for (int j = 0; j < 20; j++)
                        {
                            JsonObject ledObj = rowArr.createNestedObject();
                            ledObj["led_id"] = screen[row][j].led_id;
                            ledObj["color"] = screen[row][j].color;
                            ledObj["saturation"] = screen[row][j].saturation;
                            ledObj["brightness"] = screen[row][j].brightness;
                        }
                        doc["status"] = "ok";
                    }
                    else
                    {
                        doc["status"] = "error";
                        doc["error"] = "Invalid row";
                    }
                }
                else
                {
                    doc["status"] = "error";
                    doc["error"] = "Unknown or missing mycase";
                }

                if (row >= 0 && row < 7 && column >= 0 && column < 20)
                {
                    myScreen.changeLedStatus(row, column, color, saturation, brightness);
                }

                doc["received"] = inputDoc;
                doc["status"] = "ok";
            }
            else
            {
                doc["status"] = "error";
                doc["error"] = "Invalid JSON";
            }

            String json;
            serializeJson(doc, json);
            this->server.send(200, "application/json", json);
        }
    }

    void scan_ssid()
    {
        int n = WiFi.scanNetworks();

        if (n == 0)
        {
            Serial.println("No networks were found");
        }
        else
        {
            for (int i = 0; i < n; i++)
            {
                Serial.println(WiFi.SSID(i));
            };
        }
    }

    bool isThereTheRightNetwork()
    {
        int n = WiFi.scanNetworks();
        bool found = false;
        if (n == 0)
        {
            return found;
        }
        else
        {
            for (int i = 0; i < n; i++)
            {
                if (WiFi.SSID(i) == this->ssid)
                {
                    found = true;
                }
            };
        }

        return found;
    }

    void update_status()
    {
        this->wifiStatus = WiFi.status();
    }

    String get_status()
    {
        this->update_status();

        switch (this->wifiStatus)
        {
        case WL_IDLE_STATUS:
            return "WL_IDLE_STATUS";
        case WL_SCAN_COMPLETED:
            return "WL_SCAN_COMPLETED";
        case WL_NO_SSID_AVAIL:
            return "WL_NO_SSID_AVAIL";
        case WL_CONNECT_FAILED:
            return "WL_CONNECT_FAILED";
        case WL_CONNECTION_LOST:
            return "WL_CONNECTION_LOST";
        case WL_CONNECTED:
            return "WL_CONNECTED";
        case WL_DISCONNECTED:
            return "WL_DISCONNECTED";
        }
    }
};