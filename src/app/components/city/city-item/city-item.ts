import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlaceItem } from '../../place/place-item/place-item';
import { Button } from "primeng/button";
import { PlannerService } from '../../../services/planner.service';
import { PlaceForm } from '../../place/place-form/place-form';
import { City } from '../../../models/cities/city.model';
import { Place } from '../../../models/places/place.model';

@Component({
  selector: 'city-item',
  imports: [CommonModule, PlaceItem, Button, PlaceForm],
  templateUrl: './city-item.html',
  styleUrl: './city-item.scss'
})
export class CityItem {
  @Input() city: City;

  public isPlaceFormOpen: boolean;
  public editingPlace: Place;
  public isEditMode: boolean;

  constructor(private plannerService: PlannerService) { }

  public onRemoveCity(cityId: string): void {
    this.plannerService.removeCity(cityId);
  }

  public onAddPlace(): void {
    this.editingPlace = null;
    this.isEditMode = false;
    this.isPlaceFormOpen = true;
  }

  public onEditPlace(place: Place): void {
    this.editingPlace = place;
    this.isEditMode = true;
    this.isPlaceFormOpen = true;
  }

  public onClosePlaceForm(): void {
    this.isPlaceFormOpen = false;
    this.editingPlace = null;
    this.isEditMode = false;
  }

  public onSavePlace(place: Place): void {
    if (this.isEditMode && this.editingPlace) {
      this.plannerService.editPlace(this.city.id, this.editingPlace.id, place);
    } else {
      this.plannerService.addPlace(this.city.id, place);
    }
    this.onClosePlaceForm();
  }
}
