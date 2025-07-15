import 'dart:math';

class Pixel {
  int _led_id = -1;
  int _color = 0;
  int _saturation = 0;
  int _brightness = 44;

  void set_led_id(int? new_id) {
    if (new_id != null) {
      this._led_id = new_id;
    }
  }

  void set_color(int? new_color) {
    if (new_color != null) {
      this._color = new_color;
    }
  }

  void set_saturation(int? new_saturation) {
    if (new_saturation != null) {
      this._saturation = new_saturation;
    }
  }

  void set_brightness(int? new_brightness) {
    if (new_brightness != null) {
      this._brightness = new_brightness;
    }
  }

  List<int> get_rgb_color() { // convert HSV to RGB
    double h = this._color.toDouble() / 255 * 360;
    double s = this._saturation.toDouble() / 255;
    double v = this._brightness.toDouble() / 255;

    double c = v * s;
    double x = c * (1 - (((h / 60) % 2) - 1).abs());
    double m = v - c;

    double r1;
    double g1;
    double b1;

    if (h >= 0 && h < 60) {
      r1 = c;
      g1 = x;
      b1 = 0;
    } else if (h < 120) {
      r1 = x;
      g1 = c;
      b1 = 0;
    } else if (h < 180) {
      r1 = 0;
      g1 = c;
      b1 = x;
    } else if (h < 240) {
      r1 = 0;
      g1 = x;
      b1 = c;
    } else if (h < 300) {
      r1 = x;
      g1 = 0;
      b1 = c;
    } else {
      r1 = c;
      g1 = 0;
      b1 = x;
    }

    int r = ((r1 + m) * 255).round();
    int g = ((g1 + m) * 255).round();
    int b = ((b1 + m) * 255).round();

    return [r, g, b];
  }

  int get_led_id() {
    return this._led_id;
  }

  Pixel get_pixel() {
    return this;
  }
}
