const input = require('./bad-apple.json');
const fs = require('fs');
const path = require('path');

/**
 * Basic stuff / unserializing
 */
function read(image) {
	let str = '', rows = [];
	for (let i32 of image) {
		i32 = i32 & 0xFFFFFFFF;
		if (i32 < 0) {
			if (str != '')
				rows.push(str);
			str = '';
			continue;
		}
		const color = ' XX'[i32 >> 24];
		const length = i32 & 16777215;
		for (let i = 0; i < length; i++)
			str += color;
	}

	return rows;
}


/**
 * Displays the video
 */

function emptyDirSync(folder) {
	const items = fs.readdirSync(folder);
	for (let item of items)
		fs.rmdirSync(path.join(folder, item));
}

function pad(n) {
	return (n < 10 ? '0' : '') + n;
}

function displayFrame(frame) {
	const base = path.join('.', 'sandbox');
	emptyDirSync(base);
	let c = 0;
	for (let row of frame)
		fs.mkdirSync(path.join(base, [pad(c++), row].join('-')));
}

function readAfter(str, ms) {
	return new Promise((res, rej) => {
		setTimeout(() => {
			res(str);
		}, ms);
	});
}

async function run() {
	for (let frame of input['data']) {
		const str = read(frame);
		displayFrame(await readAfter(str, 1000 / 11));
	}
}

run();