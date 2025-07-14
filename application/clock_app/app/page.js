'use client'

import { useEffect, useRef, useState } from "react";
import Image from 'next/image'
import img from '/public/image.png'
import mainScreen from './mainScreen'
import CustomDigit from './customDigit'
import ThemeDigits from './themeDigits'
import CustomScreen from './customScreen'


export default function Home() {
  const [color, setColor] = useState(0);
  const [saturation, setSaturation] = useState(255);
  const [bright, setBright] = useState(255);
  const [hexcolor, setHexColor] = useState('#ff0000');
  const [rerenderFlag, setRerenderFlag] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [clock_screen, setClockScreen] = useState([]);
  const [drawedDigits, setDrawDigits] = useState([]);
  const [clockPos, setClockPosition] = useState(false);
  const [clockdigits, setClockDigits] = useState({
    hour1: { x: 0, y: 0 },
    hour2: { x: 0, y: 0 },
    min1: { x: 0, y: 0 },
    min2: { x: 0, y: 0 },
    sec: { x: 0, y: 0 },
  })
  const [editPlace, setEditPlace] = useState(null);

  const currentScreen = useRef();
  const currentThemeDigits = useRef();
  const customScreen = useRef();
  const customDraw = useRef();

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

    if (allRows.length != 0) {
      setClockScreen(allRows);
      setRerenderFlag(flag => !flag);
    }
  }
  useEffect(() => {
    currentScreen.current = new mainScreen();
    currentThemeDigits.current = new ThemeDigits();
    customScreen.current = new CustomScreen();
    customDraw.current = new ThemeDigits();
    currentScreen.current.init_screen();

    // getClockStatus();
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



    // fetch(url, {
    //   method: "post",
    //   body: JSON.stringify({
    //     led_id: currentScreen.current.getScreen()[row][column].led_id,
    //     column: column,
    //     row: row,
    //     color: currentScreen.current.getScreen()[row][column].color,
    //     saturation: currentScreen.current.getScreen()[row][column].saturation,
    //     brightness: currentScreen.current.getScreen()[row][column].brightness
    //   }),
    // })
    //   .then((data) => data.json())
    //   .then((data) => {
    //     console.log(data);
    //   });
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

  const saveDigitOne = (index) => {
    let digit = new CustomDigit();

    digit.init_digit(currentScreen.current.getScreen());


    // digit.edit_digit(currentScreen.current.moveToSide(digit.show_digit(), -1, 0));

    // console.log(currentScreen.current.moveToSide(digit.show_digit(), -1, 0));
    digit.edit_digit(currentScreen.current.moveToSide(digit.show_digit(), -1, 0))
    console.log(digit.show_digit());

    currentScreen.current.write_digit(digit.show_digit());

    // console.log(currentScreen.current.getScreen());

    currentThemeDigits.current.add_digit(index, digit.show_digit());
    setRefresh(r => !r);

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

  const showDigitOne = (index) => {
    console.log(currentThemeDigits.current.get_all())

    currentScreen.current.write_digit(currentThemeDigits.current.get_digit(index)[0])
    setRefresh(r => !r);
  }

  const clearScreen = () => {
    currentScreen.current.init_screen();
    setRefresh(r => !r);
    console.log(currentScreen.current.getScreen())
  }

  const stackAllDigits = () => {
    for (let i = 0; i < currentThemeDigits.current.get_all().length; i++) {
      if (i < 10) {
        currentScreen.current.stack_screen(currentThemeDigits.current.get_all()[i][0])
      }
    }
    setRefresh(r => !r);
  }

  const setClockPos = () => {
    setClockPosition(last => !last);

    stackAllDigits()
    console.log(currentThemeDigits.current.get_all())


  }

  const changeHourPos = (x, y) => {
    let theme = currentThemeDigits.current.get_all();
    let allCanBeMoved = true;
    let digitplaces = customScreen.current.get_all_digits();
    console.log(digitplaces)

    for (let i = 0; i < theme.length; i++) {
      if (i < 10) {
        if (editPlace != null && currentScreen.current.moveDigit(theme[i][0], customScreen.current.get_digits_pos(editPlace).x + x, customScreen.current.get_digits_pos(editPlace).y + y) == false) {
          allCanBeMoved = false;
          console.log(currentScreen.current.moveDigit(theme[i][0], customScreen.current.get_digits_pos(editPlace).x + x, customScreen.current.get_digits_pos(editPlace).y + y))
        }
      }
    }

    // console.log(currentScreen.current.moveDigit(theme[1][0], clockdigits.hour1.x, 0))

    if (editPlace != null && allCanBeMoved) {
      // console.log(currentScreen.current.moveDigit(theme[1][0], customScreen.current.get_digits_pos(editPlace).x + x, customScreen.current.get_digits_pos(editPlace).y + y))
      // currentScreen.current.init_screen();
      // for (let i = 0; i < theme.length; i++) {
      //   if (i < 10) {
      //     currentScreen.current.stack_screen(currentScreen.current.moveDigit(theme[i][0], customScreen.current.get_digits_pos(editPlace).x + x, customScreen.current.get_digits_pos(editPlace).y + y));
      //   }
      // }
      customScreen.current.edit_digits_pos(editPlace, x, y)
      console.log(customScreen.current.get_all_digits())
      // setRefresh(r => !r);


      // setClockDigits({
      //   ...clockdigits, hour1: {
      //     ...clockdigits.hour1,
      //     x: clockdigits.hour1.x + x,
      //     y: clockdigits.hour1.y + y
      //   }
      // })
    }

    showAllDrawingsAndDigits();

    // currentScreen.current.init_screen();
    // for (let places = 0; places < digitplaces.length; places++) {
    //   for (let i = 0; i < theme.length; i++) {
    //     if (i < 10) {
    //       currentScreen.current.stack_screen(currentScreen.current.moveDigit(theme[i][0], customScreen.current.get_digits_pos(places).x, customScreen.current.get_digits_pos(places).y));
    //     }
    //   }
    // }
    // setRefresh(r => !r);
  }

  const editPlaceOfDigits = (index) => {
    setEditPlace(index);
  }

  const addDigitPlace = () => {
    customScreen.current.add_newDigits();
    setClockPos();
  }

  const removePlaceOfDigits = (i) => {
    customScreen.current.remove_digits_pos(i);
    setEditPlace(null);
    changeHourPos(0, 0);
  }

  const saveDrawing = (index) => {
    let digit = new CustomDigit();

    digit.init_digit(currentScreen.current.getScreen());

    digit.edit_digit(currentScreen.current.moveToSide(digit.show_digit(), -1, 0))

    currentScreen.current.write_digit(digit.show_digit());

    console.log(digit.show_digit())

    customDraw.current.add_digit(index, digit.show_digit());
    setRefresh(r => !r);
  }

  const showDrawing = (index) => {
    currentScreen.current.write_digit(customDraw.current.get_digit(index)[0])
    setRefresh(r => !r);
  }

  const addDrawToScreen = (index) => {
    customScreen.current.add_drawings(index)
    // customDraw.current.get_digit(index);
  }

  const removeDrawToScreen = (index) => {
    currentScreen.current.remove_drawing(index);
  }

  const changeDrawPos = (x, y) => {
    let draw = customDraw.current.get_all();
    let allCanBeMoved = true;
    let drawingsplaces = customScreen.current.get_all_drawings_pos();


    if (currentScreen.current.moveDigit(draw[0][0], customScreen.current.get_drawing_pos(0).x + x, customScreen.current.get_drawing_pos(0).y + y) == false) {
      allCanBeMoved = false;
    }

    // for (let i = 0; i < theme.length; i++) {
    //   if (i < 10) {
    //     if (editPlace != null && currentScreen.current.moveDigit(theme[i][0], customScreen.current.get_digits_pos(editPlace).x + x, customScreen.current.get_digits_pos(editPlace).y + y) == false) {
    //       allCanBeMoved = false;
    //       console.log(currentScreen.current.moveDigit(theme[i][0], customScreen.current.get_digits_pos(editPlace).x + x, customScreen.current.get_digits_pos(editPlace).y + y))
    //     }
    //   }
    // }

    if (allCanBeMoved) {
      customScreen.current.edit_drawings_pos(0, x, y);
    }

    // if (editPlace != null && allCanBeMoved) {
    //   customScreen.current.edit_digits_pos(editPlace, x, y)
    //   console.log(customScreen.current.get_all_digits())
    // }

    showAllDrawingsAndDigits()

    // currentScreen.current.init_screen();
    // for (let places = 0; places < digitplaces.length; places++) {
    //   for (let i = 0; i < theme.length; i++) {
    //     if (i < 10) {
    //       currentScreen.current.stack_screen(currentScreen.current.moveDigit(theme[i][0], customScreen.current.get_digits_pos(places).x, customScreen.current.get_digits_pos(places).y));
    //     }
    //   }
    // }
    // setRefresh(r => !r);
  }

  const showAllDrawingsAndDigits = () => {
    let theme = currentThemeDigits.current.get_all();
    let digitplaces = customScreen.current.get_all_digits();
    let drawingsplaces = customScreen.current.get_all_drawings_pos();
    console.log(drawingsplaces)
    currentScreen.current.init_screen();
    for (let places = 0; places < digitplaces.length; places++) {
      for (let i = 0; i < theme.length; i++) {
        if (i < 10) {
          currentScreen.current.stack_screen(currentScreen.current.moveDigit(theme[i][0], customScreen.current.get_digits_pos(places).x, customScreen.current.get_digits_pos(places).y));
        }
      }
    }

    for (let drawPlace = 0; drawPlace < drawingsplaces.length; drawPlace++) {
      currentScreen.current.stack_screen(currentScreen.current.moveDigit(customDraw.current.get_digit(drawingsplaces[drawPlace].drawing_id)[0], customScreen.current.get_drawing_pos(drawPlace).x, customScreen.current.get_drawing_pos(drawPlace).y));
    }

    setRefresh(r => !r);

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
                    <div key={`${i}${y}`} className="led" onClick={() => ledChangeHandler(i, y)} style={{ background: column.hex != "#ffffff" ? clockPos ? currentScreen.current.getEditColor() : column.hex : column.hex }}></div> : ""
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
      <button onClick={() => clearScreen()}>Clear Screen</button>

      <div className="digits">
        <button onClick={() => saveDigitOne(0)}>Save Digit 0</button>
        <button onClick={() => showDigitOne(0)}>Show Digit 0</button>
      </div>
      <div className="digits">
        <button disabled={currentThemeDigits.current.get_all().length > 0 ? false : true} onClick={() => saveDigitOne(1)}>Save Digit 1</button>
        <button disabled={currentThemeDigits.current.get_all().length > 0 ? false : true} onClick={() => showDigitOne(1)}>Show Digit 1</button>
      </div>
      <div className="digits">
        <button disabled={currentThemeDigits.current.get_all().length > 1 ? false : true} onClick={() => saveDigitOne(2)}>Save Digit 2</button>
        <button disabled={currentThemeDigits.current.get_all().length > 1 ? false : true} onClick={() => showDigitOne(2)}>Show Digit 2</button>
      </div>
      <div className="digits">
        <button disabled={currentThemeDigits.current.get_all().length > 2 ? false : true} onClick={() => saveDigitOne(3)}>Save Digit 3</button>
        <button disabled={currentThemeDigits.current.get_all().length > 2 ? false : true} onClick={() => showDigitOne(3)}>Show Digit 3</button>
      </div>
      <div className="digits">
        <button disabled={currentThemeDigits.current.get_all().length > 3 ? false : true} onClick={() => saveDigitOne(4)}>Save Digit 4</button>
        <button disabled={currentThemeDigits.current.get_all().length > 3 ? false : true} onClick={() => showDigitOne(4)}>Show Digit 4</button>
      </div>
      <div className="digits">
        <button disabled={currentThemeDigits.current.get_all().length > 4 ? false : true} onClick={() => saveDigitOne(5)}>Save Digit 5</button>
        <button disabled={currentThemeDigits.current.get_all().length > 4 ? false : true} onClick={() => showDigitOne(5)}>Show Digit 5</button>
      </div>
      <div className="digits">
        <button disabled={currentThemeDigits.current.get_all().length > 5 ? false : true} onClick={() => saveDigitOne(6)}>Save Digit 6</button>
        <button disabled={currentThemeDigits.current.get_all().length > 5 ? false : true} onClick={() => showDigitOne(6)}>Show Digit 6</button>
      </div>
      <div className="digits">
        <button disabled={currentThemeDigits.current.get_all().length > 6 ? false : true} onClick={() => saveDigitOne(7)}>Save Digit 7</button>
        <button disabled={currentThemeDigits.current.get_all().length > 6 ? false : true} onClick={() => showDigitOne(7)}>Show Digit 7</button>
      </div>
      <div className="digits">
        <button disabled={currentThemeDigits.current.get_all().length > 7 ? false : true} onClick={() => saveDigitOne(8)}>Save Digit 8</button>
        <button disabled={currentThemeDigits.current.get_all().length > 7 ? false : true} onClick={() => showDigitOne(8)}>Show Digit 8</button>
      </div>
      <div className="digits">
        <button disabled={currentThemeDigits.current.get_all().length > 8 ? false : true} onClick={() => saveDigitOne(9)}>Save Digit 9</button>
        <button disabled={currentThemeDigits.current.get_all().length > 8 ? false : true} onClick={() => showDigitOne(9)}>Show Digit 9</button>
      </div>


      <div>
        <p>Clock position</p>
        <button onClick={() => setClockPos()}>Set clock pos</button><br />
        <span>Move X:</span><button onClick={() => changeHourPos(-1, 0)}>-</button><button onClick={() => changeHourPos(1, 0)}>+</button>
        <span>Move Y:</span><button onClick={() => changeHourPos(0, -1)}>-</button><button onClick={() => changeHourPos(0, 1)}>+</button>
        {
          clockPos ?
            <>
              <br /><button onClick={() => addDigitPlace()}>Add digit place</button>
              {
                customScreen.current.get_all_digits().map((e, i) => (
                  <div key={i}>
                    <button onClick={() => editPlaceOfDigits(i)}>Edit digit place {i}</button>
                    <button onClick={() => removePlaceOfDigits(i)}>Remove digit place {i}</button>
                  </div>
                ))

              }

              <button onClick={() => addDrawToScreen(0)}>Add draw to screen</button>
              <button onClick={() => removeDrawToScreen(0)}>Remove draw to screen</button>
            </>
            : ""
        }
      </div>

      <div className="digits">
        <button onClick={() => saveDrawing(0)}>Save Draw</button>
        <button onClick={() => showDrawing(0)}>Show Draw</button>
        <span>Move X:</span><button onClick={() => changeDrawPos(-1, 0)}>-</button><button onClick={() => changeDrawPos(1, 0)}>+</button>
        <span>Move Y:</span><button onClick={() => changeDrawPos(0, -1)}>-</button><button onClick={() => changeDrawPos(0, 1)}>+</button>
      </div>

      {/* <input type="color" value={hexcolor} onChange={e => handleColorPicker(e.target.value)} /> */}

    </div>
  );
}
