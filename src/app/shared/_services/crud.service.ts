import { Injectable, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { Http } from '@angular/http';

@Injectable()
/**
 * Servicio genérico para operaciones CRUD simples
 * */
export class CrudService {
    public apiEndPoint = '';

    constructor(protected http: Http) { }

    /** Reads the full list of items */
    get(): Observable<any> {
        return this.http
            .get(this.apiEndPoint);
    }

    /** Reads an item by its primary key */
    getById(id: string): Observable<any> {
        return this.http
            .get(this.apiEndPoint + '/' + id);
    }

    /** Update or create a new item */
    save(item: any): Observable<any> {
        if (item.id) {
            return this.put(item.id, item);
        } else {
            return this.post(item);
        }
    };
    /** Create */
    post(item: any): Observable<any> {
        return this.http
            .post(this.apiEndPoint, item);
    };
    /** Update */
    put(id: string, item: any): Observable<any> {
        return this.http
            .post(this.apiEndPoint + '/' + id, item);
    };

    /** Delete */
    delete(id: string): Observable<any> {
        return this.http
            .delete(this.apiEndPoint + '/' + id);
    };
}
