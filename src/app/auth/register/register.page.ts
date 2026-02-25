import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { email, form, FormField, minLength, required, schema, validate } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonRouterLink,
  IonRow,
  IonTitle,
  IonToolbar,
  NavController,
  ToastController,
} from '@ionic/angular/standalone';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    FormField,
    RouterLink,
    IonRouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonInput,
    IonIcon,
    IonImg,
    IonButton,
    IonGrid,
    IonRow,
    IonCol,
    IonLabel,
  ],
})
export class RegisterPage {
  usermodel = signal({
    name: '',
    password: '',
    password2: '',
    email: '',
    avatar: '',
  });

  userForm = form(this.usermodel, schema => {
    required(schema.name);
    required(schema.password);
    required(schema.password2);
    required(schema.email);
    required(schema.avatar);
    minLength(schema.password, 4);

    email(schema.email);
    validate(schema.password2, ({value, valueOf}) => {
      const password = valueOf(schema.password);
      if (value() !== password) {
        return {
          kind: 'sameAs',
          message: 'Passwords are not equal'
        }
      }
      return null;
    })
  });
  

  #authService = inject(Auth);
  #toastCtrl = inject(ToastController);
  #nav = inject(NavController);
  #changeDetector = inject(ChangeDetectorRef);

  register(event: Event) {
    event.preventDefault();
    this.#authService.register(this.usermodel()).subscribe(async () => {
      (
        await this.#toastCtrl.create({
          duration: 3000,
          position: 'bottom',
          message: 'User registered!',
        })
      ).present();
      this.#nav.navigateRoot(['/auth/login']);
    });
  }

  async takePhoto() {
    const photo = await Camera.getPhoto({
      source: CameraSource.Camera,
      quality: 90,
      height: 640,
      width: 640,
      allowEditing: true,
      resultType: CameraResultType.DataUrl, // Base64 (url encoded)
    });

    this.userForm.avatar().setControlValue(photo.dataUrl as string);
    this.#changeDetector.markForCheck();
  }

  async pickFromGallery() {
    const photo = await Camera.getPhoto({
      source: CameraSource.Photos,
      height: 640,
      width: 640,
      allowEditing: true,
      resultType: CameraResultType.DataUrl, // Base64 (url encoded)
    });

    this.userForm.avatar().setControlValue(photo.dataUrl as string);
    this.#changeDetector.markForCheck();
  }
}
