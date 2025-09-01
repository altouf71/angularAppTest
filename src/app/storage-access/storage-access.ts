import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-storage-access',
  imports: [CommonModule],
  templateUrl: './storage-access.html',
  styleUrl: './storage-access.scss'
})

export class StorageAccess {

  accessStatus: string = '';
  viewStatus: boolean = true;
  loginError: string = '';
  
      /*
      async requestAccess(): Promise<void> {
        try {
          // Check if access is already granted
          const hasAccess = await document.hasStorageAccess();
          if (hasAccess) {
            this.accessStatus = 'Storage access already granted.';
            return;
          }

          // Request access if not already granted
          await document.requestStorageAccess();
          this.accessStatus = 'Storage access granted!';
        } catch (error) {
          this.accessStatus = `Storage access denied: ${error instanceof Error ? error.message : 'Unknown error'}`;
        }
      }
      

      changerView(){

        this.viewStatus = !this.viewStatus;

      }
*/


// ...existing code...

showConsent = false;
userConsent = false;

ngOnInit() {
  // Check if consent is already given
  const consent = localStorage.getItem('userConsent');
  this.userConsent = consent === 'false';
  this.showConsent = !this.userConsent;
}

approveConsent() {
  this.userConsent = true;
  localStorage.setItem('userConsent', 'true');
  this.showConsent = false;
  // Now you can safely use localStorage/cookies
}

declineConsent() {
  this.userConsent = false;
  localStorage.setItem('userConsent', 'false');
  this.showConsent = false;
  // Avoid using localStorage/cookies for this session
}

// Example usage:
login() {
  if (!this.userConsent) {
    this.loginError = 'Please approve cookies/local storage to continue.';
    return;
  }
  // ...existing login logic...
}

// ...existing code...


}
