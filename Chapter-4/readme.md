# Chapter 4. Pitch and the Frequency Domain 音高和频域

So far we have learned about some basic properties of sound: timing and volume. To do more complex things, such as sound equalization (e.g., increasing the bass and decreasing the treble), we need more complex tools. This section explains some of the tools that allow you to do these more interesting transformations, which include the ability to simulate different sorts of environments and manipulate sounds directly with JavaScript.
到目前为止，我们已经了解了声音的一些基本属性：时间和音量。要做更复杂的事情，例如声音均衡（例如，增加低音和降低高音），我们需要更复杂的工具。 本节将介绍一些允许您进行更有趣的转换的工具，其中包括能够模拟不同种类的环境并直接使用JavaScript操作声音。

## Basics of Musical Pitch 音调

Music consists of many sounds played simultaneously. Sounds produced by musical instruments can be very complex, as the sound bounces through various parts of the instrument and is shaped in unique ways. However, these musical tones all have one thing in common: physically, they are periodic waveforms. This periodicity is perceived by our ears as pitch. The pitch of a note is measured in frequency, or the number of times the wave pattern repeats every second, specified in hertz. The frequency is the time (in seconds) between the crests of the wave. As illustrated in Figure 4-1, if we halve the wave in the time dimension, we end up with a correspondingly doubled frequency, which sounds to our ears like the same tone, one octave higher. Conversely, if we extend the wave’s frequency by two, this brings the tone an octave down. Thus, pitch (like volume) is perceived exponentially by our ears: **at every octave, the frequency doubles**.
音乐包括同时播放的许多声音。由乐器产生的声音可能非常复杂，因为声音会在乐器的各个部分反射，并以独特的方式形成最终听到的声音。然而，这些音乐都有一个共同点：物理上它们是周期性的波形。 这种周期性被我们的耳朵感知为音调。音调是通过以赫兹为单位的频率或波形每秒重复的次数进行测量的。频率是相邻两个波峰的时间间隔（秒）。如图4-1所示，如果我们在时间维度上将声波的时常压缩为原来的一半，反映在频域上是双倍频率，最终人耳听起来音调相似，但是高了一个八度音程。相反，如果我们把波的频率扩大两倍，那么这个音调就会降低八度。因此，音调如同音量一样被我们的耳朵指数的地感知：**每升高八度，频率加倍**。

