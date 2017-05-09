var sine_a = generate_wave({
	type : 'sine',
	frequency : 400
});

var sine_b = generate_wave({
	type : 'sine',
	frequency : 523.25
});

var sine_c = generate_wave({
	type : 'sine',
	frequency : 698.46
});

var volume = audioCtx.createGain();
connect_node([sine_a, sine_b, sine_c], volume);
connect_node(volume, audioCtx.destination);
start([sine_a, sine_b, sine_c]);
volume.gain.value = 0.2;

function generate_wave (options) {
	var wave = audioCtx.createOscillator();
	wave.type = options.type || 'sine';
	wave.frequency.value = options.frequency || 440;
	return wave;
}

function connect_node (a, b) {
	if (!isArray(a)) {
		a = [a];
	}
	a.forEach((item) => {
		item.connect(b);
	});
}

function start (sounds) {
	if (!isArray(sounds)) {
		sounds = [sounds];
	}
	sounds.forEach((item) => {
		item.start(0);
	});
}


function stop (sounds) {
	if (!isArray(sounds)) {
		sounds = [sounds];
	}
	sounds.forEach((item) => {
		item.stop(0);
	});
}

function isArray(o){
  return Object.prototype.toString.call(o)=='[object Array]';
}

