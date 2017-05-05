# Chapter 3. Volume and Loudness 音量和响度

Once we are ready to play a sound, whether from an AudioBuffer or from other sources, one of the most basic parameters we can change is the loudness of the sound.
一旦准备好要播放的声音，无论是从 AudioBuffer 还是从其他来源，我们可以改变的最基本的参数之一是声音的响度。

The main way to affect the loudness of a sound is using GainNodes. As previously mentioned, these nodes have a gain parameter, which acts as a multiplier on the incoming sound buffer. The default gain value is one, which means that the input sound is unaffected. Values between zero and one reduce the loudness, and values greater than one amplify the loudness. Negative gain (values less than zero) inverts the waveform (i.e., the amplitude is flipped).
影响声音响度的主要方法是使用GainNodes。如前所述，这些节点具有增益参数，其作为输入声音缓冲器上的乘数。 默认增益值为1，这意味着输入声音不受影响。0和1之间的值可以减小响度，大于1的值可以放大响度。 负增益（小于零的值）反转波形（即，振幅被翻转）。

## Volume, Gain, and Loudness 音量，增益和响度

**Let’s start with some definitions. Loudness is a subjective measure of how intensely our ears perceive a sound. Volume is a measure of the physical amplitude of a sound wave. Gain is a scale multiplier affecting a sound’s amplitude as it is being processed.**
**我们从一些定义开始。 响度是我们的耳朵感觉到强烈的声音的主观测量。 音量是声波的物理振幅的量度。 增益是影响正在处理的声音幅度的比例倍增器。**

In other words, when undergoing a gain, the amplitude of a sound wave is scaled, with the gain value used as a multiplier. For example, while a gain value of one will not affect the sound wave at all, Figure 3-1 illustrates what happens to a sound wave if you send it through a gain factor of two.
换句话说，当经历增益时，声波的幅度被缩放，增益值用作乘数。 例如，增益值为1不会影响声波，图3-1说明了如果通过增益系数为2的处理后发送声波，会发生什么。

