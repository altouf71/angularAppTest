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
      */

      changerView(){

        this.viewStatus = !this.viewStatus;

      }

}
