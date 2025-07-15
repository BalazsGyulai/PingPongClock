import 'dart:ffi';

import 'package:flutter/material.dart';
import 'package:production_app/var/screen.dart';

class Clockscreen extends StatefulWidget {
  const Clockscreen({super.key});

  @override
  State<Clockscreen> createState() => _ClockscreenState();
}

class _ClockscreenState extends State<Clockscreen> {
  Screen screen = Screen();

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: EdgeInsets.only(top: 36.0),
      width: MediaQuery.sizeOf(context).width,
      height: MediaQuery.sizeOf(context).height / 12 * 3,
      // color: Colors.amber,
      child: Column(
        spacing: 1,
        mainAxisAlignment: MainAxisAlignment.center,
        children: screen.get_screen()!.map<Widget>((row) {
          return Row(
            spacing: 1,
            mainAxisAlignment: MainAxisAlignment.center,
            children: row!.map<Widget>((pixel) {
              List<int> pixel_rgb = pixel!.get_rgb_color();
              return pixel.get_led_id() != -1
                  ? Container(
                      width: (MediaQuery.sizeOf(context).width - 39) / 20,
                      height: (MediaQuery.sizeOf(context).width - 39) / 20,
                      // margin: EdgeInsets.all(2),
                      decoration: BoxDecoration(
                        color: Color.fromRGBO(pixel_rgb[0], pixel_rgb[1], pixel_rgb[2], 1),
                        borderRadius: BorderRadius.circular(
                          (MediaQuery.sizeOf(context).width - 58) / 20 / 2,
                        ),
                      ),
                      child: SizedBox(),
                    )
                  : SizedBox();
            }).toList(),
          );
        }).toList(),
      ),
    );
  }
}

// [
//       [-1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, -1],
//       [-1, 34, 33, 32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, -1],
//       [-1, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53],
//       [73, 72, 71, 70, 69, 68, 67, 66, 65, 64, 63, 62, 61, 60, 59, 58, 57, 56, 55, 54],
//       [-1, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92],
//       [-1, 110, 109, 108, 107, 106, 105, 104, 103, 102, 101, 100, 99, 98, 97, 96, 95, 94, 93, -1],
//       [-1, -1, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, -1]
//     ]
