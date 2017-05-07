# Chapter 5. Analysis and Visualization 分析与可视化

So far we’ve only talked about audio synthesis and processing, but that is only half of the functionality that the Web Audio API provides. The other half, audio analysis, is all about understanding what the sound that is being played is like. The canonical example of this feature is visualization, but there are many other applications far outside the scope of this book, including pitch detection, rhythm detection, and speech recognition.
到目前为止，我们只谈到音频合成和加工，但这只涉及到 Web Audio API 一半的功能。 另一半则是关于音频分析，是关于理解正在播放的声音是什么样的。 该功能的典型例子是可视化，但是还有许多其他应用远远超出了本书的范围，包括音高检测，节奏检测和语音识别。

This is an important topic for us as game developers and interactive application builders for a couple of reasons. Firstly, a good visual analyzer can act as a sort of debugging tool (obviously in addition to your ears and a good metering setup) for tweaking sounds to be just right. Secondly, visualization is critical for any games and applications related to music, from games like Guitar Hero to software like GarageBand.
这是我们作为游戏开发人员和互动应用程序构建者的重要课题，有几个原因。 首先，一个好的可视化分析器可以作为一种调试工具（显然是除了耳朵之外另一个很好的测量方式），刚好用于调节音频。其次，可视化对于任何与音乐有关的游戏和应用都是至关重要的，比如 Guitar Hero 到 GarageBand。

## Frequency Analysis 频率分析

The main way of doing sound analysis with the Web Audio API is to use AnalyserNodes. These nodes do not change the sound in any way, and can be placed anywhere in your audio context. Once this node is in your graph, it provides two main ways for you to inspect the sound wave: over the time domain and over the frequency domain.
使用Web Audio API进行声音分析的主要方法是使用AnalyserNodes。这些节点不会以任何方式更改声音，并且可以放置在音频上下文的任何位置。一旦这个节点被添加，它就提供了两个主要的方式来检查声波：通过时域和频域。

The results you get are based on FFT analysis over a certain buffer size. We have a few knobs to customize the output of the node:
得到的结果是基于对某特定缓冲区大小的FFT分析。并有几个旋钮来自定义节点的输出：

fftSize
    This defines the buffer size that is used to perform the analysis. It must be a power of two. Higher values will result in more fine-grained analysis of the signal, at the cost of some performance loss.
    这定义了用于执行分析的缓冲区大小，其必须是2的n次方。值越高，对信号就能进行更细粒度的分析，但要以牺牲性能为代价。

frequencyBinCount
    This is a read-only property, set automatically as fftSize/2.
    这是一个只读属性，自动设置为fftSize / 2。

smoothingTimeConstant
    This is a value between zero and one. A value of one causes a large moving average window and smoothed results. A value of zero means no moving average, and quickly fluctuating results.
    这是一个介于0和1之间的值。值为1代表有一个大的移动平均窗口并产生平滑的结果。值为0表示没有移动平均值，并产生快速波动的结果。

The basic setup is to insert the analyzer node into the interesting part of our audio graph:
基本的做法就是将分析仪节点插入到我们感兴趣的部分：
```js
// Assume that node A is ordinarily connected to B.
var analyser = context.createAnalyser();
A.connect(analyser);
analyser.connect(B);
```

Then we can get frequency or time domain arrays as follows:
```js
var freqDomain = new Float32Array(analyser.frequencyBinCount);
analyser.getFloatFrequencyData(freqDomain);
```

In the previous example, freqDomain is an array of 32-bit floats corresponding to the frequency domain. These values are normalized to be between zero and one. The indexes of the output can be mapped linearly between zero and the nyquist frequency, which is defined to be half of the sampling rate (available in the Web Audio API via context.sampleRate). The following snippet maps from frequency to the correct bucket in the array of frequencies:
在前面的例子中，freqDomain 是一个对应于频域的32位浮点数组。 这些值被归一化为在0和1之间。 输出的索引可以在零和奈奎斯特频率之间线性映射，奈奎斯特频率的定义为采样率的一半（通过context.sampleRate在Web Audio API中可用）。 以下片段将频率映射到频率数组中的对应位置：
```js
function getFrequencyValue(frequency) {
  var nyquist = context.sampleRate/2;
  var index = Math.round(frequency/nyquist * freqDomain.length);
  return freqDomain[index];
}
```

If we are analyzing a 1,000-Hz sine wave, for example, we would expect that getFrequencyValue(1000) would return a peak value in the graph, as shown in Figure 5-1.
如果我们正在分析一个1000Hz的正弦波，那么getFrequencyValue（1000）将返回图中的峰值，如图5-1所示。

