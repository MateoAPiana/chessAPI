var express = require('express');
var cors = require('cors');
var PORT = process.env.PORT || 3000;
var app = express();
var ACCEPTED_ORIGINS = [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://sn9g91g0-5173.brs.devtunnels.ms/',
];
var corsMiddleware = function (_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.acceptedOrigins, acceptedOrigins = _c === void 0 ? process.env.UI_URL ? process.env.UI_URL : ACCEPTED_ORIGINS : _c;
    return cors({
        origin: function (origin, callback) {
            if (acceptedOrigins.includes(origin ? origin : '')) {
                return callback(null, true);
            }
            if (!origin) {
                return callback(null, true);
            }
            return callback(new Error('Not allowed by CORS'));
        },
    });
};
app.get('/', function (req, res) {
    res.send('Hola');
});
app.listen(PORT, function () {
    console.log('Port is listening in the port http://localhost:', PORT);
});
