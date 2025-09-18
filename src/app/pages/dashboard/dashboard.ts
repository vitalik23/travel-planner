import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { NominatimOpenstreetmapService } from '../../services/nominatim-openstreetmap.service';
import { BehaviorSubject, catchError, of, tap, takeUntil, Subscription } from 'rxjs';
import { PlannerService } from '../../services/planner.service';
import { CommonModule } from '@angular/common';
import { CityItem } from '../../components/city/city-item/city-item';
import { City } from '../../models/cities/city.model';

@Component({
  selector: 'dashboard',
  imports: [AutoCompleteModule, FormsModule, CommonModule, CityItem],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit, OnDestroy {

  public city: string;
  public cities$ = new BehaviorSubject<City[]>([]);
  public selectedCities$ = new BehaviorSubject<City[]>([]);

  private selectedCitiesSubscription: Subscription;

  constructor(
    private nominatimOpenstreetmapService: NominatimOpenstreetmapService,
    private plannerService: PlannerService
  ) { }

  ngOnInit(): void {
    this.selectedCitiesSubscription = this.plannerService.getCities$()
      .subscribe(cities => {
        this.selectedCities$.next(cities);
      });
  }

  ngOnDestroy(): void {
    this.selectedCitiesSubscription.unsubscribe();
  }

  public onCompleteMethod(text: string): void {
    this.nominatimOpenstreetmapService.searchCities(text).pipe(
      tap((cities: any) => {
        if (cities.length == 0) {
          this.onClear();
          return;
        }
        const mappedCities = cities.map((city: any) => ({
          id: city.place_id,
          displayName: city.display_name,
          name: city.name
        }));
        this.cities$.next(mappedCities);
      }),
      catchError(() => {
        this.cities$.next([]);
        return of([]);
      })
    ).subscribe();
  }
  
  public onLocationSelect(city: City): void {
    this.plannerService.addCity(city);
    this.city = '';
  }
  
  public onClear(): void {
    this.cities$.next([]);
  }
}