The frequency domain is also available in 8-bit unsigned units via the getByteFrequencyData call. The values of these integers is scaled to fit between minDecibels and maxDecibels (in dBFS) properties on the analyzer node, so these parameters can be tweaked to scale the output as desired.
频域也可以通过getByteFrequencyData得到在8位无符号的数据。 这些整数的值被缩放以适应分析器节点上的minDecibels和maxDecibels（以dBFS）为特征，因此可以调整这些参数以根据需要对输出进行缩放。

![Figure 5-1. A 1,000-Hz tone being visualized (the full domain extends from 0 to 22,050 Hz)](http://orm-chimera-prod.s3.amazonaws.com/1234000001552/images/waap_0501.png)
Figure 5-1. A 1,000-Hz tone being visualized (the full domain extends from 0 to 22,050 Hz)

## Animating with requestAnimationFrame

If we want to build a visualization for our soundform, we need to periodically query the analyzer, process the results, and render them. We can do this by setting up a JavaScript timer like setInterval or setTimeout, but there’s a better way: requestAnimationFrame. This API lets the browser incorporate your custom draw function into its native rendering loop, which is a great performance improvement. Instead of forcing it to draw at specific intervals and contending with the rest of the things a browser does, you just request it to be placed in the queue, and the browser will get to it as quickly as it can.
如果要对声音形进行可视化，我们需要定期查询分析器，处理结果并进行渲染。 我们可以通过设置一个JavaScript定时器，如setInterval或setTimeout来实现，但有一个更好的方法：requestAnimationFrame。 该API允许浏览器将您的自定义绘图功能纳入其原始渲染循环，这是一个很好的性能提升。 而不是强制它以特定的间隔绘制，并与浏览器的其他任务竞争，您只需要将其放置在队列中，浏览器就能很好的自动完成处理。

Because the requestAnimationFrame API is still experimental, we need to use the prefixed version depending on user agent, and fall back to a rough equivalent: setTimeout. The code for this is as follows:
因为 requestAnimationFrame API 仍然是实验性的，我们需要根据具体浏览器的判断其是否需要用setTimeout代替。 其代码如下：
```js
window.requestAnimationFrame = (function(){
return window.requestAnimationFrame  ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame    ||
  window.oRequestAnimationFrame      ||
  window.msRequestAnimationFrame     ||
  function(callback){
  window.setTimeout(callback, 1000 / 60);
};
})();
```

Once we have this requestAnimationFrame function defined, we should use it to query the analyzer node to give us detailed information about the state of the audio stream.
一旦我们定义了这个requestAnimationFrame函数，我们应该使用它来查询分析器节点，给出关于音频流状态的详细信息。

## Visualizing Sound 音频可视化

Putting it all together, we can set up a render loop that queries and renders the analyzer for its current frequency analysis as before, into a freqDomain array:
将它们放在一起，我们可以设置一个渲染循环，将分析器的当前频率分析查询并呈现到freqDomain数组中：
```js
var freqDomain = new Uint8Array(analyser.frequencyBinCount);
analyser.getByteFrequencyData(freqDomain);
for (var i = 0; i < analyser.frequencyBinCount; i++) {
  var value = freqDomain[i];
  var percent = value / 256;
  var height = HEIGHT * percent;
  var offset = HEIGHT - height - 1;
  var barWidth = WIDTH/analyser.frequencyBinCount;
  var hue = i/analyser.frequencyBinCount * 360;
  drawContext.fillStyle = 'hsl(' + hue + ', 100%, 50%)';
  drawContext.fillRect(i * barWidth, offset, barWidth, height);
}
```

We can do a similar thing for the time-domain data as well:

```js
var timeDomain = new Uint8Array(analyser.frequencyBinCount);
analyser.getByteTimeDomainData(freqDomain);
for (var i = 0; i < analyser.frequencyBinCount; i++) {
  var value = timeDomain[i];
  var percent = value / 256;
  var height = HEIGHT * percent;
  var offset = HEIGHT - height - 1;
  var barWidth = WIDTH/analyser.frequencyBinCount;
  drawContext.fillStyle = 'black';
  drawContext.fillRect(i * barWidth, offset, 1, 1);
}
```

This code plots time-domain values using HTML5 canvas, creating a simple visualizer that renders a graph of the waveform on top of the colorful bar graph, which represents frequency-domain data. The result is a canvas output that looks like Figure 5-2, and changes with time.
该代码使用HTML5画布绘制时域值，创建一个简单的可视化程序，在多彩条形图顶部呈现波形图，条形图表示频域数据。 结果是一个画布的输出，如图5-2所示，并随时间而变化。

![该代码使用HTML5画布绘制时域值，创建一个简单的可视化程序，在多彩条形图顶部呈现波形图，表示频域数据。 结果是一个画布输出，如图5-2所示，并随时间而变化。](http://orm-chimera-prod.s3.amazonaws.com/1234000001552/images/waap_0502.png)









