/*
 * Copyright 2013 Boris Smus. All Rights Reserved.

 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


function VolumeSample() {
  loadSounds(this, {
    buffer: 'http://fsb.zobj.net/download/bG6ZpaxIyGHZK8NpR6YqZ5hHZhld0rlBhgKBGWNtvs1pCHyQ_-0uMx31u8pbfp4GGdNQ2Z_wiOGAyTY05/?a=www&c=4&f=deadpool_iphone.mp3&special=1493879430-cf62aG2GsmmTCDgg0F%2FQvnlj4L60rYz%2FmYNCs4VzEZc%3D' //'techno.wav'
  });
  this.isPlaying = false;
};

VolumeSample.prototype.play = function() {
  // 老版本的方法已经被抛弃了，新版只是简单的改了个名称
  // this.gainNode = context.createGainNode();
  this.gainNode = context.createGain();
  this.source = context.createBufferSource();
  this.source.buffer = this.buffer;

  var DURATION = 2;
  var FREQUENCY = 1;
  var SCALE = 0.4;

  // Split the time into valueCount discrete steps.
  var valueCount = 4096;
  // Create a sinusoidal value curve.
  var values = new Float32Array(valueCount);
  for (var i = 0; i < valueCount; i++) {
    var percent = (i / valueCount) * DURATION*FREQUENCY;
    values[i] = 1 + (Math.sin(percent * 2*Math.PI) * SCALE);
    // Set the last value to one, to restore playbackRate to normal at the end.
    if (i == valueCount - 1) {
      values[i] = 1;
    }
  }
  // Apply it to the gain node immediately, and make it last for 2 seconds.
  this.gainNode.gain.setValueCurveAtTime(values, context.currentTime, DURATION);

  // Connect source to a gain node
  this.source.connect(this.gainNode);
  // Connect gain node to destination
  this.gainNode.connect(context.destination);
  // Start playback in a loop
  this.source.loop = true;
  this.source.start(0);
};

VolumeSample.prototype.changeVolume = function(element) {
  var volume = element.value;
  var fraction = parseInt(element.value) / parseInt(element.max);
  // Let's use an x*x curve (x-squared) since simple linear (x) does not
  // sound as good.
  this.gainNode.gain.value = fraction * fraction;
};

VolumeSample.prototype.stop = function() {
  this.source.stop(0);
};

VolumeSample.prototype.toggle = function() {
  this.isPlaying ? this.stop() : this.play();
  this.isPlaying = !this.isPlaying;
};