![Figure 4-1. Graph of perfect A4 and A5 tones side by side](http://orm-chimera-prod.s3.amazonaws.com/1234000001552/images/waap_0401.png)

Octaves are split up into 12 semitones. Each adjacent semitone pair has an identical frequency ratio (at least in equal-tempered tunings). In other words, the ratios of the frequencies of A4 to A#4 are identical to A#4 to B.
八度分为12个半音。 每个相邻的半音对具有相同的频率比（至少在等平均律音调中）。换句话说，A4与A＃4的频率之比与A＃4至B相同。

Figure 4-1 shows how we would derive the ratio between every successive semitone, given that:
图4-1显示如何导每个连续的半音之间的比例，给出：

    － To transpose a note up an octave, we double the frequency of the note.
    － 要将音符转换一个八度，我们将音符的频率加倍。
    － Each octave is split up into 12 semitones, which, in an equal tempered tuning, have identical frequency ratios.
    － 每个八度音阶分为12个半音，在等平均律音调中，具有相同的频率比。

Let's define a *f_0* to be some frequency, and *f_1* to be that same note one octave higher. we know that this is the relationship between them:
定义 *f_0* 为某一个频率，*f_1* 为对应的高了一个八度的声音的频率。则它们之间关系如下：
<p style="text-align:center; 
    font-style:italic; 
    font-size:1.2em;
    font-family:'Computer Modern Math', 'Latin Modern Math'">
f<sub>1</sub> = 2 * f<sub>0</sub>
</p>
Next, let k be the fixed multiplier between any two adjacent semitones. Since there are 12 semitones in an octave, we also know the following:
现在，设 k 为相邻两个半音之间频率的比值，由于一个八度之间有12个半音，因此可得下面的式子：
<p style="text-align:center; 
    font-style:italic; 
    font-size:1.2em;
    font-family:'Computer Modern Math', 'Latin Modern Math'">
f<sub>1</sub> = f<sub>0</sub> * k * k * k * ... * k (12x) = f<sub>0</sub> * k<sup>12</sup>
</p>
Solving the system of equations above, we have the following:
<p style="text-align:center; 
    font-style:italic; 
    font-size:1.2em;
    font-family:'Computer Modern Math', 'Latin Modern Math'">
2 * f<sub>0</sub> = f<sub>0</sub> * k<sup>12</sup>
</p>
Solving for k:
<p style="text-align:center; 
    font-style:italic; 
    font-size:1.2em;
    font-family:'Computer Modern Math', 'Latin Modern Math'">
k = 2<sup>(1/12)</sup> = 1.0595
</p>

Conveniently, all of this semitone-related offsetting isn’t really necessary to do manually, since many audio environments (the Web Audio API included) include a notion of detune, which linearizes the frequency domain. **Detune is measured in cents, with each octave consisting of 1200 cents, and each semitone consisting of 100 cents. By specifying a detune of 1200, you move up an octave. Specifying a detune of −1200 moves you down an octave.**
方便的是，所有这些与半音相关的偏移量并不是一定要通过手动计算，因为许多音频环境（包括Web Audio API）都包含了一个将频域线性化的分离概念。**解谐以分衡量，每个八度由1200分组成，每个半音由100分组成。 通过指定一个1200的解谐，上移一个八度。 指定-1200的解谐下移动八度。**

## Pitch and playbackRate 音高和播放速率

The Web Audio API provides a playbackRate parameter on each AudioSourceNode. This value can be set to affect the pitch of any sound buffer. Note that the pitch as well as the duration of the sample will be affected in this case. There are sophisticated methods that try to affect pitch independent of duration, but this is quite difficult to do in a general-purpose way without introducing blips, scratches, and other undesirable artifacts to the mix.
Web Audio API在每个AudioSourceNode上提供一个playbackRate参数。该值可以设置为影响任何声音缓冲区的音高。 请注意，在这种情况下，音高以及采样的持续时间将受到影响。 有一些复杂的方法试图独立于持续时间影响音调，但很难找到一个通用的方式并且不会在混音中引入 blips，scratches 等。。。。。

As discussed in “Basics of Musical Pitch”, to compute the frequencies of successive semitones, we simply multiply the frequency by the semitone ratio 2^(1/12). This is very useful if you are developing a musical instrument or using pitch for randomization in a game setting. The following code plays a tone at a given frequency offset in semitones:
如“音乐音调基础”中所讨论的，为了计算连续半音的频率，我们简单地将频率乘以半音比2^(1/12)。 如果您正在开发乐器或在游戏设置中使用音调进行随机化，这是非常有用的。以下代码在半音中以给定的频率偏移量播放音调：

```js
function playNote(semitones) {
  // Assume a new source was created from a buffer.
  var semitoneRatio = Math.pow(2, 1/12);
  source.playbackRate.value = Math.pow(semitoneRatio, semitones);
  source.start(0);
}
```

As we discussed earlier, our ears perceive pitch exponentially. Treating pitch as an exponential quantity can be inconvenient, since we often deal with awkward values such as the twelfth root of two. Instead of doing that, we can use the detune parameter to specify our offset in cents. Thus you can rewrite the above function using detune in an easier way:
正如我们前面讨论的，我们的耳朵指数地感知变化音调。但是在处理音调时使用指数就很不方便的，因为这会经常处理很尴尬的值，2的12次方根（1.05946309436）。所以这就出现了另一种方法，可以使用detune参数指定用分表示的偏移量。 因此，您可以以更简单的方式使用detune重写上述函数：

```js
function playNote(semitones) {
  // Assume a new source was created from a buffer.
  source.detune.value = semitones * 100;
  source.start(0);
}
```

If you pitch shift by too many semitones (e.g., by calling playNote(24);), you will start to hear distortions. Because of this, digital pianos include multiple samples for each instrument. Good digital pianos avoid pitch bending at all, and include a separate sample recorded specifically for each key. Great digital pianos often include multiple samples for each key, which are played back depending on the velocity of the key press.
如果声音偏移了太多的半音（比如调用 playNote（24）），很有可能会听到失真。 因此，电子钢琴的每个乐器都包含多个采样。优秀的电子钢琴可以完全避免音调失真，并为每个键记录的独立的采样。伟大的电子钢琴通常为每个键保存的多个采样，并根据按键的速度选择播放的音频。

## Multiple Sounds with Variations 多个声音与变化

A key feature of sound effects in games is that there can be many of them simultaneously. Imagine you’re in the middle of a gunfight with multiple actors shooting machine guns. Each machine gun fires many times per second, causing tens of sound effects to be played at the same time. Playing back sound from multiple, precisely-timed sources simultaneously is one place the Web Audio API really shines.
游戏音效的一个关键特征是可以同时播放许多声音。 想像你正在与多名角色进行射击机枪战。 每台机枪每秒都能触发许多次，同一时刻会有数十声音效在播放。控制多声源精确的在规定的时刻播放也正是 Web Audio API 的强项之一。

Now, if all of the machine guns in your game sounded exactly the same, that would be pretty boring. Of course the sound would vary based on distance from the target and relative position [more on this later in “Spatialized Sound”], but even that might not be enough. Luckily the Web Audio API provides a way to easily tweak the previous example in at least two simple ways:
现在，如果你游戏中的所有机关枪都听起来完全一样，那将是非常无聊的。当然，播放的声音会根据与目标的距离和相对位置的不同而有所不同（稍后在“Spatialized Sound”中有更多的内容）]，但即使这样做可能还不够。 幸运的是，Web Audio API 提供了一种以至少两种简单方式轻松调整上述示例的方法：

    - With a subtle shift in time between bullets firing.
    - 子弹射击之间的时间有微妙的偏移。

    - By changing pitch to better simulate the randomness of the real world.
    - 通过改变音调来更好地模拟现实世界的随机性。

