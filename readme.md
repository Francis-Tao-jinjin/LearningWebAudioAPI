# Chapter 2. Perfect Timing and Latency

One of the strengths of the Web Audio API as compared to the <audio> tag is that it comes with a low-latency precise-timing model.
与“音频”标签相比，Web Audio API 的优点之一是具有低延迟的精确时序模型。

Low latency is very important for games and other interactive applications since you often need fast auditory response to user actions. If the feedback is not immediate, the user will sense the delay, which will lead to frustration. In practice, due to imperfections of human hearing, there is leeway for a delay of up to 20 ms or so, but the number varies depending on many factors.
低延迟对于游戏和其他交互式应用来说非常重要，因为经常需要对用户操作做出快速的音效响应。 如果反馈不是即时的，用户会感觉到延迟，并因此不愉快。在实际情况下，由于人类听觉的缺陷，有延迟高达20毫秒左右的余地，但具体数值因许多因素而异。

Precise timing enables you to schedule events at specific times in the future. This is very important for scripted scenes and musical applications.
精准的时间使您能够在将来的特定时间安排活动。 这对脚本场景和音乐应用非常重要。

## Timing Model 时间模型

One of the key things that the audio context provides is a consistent timing model and frame of reference for time. Importantly, this model is different from the one used for JavaScript timers such as setTimeout, setInterval, and new Date(). It is also different from the performance clock provided by window.performance.now().
音频上下文提供的关键之一是时间的一致的时序模型和参考框架。重要的是，该模型与用于JavaScript定时器（如 setTimeout，setInterval 和 new Date（））的模型不同。它也与 window.performance.now（）提供的性能时钟不同。

All of the absolute times that you will be dealing with in the Web Audio API are in seconds (not milliseconds!), in the coordinate system of the specified audio context. The current time can be retrieved from the audio context via the currentTime property. Although the units are seconds, time is stored as a floating-point value with high precision.
在 Web Audio API 中处理的所有绝对时间都在指定音频上下文的坐标系中的秒数 （而不是毫秒！）。 可以通过 currentTime 属性从音频上下文中检索当前时间。 虽然单位是秒，但时间以高精度存储为浮点值。

## Precise Playback and Resume 精准播放和恢复

The start() function makes it easy to schedule precise sound playback for games and other time-critical applications. To get this working properly, ensure that your sound buffers are pre-loaded [see “Loading and Playing Sounds”]. Without a pre-loaded buffer, you will have to wait an unknown amount of time for the browser to fetch the sound file, and then for the Web Audio API to decode it. The failure mode in this case is you want to play a sound at a precise instant, but the buffer is still loading or decoding.
start（）函数可以轻松地为游戏和其他时间关键的应用程序安排精确的声音回放。 要使其正常工作，请确保声音缓冲区预加载[参见“加载和播放声音”]。 没有预先加载的缓冲区，将不得不等待一段时间让浏览器读取声音文件，然后使用 Web Audio API 进行解码。 这种情况下的故障模式是有精确的瞬间播放声音的需求，但是缓冲区仍在加载或解码。

Sounds can be scheduled to play at a precise time by specifying the first (when) parameter of the start() call. This parameter is in the coordinate system of the AudioContext’s currentTime. If the parameter is less than the currentTime, it is played immediately. Thus start(0) always plays sound immediately, but to schedule sound in 5 seconds, you would call start(context.currentTime + 5).
可以通过指定 start（）调用时的第一个（when）参数，来精确的调度在某个时间进行声音播放。 该参数位于 AudioContext 的 currentTime 的坐标系中。 如果参数小于 currentTime ，则会立即播放。 因此，起始（0）始终立即播放声音，但是要在5秒内调度声音，您可以调用start（context.currentTime + 5）。

Sound buffers can also be played from a specific time offset by specifying a second parameter to the start() call, and limited to a specific duration with a third optional parameter. For example, if we want to pause a sound and play it back from the paused position, we can implement a pause by tracking the amount of time a sound has been playing in the current session and also tracking the last offset in order to resume later:
也可以通过为 start（）调用指定第二个参数，达到从特定的时间偏移量播放声音缓冲区的功能，并通过第三个参数限制其播放持续时间。 例如，如果我们要暂停一个声音并从暂停的位置播放，我们可以通过跟踪在当前会话中播放声音的时间量来实现暂停，并且还跟踪最后声音播放的总偏移量以便稍后恢复：

