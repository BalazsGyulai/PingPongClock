import 'package:flutter/material.dart';

class Screensplace extends StatefulWidget {
  const Screensplace({super.key});

  @override
  State<Screensplace> createState() => _ScreensplaceState();
}

class _ScreensplaceState extends State<Screensplace> {
  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        width: MediaQuery.sizeOf(context).width,
        height: double.infinity,
        decoration: BoxDecoration(
          color: Color(0xFFFFFAFB),
          borderRadius: BorderRadius.only(
            topLeft: Radius.circular(32),
            topRight: Radius.circular(32),
          ),
        ),
        padding: EdgeInsets.symmetric(vertical: 10, horizontal: 30),
        child: Column(children: [ScreensPageSelect()]),
      ),
    );
  }
}

class ScreensPageSelect extends StatefulWidget {
  const ScreensPageSelect({super.key});

  @override
  State<ScreensPageSelect> createState() => _ScreensPageSelectState();
}

class _ScreensPageSelectState extends State<ScreensPageSelect> {
  @override
  Widget build(BuildContext context) {
    return Container(
      width: MediaQuery.sizeOf(context).width,
      height: 32,
      decoration: BoxDecoration(
        color: Color(0xff141414),
        borderRadius: BorderRadius.all(Radius.circular(9)),
      ),
      // color: Color(0xff141414),
      padding: EdgeInsets.all(2),
      child: Row(
        children: [
          ScreensPageElement(text: 'Screen', active: true,),
          ScreensPageElement(text: 'Settings', ),
        ],
      ),
    );
  }
}

class ScreensPageElement extends StatefulWidget {
  ScreensPageElement({super.key, required this.text, this.active = false});

  final String text;
  bool active;

  @override
  State<ScreensPageElement> createState() => _ScreensPageElementState();
}

class _ScreensPageElementState extends State<ScreensPageElement> {
  @override
  Widget build(BuildContext context) {
    return Container(
      width: (MediaQuery.sizeOf(context).width - 64) / 2,
      height: double.infinity,
      decoration: BoxDecoration(
        color: widget.active ? Colors.white : Color(0xff141414),
        borderRadius: BorderRadius.all(Radius.circular(7)),
      ),
      child: Center(
        child: Text(widget.text, style: TextStyle(color: widget.active ? Color(0xff141414) :  Color(0xFFFFFAFB), fontWeight: FontWeight.normal, fontSize: 14),),
      ),
    );
  }
}
