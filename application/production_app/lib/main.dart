import 'package:flutter/material.dart';
import 'package:production_app/components/basicInfo.dart';
import 'package:production_app/components/clockScreen.dart';
import 'package:production_app/components/screensPlace.dart';
import 'package:production_app/components/statusBar.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'PingPong Clock',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.dark(),
      ),
      home: const MainScreen(),
    );
  }
}

class MainScreen extends StatefulWidget {
  const MainScreen({super.key});

  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(child: 
      Column(
        children: [
          Statusbar(),
          Clockscreen(),
          Basicinfo(),
          Screensplace()
        ],
      )
      ),
    );
  }
}

