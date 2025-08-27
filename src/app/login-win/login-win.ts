import { Component, HostBinding, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleLogin } from '../google-login/google-login';


import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
  selector: 'app-login-win',
  /*
    animations: [
    trigger('openClose', [

      state(
        'open',
        style({
          height: '200px',
          opacity: 1,
          backgroundColor: 'yellow',
        }),
      ),
      state(
        'closed',
        style({
          height: '100px',
          opacity: 0.8,
          backgroundColor: 'blue',
        }),
      ),
      transition('open => closed', [animate('1s')]),
      transition('closed => open', [animate('0.5s')]),
      transition('* => *', [animate('0.5s')]),
    ]),
  ],
  */
  imports: [CommonModule, GoogleLogin],
  templateUrl: './login-win.html',
  styleUrl: './login-win.scss'
})

export class LoginWin {

    //animationState = "";
    animationState = 'animated-idel';
    navAnimationState = 'nav-animated-idel';
    isAnimating = false;
    navViewState = false;
    logViewState = false;

  toggleAnimation() {

    //this.animationState = this.animationState === 'bounce-in' ? 'bounce-out' : 'bounce-out';

    this.isAnimating = !this.isAnimating;
  }

  animationClass() {

    if(this.navAnimationState === 'nav-animated-out'){
      this.navAnimationState = 'nav-animated-in';
    }

    this.logViewState = !this.logViewState;

    //this.animationState = ?  'bounce-in' ? 'bounce-out' : 'bounce-out';
    //this.animationState = this.animationState ? 'bounce-out' : 'bounce-in'; // If isActive is true, set to false; otherwise, set to true.
    this.animationState = this.animationState === 'animated-out' ? 'animated-in' : 'animated-out';

  }



  navAnimationClass() {

    if(this.animationState === 'animated-out'){
      this.animationState = 'animated-in';
    }

    this.navViewState = !this.navViewState;

    //this.animationState = ?  'bounce-in' ? 'bounce-out' : 'bounce-out';
    //this.animationState = this.animationState ? 'bounce-out' : 'bounce-in'; // If isActive is true, set to false; otherwise, set to true.
    this.navAnimationState = this.navAnimationState === 'nav-animated-out' ? 'nav-animated-in' : 'nav-animated-out';

  }


  openNav(){}

  closeNav(){}

}
