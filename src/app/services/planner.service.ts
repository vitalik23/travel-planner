import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import { Place } from '../models/places/place.model';
import { City } from '../models/cities/city.model';

@Injectable({
    providedIn: 'root'
})
export class PlannerService {
    private readonly STORAGE_KEY = 'travel-planner';
    private citiesCache: City[] = [];
    private cities$ = new BehaviorSubject<City[]>([]);

    constructor(private localStorageService: LocalStorageService) {
        this.citiesCache = this.loadData();
        this.cities$.next(this.citiesCache);
    }

    public getCities$(): Observable<City[]> {
        return this.cities$;
    }

    public addCity(city: City): void {
        if (this.citiesCache.some(c => c.id === city.id)) return;

        this.citiesCache = [...this.citiesCache, city];
        this.saveData();
        this.cities$.next(this.citiesCache);
    }

    public removeCity(cityId: string): void {
        this.citiesCache = this.citiesCache.filter(c => c.id !== cityId);
        this.saveData();
        this.cities$.next(this.citiesCache);
    }

    public addPlace(cityId: string, place: Place): void {
        const city = this.citiesCache.find(c => c.id === cityId);
        if (!city) return;

        if (!city.places) {
            city.places = [];
        }

        city.places = [...city.places, place];
        this.saveData();
        this.cities$.next(this.citiesCache);
    }

    public removePlace(cityId: string, placeId: string) {
        const city = this.citiesCache.find(c => c.id === cityId);
        if (!city) return;

        city.places = city.places.filter(p => p.id !== placeId);
        this.saveData();
        this.cities$.next(this.citiesCache);
    }

    public editPlace(cityId: string, placeId: string, updatedPlace: Place): void {
        const city = this.citiesCache.find(c => c.id === cityId);
        if (!city) return;

        const placeIndex = city.places.findIndex(p => p.id === placeId);
        if (placeIndex === -1) return;

        city.places[placeIndex] = { ...updatedPlace, id: placeId };
        this.saveData();
        this.cities$.next(this.citiesCache);
    }

    public getPlace(cityId: string, placeId: string): Place | null {
        const city = this.citiesCache.find(c => c.id === cityId);
        if (!city) return null;

        return city.places.find(p => p.id === placeId) || null;
    }

    public clearAll() {
        this.localStorageService.removeItem(this.STORAGE_KEY);
    }

    private saveData(): void {
        this.localStorageService.setItem(this.STORAGE_KEY, JSON.stringify(this.citiesCache));
    }

    private loadData(): City[] {
        const data = this.localStorageService.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    }
}
