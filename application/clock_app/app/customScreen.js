export default class CustomScreen {
  constructor() {
    this.screenDigitsPlaces = [];
    this.customDrawingsPlaces = [];
    this.customDrawingsIndexes = [];
  }

  add_drawings(index) {
    this.customDrawingsIndexes.push(index);
    this.add_drawings_pos(index);
  }

  add_drawings_pos(index) {
    this.customDrawingsPlaces.push({ x: 0, y: 0, drawing_id: index })
  }

  edit_drawings_pos(i, x, y) {
    let p_X = this.customDrawingsPlaces[i].x;
    let p_Y = this.customDrawingsPlaces[i].y;

    this.customDrawingsPlaces.splice(i, 1, { x: p_X + x, y: p_Y + y, drawing_id: i })
  }

  remove_drawing(i) {
    this.customDrawingsPlaces.splice(i, 1);
    this.customDrawingsIndexes.splice(i, 1);
  }

  get_drawing_pos(i) {
    return this.customDrawingsPlaces[i];
  }

  get_all_drawings_pos(){
    return this.customDrawingsPlaces;
  }

  get_drawing_id(i){
    return this.customDrawingsIndexes[i];
  }

  get_all_drawings_id(){
    return this.customDrawingsIndexes;
  }

  add_newDigits() {
    this.screenDigitsPlaces.push({ x: 0, y: 0 })
  }

  edit_digits_pos(i, x, y) {
    let p_X = this.screenDigitsPlaces[i].x;
    let p_Y = this.screenDigitsPlaces[i].y;

    this.screenDigitsPlaces.splice(i, 1, { x: p_X + x, y: p_Y + y })
  }

  remove_digits_pos(i) {
    this.screenDigitsPlaces.splice(i, 1);
  }

  get_digits_pos(i) {
    return this.screenDigitsPlaces[i];
  }

  get_all_digits() {
    return this.screenDigitsPlaces;
  }
}