![Figure 3-1. Original soundform on the left, gain 2 soundform on the right](http://orm-chimera-prod.s3.amazonaws.com/1234000001552/images/waap_0301.png)

Generally speaking, power in a wave is measured in decibels (abbreviated dB), or one tenth of a Bel, named after Alexander Graham Bell. Decibels are a relative, logarithmic unit that compare the level being measured to some reference point. There are many different reference points for measuring dB, and each reference point is indicated with a suffix on the unit. Saying that a signal is some number of dB is meaningless without a reference point! For example, dBV, dBu, and dBm are all useful for measuring electrical signals. Since we are dealing with digital audio, we are mainly concerned with two measures: dBFS and dBSPL.
一般来说，声波的功率以分贝（缩写dB）或贝尔的十分之一计量，以亚历山大·格雷厄姆·贝尔（Alexander Graham Bell）命名。 分贝是一个相对的对数单位，将被测量水平与某个参考点进行比较。 测量dB有许多不同的参考点，每个参考点用本机后缀表示。说一个信号是一定数量的dB没有参考点是无意义的！ 例如，dBV，dBu和dBm都可用于测量电信号。由于我们处理数字音频，所以我们主要关注两个措施：dBFS和dBSPL。

The first is dBFS, or decibels full scale. The highest possible level of sound produced by audio equipment is 0 dBFS. All other levels are expressed in negative numbers.
第一个是dBFS，或分贝满量程。 音频设备产生的最高声音级别为0 dBFS。 所有其他级别均以负数表示。

dBFS is described mathematically as:
dBFS在数学上描述为：

```
dBFS = 20 * log( [sample level] / [max level] )
```

The maximum dBFS value in a 16-bit audio system is:
16位音频系统中的最大dBFS值为：

```
max = 20 * log(1111 1111 1111 1111/1111 1111 1111 1111) = log(1) = 0
```

Note that the maximum dBFS value will always be 0 by definition, since log(1)=0. Similarly, the minimum dBFS value in the same system is:
请注意，由于log（1）= 0，最大dBFS值将始终为0。同样，同一系统中的最小dBFS值为：

```
min = 20 * log(0000 0000 0000 0001/1111 1111 1111 1111) = -96 dBFS
```

dBFS is a measure of gain, not volume. You can play a 0-dBFS signal through your stereo with the stereo gain set very low and hardly be able to hear anything. Conversely, you can play a −30-dBFS signal with the stereo gain maxed and blow your eardrums away.
dBFS是增益的量度，而不是音量。您可以通过立体声播放0dBFS信号，将立体声增益设置非常低，几乎无法听到任何声音。相反，也可以播放一个-30 dBFS信号，并将立体声增益调到最大，震破耳膜。

That said, you’ve probably heard someone describe the volume of a sound in decibels. Technically speaking, they were referring to dBSPL, or decibels relative to sound pressure level. Here, the reference point is 0.000002 newtons per square meter (roughly the sound of a mosquito flying 3 m away). There is no upper value to dBSPL, but in practice, we want to stay below levels of ear damage (~120 dBSPL) and well below the threshold of pain (~150 dBSPL). The Web Audio API does not use dBSPL, since the final volume of the sound depends on the OS gain and the speaker gain, and only deals with dBFS.
也就是说，你可能听说有人以分贝的形式描述声音的音量。在技​​术上来说，它们指的是dBSPL，或相对于声压级的分贝。在这里，参考点是每平方米0.000002牛顿（大概是3米远的蚊子的声音）。 dBSPL没有上限，但实际上，我们要保持低于耳朵损伤（〜120dBSPL）的水平，远低于疼痛阈值（〜150 dBSPL）。 Web Audio API 不使用 dBSPL ，并且仅处理 dBFS，因为声音的最终音量取决于操作系统的增益和扬声器增益。

The logarithmic definition of decibels correlates somewhat to the way our ears perceive loudness, but loudness is still a very subjective concept. Comparing the dB values of a sound and the same sound with a 2x gain, we can see that we’ve gained about 6 dB:
分贝的对数定义与我们的耳朵感知响度的方式有些相关，但响度仍然是一个非常主观的概念。将原始声音和通过2x增益的声音对比计算，可以计算出两者相差大约 6dB：

```
diff = 20 * log(2/2^16) - 20 * log(1/2^16) = 6.02 dB
```

Every time we add 6 dB or so, we actually double the amplitude of the signal. Comparing the sound at a rock concert (~110 dBSPL) to your alarm clock (~80 dBSPL), the difference between the two is (110 − 80)/6 dB, or roughly 5 times louder, with a gain multiplier of 2^5 = 32x. A volume knob on a stereo is therefore also calibrated to increase the amplitude exponentially. In other words, turning the volume knob by 3 units multiplies the amplitude of the signal roughly by a factor of 23 or 8 times. In practice, the exponential model described here is merely an approximation to the way our ears perceive loudness, and audio equipment manufacturers often have their own custom gain curves that are neither linear nor exponential.
每增加约 6dB，信号的幅度加倍。 将摇滚音乐会（〜110 dBSPL）的声音与闹钟（〜80 dBSPL）进行比较，两者之间的差异为（110 - 80）/ 6 dB，即大约为5倍，增益乘数为2^5 =32X。立体声音响上的音量旋钮通畅也被校准以指数地增加振幅。换句话说，把音量旋钮旋转3个单位，将使信号的幅度大致乘以2^3，即8倍。 在实践中，这里描述的指数模型仅仅是我们的耳朵感知响度的方式的近似，音频设备制造商通常具有既不是线性也不是指数的自己的定制增益曲线。


## Equal Power Crossfading 等功率交叠渐变

Often in a game setting, you have a situation where you want to crossfade between two environments that have different sounds associated with them. However, when to crossfade and by how much is not known in advance; perhaps it varies with the position of the game avatar, which is controlled by the player. In this case, we cannot do an automatic ramp.
通常在游戏设置中，通畅会有这样一种情况，即希望在具有不同声音的两个环境之间交叉淡入淡出。 但是，而什么时候交叉淡化，预先不知道多少;也许它随游戏角色的位置变化而变化，而角色又由玩家控制。 在这种情况下，就无法做自动过渡。

In general, doing a straightforward, linear fade will result in the following graph. It can sound unbalanced because of a volume dip between the two samples, as shown in Figure 3-2.
一般来说，一个简单的线性渐变如下图。由于两个采样之间的音量下降造成割裂，听起来会不平衡，如图3-2所示。

![Figure 3-2. A linear crossfade between two tracks](http://orm-chimera-prod.s3.amazonaws.com/1234000001552/images/waap_0302.png)

To address this issue, we use an equal power curve, in which the corresponding gain curves are neither linear nor exponential, and intersect at a higher amplitude (Figure 3-3). This helps avoid a dip in volume in the middle part of the crossfade, when both sounds are mixed together equally.
为了解决这个问题，我们使用等功率曲线，其中相应的增益曲线既不是线性的也不是指数型，并且以更高的幅度相交（图3-3）。这有助于避免在两个声音平等混合在一起时，交叉淡入淡出的中间部分会下降。

![Figure 3-3. An equal power crossfade sounds much better](http://orm-chimera-prod.s3.amazonaws.com/1234000001552/images/waap_0303.png)

The graph in Figure 3-3 can be generated with a bit of math:

```js
function equalPowerCrossfade(percent) {
  // Use an equal-power crossfading curve:
  var gain1 = Math.cos(percent * 0.5*Math.PI);
  var gain2 = Math.cos((1.0 - percent) * 0.5*Math.PI);
  this.ctl1.gainNode.gain.value = gain1;
  this.ctl2.gainNode.gain.value = gain2;
}
```

## Clipping and Metering 截幅和计量
Like images exceeding the boundaries of a canvas, sounds can also be clipped if the waveform exceeds its maximum level. The distinct distortion that this produces is obviously undesirable. Audio equipment often has indicators that show the magnitude of audio levels to help engineers and listeners produce output that does not clip. These indicators are called meters (Figure 3-4) and often have a green zone (no clipping), yellow zone (close to clipping), and red zone (clipping).
就像超过画布边界的图像会被剪切，如果声音的波形超过其最大值，其也可以被截幅。但截幅过程中导致的过于明显的失真明显变形显然是不合要求的。音频设备通常具有显示音频电平大小的指示器，以帮助工程师和听众避免输出到达截幅水平的音频。这些指标称为meters（图3-4），通常有绿色区域（无截幅），黄色区域（接近截幅）和红色区域（截幅）。

![Figure 3-4. A meter in a typical receiver](http://orm-chimera-prod.s3.amazonaws.com/1234000001552/images/waap_0304.png)

Clipped sound looks bad on a monitor and sounds no better. It’s important to listen for harsh distortions, or conversely, overly subdued mixes that force your listeners to crank up the volume. If you’re in either of these situations, read on!

## Using Meters to Detect and Prevent Clipping 

Since multiple sounds playing simultaneously are additive with no level reduction, you may find yourself in a situation where you are exceeding past the threshold of your speaker’s capability. The maximum level of sound is 0 dBFS, or 2^16, for 16-bit audio. In the floating point version of the signal, these bit values are mapped to [−1, 1]. The waveform of a sound that’s being clipped looks something like Figure 3-5. In the context of the Web Audio API, sounds clip if the values sent to the destination node lie outside of the range. It’s a good idea to leave some room (called headroom) in your final mix so that you aren’t too close to the clipping threshold.
由于同时播放的多个声音是相加的，没有降低电平，您可能会发现自己处于超过扬声器功能阈值的情况。对于16位音频，声音的最大音量为0 dBFS或 2^16。在信号的浮点版本中，这些位值映射到[-1,1]。正在剪辑的声音的波形看起来像图3-5所示。在 Web Audio API 的上下文中，如果发送到目的地节点的值超出了范围，则对声音截幅。

![Figure 3-5. A diagram of a waveform being clipped](http://orm-chimera-prod.s3.amazonaws.com/1234000001552/images/waap_0305.png)

In addition to close listening, you can check whether or not you are clipping your sound programmatically by putting a script processor node into your audio graph. Clipping may occur if any of the PCM values are out of the acceptable range. In this sample, we check both left and right channels for clipping, and if clipping is detected, save the last clipping time:
除了通过仔细聆听外辨别是否有截幅，还可以通过将脚本处理器节点放入音频图形来检查是否以编程方式对声音截幅度。如果任何 PCM 值超出可接受范围，可能会发生剪切。在此示例中，我们检查左右声道进行剪辑，如果检测到剪辑，则保存最后一个剪切时间：

```js
function onProcess(e) {
  var leftBuffer = e.inputBuffer.getChannelData(0);
  var rightBuffer = e.inputBuffer.getChannelData(1);
  checkClipping(leftBuffer);
  checkClipping(rightBuffer);
}

function checkClipping(buffer) {
  var isClipping = false;
  // Iterate through buffer to check if any of the |values| exceeds 1.
  for (var i = 0; i < buffer.length; i++) {
    var absValue = Math.abs(buffer[i]);
    if (absValue >= 1.0) {
      isClipping = true;
      break;
    }
  }
  this.isClipping = isClipping;
  if (isClipping) {
    lastClipTime = new Date();
  }
}
```

An alternative implementation of metering could poll a real-time analyzer in the audio graph for getFloatFrequencyData at render time, as determined by requestAnimationFrame (see Chapter 5). This approach is more efficient, but misses a lot of the signal (including places where it potentially clips), since rendering happens most at 60 times a second, whereas the audio signal changes far more quickly.
计量的另一种实现可以在renderAnimationFrame确定的渲染时轮询getFloatFrequencyData的音频图形中的实时分析器（参见第5章）。这种方法更有效率，但错过了很多信号（包括可能需要截幅度的地方），因为渲染最多是每秒60次，而音频信号变化更快。

The way to prevent clipping is to reduce the overall level of the signal. If you are clipping, apply some fractional gain on a master audio gain node to subdue your mix to a level that prevents clipping. In general, you should tweak gains to anticipate the worst case, but getting this right is more of an art than a science. In practice, since the sounds playing in your game or interactive application may depend on a huge variety of factors that are decided at runtime, it can be difficult to pick the master gain value that prevents clipping in all cases. For this unpredictable case, look to dynamics compression, which is discussed in “Dynamics Compression”.
防止截幅的方法是降低信号的整体水平。如果遇到了截幅，可以在主音频增益节点上应用一些减弱幅度的增益，将混音降低到防止截幅的级别。一般来说，应该事先调整增益以预测最坏的情况，这个过程与其说是科学，更多是一种艺术。实际上，由于在游戏或交互式应用程序中播放的声音可能取决于在运行时决定的各种各样的因素，因此很难得到一个让所有情况都不会发生截幅的主增益值。对于这种不可预知的情况，请查看动态压缩，这在“动态压缩”中进行了讨论。

## Understanding Dynamic Range 了解动态范围
In audio, dynamic range refers to the difference between the loudest and quietest parts of a sound. The amount of dynamic range in musical pieces varies greatly depending on genre. Classical music has large dynamic range and often features very quiet sections followed by relatively loud ones. Many popular genres like rock and electronica tend to have a small dynamic range, and are uniformly loud because of an apparent competition (known pejoratively as the “Loudness War”) to increase the loudness of tracks to meet consumer demands. This uniform loudness is generally achieved by using dynamic range compression.
在音频中，动态范围是指声音中最响亮和最安静的部分之间的差异。音乐作品中动态范围的大小根据流派而异。古典音乐具有较大的动态范围，通常具有非常安静的部分，其次是相对较大的部分。许多流行的类型，如摇滚和电子，倾向于具有较小的动态范围，并且由于明显的竞争（被称为“响度战争”），因而增加了音轨的响度以满足消费者需求，因而拥有较均匀的响度。这种均匀的响度通常通过使用动态范围压缩来实现。

That said, there are many legitimate uses of compression. Sometimes recorded music has such a large dynamic range that there are sections that sound so quiet or loud that the listener constantly needs to have a finger on the volume knob. Compression can quiet down the loud parts while making the quiet parts audible. Figure 3-6 illustrates a waveform (above), and then the same waveform with compression applied (below). You can see that the sound is louder overall, and there is less variance in the amplitude.
也就是说，压缩有很多合法用途。有时录制的音乐有如此大的动态范围，有些部分听起来很安静或响亮，听者经常需要在音量旋钮上放一个手指。压缩可以使响度过大的部分响度降低，同时使安静的部分听起来正常。图3-6说明了一个波形（上图），然后是相同的波形（应用压缩）（下图）。您可以看到声音整体响亮，振幅差异较小。

![Figure 3-6. The effects of dynamics compression](http://orm-chimera-prod.s3.amazonaws.com/1234000001552/images/waap_0306.png)

For games and interactive applications, you may not know beforehand what your sound output will look like. Because of games’ dynamic nature, you may have very quiet periods (e.g., stealthy sneaking) followed by very loud ones (e.g., a warzone). A compressor node can be helpful in suddenly loud situations for reducing the likelihood of clipping [see “Clipping and Metering”].
对于游戏和互动应用，很有可能不能预先知道输出的声音将是什么样子。由于游戏的动态性，可能会有先是非常安静的场景（例如隐身潜行），紧接着又是非常响亮的（例如战区）。压缩器节点可以在突然大声的情况下改善这种情况，以减少截幅的可能性[参见“剪切和计量”]。

Compressors can be modeled with a compression curve with several parameters, all of which can be tweaked with the Web Audio API. Two of the main parameters of a compressor are threshold and ratio. Threshold refers to the lowest volume at which a compressor starts reducing dynamic range. Ratio determines how much gain reduction is applied by the compressor. Figure 3-7 illustrates the effect of threshold and various compression ratios on the compression curve.
压缩器可以使用多个参数进行压缩曲线建模，所有这些参数都可以通过Web Audio API进行调整。 压缩器的两个主要参数是阈值和比值。阈值是指压缩器开始减小动态范围的最低音量。比值决定压缩器应用的增益减少量。 图3-7说明了阈值和各种压缩比对压缩曲线的影响。

![Figure 3-7. A sample compression curve with basic parameters](http://orm-chimera-prod.s3.amazonaws.com/1234000001552/images/waap_0307.png)

## Dynamics Compression 动态压缩

Compressors are available in the Web Audio API as DynamicsCompressorNodes. Using moderate amounts of dynamics compression in your mix is generally a good idea, especially in a game setting where, as previously discussed, you don’t know exactly what sounds will play and when. One case where compression should be avoided is when dealing with painstakingly mastered tracks that have been tuned to sound “just right” already, which are not being mixed with any other tracks.
压缩器在Web Audio API中可用作DynamicsCompressorNodes。 在您的混合中使用适量的动态压缩通常是一个好主意，特别是在游戏设置中，如前所述，您不知道什么声音将会播放和什么时候。 应该避免压缩的一个情况是处理已经进过精心调整并听起来刚刚好的音频，这些轨道不与其他轨道混合。

Implementing dynamic compression in the Web Audio API is simply a matter of including a dynamics compressor node in your audio graph, generally as the last node before the destination:
在Web Audio API中实现动态压缩只是在音频图形中包含一个动态压缩器节点，通常作为输出节点之前的最后一个节点：

```js
var compressor = context.createDynamicsCompressor();
mix.connect(compressor);
compressor.connect(context.destination);
```

The node can be configured with some additional parameters as described in the theory section, but the defaults are quite good for most purposes. For more information about configuring the compression curve, see the Web Audio API specification.




