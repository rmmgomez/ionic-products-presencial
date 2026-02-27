import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  ToastController,
  IonButtons,
  IonItem,
  IonList,
  IonIcon,
  IonMenuButton,
  IonLabel,
  IonButton,
  IonImg,
  IonGrid,
  IonRow,
  IonCol,
  IonInput,
} from '@ionic/angular/standalone';
import { Camera, CameraSource, CameraResultType } from '@capacitor/camera';
import { Product } from '../interfaces/product';
import { Products } from '../services/products';
import { Router, RouterLink } from '@angular/router';
import { form, required, minLength, email, validate, min, FormField } from '@angular/forms/signals';

@Component({
  selector: 'product-form',
  templateUrl: './product-form.page.html',
  styleUrls: ['./product-form.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonButtons,
    IonItem,
    IonList,
    IonIcon,
    IonMenuButton,
    IonLabel,
    IonButton,
    IonImg,
    IonGrid,
    IonRow,
    IonCol,
    RouterLink,
    IonInput,
    FormField
],
})
export class ProductFormPage {
  constructor(private router: Router) {}

  productModel = signal({
    description: '',
    price: 0,
    imageUrl: '',
  });

  productForm = form(this.productModel, schema => {
    required(schema.description);
    required(schema.price);
    required(schema.imageUrl);
    min(schema.price, 0.01);
  });

  #productsService = inject(Products);
  #toastCtrl = inject(ToastController);
  #changeDetector = inject(ChangeDetectorRef);

  addProduct() {
    this.#productsService.addProduct(this.productModel()).subscribe({
      next: async (prod) => {
        (
          await this.#toastCtrl.create({
            position: 'bottom',
            duration: 3000,
            message: 'Product added succesfully',
            color: 'success',
          })
        ).present();
        this.router.navigate(['/products']);
      },
      error: async (error) =>
        (
          await this.#toastCtrl.create({
            position: 'bottom',
            duration: 3000,
            message: 'Error adding product',
          })
        ).present(),
    });
  }

  async takePhoto() {
    const photo = await Camera.getPhoto({
      source: CameraSource.Camera,
      quality: 90,
      height: 640,
      width: 640,
      // allowEditing: true,
      resultType: CameraResultType.DataUrl, // Base64 (url encoded)
    });

    this.productForm.imageUrl().setControlValue(photo.dataUrl as string);
    this.#changeDetector.markForCheck();
  }

  async pickFromGallery() {
    const photo = await Camera.getPhoto({
      source: CameraSource.Photos,
      height: 640,
      width: 640,
      //allowEditing: true,
      resultType: CameraResultType.DataUrl, // Base64 (url encoded)
    });

    this.productForm.imageUrl().setControlValue(photo.dataUrl as string);
    this.#changeDetector.markForCheck();
  }
}
