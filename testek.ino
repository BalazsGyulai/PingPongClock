// setup
#include <FastLED.h>
#include <WifiModul.h>
#include <Onboardled.h>
#include <esp_heap_caps.h>

#define LED_PIN 10
#define NUM_LEDS 128
CRGB leds[NUM_LEDS];

TaskHandle_t Task0;

// initial variables
int color = 116;
int saturation = 100;
int brightness = 15;

// led numbers of screen
int screen[7][20] = {
  { -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, -1 },
  { -1, 34, 33, 32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, -1 },
  { -1, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53 },
  { 73, 72, 71, 70, 69, 68, 67, 66, 65, 64, 63, 62, 61, 60, 59, 58, 57, 56, 55, 54 },
  { -1, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92 },
  { -1, 110, 109, 108, 107, 106, 105, 104, 103, 102, 101, 100, 99, 98, 97, 96, 95, 94, 93, -1 },
  { -1, -1, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, -1 }
};

bool IsScreenValid(int row, int column) {  // return true when the screen value is not -1 therefore pixel can be set
  if (screen[row][column] != -1) {
    return true;
  } else {
    return false;
  }
}

void WriteScreen(int row, int column) {
  if (IsScreenValid(row, column)) {
    // strip.setPixelColor(screen[row][column], strip.ColorHSV(color, saturation, brightness));
    leds[screen[row][column]] = CHSV(color, saturation, brightness);

    FastLED.show();
  }
}



OnBoardLed boardLed;
_WifiGuide myWifi;

void codeForCore0(void* param) {
  myWifi.init_setup();
  myWifi.init_connection();

  myWifi.init_webserver();

  for (;;) {
    myWifi.init_connection();
    myWifi.handleClientRequests();
    vTaskDelay(1);
  }
}

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);

  FastLED.addLeds<WS2812, LED_PIN, GRB>(leds, NUM_LEDS);

  boardLed.init_led();

  // uint32_t freeHeapBefore = esp_get_free_heap_size();
  // myWifi.init_setup();
  // myWifi.scan_ssid();
  // if (myWifi.isThereTheRightNetwork()) {
  //   myWifi.init_connection();
  // }
  // uint32_t freeHeapAfter = esp_get_free_heap_size();
  // Serial.println(freeHeapBefore - freeHeapAfter);

  xTaskCreatePinnedToCore(
    codeForCore0,
    "Task_0",
    61790,
    NULL,
    1,
    &Task0,
    0);
}

void loop() {
  // put your main code here, to run repeatedly:
  WriteScreen(6, 2);
  WriteScreen(6, 18);
  boardLed.turnOnLed();
}
