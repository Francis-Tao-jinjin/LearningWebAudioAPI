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