```js
// Assume context is a web audio context, buffer is a pre-loaded audio buffer.
var startOffset = 0;
var startTime = 0;

function pause() {
  source.stop();
  // Measure how much time passed since the last pause.
  startOffset += context.currentTime - startTime;
}
```

Once a source node has finished playing back, it can’t play back more. To play back the underlying buffer again, you need to create a new source node (AudioBufferSourceNode) and call start():
一旦源节点已经完成播放，它不能播放更多。 要再次播放底层缓冲区，您需要创建一个新的源节点（AudioBufferSourceNode）并调用start（）：

```js
function play() {
  startTime = context.currentTime;
  var source = context.createBufferSource();
  // Connect graph
  source.buffer = this.buffer;
  source.loop = true;
  source.connect(context.destination);
  // Start playback, but make sure we stay in bound of the buffer.
  source.start(0, startOffset % buffer.duration);
}
```

Though recreating the source node may seem inefficient at first, keep in mind that source nodes are heavily optimized for this pattern. Remember that if you keep a handle to the AudioBuffer, you don’t need to make another request to the asset to play the same sound again. By having this AudioBuffer around, you have a clean separation between buffer and player, and can easily play back multiple versions of the same buffer overlapping in time. If you find yourself needing to repeat this pattern, encapsulate playback with a simple helper function like playSound(buffer) in an earlier code snippet.
虽然重新创建源节点可能看起来效率不高，但请记住，源节点对于该模式进行了大量优化。 请记住，如果您保留对 AudioBuffer 的句柄，则不需要再发起另一个对该资源的请求以再次播放。 通过这个 AudioBuffer，可以在缓冲区和播放器之间有一个清晰的分离，并且可以轻松地播放多个版本的同一个缓冲区。 如果您发现自己需要重复此模式，请在较早的代码段中使用简单的帮助函数（如 playSound（buffer））封装播放。

## Scheduling Precise Rhythms 精确调度节奏

The Web Audio API lets developers precisely schedule playback in the future. To demonstrate this, let’s set up a simple rhythm track. Probably the simplest and most widely known drumkit pattern is shown in Figure 2-1, in which a hihat is played every eighth note, and the kick and snare are played on alternating quarter notes, in 4/4 time.
Web Audio API 允许开发人员在将来精确地调度播放。为了证明这一点，让我们设置一个简单的节奏轨道。 可能最简单和最广为人知的鼓组模式如图2-1所示，其中每八分音符发出一个高音，并且在4/4时间内以交替的四分音符播放踢球和圈套。

