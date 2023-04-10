import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';

enum KeyCode {
  LEFT = 'ArrowLeft',
  RIGHT = 'ArrowRight',
  SPACE = 'Space',
}

@Component({
  selector: 'app-mon-composant',
  template: `
    <canvas #myCanvas width="500" height="500"></canvas>
  `,
  templateUrl: './mon-composant.component.html',
  styleUrls: ['./mon-composant.component.scss']
})
export class MonComposantComponent implements OnInit, AfterViewInit {
  cubeX = 0;
  cubeY = 200;
  jumpVelocity = 0;
  velocityX = 0;
  acceleration = 1;

  @ViewChild('myCanvas') myCanvas!: ElementRef<HTMLCanvasElement>;
  ctx!: CanvasRenderingContext2D;

  constructor(private readonly elementRef: ElementRef) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    const canvas = this.myCanvas.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.drawGround();
    this.drawCube(this.cubeX, this.cubeY);
  }

  drawGround() {
    if (this.ctx) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, 250);
      this.ctx.lineTo(500, 250);
      this.ctx.stroke();
    }
  }

  drawCube(x: number, y: number) {
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      this.drawGround();
      this.ctx.fillRect(x, y, 50, 50);
      if (y < 200) {
        window.requestAnimationFrame(() => {
          this.drawCube(x, y + 5);
        });
      }
    }
  }

  moveCube(event: KeyboardEvent) {
    switch (event.code) {
      case KeyCode.LEFT:
        this.acceleration = -1;
        break;
      case KeyCode.RIGHT:
        this.acceleration = 1;
        break;
      case KeyCode.SPACE:
        if (this.cubeY === 200) {
          this.jumpVelocity = -20;
        }
        break;
    }

    if (this.acceleration === 0) {
      this.velocityX *= 0.9;
    } else {
      this.velocityX += this.acceleration;
      this.velocityX = Math.min(Math.max(this.velocityX, -10), 10);
    }

    this.cubeX += this.velocityX;

    this.cubeY += this.jumpVelocity;
    this.jumpVelocity += 1;

    if (this.cubeY > 200) {
      this.cubeY = 200;
      this.jumpVelocity = 0;
    }

    this.drawCube(this.cubeX, this.cubeY);
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    this.moveCube(event);
  }

  @HostListener('window:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    switch (event.code) {
      case KeyCode.LEFT:
      case KeyCode.RIGHT:
        this.acceleration = 0;
        break;
    }
  }
}