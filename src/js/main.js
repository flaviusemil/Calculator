import Vue from 'vue';

const $ = require('jquery');

global.$ = global.jQuery = $;

require('bootstrap/scss/bootstrap.scss');
require('bootstrap');
require('../scss/main.scss');

let jsApp = new Vue({
    el: '#vue-calculator',
    data: {
        expression: "",
    },
    methods: {
        clickOperation: function (operation) {

            let op = this.getTextFromMouseEvent(operation);

            switch (op) {
                case '=':
                    this.replaceSpecialCharacters();
                    /*
                     * # The easy way...*/
                      this.expression = eval(this.expression);
                    // this.expression = this.parser(this.expression);
                    break;
                case "CE":
                    this.expression = "";
                    break;
                default:
                    this.expression += op;
                    break;
            }
        },

        replaceSpecialCharacters: function() {
            this.expression = this.expression.replace(String.fromCharCode(215), "*");
            this.expression = this.expression.replace(/(\d+)%/g, function(match, p1) {
                return parseInt(p1) / 100;
            });
        },

        clickNumber: function (number) {
            this.expression += this.getTextFromMouseEvent(number);
        },
        parser: function (expression) {

            let orderOfOperations = ['-', '+', '/', 'X'];

            for (let i = 0; i < orderOfOperations.length; i++) {
                this.tryParseOperation(orderOfOperations[i], expression);
            }
        },
        tryParseOperation(operator, expression) {
            let array = expression.split(operator);

            if (this.isAnotherOperationNeeded(array)) {
                return this.performOperation(operator, array[0], this.tryParseOperation(operator, expression.substr(expression.indexOf(operator) + 1)));
            }

            return this.performOperation(operator, array[0], array[1]);
        },
        isAnotherOperationNeeded: function (array) {
            if (array.length < 2) {
                return false;
            }

            for (let i = 0; i < array.length; i++) {
                if (isNaN(Number(array[i]))) {
                    return true;
                }
            }

            return false;
        },
        performOperation: function (operation, value1, value2) {

            value1 = parseFloat(value1);
            value2 = parseFloat(value2);

            let result = "";
            switch (operation) {
                case '+':
                    result = value1 + value2;
                    break;
                case '-':
                    result = value1 - value2;
                    break;
                case 'X':
                    result = value1 * value2;
                    break;
                case '/':
                    result = value1 / value2;
                    break
            }

            return result;
        },
        getTextFromMouseEvent: function (event) {
            return event.target.innerText;
        }
    }
});