Using our knowledge of timing and pitch, implementing these two effects is pretty straightforward:
利用有关时间和音调知识，实现这两个效果是非常简单的：

```js
function shootRound(numberOfRounds, timeBetweenRounds) {
  var time = context.currentTime;
  // Make multiple sources using the same buffer and play in quick succession.
  for (var i = 0; i < numberOfRounds; i++) {
    var source = this.makeSource(bulletBuffer);
    source.playbackRate.value = 1 + Math.random() * RANDOM_PLAYBACK;
    source.start(time + i * timeBetweenRounds + Math.random() * RANDOM_VOLUME);
  }
}
```

The Web Audio API automatically merges multiple sounds playing at once, essentially just adding the waveforms together. This can cause problems such as clipping, which we discuss in “<a href='http://chimera.labs.oreilly.com/books/1234000001552/ch03.html#s03_3'>Clipping and Metering</a>”.

This example adds some variety to AudioBuffers loaded from sound files. In some cases, it is desirable to have fully synthesized sound effects and no buffers at all [see “Procedurally Generated Sound”].
这个例子为从声音文件加载的 AudioBuffers 添加了一些变体。在某些情况下，最好具有完全合成的声音效果，完全没有缓冲区[参见“程序生成的声音”]。

## Understanding the Frequency Domain 了解频域

So far in our theoretical excursions, we’ve only examined sound as a function of pressure as it varies over time. Another useful way of looking at sound is to plot amplitude and see how it varies over frequency. This results in graphs where the domain (x-axis) is in units of frequency (Hz). Graphs of sound plotted this way are said to be in the frequency domain.
到目前为止的理论学习中，我们只从时间的角度，将声音视为压力的函数。了解声音的另一种有用的方法是绘制其幅值图，看看它是如何响应频率的变化。此时定义域（x轴）以频率（Hz）为单位。以这种方式绘制的声音波形图表示的是频域中的波形。

The relationship between the time-domain and frequency-domain graphs is based on the idea of fourier decomposition. As we saw earlier, sound waves are often cyclical in nature. Mathematically, periodic sound waves can be seen as the sum of multiple simple sine waves of different frequency and amplitude. The more such sine waves we add together, the better an approximation of the original function we can get. We can take a signal and find its component sine waves by applying a fourier transformation, the details of which are outside the scope of this book. Many algorithms exist to get this decomposition too, the best known of which is the Fast Fourier Transform (FFT). Luckily, the Web Audio API comes with an implementation of this algorithm. We will discuss how it works later [see “Frequency Analysis”].
时域和频域图之间的关系是基于傅立叶分解的思想。正如之前所见，声波通常是周期性的。数学上，周期声波可以看作是不同频率和幅值的若干个正弦波的叠加。叠加的正弦波越多，得到的原始函数的近似度就越好。通过对一个信号应用傅立叶变换，可以找到其组成的若干正弦波，其细节超出了本书的范围。存在许多算法来获得这种分解，其中最着名的是快速傅里叶变换（FFT）。幸运的是，Web Audio API附带了该算法的实现。之后将讨论它是如何运作的[参见“频率分析”]。

