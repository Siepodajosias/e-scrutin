import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {DonneesFiltre} from "../model/donnees-filtre";

@Injectable({
	providedIn: 'root'
})
export class FiltreService {
	filtreChange: Subject<DonneesFiltre> = new Subject<DonneesFiltre>();
}
