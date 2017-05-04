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

var CrossfadePlaylistSample = function() {
  this.FADE_TIME = 1; // Seconds
  this.isPlaying = false;
  loadSounds(this, {
    jam: 'http://jay.mobile9.com/download/media/3/shorttone_pSagwv6v.mp3',
    crowd: 'http://jay.mobile9.com/download/media/3/wings-hair_QFuxhN46.mp3'
  });
};

CrossfadePlaylistSample.prototype.play = function() {
  var ctx = this;

  console.log('this.jam', this.jam);

  console.log('this.crowd', this.crowd);
  
  playHelper([this.jam, this.crowd], 4, 4);

  function createSource(buffer) {
    var source = context.createBufferSource();
    var gainNode = context.createGain();
    source.buffer = buffer;
    // Connect source to gain.
    source.connect(gainNode);
    // Connect gain to destination.
    gainNode.connect(context.destination);

    return {
      source: source,
      gainNode: gainNode
    };
  }

  /**
   * Plays back a playlist of buffers, automatically crossfading between them.
   * Iterations specifies the number of times to play through the playlist.
   */
  function playHelper(buffers, iterations, fadeTime) {
    var currTime = context.currentTime;
    for (var i = 0; i < iterations; i++) {
      // For each buffer, schedule its playback in the future.
      for (var j = 0; j < buffers.length; j++) {
        var buffer = buffers[j];
        var duration = buffer.duration;
        var info = createSource(buffer);
        var source = info.source;
        var gainNode = info.gainNode;
        // Linear Fade it in.
        // gainNode.gain.linearRampToValueAtTime(0, currTime);
        // gainNode.gain.linearRampToValueAtTime(1, currTime + fadeTime);
        // // Then fade it out.
        // gainNode.gain.linearRampToValueAtTime(1, currTime + duration-fadeTime);
        // gainNode.gain.linearRampToValueAtTime(0, currTime + duration);

        // https://webaudio.github.io/web-audio-api/#widl-AudioParam-exponentialRampToValueAtTime-AudioParam-float-value-double-endTime
        // 根据计算公式，传入的第一个参数不可以为 0 
        gainNode.gain.exponentialRampToValueAtTime(0.01, currTime);
        gainNode.gain.exponentialRampToValueAtTime(1.0, currTime + fadeTime);
        // Then fade it out.
        gainNode.gain.exponentialRampToValueAtTime(1.0, currTime + duration-fadeTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, currTime + duration);

        // Play the track now.
        source.start(currTime);

        // Increment time for the next iteration.
        currTime += duration;//  - fadeTime;
      }
    }
  }
};

