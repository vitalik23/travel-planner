import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NominatimOpenstreetmapService } from '../../../services/nominatim-openstreetmap.service';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { Place } from '../../../models/places/place.model';
import { BehaviorSubject, catchError, of, tap } from 'rxjs';
import { Button } from 'primeng/button';
import { City } from '../../../models/cities/city.model';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'place-form',
  imports: [
    InputTextModule, 
    DatePickerModule, 
    SelectModule, 
    FormsModule, 
    AutoCompleteModule, 
    Button,
    ReactiveFormsModule,
    AsyncPipe
  ],
  templateUrl: './place-form.html',
  styleUrl: './place-form.scss'
})
export class PlaceForm implements OnInit {

  @Input() public city: City;
  @Input() public place: Place;
  @Output() public onClose: EventEmitter<void> = new EventEmitter<void>();
  @Output() public onSave: EventEmitter<Place> = new EventEmitter<Place>();

  public hours: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
  public places$: BehaviorSubject<Place[]> = new BehaviorSubject<Place[]>([]);
  public placeForm: FormGroup;
  public isEditMode: boolean = false;

  constructor(
    private nominatimOpenstreetmapService: NominatimOpenstreetmapService, 
    private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.isEditMode = this.place !== null;
    this.initForm();
  }

  public onCompleteMethod(text: string): void {
    const query = `${text}+${this.city.name}`;
    this.nominatimOpenstreetmapService.searchPlaces(query)
      .pipe(
        tap((places: any) => {
          if (places.length == 0) {
            this.places$.next([]);
            return;
          }
          const mappedPlaces = places.map((place: any) => ({
            id: place.place_id,
            name: place.name,
            displayName: place.display_name
          }));
          this.places$.next(mappedPlaces);
        }),
        catchError(() => {
          this.places$.next([]);
          return of([]);
        })
      ).subscribe();
  }
  
  public onLocationSelect(place: Place): void {
    this.placeForm.patchValue({
      displayName: place.displayName,
      name: place.name,
      id: place.id
    });
  }

  public onSavePlace(): void {
    if (this.placeForm.valid) {
      const formValue = this.placeForm.getRawValue();
      this.onSave.emit(formValue);
      this.resetForm();
      this.onCancel();
    }
  }

  public onCancel(): void {
    this.onClose.emit();
  }

  private initForm(): void {
    this.placeForm = this.fb.group({
      id: [this.place?.id || ''],
      displayName: [this.place?.displayName || '', Validators.required],
      name: [this.place?.name || '', Validators.required],
      date: [this.place?.date || new Date(), Validators.required],
      durationHours: [this.place?.durationHours || 1, [Validators.min(1)]],
    });
  }

  private resetForm(): void {
    this.placeForm.reset({
      id: '',
      displayName: '',
      name: '',
      date: new Date(),
      durationHours: 1
    });
  }
}
