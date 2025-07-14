export default class mainScreen {
  constructor() {
    this.screen;
    this.editColor = '#ff0000';
  }

  getEditColor() {
    return this.editColor;
  }

  init_screen() {
    let base_screen = [
      [-1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, -1],
      [-1, 34, 33, 32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, -1],
      [-1, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53],
      [73, 72, 71, 70, 69, 68, 67, 66, 65, 64, 63, 62, 61, 60, 59, 58, 57, 56, 55, 54],
      [-1, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92],
      [-1, 110, 109, 108, 107, 106, 105, 104, 103, 102, 101, 100, 99, 98, 97, 96, 95, 94, 93, -1],
      [-1, -1, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, -1]
    ];

    for (let row = 0; row < base_screen.length; row++) {
      for (let column = 0; column < base_screen[row].length; column++) {
        base_screen[row][column] = {
          led_id: base_screen[row][column],
          color: 0,
          saturation: 0,
          brightness: 0,
          hex: '#ffffff'
        }
      }
    }

    this.screen = base_screen;
  }

  update_screen(new_screen) { // updates the whole screen
    for (let row = 0; row < new_screen.length; row++) {
      for (let column = 0; column < new_screen[row].length; column++) {
        let rgb = this.HSVtoRGB(new_screen[row][column].color, new_screen[row][column].saturation, new_screen[row][column].brightness);
        let hex = this.rgbToHex(rgb[0], rgb[1], rgb[2]);
        this.screen[row][column] = {
          led_id: new_screen[row][column].led_id,
          color: new_screen[row][column].color,
          saturation: new_screen[row][column].saturation,
          brightness: new_screen[row][column].brightness,
          hex: hex == '#000000' ? '#ffffff' : hex
        }
      }
    }
  }

  write_digit(digit) { // clear screen and updates specific values
    this.init_screen();

    for (let i = 0; i < digit.length; i++) {

      let rgb = this.HSVtoRGB(digit[i].color, digit[i].saturation, digit[i].brightness);
      let hex = this.rgbToHex(rgb[0], rgb[1], rgb[2]);


      this.screen[digit[i].row][digit[i].column] = {
        led_id: digit[i].led_id,
        color: digit[i].color,
        saturation: digit[i].saturation,
        brightness: digit[i].brightness,
        hex: hex
      }
    }
  }

  stack_screen(digit) {
    for (let i = 0; i < digit.length; i++) {

      let rgb = this.HSVtoRGB(digit[i].color, digit[i].saturation, digit[i].brightness);
      let hex = this.rgbToHex(rgb[0], rgb[1], rgb[2]);

      this.screen[digit[i].row][digit[i].column] = {
        led_id: digit[i].led_id,
        color: digit[i].color,
        saturation: digit[i].saturation,
        brightness: digit[i].brightness,
        hex: hex
      }
    }
  }

  rgbToHex = (r, g, b) => {
    return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
  }

  HSVtoRGB = (h, s, v) => {
    h = h / 255 * 360;
    s = s / 255;
    v = v / 255;

    let c = v * s;
    let x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    let m = v - c;
    let r1, g1, b1;

    if (h >= 0 && h < 60) {
      r1 = c; g1 = x; b1 = 0;
    } else if (h < 120) {
      r1 = x; g1 = c; b1 = 0;
    } else if (h < 180) {
      r1 = 0; g1 = c; b1 = x;
    } else if (h < 240) {
      r1 = 0; g1 = x; b1 = c;
    } else if (h < 300) {
      r1 = x; g1 = 0; b1 = c;
    } else {
      r1 = c; g1 = 0; b1 = x;
    }

    let r = Math.round((r1 + m) * 255);
    let g = Math.round((g1 + m) * 255);
    let b = Math.round((b1 + m) * 255);

    return [r, g, b];
  }

  getScreen() {
    return this.screen;
  }

  changePixelColor(row, column, h) {
    this.screen[row][column].color = h;
  }
  changePixelSaturation(row, column, s) {
    this.screen[row][column].saturation = s;
  }
  changePixelBrightness(row, column, b) {
    this.screen[row][column].brightness = b;
  }

  changePixelHex(row, column, hex) {
    this.screen[row][column].hex = hex;
  }

  changeScreenColor(row, column, h, s, b, hex) {
    this.changePixelColor(row, column, h);
    this.changePixelSaturation(row, column, s);
    this.changePixelBrightness(row, column, b);
    this.changePixelHex(row, column, hex);
  }




  moveDigit(drawing, moveX, moveY) {
    let can_be_moved = true;

    for (let i = 0; i < drawing.length; i++) {
      let row = drawing[i].row + moveY;
      let column = drawing[i].column + moveX;

      if (row < 0 || row >= 7 || column < 0 || column >= 20) {
        can_be_moved = false;
      }

      if (can_be_moved && this.screen[row][column].led_id == -1) {
        can_be_moved = false;
      }
    }

    if (can_be_moved) {
      let new_drawing_pos = []

      for (let i = 0; i < drawing.length; i++) {
        let row = drawing[i].row + moveY;
        let column = drawing[i].column + moveX;

        new_drawing_pos.push({
          row: row,
          column: column,
          led_id: this.screen[row][column].led_id,
          color: drawing[i].color,
          saturation: drawing[i].saturation,
          brightness: drawing[i].brightness,
          hex: drawing[i].hex
        })
      }

      return new_drawing_pos;
    } else {
      return false
    }

  }

  isLedTurnedOn = (row, column) => {
    if (this.screen[row][column].color != 0 ||
      this.screen[row][column].saturation != 0 ||
      this.screen[row][column].brightness != 0) {
      return true;
    } else {
      return false;
    }
  }

  moveToSide(drawing, moveX, moveY) {
    let new_draw = drawing;
    let count_move = 0;
    let can_be_moved = true;

    while (can_be_moved && count_move < 20) {
      for (let i = 0; i < new_draw.length; i++) {
        let row = new_draw[i].row + moveY;
        let column = new_draw[i].column + moveX;


        if (row < 0 || row >= 7 || column < 0 || column >= 20) {
          can_be_moved = false;
        }

        if (can_be_moved && this.screen[row][column].led_id == -1) {
          can_be_moved = false;
        }
      }

      if (can_be_moved) {
        for (let i = 0; i < new_draw.length; i++) {
          let row = new_draw[i].row + moveY;
          let column = new_draw[i].column + moveX;

          new_draw[i] = {
            row: row,
            column: column,
            led_id: this.screen[row][column].led_id,
            color: drawing[i].color,
            saturation: drawing[i].saturation,
            brightness: drawing[i].brightness,
            hex: drawing[i].hex
          }
        }
      }

      count_move++;
    }

    return new_draw;
  }
}