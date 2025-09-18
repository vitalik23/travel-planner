import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Place } from '../../../models/places/place.model';
import { Button } from 'primeng/button';
import { DatePipe } from '@angular/common';
import { PlannerService } from '../../../services/planner.service';

@Component({
  selector: 'place-item',
  imports: [Button, DatePipe],
  templateUrl: './place-item.html',
  styleUrl: './place-item.scss'
})
export class PlaceItem{
  
  @Input() place: Place;
  @Input() cityId: string;
  @Output() onEdit: EventEmitter<Place> = new EventEmitter<Place>();

  constructor(private plannerService: PlannerService) { }

  public onRemovePlace(placeId: string): void {
    this.plannerService.removePlace(this.cityId, placeId);
  }

  public onEditPlace(): void {
    this.onEdit.emit(this.place);
  }
}
