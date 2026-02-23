import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AlertController, IonButton, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonList, IonRouterLink, IonRow, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Auth } from '../services/auth';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [FormsModule, RouterLink, IonRouterLink, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonInput, IonGrid, IonRow, IonCol, IonButton, IonIcon]
})
export class LoginPage {
  email = '';
  password = '';

  #authService = inject(Auth);
  #alertCtrl = inject(AlertController);
  // #navCtrl = inject(NavController);

  login() {
    this.#authService
      .login(this.email, this.password)
      .subscribe({
        // next: () => this.#navCtrl.navigateRoot(['/products']),
        error: async (error) => {
          (
            await this.#alertCtrl.create({
              header: 'Login error',
              message: 'Incorrect email and/or password',
              buttons: ['Ok'],
            })
          ).present();
        },
      });
  }
}