In general, we can take a sound wave, figure out the constituent sine wave breakdown, and plot the (frequency, amplitude) as points on a new graph to get a frequency domain plot. Figure 4-2 shows a pure A note at 440 Hz (called A4).
一般来说，我们可以分解一个声波，找出构成其的正弦波，并将（频率，幅度）其绘制成频域图。图4-2显示了440 Hz的纯A音符（称为A4）

![Figure 4-2. A perfectly sinusoidal 1-KHz sound wave represented in both time and frequency domains](http://orm-chimera-prod.s3.amazonaws.com/1234000001552/images/waap_0402.png)
Figure 4-2. A perfectly sinusoidal 1-KHz sound wave represented in both time and frequency domains

Looking at the frequency domain can give a better sense of the qualities of the sound, including pitch content, amount of noise, and much more. Advanced algorithms like pitch detection can be built on top of the frequency domain. Sound produced by real musical instruments have overtones, so an A4 played by a piano has a frequency domain plot that looks (and sounds) very different from the same A4 pitch played by a trumpet. Regardless of the complexity of sounds, the same fourier decomposition ideas apply. Figure 4-3 shows a more complex fragment of a sound in both the time and frequency domains.
从频域的角度可以更好地了解声音的，包括音调信息，噪音量等等。可以在频域之上构建像音高检测这样的高级算法。由真正的乐器产生的声音具有泛音，所以由钢琴演奏的A4与由小号发出的A4音的频谱图看起来会很不一样。不管声音的复杂程度如何，都可以使用傅立叶变换对其分析。图4-3显示了时域和频域中声音的更为复杂的片段。

![Figure 4-3. A complex sound wave shown in both time and frequency domains](http://orm-chimera-prod.s3.amazonaws.com/1234000001552/images/waap_0403.png
)
Figure 4-3. A complex sound wave shown in both time and frequency domains

These graphs behave quite differently over time. If you were to very slowly play back the sound in Figure 4-3 and observe it moving along each graph, you would notice the time domain graph (on the left) progressing left to right. The frequency domain graph (on the right) is the frequency analysis of the waveform at a moment in time, so it might change more quickly and less predictably.
随着时间的推移，这些图表的行为有很大的不同。 如果您非常缓慢地播放图4-3中的声音，并观察它沿着每个图形移动，您会注意到从左到右的时域图（左侧）。频域图（右图）是时间上的波形的频率分析，因此它可能会更快，更可预测地变化。

Importantly, frequency-domain analysis is still useful when the sound examined is not perceived as having a specific pitch. Wind, percussive sources, and gunshots have distinct representations in the frequency domain. For example, white noise has a flat frequency domain spectrum, since each frequency is equally represented.
重要的是，当检测到的声音无法确定音调时，频域分析仍然十分有效哦。风声，冲击源和枪声在频域的波形有着明显的区别。 例如，白噪声具有平坦的频域频谱，因为每个频率都被均等地表示。

### 信号频域和时域的关系

所谓信号，从狭义上说可以认为是自然界中作为信息载体的各类波，一般来说简谐震动产生的正弦波是最常见的研究对象。针对正弦波，在数学上有一系列的工具可以对其进行分析。因此，对于自然界存在的所有波，我们可以利用所谓的傅立叶级数展开法将它们分解为有限或无限个不同频率不同振幅的正弦波的集合。

![傅立叶分解示例](https://pic4.zhimg.com/64e0e16740452bd862f3ec33d447a05b_b.jpg)
傅立叶分解示例

其中各个分量的振幅的确定有专门的公式，此处不详述。而各个分量的频率恰好是原来函数频率的整数倍。我们可以发现，经过分解后的公式完全可以用另一幅图来表示，横坐标为各个分量的频率，纵坐标为对应振幅。（**周期性信号可以明确的分解成有限个不同频率的波形，所以它的频域图是离散的**）

![傅立叶分解示例2](https://pic1.zhimg.com/8ac325e722439c4f64768198912f2dc8_b.jpg)
傅立叶分解示例2

到了这里，频域和时域最基本的关系就很明显了，第一幅图是一个矩形波的时域图，第二幅则是频域图。将一个表示波的函数从时域（时间与振幅的关系）转化为频域（频率与振幅的关系）的数学操作被称为傅立叶变换以上的演示的是对于周期性信号的傅立叶变换，而对于非周期信号，其过程较为抽象，对其的变换便是傅立叶变换的一般形式，具体细节可以参阅有关资料(**对非周期的信号，我们设定他的周期无限长，因此对应到无限多个不同频率的波形，因此非周期信号的频谱是连续的**)。在这里我仅说明一个一般性结论：非周期信号的傅立叶变换所得频域图像是连续的，而不像上图那样离散。也就是说，非周期信号各个分量的频率是连续的。以下是一个非周期信号的例子，具体得到的过程不再给出。

![傅立叶分解示例3](https://pic1.zhimg.com/2560ccf4cd2cbd3c5f6f020a0707aa50_b.jpg)
傅立叶分解示例3

## Oscillator-Based Direct Sound Synthesis 基于振荡器的直接声音合成

As we discussed early in this book, digital sound in the Web Audio API is represented as an array of floats in AudioBuffers. Most of the time, the buffer is created by loading a sound file, or on the fly from some sound stream. In some cases, we might want to synthesize our own sounds. We can do this by creating audio buffers programmatically using JavaScript, which simply evaluate a mathematical function at regular periods and assign values to an array. By taking this approach, we can manually change the amplitude and frequency of our sine wave, or even concatenate multiple sine waves together to create arbitrary sounds [recall the principles of fourier transformations from “Understanding the Frequency Domain”].
正如我们在本书早期讨论的那样，Web Audio API 中的数字音频被表示为 AudioBuffers 中的浮点数组。大多数情况下，缓冲区是通过加载声音文件，或者从一些声音流中即时创建的。在某些情况下，我们可能想要自定义合成音频。我们可以通过使用JavaScript以编程方式创建音频缓冲区来完成此操作，该方法简单地在预定的周期长度中运用数学函数将值分配给数组。通过采用这种方法，我们可以手动改变正弦波的幅度和频率，甚至可以将多个正弦波连接在一起，以产生任意的声音[从“<a href="http://chimera.labs.oreilly.com/books/1234000001552/ch04.html#s04_4">了解频域</a>”中回顾傅里叶变换的原理]。

Though possible, doing this work in JavaScript is inefficient and complex. Instead, the Web Audio API provides primitives that let you do this with oscillators: OscillatorNode. These nodes have configurable frequency and detune [see the “Basics of Musical Pitch”]. They also have a type that represents the kind of wave to generate. Built-in types include the sine, triangle, sawtooth, and square waves, as shown in Figure 4-4.
虽然这样做完全可行，但使用 JavaScript 实现的效率不高而且非常复杂。相反，Web Audio API 提供原生方法－－使用振荡器来实现：OscillatorNode。 这些节点具有可配置的频率和 detune [参见“音乐音调的基础”]。其有一些预置的波形，包括正弦波，三角波，锯齿波和方波，如图4-4所示。

![预置波形图](http://orm-chimera-prod.s3.amazonaws.com/1234000001552/images/waap_0404.png)
预置波形图

振荡器可以轻松代替 AudioBufferSourceNodes 地用于音频图形，下面是一个例子：

```js
function play(semitone) {
  // Create some sweet sweet nodes.
  var oscillator = context.createOscillator();
  oscillator.connect(context.destination);
  // Play a sine type curve at A4 frequency (440hz).
  oscillator.frequency.value = 440;
  oscillator.detune.value = semitone * 100;
  // Note: this constant will be replaced with "sine".
  oscillator.type = oscillator.SINE;
  oscillator.start(0);
}
```

In addition to these basic wave types, you can create a custom wave table for your oscillator by using harmonic tables. This lets you efficiently create wave shapes that are much more complex than the previous ones. This topic is very important for musical synthesis applications, but is outside of the scope of this book.
除了这些基本波形类型，您还可以使用谐波表为振荡器创建自定义波形表。这样可以有效地创更复杂的波形。这点对于音频合成应用非常重要，但不在本书的范围之内。

