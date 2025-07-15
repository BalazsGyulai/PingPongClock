import 'package:flutter/material.dart';
import 'package:production_app/UI/statusElement.dart';

class Statusbar extends StatefulWidget {
  const Statusbar({super.key});

  @override
  State<Statusbar> createState() => _StatusbarState();
}

class _StatusbarState extends State<Statusbar> {
  // double? _screen_width = null;
  // double? _screen_height = null;

  // @override
  // void initState() {
  //   // TODO: implement initState
  //   super.initState();

  //   _screen_width = MediaQuery.sizeOf(context).width;
  //   _screen_height = MediaQuery.sizeOf(context).height;
  // }

  @override
  Widget build(BuildContext context) {
    return Container(
      width: MediaQuery.sizeOf(context).width,
      height: 36,
      // decoration: BoxDecoration(color: Color.fromRGBO(255, 0, 0, 1)),
      child: Padding(
        padding: EdgeInsetsGeometry.symmetric(vertical: 5.0, horizontal: 8.0),
        child: Row(
          spacing: 5,
          children: [StatusElement(icon: Icons.bluetooth_rounded), StatusElement(icon: Icons.wifi, status: 1,), ]),
      ),
    );
  }
}