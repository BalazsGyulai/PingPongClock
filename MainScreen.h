#include <FastLED.h>

struct MainScreenData
{
    int led_id;
    int color = 0;
    int saturation = 0;
    int brightness = 0;
};

#define LED_PIN 10
#define NUM_LEDS 128
CRGB leds[NUM_LEDS];

class MainScreen
{
    MainScreenData screen[7][20];

public:
    MainScreen(const int inputScreen[7][20])
    {

        for (int i = 0; i < 7; i++)
        {
            for (int j = 0; j < 20; j++)
            {
                screen[i][j].led_id = inputScreen[i][j];
            }
        }
    }

    void init_screen()
    {
        FastLED.addLeds<WS2812, LED_PIN, GRB>(leds, NUM_LEDS).setCorrection(TypicalLEDStrip);
        FastLED.setBrightness(255);
    }

    MainScreenData (&getMainScreen())[7][20]
    {
        return this->screen;
    }

    bool IsScreenValid(int row, int column)
    { // return true when the screen value is not -1 therefore pixel can be set
        if (this->screen[row][column].led_id != -1)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    void changeLedColor(int row, int column, int color){
        this->screen[row][column].color = color;
    }
    void changeLedBrightness(int row, int column, int brightness){
        this->screen[row][column].brightness = brightness;
    }
    void changeLedSaturation(int row, int column, int saturation){
        this->screen[row][column].saturation = saturation;
    }

    void changeLedStatus(int row, int column, int color, int saturation, int brightness){
        changeLedColor(row, column, color);
        changeLedBrightness(row, column, brightness);
        changeLedSaturation(row, column, saturation);
    }

    void showScreen()
    {
        for (int i = 0; i < 7; i++)
        {
            for (int y = 0; y < 20; y++)
            {
                leds[this->screen[i][y].led_id] = CHSV(
                    this->screen[i][y].color,
                    this->screen[i][y].saturation,
                    this->screen[i][y].brightness);
            }
        }
        FastLED.show();
    }

    void WriteScreen(int row, int column)
    {
        if (IsScreenValid(row, column))
        {
            // strip.setPixelColor(screen[row][column], strip.ColorHSV(color, saturation, brightness));
            leds[this->screen[row][column].led_id] = CHSV(
                this->screen[row][column].color,
                this->screen[row][column].saturation,
                this->screen[row][column].brightness);

            FastLED.show();
        }
    }
};