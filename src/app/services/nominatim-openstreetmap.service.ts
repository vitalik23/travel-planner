import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class NominatimOpenstreetmapService {
    private readonly apiUrl = 'https://nominatim.openstreetmap.org';
    
    constructor(private http: HttpClient) { }

    public searchCities(query: string, limit: number = 5) {
        return this.http.get(`${this.apiUrl}/search?q=${query}&format=json&limit=${limit}`);
    }

    public searchPlaces(query: string, limit: number = 10) {
        return this.http.get(`${this.apiUrl}/search?q=${query}&format=json&limit=${limit}`);
    }
}
