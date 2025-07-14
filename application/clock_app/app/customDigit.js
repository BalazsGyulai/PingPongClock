
export default class CustomDigit {
  constructor() {
    this.digit;
  }

  show_digit() {
    return this.digit;
  }

  init_digit(screen) {

    let selected_leds = [];

    for (let i = 0; i < 7; i++) {
      for (let y = 0; y < 20; y++) {
        if (this.isLedTurnedOn(screen[i][y])) {
          selected_leds.push({
            row: i,
            column: y,
            led_id: screen[i][y].led_id,
            color: screen[i][y].color,
            saturation: screen[i][y].saturation,
            brightness: screen[i][y].brightness,
            hex: screen[i][y].hex
          });
        }
      }
    }

    this.digit = selected_leds;
  }

  edit_digit(digit) {
    this.digit = digit;
  }

  isLedTurnedOn = (elem) => {
    if (elem.color != 0 ||
      elem.saturation != 0 ||
      elem.brightness != 0) {
      return true;
    } else {
      return false;
    }
  }
}
