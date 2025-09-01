import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {

    animationState = 'animated-idel';
    navAnimationState = 'nav-animated-idel';
    produitAnimationState = 'produit-animated-idel';
    isAnimating = false;
    navViewState = false;
    logViewState = false;
    produitViewState = false;




    
    toggleAnimation() {

    //this.animationState = this.animationState === 'bounce-in' ? 'bounce-out' : 'bounce-out';

    this.isAnimating = !this.isAnimating;
  }

  animationClass() {

    if(this.navAnimationState === 'nav-animated-out'){
      this.navAnimationState = 'nav-animated-in';
    }else if(this.produitAnimationState === 'produit-animated-out'){
      this.produitAnimationState = 'produit-animated-in';
    }

    this.logViewState = !this.logViewState;

    this.animationState = this.animationState === 'animated-out' ? 'animated-in' : 'animated-out';

  }



  navAnimationClass() {

    if(this.animationState === 'animated-out'){
      this.animationState = 'animated-in';
    }else if(this.produitAnimationState === 'produit-animated-out'){
      this.produitAnimationState = 'produit-animated-in';
    }

    this.navViewState = !this.navViewState;

    this.navAnimationState = this.navAnimationState === 'nav-animated-out' ? 'nav-animated-in' : 'nav-animated-out';

  }


    produitAnimationClass() {

    if(this.animationState === 'animated-out'){
      this.animationState = 'animated-in';
    }else if(this.navAnimationState === 'nav-animated-out'){
      this.navAnimationState = 'nav-animated-in';
    }

    this.produitViewState = !this.produitViewState;

    this.produitAnimationState = this.produitAnimationState === 'produit-animated-out' ? 'produit-animated-in' : 'produit-animated-out';

  }


  openNav(){}

  closeNav(){}


}
