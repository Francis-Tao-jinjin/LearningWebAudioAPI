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


function MeteringSample(meterElement) {
  this.buffer = null;
  this.gainValue = 1;
  loadSounds(this, {
    buffer: 'http://jay.mobile9.com/download/media/3/shorttone_pSagwv6v.mp3'
    // buffer: 'http://orm-other.s3.amazonaws.com/webaudioapi/samples/metering/chrono.mp3'
  });

  this.meterElement = meterElement;
  this.renderMeter();
}

MeteringSample.prototype.playPause = function() {
  if (!this.isPlaying) {
    // Make a source node for the sample.
    var source = context.createBufferSource();
    source.buffer = this.buffer;
    console.log('this.buffer', this.buffer);
    source.loop = true;
    // Run the source node through a gain node.
    var gain = context.createGain();
    gain.gain.value = this.gainValue;
    // Create mix node (gain node to combine everything).
    var mix = context.createGain();
    var compressor = context.createDynamicsCompressor();

    // Create meter.
    // https://developer.mozilla.org/zh-CN/docs/Web/API/AudioContext/createScriptProcessor

    var meter = context.createScriptProcessor(2048, 2, 2);
    var ctx = this;
    meter.onaudioprocess = function(e) { ctx.processAudio.call(ctx, e) };
    // Connect the whole sound to mix node.
    source.connect(gain);
    gain.connect(mix);

    // 添加了 compressor 之后，声音整体感觉响亮一些
    mix.connect(compressor);
    compressor.connect(context.destination);
    compressor.connect(meter);

    // 不使用 compressor 的情况
    // mix.connect(meter);
    // meter.connect(context.destination);
    // // Connect source to destination for playback.
    // mix.connect(context.destination);

    this.source = source;
    this.gain = gain;
    // Start playback.
    this.source.start(0);
  } else {
    this.source.stop(0);
  }
  this.isPlaying = !this.isPlaying;
};

MeteringSample.prototype.gainRangeChanged = function(e) {
  var value = parseInt(e.value);
  this.gain.gain.value = value;
};

MeteringSample.prototype.processAudio = function(e) {
  var leftBuffer = e.inputBuffer.getChannelData(0);
  this.checkClipping(leftBuffer);
  
  var rightBuffer = e.inputBuffer.getChannelData(1);
  this.checkClipping(rightBuffer);
}

MeteringSample.prototype.checkClipping = function(buffer) {
  var isClipping = false;
  // Iterate through buffer to check if any of the |values| exceeds 1.
  for (var i = 0; i < buffer.length; i++) {
    // console.log('buffer[',i,'] :', buffer[i]);
    var absValue = Math.abs(buffer[i]);
    if (absValue >= 1) {
      isClipping = true;
      break;
    }
  }
  this.isClipping = isClipping;
  if (isClipping) {
    this.lastClipTime = new Date();
  }
}

MeteringSample.prototype.renderMeter = function() {
  var didRecentlyClip = (new Date() - this.lastClipTime) < 100;
  this.meterElement.className = didRecentlyClip ? 'clip' : 'noclip';
  var ctx = this;
  webkitRequestAnimationFrame(function() { ctx.renderMeter.call(ctx) });
}