![鼓组模式](http://orm-chimera-prod.s3.amazonaws.com/1234000001552/images/waap_0201.png)

Assuming we have already loaded the kick, snare, and hihat buffers, the code to do this is simple:
假设我们已经加载了kick，snare 和 hihat 三个声音，创建节奏的代码很简单：

```js
for (var bar = 0; bar < 2; bar++) {
  var time = startTime + bar * 8 * eighthNoteTime;
  // Play the bass (kick) drum on beats 1, 5
  playSound(kick, time);
  playSound(kick, time + 4 * eighthNoteTime);

  // Play the snare drum on beats 3, 7
  playSound(snare, time + 2 * eighthNoteTime);
  playSound(snare, time + 6 * eighthNoteTime);

  // Play the hihat every eighth note.
  for (var i = 0; i < 8; ++i) {
    playSound(hihat, time + i * eighthNoteTime);
  }
}
```

Once you’ve scheduled sound in the future, there is no way to unschedule that future playback event, so if you are dealing with an application that quickly changes, scheduling sounds too far into the future is not advisable. A good way of dealing with this problem is to create your own scheduler using JavaScript timers and an event queue. This approach is described in <a href="http://www.html5rocks.com/en/">A Tale of Two Clocks</a>.
一旦安排了未来某时刻要播放的音频，就无法取消播放，所以如果应用程序需要常常变更，则过早的安排未来要播放的音频是不太推荐的方法将不太可行。处理此问题的一个好方法是使用 JavaScript 定时器和事件队列来创建自己的调度程序。这种方法在“<a href="http://www.html5rocks.com/en/">两时钟故事</a>”中有描述。

## Changing Audio Parameters 更改音频参数

Many types of audio nodes have configurable parameters. For example, the GainNode has a gain parameter that controls the gain multiplier for all sounds going through the node. Specifically, a gain of 1 does not affect the amplitude, 0.5 halves it, and 2 doubles it [see “<a href="http://chimera.labs.oreilly.com/books/1234000001552/ch03.html#s03_1">Volume, Gain, and Loudness</a>”]. Let’s set up a graph as follows: 
许多类型的音频节点具有可配置的参数。例如，GainNode具有一个增益参数，用于控制通过该节点的所有声音的增益乘数。 具体来说，增益为 1 时不会影响振幅，为 0.5 振幅减半，为 2 时振幅倍增[ 参见“<a href="http://chimera.labs.oreilly.com/books/1234000001552/ch03.html#s03_1">音量，增益和响度</a>”]。 设置如下节点关系：

```js
// Create a gain node.
var gainNode = context.createGain();
// Connect the source to the gain node.
source.connect(gainNode);
// Connect the gain node to the destination.
gainNode.connect(context.destination);
```

In the context of the API, audio parameters are represented as AudioParam instances. The values of these nodes can be changed directly by setting the value attribute of a param instance:
在 API 的上下文中，音频参数表示为AudioParam实例。可以通过设置param实例的value属性直接更改这些节点的值：

```js
// Reduce the volume.
gainNode.gain.value = 0.5;
```

The values can also be changed later, via precisely scheduled parameter changes in the future. We could also use setTimeout to do this scheduling, but this is not precise for several reasons:

    - Millisecond-based timing may not be enough precision.
    - 基于毫秒的定时可能不够精确。

    - The main JS thread may be busy with high-priority tasks like page layout, garbage collection, and callbacks from other APIs, which delays timers.
    - 主要的JS线程可能正在忙于高优先级的任务，如页面布局，垃圾回收和来自其他API的回调，从而延迟定时器。

    - The JS timer is affected by tab state. For example, interval timers in backgrounded tabs fire more slowly than if the tab is in the foreground.
    - JS 定时器受 tab 状态的影响。例如，背景 tab 中的间隔计时器比位于前景的 tab 中的触发的更迟。

Instead of setting the value directly, we can call the setValueAtTime() function, which takes a value and a start time as arguments. For example, the following snippet sets the gain value of a GainNode in one second:
与其直接设置值，可以通过调用 setValueAtTime（）函数改变其值，它接受两个参数，value 和开始时间。 例如，以下代码段将 GainNode 的增益值设置为一秒钟：   

```js
gainNode.gain.setValueAtTime(0.5, context.currentTime + 1);
```

## Gradually Varying Audio Parameters 逐渐变化的音频参数

In many cases, rather than changing a parameter abruptly, you would prefer a more gradual change. For example, when building a music player application, we want to fade the current track out, and fade the new one in, to avoid a jarring transition. While you can achieve this with multiple calls to setValueAtTime as described previously, this is inconvenient.
在许多情况下，突然改变一个参数不如逐渐改变的效果自然。例如，当构建音乐播放器应用程序时，应将当前的音轨淡出，并将新的音轨淡出，以避免突然的转换。虽然如可以通过多次调用 setValueAtTime 实现此目的，但这样做十分不方便。

The Web Audio API provides a convenient set of RampToValue methods to gradually change the value of any parameter. These functions are linearRampToValueAtTime() and exponentialRampToValueAtTime(). The difference between these two lies in the way the transition happens. In some cases, an exponential transition makes more sense, since we perceive many aspects of sound in an exponential manner.
Web Audio API 提供了一组方便的 RampToValue 方法来逐步更改任何参数的值。 这些函数是 linearRampToValueAtTime（）和 exponentialRampToValueAtTime（）。 这两者之间的区别在于过渡发生的方式。在某些情况下，指数转换更有意义，因为我们以指数方式感知声音的许多方面（分贝的变化）。

Let’s take an example of scheduling a crossfade in the future. Given a playlist, we can transition between tracks by scheduling a gain decrease on the currently playing track, and a gain increase on the next one, both slightly before the current track finishes playing:

```js
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
      // Fade it in.
      gainNode.gain.linearRampToValueAtTime(0, currTime);
      gainNode.gain.linearRampToValueAtTime(1, currTime + fadeTime);
      // Then fade it out.
      gainNode.gain.linearRampToValueAtTime(1, currTime + duration-fadeTime);
      gainNode.gain.linearRampToValueAtTime(0, currTime + duration);

      // Play the track now.
      source.noteOn(currTime);

      // Increment time for the next iteration.
      currTime += duration - fadeTime;
    }
  }
}
```





