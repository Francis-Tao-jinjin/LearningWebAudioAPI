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

## Live Audio Input 实时音频输入

One highly requested feature of the Web Audio API is integration with getUserMedia, which gives browsers access to the audio/video stream of connected microphones and cameras. At the time of this writing, this feature is available behind a flag in Chrome. To enable it, you need to visit about:flags and turn on the “Web Audio Input” experiment, as in Figure 7-1.

![Figure 7-1. Enabling web audio input in Chrome](http://orm-chimera-prod.s3.amazonaws.com/1234000001552/images/waap_0701.png)

Once this is enabled, you can use the MediaStreamSourceNode Web Audio node. This node wraps around the audio stream object that is available once the stream is established. This is directly analogous to the way that MediaElementSourceNodes wrap <audio> elements. In the following sample, we visualize the live audio input that has been processed by a notch filter:
启用此功能后，可以使用 MediaStreamSourceNode Web Audio 节点。 一旦流建立，该节点将包围可用的音频流对象。 这与MediaElementSourceNodes包装<audio>元素的方式直接相似。 在下面的示例中，我们可视化由陷波滤波器处理的实况音频输入：

```js
function getLiveInput() {
  // Only get the audio stream.
  navigator.webkitGetUserMedia({audio: true}, onStream, onStreamError);
};

function onStream(stream) {
  // Wrap a MediaStreamSourceNode around the live input stream.
  var input = context.createMediaStreamSource(stream);
  // Connect the input to a filter.
  var filter = context.createBiquadFilter();
  filter.frequency.value = 60.0;
  filter.type = filter.NOTCH;
  filter.Q = 10.0;

  var analyser = context.createAnalyser();

  // Connect graph.
  input.connect(filter);
  filter.connect(analyser);

  // Set up an animation.
  requestAnimationFrame(render);
};

function onStreamError(e) {
  console.error(e);
};

function render() {
  // Visualize the live audio input.
  requestAnimationFrame(render);
};
```

Another way to establish streams is based on a WebRTC PeerConnection. By bringing a communication stream into the Web Audio API, you could, for example, spatialize multiple participants in a video conference.
建立流的另一种方法是基于 WebRTC PeerConnection 。 通过将通信流引入 Web Audio API ，您可以将视频会议中的多个参与者进行空间化。

## Page Visibility and Audio Playback 页面可见性和音频播放

Whenever you develop a web application that involves audio playback, you should be cognizant of the state of the page. The classic failure mode here is that one of many tabs is playing sound, but you have no idea which one it is. This may make sense for a music player application, in which you want music to continue playing regardless of the visibility of the page. However, for a game, you often want to pause gameplay (and sound playback) when the page is no longer in the foreground.
每当您开发涉及音频播放的Web应用程序时，您应该了解页面的状态。这里的经典故障模式是，许多选项卡中的一个播放声音，但您不知道它是哪一个。这对于音乐播放器应用程序来说可能是有意义的，您希望音乐继续播放，而不管页面的可见性如何。但是，对于游戏来说，当页面不再位于前景时，您经常要暂停游戏（和声音播放）。

Luckily, the Page Visibility API provides functionality to detect when a page becomes hidden or visible. The state can be determined from the Boolean document.hidden property. The event that fires when the visibility changes is called visibilitychange. Because the API is still considered to be experimental, all of these names are webkit-prefixed. With this in mind, the following code will stop a source node when a page becomes hidden, and resume it when the page becomes visible:
幸运的是，页面可见性API提供了检测页面何时隐藏或可见的功能。状态可以从布尔document.hidden属性确定。当可见性更改时触发的事件称为可见性更改。因为API仍被认为是实验性的，所有这些名称都有webkit前缀。考虑到这一点，当页面变为隐藏时，以下代码将停止源节点的播放，并在页面变为可见时恢复它：

```js
// Listen to the webkitvisibilitychange event.
document.addEventListener('webkitvisibilitychange', onVisibilityChange);

function onVisibilityChange() {
  if (document.webkitHidden) {
    source.stop(0);
  } else {
    source.start(0);
  }
}
```









