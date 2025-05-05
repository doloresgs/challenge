import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Category } from '../models/category';

@Injectable()
export class CategoryService {

    constructor(private http: HttpClient) { }

    getCategories(): Observable<Array<Category>> {
        return this.http.get<any>('/assets/categories.json').pipe(
            tap((data: Category[]) => console.log('Categories data retrieved:', data.length)), // Log inline
            catchError((err) => {
                console.error('Error retrieving categories:', err); // Handle error inline
                return throwError(() => new Error('Failed to retrieve categories')); // Throw a new error
            })
        );
    }
}