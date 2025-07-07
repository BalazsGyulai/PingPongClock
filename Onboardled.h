#include <FastLED.h>

#define PIXEL_PIN 48
#define PIXEL_NUM 1
CRGB pixel[PIXEL_NUM];

class OnBoardLed
{
private:
    int color = 255;
    int saturation = 255;
    int brightness = 100;
    int timeout = 500;
    int currTime;
    int prevTime;

public:
    void changeColor(int color)
    {
        this->color = color;
    }

    void changeSaturation(int saturation)
    {
        this->saturation = saturation;
    }

    void changeBrightness(int brightness)
    {
        this->brightness = brightness;
    }

    void changeTimeout(int timeout)
    {
        this->timeout = timeout;
    }

    void init_led()
    {
        FastLED.addLeds<WS2812B, PIXEL_PIN, GRB>(pixel, PIXEL_NUM);
        FastLED.setBrightness(255);
    }

    void turnOnLed()
    {
        pixel[0] = CHSV(this->color, this->saturation, this->brightness);
        FastLED.show();
    }
};