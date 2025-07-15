import 'package:flutter/material.dart';

class StatusElement extends StatefulWidget {
  StatusElement({super.key, required this.icon, this.status});

  final IconData icon;
  int ?status;

  @override
  State<StatusElement> createState() => _StatusElementState();
}

class _StatusElementState extends State<StatusElement> {
  Color statusColor = Color(0xFFF7374E);

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    if (widget.status == null){
      widget.status = 0;
    }

    if(widget.status == 1){
      statusColor = Color(0xffFB8618);
    } else if(widget.status == 2){
      statusColor = Color(0xff7BD389);

    }


  }

  @override
  Widget build(BuildContext context) {
    print(widget.status);

    return Container(
      width: 30,
      height: 30,
      decoration: BoxDecoration(borderRadius: BorderRadius.circular(5)),
      child: Stack(
        children: [
          Align(
            alignment: Alignment.center,
            child: Icon(widget.icon)),
          Align(
            alignment: Alignment(0.7, 0.8),
            child: Container(
              width: 5,
              height: 5,
              decoration: BoxDecoration(color: statusColor, borderRadius: BorderRadius.all(Radius.circular(5))),
            ),
          )
        ],
      ),
    );
  }
}