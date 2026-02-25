import { HttpClient, httpResource } from '@angular/common/http';
import { computed, inject, Injectable, Signal } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Product } from '../interfaces/product';
import { Comment } from '../interfaces/comment';
import {
  ProductsResponse,
  SingleProductResponse,
  SingleCommentResponse,
  CommentsResponse,
} from '../interfaces/responses';

@Injectable({
  providedIn: 'root',
})
export class Products {
  #http = inject(HttpClient);

  getProductsResource() {
    return httpResource<ProductsResponse>(() => 'products');
  }

  getProductIdResource(id: Signal<number>) {
    return httpResource<SingleProductResponse>(
      () => (id() ? `products/${id()}` : undefined), // Cuando es undefined no lanza petición http
    );
  }

  getProductsSearchResource(search: Signal<string>) {
    const queryParams = computed(() =>
      new URLSearchParams({ search: search() }).toString(),
    );
    return httpResource<ProductsResponse>(() => `products?${queryParams()}`);
  }

  addProduct(prod: Product): Observable<Product> {
    return this.#http
      .post<SingleProductResponse>('products', prod)
      .pipe(map((resp) => resp.product));
  }

  deleteProduct(idProd: number): Observable<void> {
    return this.#http.delete<void>(`products/${idProd}`);
  }

  addComment(idProd: number, comment: string): Observable<Comment> {
    return this.#http
      .post<SingleCommentResponse>(`products/${idProd}/comments`, {
        text: comment,
      })
      .pipe(map((resp) => resp.comment));
  }

  getCommentsResource(id: Signal<number>) {
    return httpResource<CommentsResponse>(
      () => (id() ? `products/${id()}/comments` : undefined), // Cuando es undefined no lanza petición http
    );
  }
}
