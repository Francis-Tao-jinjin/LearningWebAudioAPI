# Chapter 6. Advanced Topics 进阶

This chapter covers topics that are very important, but slightly more complex than the rest of the book. We will dive into adding effects to sounds, generating synthetic sound effects without any audio buffers at all, simulating effects of different acoustic environments, and spatializing sound in 3D space.
本章涵盖的内容非常重要，但比本书其余部分复杂得多。接下来将会深入音效添加，不借助现有音源合成音效，模拟不同声学环境的效果，并实现3D空间空间化的音效。

## Biquad Filters 二阶滤波器

A filter can emphasize or de-emphasize certain parts of the frequency spectrum of a sound. Visually, it can be shown as a graph over the frequency domain called a frequency response graph (see Figure 6-1). For each frequency, the higher the value of the graph, the more emphasis is placed on that part of the frequency range. A graph sloping downward places more emphasis on low frequencies and less on high frequencies.
滤波器可以强化或弱化声音频谱中的某些频率。通过频域绘制的图像，称为频率响应图（见图6-1）。对于每个频率，曲线图的值越高，频率范围越重要。有向下趋势的图表示强化低频，弱化高频。

Web Audio filters can be configured with three parameters: gain, frequency, and a quality factor (also known as Q). These parameters all affect the frequency response graph differently.
Web音频滤波器可以配置三个参数：增益，频率和品质因数（也称为Q）。这些参数都会以不同的方式影响频率响应图。

There are many kinds of filters that can be used to achieve certain kinds of effects:
可以使用多种滤波器来实现一些效果：

Low-pass filter
    Makes sounds more muffled 使声音更加闷沉
High-pass filter
    Makes sounds more tinny   使声音更加细腻
Band-pass filter
    Cuts off lows and highs (e.g., telephone filter)
Low-shelf filter
    Affects the amount of bass in a sound (like the bass knob on a stereo)
    影响音频中的低频量（如立体声上的低音旋钮）
High-shelf filter
    Affects the amount of treble in a sound (like the treble knob on a stereo)
Peaking filter
    Affects the amount of midrange in a sound (like the mid knob on a stereo)
Notch filter
    Removes unwanted sounds in a narrow frequency range
    消除窄频范围内的不必要的声音
All-pass filter
    Creates phaser effects     创建移相效果

