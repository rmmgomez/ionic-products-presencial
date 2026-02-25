import { Component, OnInit, effect, inject, linkedSignal, signal, untracked, viewChild } from '@angular/core';
import { NavController, ActionSheetController, IonRouterLink, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonRefresher, IonRefresherContent, IonFab, IonFabButton, IonIcon, IonList, IonItem, IonThumbnail,IonLabel, IonButton } from '@ionic/angular/standalone';
import { Products } from '../services/products';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { Product } from '../interfaces/product';

@Component({
  selector: 'home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [CurrencyPipe, RouterLink, IonRouterLink, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonRefresher, IonRefresherContent, IonFab, IonFabButton, IonIcon, IonList, IonItem, IonThumbnail,IonLabel, IonButton]
})
export class HomePage {
  #productsService = inject(Products);
  #navController = inject(NavController);
  #actionSheetCtrl =inject(ActionSheetController);

  ionRefresher = viewChild.required(IonRefresher)

  productsResource = this.#productsService.getProductsResource();
  products = linkedSignal(() => this.productsResource.value()?.products || []);

  constructor() {
    effect(() => {
      if(!this.productsResource.isLoading()) {
        untracked(() => this.ionRefresher().complete());
      }
    });
  }

  ionViewWillEnter() {
    this.reloadProducts();
  }

  reloadProducts(refresher?: IonRefresher) {
    if(!this.productsResource.isLoading()) {
      this.productsResource.reload();
    }
  }

  async showOptions(prod: Product) {
    const actSheet = await this.#actionSheetCtrl.create({
      header: prod.description,
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.#productsService
              .deleteProduct(prod.id!)
              .subscribe(() =>
                this.products.update(prods => prods.filter(p => p !== prod))
              );
          },
        },
        {
          text: 'See details',
          icon: 'eye',
          handler: () => {
            this.#navController.navigateForward(['/products', prod.id]);
          },
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
        },
      ],
    });

    actSheet.present();
  }
}
