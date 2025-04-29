import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Product } from '../models/product';

@Injectable()
export class ProductService {
    private apiUrl = 'http://localhost:3000/products'; // JSON Server API URL

    constructor(private http: HttpClient) { }

    getProducts(): Observable<Array<Product>> {
        return this.http.get<Product[]>(this.apiUrl).pipe(
            tap((data: Product[]) => console.log('Product data retrieved:', data.length)), // Log inline
            catchError((err) => {
                console.error('Error retrieving products:', err); // Handle error inline
                return throwError(() => new Error('Failed to retrieve products')); // Throw a new error
            })
        );
    }

    getProductById(id: string): Observable<Product> {
        return this.http.get<Product>(`${this.apiUrl}/${id}`).pipe(
            tap((data: Product) => console.log('Product data retrieved:', data)), // Log inline
            catchError((err) => {
                console.error('Error retrieving product:', err); // Handle error inline
                return throwError(() => new Error('Failed to retrieve product')); // Throw a new error
            })
        );
    }

    createProduct(product: Product): Observable<Product> {
        return this.http.post<Product>(this.apiUrl, product).pipe(
            tap((data: Product) => console.log('Product data created:', data)), // Log inline
            catchError((err) => {
                console.error('Error creating product:', err); // Handle error inline
                return throwError(() => new Error('Failed to create product')); // Throw a new error
            })
        );
    }

    updateProduct(product: Product): Observable<Product> {
        return this.http.put<Product>(`${this.apiUrl}/${product.id}`, product).pipe(
            tap((data: Product) => console.log('Product updated:', data)), // Log inline
            catchError((err) => {
                console.error('Error updating product:', err); // Handle error inline
                return throwError(() => new Error('Failed to update product')); // Throw a new error
            })
        );
    }

    deleteProduct(productId: string): Observable<any> {
        return this.http.delete<Product>( `${this.apiUrl}/${productId}`).pipe(
            tap((data: Product) => console.log('Product deleted:', data)), // Log inline
            catchError((err) => {
                console.error('Error deleting product:', err); // Handle error inline
                return throwError(() => new Error('Failed to delete product')); // Throw a new error
            })
        );
    }
}