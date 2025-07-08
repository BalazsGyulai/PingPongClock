// setup
#include <FastLED.h>
#include <MainScreen.h>
#include <WifiModul.h>
#include <Onboardled.h>

#include <esp_heap_caps.h>

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

MainScreen myScreen(screen);
OnBoardLed boardLed;
_WifiGuide myWifi;

void codeForCore0(void* param) {
  myScreen.init_screen();

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

 

  boardLed.init_led();

  // uint32_t freeHeapBefore = esp_get_free_heap_size();
  // codeForCore0();
  // uint32_t freeHeapAfter = esp_get_free_heap_size();
  // Serial.println(freeHeapBefore - freeHeapAfter);

  xTaskCreatePinnedToCore(
    codeForCore0,
    "Task_0",
    100000,
    NULL,
    1,
    &Task0,
    0);
}

void loop() {
  // put your main code here, to run repeatedly:
  myScreen.showScreen();
  boardLed.turnOnLed();
}