![Figure 6-1. Frequency response graph for a low-pass filter](http://orm-chimera-prod.s3.amazonaws.com/1234000001552/images/waap_0601.png)
Figure 6-1. Frequency response graph for a low-pass filter

All of these biquad filters stem from a common mathematical model and can all be graphed like the low-pass filter in Figure 6-1. More details about these filters can be found in more mathematically demanding books such as Real Sound Synthesis for Interactive Applications by Perry R. Cook (A K Peters, 2002), which I highly recommend reading if you are interested in audio fundamentals.
所有这些双二阶滤波器都源自一个通用的数学模型，并且都可以像图6-1中的低通滤波器一样进行绘图。 有关这些过滤器的更多细节可以在更多数学要求很高的书籍中找到，如Perry R. Cook（A K Peters，2002）的 Real Sound Synthesis for Interactive Applications ，如果您对音频基础知识感兴趣，我强烈建议您阅读。

## Adding Effects via Filters 通过滤波器添加音效

Using the Web Audio API, we can apply the filters discussed above using BiquadFilterNodes. This type of audio node is very commonly used to build equalizers and manipulate sounds in interesting ways. Let’s set up a simple low-pass filter to eliminate low frequency noise from a sound sample:
使用Web Audio API，我们可以使用BiquadFilterNodes应用上述过滤器。这种类型的音频节点非常常用于构建均衡器并以有趣的方式操纵声音。我们设置一个简单的低通滤波器，以消除声音样本中的低频噪声：

```js
// Create a filter
var filter = context.createBiquadFilter();
// Note: the Web Audio spec is moving from constants to strings.
// filter.type = 'lowpass';
filter.type = filter.LOWPASS;
filter.frequency.value = 100;
// Connect the source to it, and the filter to the destination.
```


The BiquadFilterNode has support for all of the commonly used second-order filter types. We can configure these nodes with the same parameters as discussed in the previous section, and also visualize the frequency response graphs by using the getFrequencyResponse method on the node. Given an array of frequencies, this function returns an array of magnitudes of responses corresponding to each frequency.
BiquadFilterNode 支持所有常用的二阶滤波器类型。我们可以使用与上一节所述相同的参数来配置这些节点，并且还可以通过在节点上使用 getFrequencyResponse 方法来可视化频率响应图。 给定一组频率，该函数返回与每个频率对应的响应幅度的数组。

Chris Wilson and Chris Rogers put together a great visualizer sample (Figure 6-2) that shows the frequency responses of all of the filter types available in the Web Audio API.
Chris Wilson和Chris Rogers 提供了一个了不起的可视化示例（图6-2），显示了Web Audio API 中可用的所有滤波器类型的频率响应。

![Figure 6-2. A graph of the frequency response of a low-pass filter with parameters](http://orm-chimera-prod.s3.amazonaws.com/1234000001552/images/waap_0602.png)
Figure 6-2. A graph of the frequency response of a low-pass filter with parameters

## Procedurally Generated Sound 程序化地生成声音

Up to now, we have been assuming that your game’s sound sources are static. An audio designer creates a bunch of assets and hands them over to you. Then, you play them back with some parameterization depending on local conditions (for example, the room ambiance and relative positions of sources and listeners). This approach has a few disadvantages:
到目前为止，我们一直假设游戏的音频都是静态资源。音频设计师创造了一大堆资源，再丢给开发者。然后，开发者再结合具体的情况（例如，房间氛围和听众相对于音源的位置），根据某些参数进行播放。这种方法有以下缺点：

    1.Sound assets will be very large. This is especially bad on the Web, where instead of loading from a hard drive, you load from a network (at least the first time), which is roughly an order of magnitude slower.
    1.完整的资源文件通常会非常大。通过网络请求资源远不及从本地加载体验好。

    2.Even with many assets and tweaks to each, there is limited variety.
    2.即使资源种类够多，调节的方法也够多，但依然是有限个种类。

    3.You need to find assets by scouring sound effects libraries, and then maybe worry about royalties. Plus, chances are, any given sound effect is already being used in other applications, so your users have unintended associations.
    3.前期需要通过不断的搜索音效库来查找资源，也许还要担心版税。此外，有可能找到的声音效果已经在其他应用程序中使用了。

We can use the Web Audio API to fully generate sound procedurally. For example, let’s simulate a gun firing. We begin with a buffer of white noise, which we can generate with a ScriptProcessorNode as follows:
我们可以使用 Web Audio API 完全通过程序产生声音。例如，模拟一个射击枪。可以从白噪声缓冲区开始，使用ScriptProcessorNode生成如下：

```js
function WhiteNoiseScript() {
  this.node = context.createScriptProcessor(1024, 1, 2);
  this.node.onaudioprocess = this.process;
}

WhiteNoiseScript.prototype.process = function(e) {
  var L = e.outputBuffer.getChannelData(0);
  var R = e.outputBuffer.getChannelData(1);
  for (var i = 0; i < L.length; i++) {
    L[i] = ((Math.random() * 2) - 1);
    R[i] = L[i];
  }
};
```

For more information on ScriptProcessorNodes, see “Audio Processing with JavaScript”.
有关 ScriptProcessorNodes 的更多信息，请参阅“使用 JavaScript 进行音频处理”。

This code is not an efficient implementation because JavaScript is required to constantly and dynamically create a stream of white noise. To increase efficiency, we can programmatically generate a mono AudioBuffer of white noise as follows:
该代码不是一个有效的实现，因为需要 JavaScript来不断地、动态地生成白噪声流。为了提高效率，我们可以通过编程方式生成一个白噪声的单声道 AudioBuffer ，如下所示：

```js
function WhiteNoiseGenerated(callback) {
  // Generate a 5 second white noise buffer.
  var lengthInSamples = 5 * context.sampleRate;
  var buffer = context.createBuffer(1, lengthInSamples, context.sampleRate);
  var data = buffer.getChannelData(0);

  for (var i = 0; i < lengthInSamples; i++) {
    data[i] = ((Math.random() * 2) - 1);
  }

  // Create a source node from the buffer.
  this.node = context.createBufferSource();
  this.node.buffer = buffer;
  this.node.loop = true;
  this.node.start(0);
}
```

Next, we can simulate various phases of the gun firing—attack, decay, and release—in an envelope:
接下来，我们可以通过包络处理来模拟各种相位的炮弹发射音效，及其衰减和释放：

```js
function Envelope() {
  this.node = context.createGain()
  this.node.gain.value = 0;
}

Envelope.prototype.addEventToQueue = function() {
  this.node.gain.linearRampToValueAtTime(0, context.currentTime);
  this.node.gain.linearRampToValueAtTime(1, context.currentTime + 0.001);
  this.node.gain.linearRampToValueAtTime(0.3, context.currentTime + 0.101);
  this.node.gain.linearRampToValueAtTime(0, context.currentTime + 0.500);
};
```

Finally, we can connect the voice outputs to a filter to allow a simulation of distance:
最后，我们可以将语音输出连接到滤波器，以模拟不同距离的效果：

```js
  this.voices = [];
  this.voiceIndex = 0;

  var noise = new WhiteNoise();

  var filter = context.createBiquadFilter();
  filter.type = 0;
  filter.Q.value = 1;
  filter.frequency.value = 800;

  // Initialize multiple voices.
  for (var i = 0; i < VOICE_COUNT; i++) {
    var voice = new Envelope();
    noise.connect(voice.node);
    voice.connect(filter);
    this.voices.push(voice);
  }

  var gainMaster = context.createGainNode();
  gainMaster.gain.value = 5;
  filter.connect(gainMaster);

  gainMaster.connect(context.destination);
```

This example is borrowed from BBC’s <a href='http://webaudio.prototyping.bbc.co.uk/gunfire/'>gunfire effects page</a> with small modifications, including a port to JavaScript.
该示例参考自 BBC 的一个系列博客，推荐参考 <a href='http://webaudio.prototyping.bbc.co.uk/gunfire/'>gunfire effects page</a>，其中有 BCC 提供的 demo 和完整的代码讲解。

As you can see, this approach is very powerful but gets complicated pretty quickly, going beyond the scope of this book. For more information about procedural sound generation, take a look at Andy Farnell’s Practical Synthetic Sound Design tutorials and book.
正如你所看到的，这种方法非常强大，但很快就会复杂化，超出了本书的范围。有关程序声音生成的更多信息，请参阅 Andy Farnell 的实用声音合成设计教程和书籍。

## Room Effects 室内效果

Before sound gets from its source to our ears, it bounces off walls, buildings, furniture, carpets, and other objects. Every such collision changes properties of the sound. For example, clapping your hands outside sounds very different from clapping your hands inside a large cathedral, which can cause audible reverberations for several seconds. Games with high production value aim to imitate these effects. Creating a separate set of samples for each acoustic environment is often prohibitively expensive, since it requires a lot of effort from the audio designer, and a lot of assets, and thus a larger amount of game data.
在耳朵听到声音之前，它会在墙壁，建筑物，家具，地毯和其他物体上反弹。每次碰撞都会改变声音的属性。例如，在室外鼓掌与在大教堂内鼓掌听起来会很不一样，后者会产生延续数秒的回音。具有高产值的游戏旨在模仿这些效果。为每个声学环境创建单独的样本集往往是非常昂贵的，因为它需要音频设计人员大量的工作，产生数量众多的资源文件，导致游戏数据更加庞大。

The Web Audio API comes with a facility to simulate these various acoustic environments called a ConvolverNode. Examples of effects that you can get out of the convolution engine include chorus effects, reverberation, and telephone-like speech.
Web Audio API 提供了一种可以模拟各种声学环境的工具－－ConvolverNode。您可以从 convolution 引擎中获得的效果的例子包括合唱效果，混响和类似电话音效果。

The idea for producing room effects is to play back a reference sound in a room, record it, and then (metaphorically) take the difference between the original sound and the recorded one. The result of this is an impulse response that captures the effect that the room has on a sound. These impulse responses are painstakingly recorded in very specific studio settings, and doing this on your own requires serious dedication. Luckily, there are sites that host many of these pre-recorded impulse response files (stored as audio files) for your convenience.
产生房间效果的想法是在房间中播放参考声音，记录它，然后（比喻）取得原始声音和录制的声音之间的差异。这样做的结果是得到一个捕捉到房间中声音效果的脉冲响应。这些脉冲响应在精心布置的工作室环境中被刻意地记录下来，如果要自己完成这项工作会非常的费时费力。幸运的是，有些站点托管许多这些预先录制的脉冲响应文件（存储为音频文件），以方便您使用。

The Web Audio API provides an easy way to apply these impulse responses to your sounds using the ConvolverNode. This node takes an impulse response buffer, which is a regular AudioBuffer with the impulse response file loaded into it. The convolver is effectively a very complex filter (like the BiquadFilterNode), but rather than selecting from a set of effect types, it can be configured with an arbitrary filter response:
Web Audio API提供了一种使用ConvolverNode将这些脉冲响应应用于您的声音的简单方法。该节点接收脉冲响应的 buffer，该 buffer 是加载了脉冲响应文件的常规AudioBuffer。convolver实际上是一个非常复杂的滤波器（如BiquadFilterNode），并不能直接从预设的效果中获得，它可以用于配置任意的滤波器响应：

```js
var impulseResponseBuffer = null;
function loadImpulseResponse() {
  loadBuffer('impulse.wav', function(buffer) {
    impulseResponseBuffer = buffer;
  });
}

function play() {
  // Make a source node for the sample.
  var source = context.createBufferSource();
  source.buffer = this.buffer;
  // Make a convolver node for the impulse response.
  var convolver = context.createConvolver();
  // Set the impulse response buffer.
  convolver.buffer = impulseResponseBuffer;
  // Connect graph.
  source.connect(convolver);
  convolver.connect(context.destination);
}
```

The convolver node “smushes” the input sound and its impulse response by computing a convolution, a mathematically intensive function. The result is something that sounds as if it was produced in the room where the impulse response was recorded. In practice, it often makes sense to mix the original sound (called the dry mix) with the convolved sound (called the wet mix), and use an equal-power crossfade to control how much of the effect you want to apply。
卷积器节点通过计算卷积（a mathematically intensive function） “压缩”输入的音源及其脉冲响应。结果听起来就像是在记录脉冲响应的房间中产生的。在实践中，混合原始声音（称为干混音）与卷积得到的声音（称为湿混音）通常是有意义的，并使用等功率点的的交叉淡入淡出来控制效果的程度。

It’s also possible to generate these impulse responses synthetically, but this topic is outside of the scope of this book.
也可以通过合成的方式产生这些脉冲响应，但这个主题不在本书的范围之内。

## Spatialized Sound 空间化音频

Games are often set in a world where objects have positions in space, either in 2D or in 3D. If this is the case, spatialized audio can greatly increase the immersiveness of the experience. Luckily, the Web Audio API comes with built-in positional audio features (stereo for now) that are quite straightforward to use.
游戏通常设置在一个空间中，物体在该空间中有确定的二维或三维的坐标。在这种情况下，空间化音频可以大大提高体验的沉浸感。所幸的是， Web Audio API 提供了内置的定位声源的功能（现在的立体声），这些功能非常简单易用。

As you experiment with spatialized sound, make sure that you are listening through stereo speakers (preferably headphones). This will give you a better idea of how the left and right channels are being transformed by your spatialization approach.
当您尝试空间化声音时，请确保您正在通过立体声扬声器（最好是耳机）聆听。这将使您更好地了解如何通过空间化方法转换左右声道。

The Web Audio API model has three aspects of increasing complexity, with many concepts borrowed from OpenAL:
Web Audio API 模型具有日益复杂的三个方面，许多概念来自 OpenAL：

    1.Position and orientation of sources and listeners
    1.音源和听众的相对位置和方向

    2.Parameters associated with the source audio cones
    2.与源音频锥相关联的参数

    3.Relative velocities of sources and listeners
    3.音源和听众的相对速度

There is a single listener (AudioListener) attached to the Web Audio API context that can be configured in space through position and orientation. Each source can be passed through a panner node (AudioPannerNode), which spatializes the input audio. Based on the relative position of the sources and the listener, the Web Audio API computes the correct gain modifications.
有一个连接到 Web Audio API 上下文的监听器（AudioListener）可以通过位置和方向在空间中进行配置。每个源都可以通过一个可以对输入音频进行空间化的panner节点（AudioPannerNode）传递。基于源和收听者的相对位置，Web Audio API计算正确的增益修改。

There are a few things to know about the assumptions that the API makes. The first is that the listener is at the origin (0, 0, 0) by default. Positional API coordinates are unitless, so in practice, it takes some multiplier tweaking to make things sound the way you want. Secondly, orientations are specified as direction vectors (with a length of one). Finally, in this coordinate space, positive y points upward, which is the opposite of most computer graphics systems.
有一些事情要了解API的假设。第一个是默认情况下，听众的位置在原点（0，0，0）。位置API坐标是无单位的，所以在实践中，需要一些乘法器调整，使声音听起来像是你想要的。其次，方向被指定为方向向量（长度为1）。最后，在这个坐标空间中，y轴正方向朝上，这与大多数计算机图形系统相反。

With these things in mind, here’s an example of how you can change the position of a source node that is being spatialized in 2D via a panner node (PannerNode):
有了上面的铺垫，现在举例说明如何通过Panner节点（PannerNode）更改2D中的空间化源节点的位置：

```js
// Position the listener at the origin (the default, just added for the sake of being explicit)
context.listener.setPosition(0, 0, 0);

// Position the panner node.
// Assume X and Y are in screen coordinates and the listener is at screen center.
var panner = context.createPanner();
var centerX = WIDTH/2;
var centerY = HEIGHT/2;
var x = (X - centerX)  / WIDTH;
// The y coordinate is flipped to match the canvas coordinate space.
var y = (Y - centerY) / HEIGHT;
// Place the z coordinate slightly in behind the listener.
var z = -0.5;
// Tweak multiplier as necessary.
var scaleFactor = 2;
panner.setPosition(x * scaleFactor, y * scaleFactor, z);

// Convert angle into a unit vector.
panner.setOrientation(Math.cos(angle), -Math.sin(angle), 1);

// Connect the node you want to spatialize to a panner.
source.connect(panner);
```

In addition to taking into account relative positions and orientations, each source has a configurable audio cone, as shown in Figure 6-3.
除了考虑相对位置和方向外，每个源都有一个可配置的音频锥，如图6-3所示。

![Figure 6-3. A diagram of panners and the listener in 2D space](http://orm-chimera-prod.s3.amazonaws.com/1234000001552/images/waap_0603.png)


Once you have specified an inner and outer cone, you end up with a separation of space into three parts, as seen in Figure 6-3:
一旦你指定了一个内锥和外锥，你就可以将空间分成三部分，如图6-3所示：

    1.Inner cone
    2.内锥

    2.Outer cone
    2.外锥

    3.Neither cone
    3.无锥

Each of these sub-spaces can have a gain multiplier associated with it as an extra hint for the positional model. For example, to emulate targeted sound, we might have the following configuration:
这些子空间中的每一个可以具有与其相关联的增益乘数作为位置模型的额外提示。例如，为了模拟目标声音，我们可能有以下配置：

```js
panner.coneInnerAngle = 5;
panner.coneOuterAngle = 10;
panner.coneGain = 0.5;
panner.coneOuterGain = 0.2;
```

A dispersed sound can have a very different set of parameters. An omnidirectional source has a 360-degree inner cone, and its orientation makes no difference for spatialization:
分散的声音可以有一组非常不同的参数。 全向源具有 360 度内锥，其取向对于空间化无差异：

```js
panner.coneInnerAngle = 180;
panner.coneGain = 0.5;
```

In addition to position, orientation, and sound cones, sources and listeners can also specify velocity. This value is important for simulating pitch changes as a result of the doppler effect.
除了位置，方向和声音锥，源和听众也可以指定速度。 该值对于模拟多普勒效应的音高变化很重要。
(**多普勒效应**是波源和观察者有相对运动时，观察者接受到波的频率与波源发出的频率并不相同的现象。远方急驶过来的火车鸣笛声变得尖细（即频率变高，波长变短），而离我们而去的火车鸣笛声变得低沉（即频率变低，波长变长），就是多普勒效应的现象，同样现象也发生在私家车鸣响与火车的敲钟声。*从某个角度思考，多普勒效应和相对论有相似之处*)

## Audio Processing with JavaScript 使用JavaScript进行音频处理

Generally speaking, the Web Audio API aims to provide enough primitives (mostly via audio nodes) to do most common audio tasks. The idea is that these modules are written in C++ and are much faster than the same code written in JavaScript.
一般来说，Web Audio API 旨在提供足够的图元（主要通过音频节点）来执行最常见的音频任务。 这个想法是这些模块是用 C++ 编写的，比用 JavaScript 编写的代码要快得多。

However, the API also provides a ScriptProcessorNode that lets web developers synthesize and process audio directly in JavaScript. For example, you could prototype custom DSP effects using this approach, or illustrate concepts for educational applications.
然而，API还提供了一个ScriptProcessorNode，让Web开发人员可以直接在JavaScript中合成和处理音频。 例如，您可以使用此方法对自定义DSP效果进行原型化，或用于教育应用程序。

To get started, create a ScriptProcessorNode. This node processes sound in chunks specified as a parameter to the node (bufferSize), which must be a power of two. Err on the side of using a larger buffer, since it gives you more of a safety margin against glitches if the main thread is busy with other things, such as page re-layout, garbage collection, or JavaScript callbacks:
要开始，创建一个ScriptProcessorNode。该节点处理指定为节点（bufferSize）的参数的块中的声音，其值必须要是2的幂。Err 在使用较大的缓冲区的一边，因为如果主线程忙于其他事情（如页面重新布局，垃圾回收或JavaScript 回调），它可以为您提供更多的毛刺安全余地：

```js
// Create a ScriptProcessorNode.
var processor = context.createScriptProcessor(2048);
// Assign the onProcess function to be called for every buffer.
processor.onaudioprocess = onProcess;
// Assuming source exists, connect it to a script processor.
source.connect(processor);
```

Once you have the audio data piping into a JavaScript function, you can analyze the stream by examining the input buffer, or directly change the output by modifying the output buffer. For example, we can easily swap the left and right channels by implementing the following script processor:
将音频数据流到JavaScript函数后，您可以通过检查输入缓冲区来分析流，或者通过修改输出缓冲区来直接更改输出。例如，我们可以通过实现以下脚本处理器轻松地交换左右声道：

```js
function onProcess(e) {
  var leftIn = e.inputBuffer.getChannelData(0);
  var rightIn = e.inputBuffer.getChannelData(1);
  var leftOut = e.outputBuffer.getChannelData(0);
  var rightOut = e.outputBuffer.getChannelData(1);

  for (var i = 0; i < leftIn.length; i++) {
    // Flip left and right channels.
    leftOut[i] = rightIn[i];
    rightOut[i] = leftIn[i];
  }
}
```

Note that you should never do this channel swap in production, since using a ChannelSplitterNode followed by a ChannelMergerNode is far more efficient. As another example, we can add a random noise to the mix. We do this by simply adding a random offset to the signal. By making the signal completely random, we can generate white noise, which is actually quite useful in many applications [see “Procedurally Generated Sound”]:
请注意，在正式情况下不应该用这种方式进行声道交换，因为使用 ChannelMergerNode 后接的 ChannelSplitterNode 效率更高。另一个例子是，我们可以在混音中添加随机噪声。我们通过简单地向信号添加随机偏移来做到这一点。通过使信号完全随机，我们可以产生白噪声，这在许多应用中实际上非常有用[参见“程序生成的声音”]：

```js
function onProcess(e) {
  var leftOut = e.outputBuffer.getChannelData(0);
  var rightOut = e.outputBuffer.getChannelData(1);

  for (var i = 0; i < leftOut.length; i++) {
    // Add some noise
    leftOut[i] += (Math.random() - 0.5) * NOISE_FACTOR;
    rightOut[i] += (Math.random() - 0.5) * NOISE_FACTOR;
  }
}
```

The main issue with using script processing nodes is performance. Using JavaScript to implement these mathematically-intensive algorithms is significantly slower than implementing them directly in the native code of the browser.(??原文的语句优点奇怪)
使用脚本处理节点的主要问题是性能。使用JavaScript实现这些数学密集型算法比在浏览器的本机代码中直接实现它们要慢得多。






