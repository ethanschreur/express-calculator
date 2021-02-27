const express = require('express');
const math = require('mathjs');
const { ExpressError } = require('./express-error');

const app = express();

app.use((req, res, next) => {
	try {
		if (typeof req.query['nums'] === 'undefined') {
			throw error('uhoh');
		}
	} catch (e) {
		next(new ExpressError(`nums are required`, 400));
	}
	if (req.query['nums'].split(',').length === 1) {
		try {
			if (Number.isNaN(1 + parseInt(req.query['nums']))) {
				throw error('uhoh');
			}
		} catch (e) {
			next(new ExpressError(`${req.query['nums']} is not a number`, 400));
		}
	}
	for (var num of req.query['nums'].split(',')) {
		try {
			if (Number.isNaN(1 + parseInt(num))) {
				console.log('yo');
				throw error('uhoh');
			}
			next();
		} catch (e) {
			next(new ExpressError(`${num} is not a number`, 400));
		}
	}
});

app.get('/mean', function mean(req, res, next) {
	try {
		let nums = req.query['nums'].split(',');
		nums = nums.filter((num) => parseInt(num));
		const value = math.mean(...nums);
		return res.json({ response: { operation: 'mean', value: value } });
	} catch (e) {
		next(e);
	}
});

app.get('/median', function median(req, res, next) {
	try {
		let nums = req.query['nums'].split(',');
		nums = nums.filter((num) => parseInt(num));
		const value = math.median(...nums);
		return res.json({ response: { operation: 'median', value: value } });
	} catch (e) {
		next(e);
	}
});

app.get('/mode', function mode(req, res, next) {
	try {
		let nums = req.query['nums'].split(',');
		nums = nums.filter((num) => parseInt(num));
		const value = math.mode(...nums);
		return res.json({ response: { operation: 'mode', value: value } });
	} catch (e) {
		next(e);
	}
});

app.use(function(err, req, res, next) {
	return res.status(err.status).json({ response: err.message });
});

app.listen(3000, function start_server() {
	console.log('server has started');
});
