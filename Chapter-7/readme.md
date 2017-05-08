# Chapter 7. Integrating with Other Technologies 与其他技术集成

The Web Audio API makes audio processing and analysis a fundamental part of the web platform. As a core building block for web developers, it is designed to play well with other technologies.
Web Audio API 使音频处理和分析成为Web平台的基本部分。作为Web开发人员的核心构架，它被设计为与其他技术一起发挥作用。

## Setting Up Background Music with the <audio> Tag 使用<audio>标签设置背景音乐

As I mentioned at the very start of the book, the <audio> tag has many limitations that make it undesirable for games and interactive applications. One advantage of this HTML5 feature, however, is that it has built-in buffering and streaming support, making it ideal for long-form playback. Loading a large buffer is slow from a network perspective, and expensive from a memory-management perspective. The <audio> tag setup is ideal for music playback or for a game soundtrack.
正如我在本书开头提到的那样，<audio>标签有很多限制，这使得它不适合游戏和交互式应用程序。但是，HTML5功能的一个优点是它具有内置的缓冲和对流的支持，使其成为长格式播放的理想选择。从网络的角度来看，加载大型缓冲区的速度很慢，而且从内存管理的角度看是非常昂贵的。 使用 <audio>标签是音乐播放或游戏配乐的理想选择。

Rather than going the usual path of loading a sound directly by issuing an XMLHttpRequest and then decoding the buffer, you can use the media stream audio source node (MediaElementAudioSourceNode) to create nodes that behave much like audio source nodes (AudioSourceNode), but wrap an existing <audio> tag. Once we have this node connected to our audio graph, we can use our knowledge of the Web Audio API to do great things. This small example applies a low-pass filter to the <audio> tag:
您可以使用媒体流音频源节点（MediaElementAudioSourceNode）创建与音频源节点（AudioSourceNode）非常相似的节点，而不是直接通过发出XMLHttpRequest直接加载声音，然后解码缓冲区，而是包装现有的<audio>标签。一旦我们将这个节点连接到我们的音频图上，我们可以使用我们对Web Audio API的知识来处理音频。下面的例子显示使用低通滤波器应用于<audio>标签：

```js
window.addEventListener('load', onLoad, false);

function onLoad() {
  var audio = new Audio();
  source = context.createMediaElementSource(audio);
  var filter = context.createBiquadFilter();
  filter.type = filter.LOWPASS;
  filter.frequency.value = 440;

  source.connect(this.filter);
  filter.connect(context.destination);
  audio.src = 'http://example.com/the.mp3';
  audio.play();
}
```








