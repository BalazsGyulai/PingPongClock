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
}


export default function Home() {
  const [color, setColor] = useState(0);
  const [saturation, setSaturation] = useState(255);
  const [bright, setBright] = useState(255);
  const [hexcolor, setHexColor] = useState('#ff0000');
  const [rerenderFlag, setRerenderFlag] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const currentScreen = useRef();

  useEffect(() => {
    currentScreen.current = new mainScreen();
    currentScreen.current.init_screen();
    setRerenderFlag(flag => !flag);
  }, []);

  if (!currentScreen.current) return null;

  const url = `http://192.168.0.29`;

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

  const screen = [
    [-1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, -1],
    [-1, 34, 33, 32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, -1],
    [-1, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53],
    [73, 72, 71, 70, 69, 68, 67, 66, 65, 64, 63, 62, 61, 60, 59, 58, 57, 56, 55, 54],
    [-1, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92],
    [-1, 110, 109, 108, 107, 106, 105, 104, 103, 102, 101, 100, 99, 98, 97, 96, 95, 94, 93, -1],
    [-1, -1, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, -1]
  ];

  const HSVtoRGB = (h, s, v) => {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
      s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
      case 0: r = v, g = t, b = p; break;
      case 1: r = q, g = v, b = p; break;
      case 2: r = p, g = v, b = t; break;
      case 3: r = p, g = q, b = v; break;
      case 4: r = t, g = p, b = v; break;
      case 5: r = v, g = p, b = q; break;
    }
    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
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

  const handleColorPicker = (val) => {
    setHexColor(val);

    let rgb = hexToRGB(val);

    let hsv = RGBtoHSV(rgb['r'], rgb['g'], rgb['b']);

    setColor(hsv[0]);
    setSaturation(hsv[1]);
    setBright(hsv[2]);

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
        <div className="reference">
          <Image src={img} width={350} height={15} />
        </div>
        <input type="range" min={0} max={255} />
      </div>
      <input type="color" value={hexcolor} onChange={e => handleColorPicker(e.target.value)} />

      <p>H: {`${color}`}; S: {`${saturation}`}; V: {`${bright}`};</p>
    </div>
  );
}
