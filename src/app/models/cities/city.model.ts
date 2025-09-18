import { Place } from "../places/place.model";

export class City {
    id: string;
    displayName: string;
    name: string;
    places: Place[];

    constructor() {
        this.places = [];
    }
}