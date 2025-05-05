import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { ProductHistory } from '../models/product-history';


@Injectable()
export class ProductHistoryService {
    private apiUrl = 'http://localhost:3000/productHistory'; // JSON Server API URL

    constructor(private http: HttpClient) { }

    getProductHistoryByProductId(productId: string): Observable<Array<ProductHistory>> {
        return this.http.get<ProductHistory[]>(`${this.apiUrl}?productId=${productId}`).pipe(
            tap((data: ProductHistory[]) => console.log('Product history data retrieved:', data.length)), // Log inline
            catchError((err) => {
                console.error('Error retrieving products history:', err); // Handle error inline
                return throwError(() => new Error('Failed to retrieve products history')); // Throw a new error
            })
        );
    }

    createProductHistory(product: ProductHistory): Observable<ProductHistory> {
        return this.http.post<ProductHistory>(this.apiUrl, product).pipe(
            tap((data: ProductHistory) => console.log('Product history data created:', data)), // Log inline
            catchError((err) => {
                console.error('Error creating product history:', err); // Handle error inline
                return throwError(() => new Error('Failed to create product history')); // Throw a new error
            })
        );
    }
}