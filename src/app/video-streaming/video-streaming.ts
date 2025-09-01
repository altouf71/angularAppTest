import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-video-streaming',
  imports: [],
  templateUrl: './video-streaming.html',
  styleUrl: './video-streaming.scss'
})
export class VideoStreaming {
    videoSrc = 'http://localhost:4200/video'; // URL of your Node.js video stream
    private ws: WebSocket | undefined;

  ngOnInit() {
    this.startCamera();
  }



    async startCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    const video: HTMLVideoElement = document.querySelector('video')!;
    video.srcObject = stream;
    video.play();

    // Send video chunks to server
    this.ws = new WebSocket('ws://localhost:4000');
    const recorder = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp8' });

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0 && this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(event.data);
      }
    };

    recorder.start(100); // Send every 100ms
  }


}
