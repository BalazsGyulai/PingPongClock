export default class ThemeDigits {
    constructor() {
        this.digits = [];
    }

    add_digit(index, digit) {
        if (index >= this.digits.length) {
            this.digits.push([digit])
        } else {

            this.digits.splice(index, 1, [digit])
        }
    }

    remove_digit(i){
        this.digits.splice(i, 1);
    }

    get_digit(index) {
        return this.digits[index];
    }

    get_all() {
        return this.digits;
    }
}