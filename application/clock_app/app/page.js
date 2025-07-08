'use client'

import { useEffect, useRef, useState } from "react";
import Image from 'next/image'
import img from '/public/image.png'

class mainScreen {
  constructor() {
    this.screen = [
      [-1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, -1],
      [-1, 34, 33, 32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, -1],
      [-1, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53],
      [73, 72, 71, 70, 69, 68, 67, 66, 65, 64, 63, 62, 61, 60, 59, 58, 57, 56, 55, 54],
      [-1, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92],
      [-1, 110, 109, 108, 107, 106, 105, 104, 103, 102, 101, 100, 99, 98, 97, 96, 95, 94, 93, -1],
      [-1, -1, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, -1]
    ];
  }

  init_screen() {
    for (let row = 0; row < this.screen.length; row++) {
      for (let column = 0; column < this.screen[row].length; column++) {
        this.screen[row][column] = {
          led_id: this.screen[row][column],
          color: 0,
          saturation: 0,
          brightness: 0,
          hex: '#ffffff'
        }
      }
    }
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

  refresh_screen(new_screen) { // updates only specific values
    for (let row = 0; row < this.screen.length; row++) {
      for (let column = 0; column < this.screen[row].length; column++) {

        // for (let i = 0; i < new_screen.length; i++) {

        //   if (this.isLedTurnedOn())

        // }

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
    let new_draw = drawing
    let count_move = 0;
    let can_be_moved = true;
    while (can_be_moved && count_move < 20) {
      new_draw = this.moveDigit(new_draw, moveX, moveY);

      count_move++;
    }

    return new_draw;
  }
}

class CustomDigit {
  constructor() {
    this.digit;
  }

  show_digit() {
    return this.digit;
  }

  edit_digit(screen) {

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


export default function Home() {
  const [color, setColor] = useState(0);
  const [saturation, setSaturation] = useState(255);
  const [bright, setBright] = useState(255);
  const [hexcolor, setHexColor] = useState('#ff0000');
  const [rerenderFlag, setRerenderFlag] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [clock_screen, setClockScreen] = useState([]);
  const [drawedDigits, setDrawDigits] = useState([]);

  const currentScreen = useRef();

  const url = `http://192.168.0.29`;

  const getClockStatus = async () => {
    let allRows = [];
    for (let row = 0; row < 7; row++) {
      await fetch(url, {
        method: "post",
        body: JSON.stringify({
          mycase: 0,
          row: row
        }),
      })
        .then((data) => data.json())
        .then((data) => {
          console.log(data);
          allRows.push(data['screen_row']);
        });

    }

    setClockScreen(allRows);
  }
  useEffect(() => {
    currentScreen.current = new mainScreen();
    currentScreen.current.init_screen();
    setRerenderFlag(flag => !flag);

    getClockStatus();
  }, []);

  useEffect(() => {
    currentScreen.current.update_screen(clock_screen);
    setRerenderFlag(flag => !flag);
    console.log(currentScreen.current.getScreen())
  }, [clock_screen])

  if (!currentScreen.current) return null;


  const sendMessage = async () => {
    const data = await fetch('http://192.168.0.29?message=olaaah');
    const posts = await data.json()
    console.log(posts);

  }
  const sendPostMessage = async () => {
    fetch(`http://192.168.0.29`, {
      method: "post",
      body: JSON.stringify({
        players: 8,
      }),
    })
      .then((data) => data.json())
      .then((data) => {
        console.log(data);
      });

  }


  const HSVtoRGB = (h, s, v) => {
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

  const RGBtoHSV = (r, g, b) => {
    r /= 255, g /= 255, b /= 255;

    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, v = max;

    var d = max - min;
    s = max == 0 ? 0 : d / max;

    if (max == min) {
      h = 0; // achromatic
    } else {
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }

      h /= 6;
    }

    return [Math.round(h * 255), Math.round(s * 255), Math.round(v * 255)];
  }

  const hexToRGB = (hex) => {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  const rgbToHex = (r, g, b) => {
    return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
  }

  const handleColorChange = (e) => {
    let rgb = HSVtoRGB(e.target.value, saturation, bright);
    setHexColor(rgbToHex(rgb[0], rgb[1], rgb[2]));
    setColor(e.target.value);
  }

  const handleSaturationChange = (e) => {
    let rgb = HSVtoRGB(color, e.target.value, bright);
    setHexColor(rgbToHex(rgb[0], rgb[1], rgb[2]));
    setSaturation(e.target.value);
  }

  const handleBrightnessChange = (e) => {
    let rgb = HSVtoRGB(color, saturation, e.target.value);
    setHexColor(rgbToHex(rgb[0], rgb[1], rgb[2]));
    setBright(e.target.value);

  }

  const ledChangeHandler = (row, column) => {

    if (currentScreen.current.getScreen()[row][column].color == 0 &&
      currentScreen.current.getScreen()[row][column].saturation == 0 &&
      currentScreen.current.getScreen()[row][column].brightness == 0) {
      currentScreen.current.changeScreenColor(row, column, color, saturation, bright, hexcolor);
    } else if (currentScreen.current.getScreen()[row][column].color != 0 ||
      currentScreen.current.getScreen()[row][column].saturation != 0 ||
      currentScreen.current.getScreen()[row][column].brightness != 0) {
      currentScreen.current.changeScreenColor(row, column, 0, 0, 0, '#ffffff');
    }

    setRefresh(r => !r);




    console.log(currentScreen.current.getScreen()[row][column]);



    fetch(url, {
      method: "post",
      body: JSON.stringify({
        led_id: currentScreen.current.getScreen()[row][column].led_id,
        column: column,
        row: row,
        color: currentScreen.current.getScreen()[row][column].color,
        saturation: currentScreen.current.getScreen()[row][column].saturation,
        brightness: currentScreen.current.getScreen()[row][column].brightness
      }),
    })
      .then((data) => data.json())
      .then((data) => {
        console.log(data);
      });
  }

  const isLedTurnedOn = (row, column) => {
    if (currentScreen.current.getScreen()[row][column].color != 0 ||
      currentScreen.current.getScreen()[row][column].saturation != 0 ||
      currentScreen.current.getScreen()[row][column].brightness != 0) {
      return true;
    } else {
      return false;
    }
  }

  const moveDrawToSide = (draw, moveX, moveY) => {

    let selected_leds = draw;
    let count_move = 0;
    let can_be_moved = true;
    while (can_be_moved && count_move < 20) {
      for (let i = 0; i < selected_leds.length; i++) {
        let row = selected_leds[i][0] + moveY;
        let column = selected_leds[i][1] + moveX;

        if (row < 0 || row >= 7 || column < 0 || column >= 20) {
          can_be_moved = false;
        }

        if (can_be_moved && currentScreen.current.getScreen()[row][column].led_id == -1) {
          can_be_moved = false;
        }
      }

      if (can_be_moved) {
        for (let i = 0; i < selected_leds.length; i++) {
          selected_leds[i] = [selected_leds[i][0] + moveY, selected_leds[i][1] + moveX];
        }
      }



      count_move++;
    }

    return selected_leds;
  }

  const saveDigitOne = () => {
    let digit = new CustomDigit();

    digit.edit_digit(currentScreen.current.getScreen());

    console.log(digit.show_digit());

    digit.edit_digit(currentScreen.current.moveToSide(digit.show_digit(), -1, 0));

    console.log(currentScreen.current.moveToSide(digit.show_digit(), -1, 0));

    // let selected_leds = [];

    // for (let i = 0; i < 7; i++) {
    //   for (let y = 0; y < 20; y++) {
    //     if (isLedTurnedOn(i, y)) {
    //       selected_leds.push({
    //         row: i,
    //         column: y,
    //         led_id: currentScreen.current.getScreen()[i][y].led_id,
    //         color: currentScreen.current.getScreen()[i][y].color,
    //         saturation: currentScreen.current.getScreen()[i][y].saturation,
    //         brightness: currentScreen.current.getScreen()[i][y].brightness,
    //         hex: currentScreen.current.getScreen()[i][y].hex
    //       });
    //     }
    //   }
    // }


    // selected_leds = moveDrawToSide(selected_leds, -1, 0);

  }

  return (
    <div>
      <div id="frame">
        {
          currentScreen.current.getScreen().map((row, i) => (
            <div key={i} className="row">
              {
                row.map((column, y) => (
                  column.led_id != -1 ?
                    <div key={`${i}${y}`} className="led" onClick={() => ledChangeHandler(i, y)} style={{ background: column.hex }}></div> : ""
                ))
              }
            </div>
          ))
        }
      </div>

      <div className="color">
        <span>Color: {`${color}`}</span>
        <div className="reference">
          <Image src={img} width={350} height={15} alt={'colors'} />
        </div>
        <input type="range" min={0} max={255} value={color} onChange={e => handleColorChange(e)} />
        <span>Saturation: {`${saturation}`}</span>
        <input type="range" min={0} max={255} value={saturation} onChange={e => handleSaturationChange(e)} />
        <span>Brightness: {`${bright}`}</span>
        <input type="range" min={0} max={255} value={bright} onChange={e => handleBrightnessChange(e)} />

      </div>

      <div className="digits">
        <button onClick={saveDigitOne}>Save Digit 1</button>

      </div>


      {/* <input type="color" value={hexcolor} onChange={e => handleColorPicker(e.target.value)} /> */}

    </div>
  );
}
