import 'package:flutter/material.dart';

class Basicinfo extends StatefulWidget {
  const Basicinfo({super.key});

  @override
  State<Basicinfo> createState() => _BasicinfoState();
}

class _BasicinfoState extends State<Basicinfo> {
  @override
  Widget build(BuildContext context) {
    return Container(
      width: MediaQuery.sizeOf(context).width,
      height: 100,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          BasicinfoElement(text: "Temp", icon: '%', border: true),
          BasicinfoElement(text: "Humi", icon: '°C'),
        ],
      ),
    );
  }
}

class BasicinfoElement extends StatefulWidget {
  BasicinfoElement({super.key, required this.text, this.icon, this.border});

  final String text;
  final String? icon;
  bool? border;

  @override
  State<BasicinfoElement> createState() => _BasicinfoElementState();
}

class _BasicinfoElementState extends State<BasicinfoElement> {
  @override
  void initState() {
    // TODO: implement initState
    super.initState();

    if (widget.border == null) {
      widget.border = false;
    }
  }

  @override
  Widget build(BuildContext context) {
    if (widget.border == null) {
      widget.border = false;
    }
    return Container(
      width: MediaQuery.sizeOf(context).width / 12 * 3,
      height: double.infinity,
      decoration: BoxDecoration(
        border: Border(
          right: widget.border!
              ? BorderSide(color: Color(0xff2c2c2c), width: 1.0)
              : BorderSide.none,
        ),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(
            widget.text,
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w100,
              color: Color(0xFFFFFAFB),
            ),
          ),
          Row(
            spacing: 5,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                '80',
                style: TextStyle(
                  fontSize: 36,
                  fontWeight: FontWeight.normal,
                  color: Color(0xFFFFFAFB),
                ),
              ),
              widget.icon != null
                  ? Text(
                      widget.icon!,
                      style: TextStyle(
                        fontSize: 34,
                        fontWeight: FontWeight.normal,
                        color: Color(0xFFFFFAFB),
                      ),
                    )
                  : SizedBox(),
            ],
          ),
        ],
      ),
    );
  }
}
