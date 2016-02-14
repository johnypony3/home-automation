// call the packages we need
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var morgan = require('morgan');
//var Gpio = require('onoff').Gpio;

var gpio = require('rpi-gpio');
// configure app
app.use(morgan('dev')); // log requests to the console

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var OFF = 'off';
var ON = 'on';
var NA = 'na';
var PIN = 'pin';

var port = process.env.PORT || 80; // set our port
var Bear = require('./app/models/bear');

// ROUTES FOR OUR API
// =============================================================================

// create our router
var router = express.Router();

// middleware to use for all requests
router.use(function (req, res, next) {
    // do logging
    console.log('Something is happening.');
    next();
});

// on routes that end in /bears
// ----------------------------------------------------
router.route('/bears')
    .get(function (req, res) {
        res.json({ message: JSON.stringify(pins) });
    })

router.route('/bears/:bear_id')
    .get(function (req, res) {
        var passedId = req.params.bear_id;
        res.json({ message: pins[passedId] });
    })

router.route('/bears/:bear_id/:bear_on')
    .put(function (req, res) {
        var passedValue = req.params.bear_on;
        var passedId = req.params.bear_id;
        var currentPinValue = getPin(passedId);
        var pinId = getPinId(passedId);
        var pinOn = (passedValue == ON) ? true : false;

        console.log('passedValue: ' + passedValue);
        console.log('passedId: ' + passedId);
        console.log('currentPinValue: ' + currentPinValue);
        console.log('pinId: ' + pinId);
        console.log('pinOn: ' + pinOn);

        if (currentPinValue == passedValue) {
            console.log('Current state same as requested');
        }

        if (pins[passedId] != "na" && currentPinValue != passedValue) {
            gpio.setup(pinId, gpio.DIR_OUT, pinOn ? on : off);

            function off() {
                gpio.write(pinId, 1, pushToArray);
            }

            function on() {
                gpio.write(pinId, 0, pushToArray);
            }

            function pushToArray() {
                pushToAry(pinId, passedValue);
                console.log('Written to pin. Value: ' + pins[passedId]);
            }
        }

        res.json({ message: '' });
    })

app.use('/api', router);
app.listen(port);
console.log('Magic happens on port ' + port);

var pins = {};

function getPinId(val) {
    val = parseInt(val.replace(PIN, ''));
    return val;
}

function pushToAry(name, val) {
    var friendlyName = PIN + name.toString();
    console.log(friendlyName + ' ' + val);
    pins[friendlyName] = val;
}

function getPin(name) {
    for (var key in pins) {
        if (key == name) {
            return pins[key];
        }
    }
}

pushToAry(1, NA);
pushToAry(2, NA);
pushToAry(3, OFF);
pushToAry(4, NA);
pushToAry(5, OFF);

pushToAry(6, NA);
pushToAry(7, OFF);
pushToAry(8, OFF);
pushToAry(9, NA);
pushToAry(10, OFF);

pushToAry(11, OFF);
pushToAry(12, OFF);
pushToAry(13, OFF);
pushToAry(14, NA);
pushToAry(15, OFF);

pushToAry(16, OFF);
pushToAry(17, NA);
pushToAry(18, OFF);
pushToAry(19, OFF);
pushToAry(20, NA);

pushToAry(21, OFF);
pushToAry(22, OFF);
pushToAry(23, OFF);
pushToAry(24, OFF);
pushToAry(25, NA);

pushToAry(26, OFF);
pushToAry(27, OFF);
pushToAry(28, OFF);
pushToAry(29, OFF);
pushToAry(30, NA);

pushToAry(31, OFF);
pushToAry(32, OFF);
pushToAry(33, OFF);
pushToAry(34, NA);
pushToAry(35, OFF);

pushToAry(36, OFF);
pushToAry(37, OFF);
pushToAry(38, OFF);
pushToAry(39, NA);
pushToAry(40, OFF);

process.on('exit', function () {
    gpio.destroy(function () {
        console.log('All pins unexported');
    });
});
