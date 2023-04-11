import {ApplicationRef, Component, ComponentFactoryResolver, Injector, OnInit, Type} from '@angular/core';
import RegionGeojson from '../../../../assets/json/RegionGeojson.json';
import DepGeojson from '../../../../assets/json/DepGeojson.json';
import SpGeojson from '../../../../assets/json/SpGepjson.json';
import CommuneGeojson from '../../../../assets/json/CommuneGeojson.json';
import * as L from 'leaflet';
import * as geojson from 'geojson';
import {Resultat} from '../../shared/model/resultat';
import {ResultatService} from '../../shared/service/resultat.service';
import {DonneesFiltre} from '../../shared/model/donnees-filtre';
import {DetailResulatComponent} from '../detail-resulat/detail-resulat.component';
import {ResultatCandidat} from '../../shared/model/resultat-candidat';
import {FiltreService} from '../../shared/service/filtre.service';
import {VoixPartis} from '../../shared/model/voix-partis.model';
import {HttpClient} from '@angular/common/http';
import {delay, finalize} from 'rxjs';
import {NotificationService} from '../../shared/websocket/notification.service';
import {NavigationService} from '../../shared/service/navigation.service';
import {CodeDesignation} from '../../shared/model/code-designation';
import 'leaflet-easybutton';

@Component({
	selector: 'app-carte-interactive',
	templateUrl: './carte-interactive.html',
	styleUrls: ['./carte-interactive.scss']
})
export class CarteInteractive implements OnInit {
	resultats: Resultat[];
	donneeFiltres: DonneesFiltre = DonneesFiltre.initialiserDonneesFiltres();
	loading = false;

	private map: any;
	public regionArray: any;
	private statesData = RegionGeojson as geojson.GeoJsonObject;
	private depGeo = DepGeojson as geojson.GeoJsonObject;
	private spGeo = SpGeojson as geojson.GeoJsonObject;
	private CommuneGeo = CommuneGeojson as geojson.GeoJsonObject;
	private resultatParti: VoixPartis[] = [];
	private globalZoom: any;
	private globalExtend: any;
	private globalMapCenter: any;

	readonly DECOUPAGE_REGION = 'REGION';
	readonly DECOUPAGE_COMMUNE = 'COMMUNE';

	private mapStyle = {
		weight: 1,
		opacity: 0.5,
		color: '#000000',
		fillOpacity: 0.8,
		fillColor: '#808080'
	};

	private regionStyle = {
		fillColor: '#ffffff',
		weight: 1,
		opacity: 1,
		color: '#000000',
		fillOpacity: 0.7
	};

	private coucheRegion: any;
	private coucheDepartement: any;
	private coucheSousPrefecture: any;
	private coucheCommune: any;
	private mapColorLayer: any;
	private communeLayer: any;
	private featureGroup = L.featureGroup();
	isLoading = false;
	private zoomAuClic = false;

	constructor(private mappRef: ApplicationRef,
				private resultatService: ResultatService,
				private navigationService: NavigationService,
				private injector: Injector,
				private filtreService: FiltreService,
				private http: HttpClient,
				private resolver: ComponentFactoryResolver,
				private notificationService: NotificationService) {
	}

	ngOnInit(): void {
		this.handleNotification();
		this.handleChangementFiltreResultat();
		this.recupererResultat();
	}

	/**
	 * Traite la réception d'une notification en affichant ou mettant à jour la popup.
	 */
	handleNotification(): void {
		this.notificationService.notificationChange.subscribe(async (message) => {
			if (this.navigationService.isCarteInteractive()) {
				this.featureUpdate(this.isDecoupageRegion() ?
			    message.region.code : message.commune.code);
				setTimeout(() => {
					this.recupererResultat(false);
				}, 2000);
			}
		});
	}

	private featureUpdate(codeFeature: string): void {
		const featureLayer = this.featureGroup.getLayers();
		for (var l in featureLayer) {
			var overlay: any = featureLayer[l];
			if (overlay._layers) {
				for (var f in overlay._layers) {
					var res = overlay._layers[f];
					if (res.feature.properties.code) {
						if (res.feature.properties.code === codeFeature) {
							const fillColor: string = res.options.fillColor;

							res.setStyle({
								weight: 3,
								color: '#000',
								fillColor: res.options.fillColor === '#FFF' ? fillColor : '#FFF',
								smoothFactor: 0.5,
								interactive: false,
							});
							res.bindTooltip('Chargement...',
								{permanent: true, direction: 'center', className: 'blinking'});
						}
					}
				}
			}
		}
	}

	/**
	 * Initialisation de la map
	 */
	initMap(): void {
		if (this.map) {
			this.map.off();
			this.map.remove();
		}

		if (this.globalZoom && this.globalExtend && this.globalMapCenter) {
			this.map = L.map('map', {
				center: this.globalMapCenter,
				zoom: this.globalZoom,
				minZoom: 7
			});

		} else {
			this.map = L.map('map', {
				center: [7.539989, -5.547080],
				zoom: 7,
				minZoom: 7
			});

			L.easyButton('fa-home', (map) => {
				this.map.setView([7.539989, -5.547080], 7);
				this.map.closePopup();
			}).addTo(this.map);

			L.control.scale().addTo(this.map);
		}

		this.map.on('zoomend', () => {
			this.globalZoom = '';
			this.globalExtend = '';
			this.globalMapCenter = '';

			this.globalZoom = this.map.getZoom();
			this.globalExtend = this.map.getBounds();
			this.globalMapCenter = this.map.getCenter();
			if (!this.zoomAuClic) {
				this.featureGroup.clearLayers();
			} else {
				this.zoomAuClic = false;
			}

			this.map.eachLayer((layer: any) => {
				const zoom = this.map.getZoom();
				if ((this.isDecoupageCommune() && zoom < 10) || (this.isDecoupageRegion() && zoom < 8)) {
					layer.unbindTooltip();
					this.map.closePopup();
				}
				// this.map.removeLayer(layer);
			});

			// retirer toutes les couches du groupe entité
			this.colorerCarteCirconscriptionCommunale();
		});

		this.map.on('drag', () => {
			this.globalZoom = '';
			this.globalExtend = '';
			this.globalMapCenter = '';

			this.globalZoom = this.map.getZoom();
			this.globalExtend = this.map.getBounds();
			this.globalMapCenter = this.map.getCenter();
		});
		this.coucheRegion = L.layerGroup().addTo(this.map);
		this.coucheDepartement = L.layerGroup().addTo(this.map);
		this.coucheSousPrefecture = L.layerGroup().addTo(this.map);
		this.coucheCommune = L.layerGroup().addTo(this.map);
		this.afficheCoucheRegion();
		this.afficherLegende();
	}

	private handleChangementFiltreResultat(): void {
		this.filtreService.filtreChange.subscribe({
			next: (donneesFiltre) => {
				this.donneeFiltres = donneesFiltre;
				if (this.navigationService.isCarteInteractive() && this.donneeFiltres.annee && this.donneeFiltres.typeScrutin) {
					this.recupererResultat();
				}
			}
		});
	}


	private colorerCarteCirconscriptionCommunale(): void {
		if (this.resultats?.length) {
			this.resultats.forEach(element => {
				this.construireDonneesCarte(this.isDecoupageRegion() ? element.region : element.commune, element.premier, element.deuxieme);
			});
		}
	}

	private async construireDonneesCarte(zone: CodeDesignation, premier: ResultatCandidat, deuxieme: ResultatCandidat) {

		this.mapColorLayer = L.geoJson(this.isDecoupageRegion() ? this.statesData : this.CommuneGeo, {
			style: (feature) => (
				{
					weight: 1,
					opacity: 0.5,
					color: '#000',
					fillOpacity: 0.8,
					fillColor: (!deuxieme || premier.score > deuxieme.score) ? premier.codeCouleur : '#808080'
				}
			),
			// Une fonction qui permet de filter l'affchage des résultats sur notre carte
			filter: (feature) => {
				return feature.properties.code === zone.code;
			},
			onEachFeature: (feature, layer) => {
				if (feature.properties.code && feature.properties.code === zone.code) {
					const zoom = this.map.getZoom();
					if (this.isDecoupageRegion() && zoom >= 8) {
						this.construireTooltip(layer, zone, premier, deuxieme);
					} else if (this.isDecoupageCommune() && zoom >= 10 && (!layer.getTooltip())) {
						this.construireTooltip(layer, zone, premier, deuxieme);
					}

				}

				layer.on({
					mouseover: (e) => (this.highlightFeature(e)),
					mouseout: (e) => (this.resetFeature(e)),
					click: (e) => (this.zoomToFeature(e))
				});
			},
		});
		this.featureGroup.addLayer(this.mapColorLayer);
		this.featureGroup.addTo(this.map);
		//this.mapColorLayer.addTo(this.map);
	}

	construireTooltip(layer: any, zone: CodeDesignation, premier: ResultatCandidat, deuxieme: ResultatCandidat): void {
		const labelZone = this.isDecoupageRegion() ? 'Region: ' : 'Commune :';
		const labelPremier = premier ? premier.partiPolitique + ': ' + premier.score + ' / ' + premier.total : '';
		const labelDeuxieme = deuxieme ? deuxieme.partiPolitique + ': ' + deuxieme.score + ' / ' + deuxieme.total : '';
		layer.bindTooltip(labelZone + zone.designation + `</br>` + labelPremier + `</br>` + labelDeuxieme,
			{permanent: true, direction: 'center', className: 'my-labels'});
	}

	private zoomToFeature(e: any) {
		this.zoomAuClic = true;
		this.map.fitBounds(e.target.getBounds());
	}

	private afficheCoucheRegion(): void {
		L.geoJSON(this.statesData, {
			style: this.regionStyle,
			onEachFeature: (feature, layer) => {
				this.coucheRegion.addLayer(layer);
			},
		}).addTo(this.map);
		if (this.isDecoupageCommune()) {
			this.afficherCoucheCommune();
		}
	}

	private showRegionLabel(e: any): void {
		const layer = e.target;
		layer.bindPopup(layer.feature.properties.nom);
	}

	private afficherCoucheDepartement(): void {
		L.geoJson(this.depGeo, {
			style: this.mapStyle,
			onEachFeature: (feature, layer) => {
				this.coucheDepartement.addLayer(layer);
			}
		}).addTo(this.map);
	}

	private afficherCoucherSp(): void {
		L.geoJson(this.spGeo, {
			style: this.mapStyle,
			onEachFeature: (feature, layer) => {
				this.coucheSousPrefecture.addLayer(layer);
			}
		}).addTo(this.map);

	}

	private afficherCoucheCommune(): void {
		this.communeLayer = L.geoJson(this.CommuneGeo, {
			style: this.mapStyle,
			onEachFeature: (feature, layer) => {
				this.coucheCommune.addLayer(layer);
			}
		});

		this.communeLayer.addLayer(this.map);
	}

	private highlightFeature(e: any) {
		const layer = e.target;

		if (layer.feature.properties.code) {

			const rs = this.resultats.find(e => this.isDecoupageRegion() ? e.region.code === layer.feature.properties.code : e.commune.code === layer.feature.properties.code);
			if (rs.resultats.length > 0) {
				if (this.isDecoupageRegion()) {
					layer.bindPopup(this.afficherDetailResulat(rs.resultats, rs.region, this.donneeFiltres.decoupage));
				} else {
					layer.bindPopup(this.afficherDetailResulat(rs.resultats, rs.commune, this.donneeFiltres.decoupage));
				}

			}
		}

		layer.setStyle({
			color: 'black',
			weight: 3
		});
	}

	private resetFeature(e: any) {
		const layer = e.target;

		layer.setStyle({
			color: 'black',
			weight: 1
		});
	}

	recupererResultat(isNotification = true): void {
		if (this.donneeFiltres.annee && this.donneeFiltres.typeScrutin && this.donneeFiltres.tour && this.donneeFiltres.decoupage) {
			this.loading = isNotification;
			this.resultatService.recupererListeResultats(this.donneeFiltres).pipe(finalize(() => {
				this.getNomPartiAndColor();
			})).subscribe({
				next: (resultats) => {
					this.resultats = resultats;
					this.loading = false;
				}
			});
		}

	}

	getNomPartiAndColor(): void {
		this.resultatService.recupererListeResultatPartiPolitique(this.donneeFiltres).pipe(
			finalize(() => {
				this.initMap();
				this.featureGroup.clearLayers();
				this.colorerCarteCirconscriptionCommunale();
			})
		).subscribe({
			next: (resultatsPartis) => {
				this.resultatParti = resultatsPartis;
			}
		});
	}

	private afficherLegende(): void {
		const legend = new (L.Control.extend({
			options: {position: 'bottomright'}
		}));
		legend.onAdd = (map) => {

			var div = L.DomUtil.create('div', 'info legend'),
				// Les données de ce tableau doivent être recupérées depuis la bd
				labels = ['<strong> PARTIS POLITIQUES </strong> (VICTOIRES)'];

			this.resultatParti.forEach(elt => {
				div.innerHTML +=
					labels.push(
						'<i class="fa fa-circle" style="color:' + elt.codeCouleur + '"></i> ' +
						(elt.nom) + '(' + (elt.nombreVictoires) + ')');
			});

			div.innerHTML = labels.join('<br>');
			return div;
		};

		legend.addTo(this.map);
	}

	/**
	 * Afficher le lieu de vote sur la carte
	 */
	public afficherDetailResulat(resultats: ResultatCandidat[], zone: CodeDesignation, decoupage: string): any {
		return this.compilePopup(DetailResulatComponent,
			(c) => {
				c.instance.resultats = resultats;
				c.instance.zone = zone;
				c.instance.decoupage = decoupage;
			});
	}

	/**
	 * Builds the referenced component so it can be injected into the
	 * leaflet map as popup.
	 * Original code from:https://stackblitz.com/edit/angular-ivy-leafletjs-map-popup?file=src%2Fapp%2Fmap%2Fmap.component.ts
	 */
	private compilePopup(component: Type<unknown>, onAttach: (arg0: any) => void): any {
		// const compRef: any = this.viewContainerRef.createComponent(component);
		const compFactory: any = this.resolver.resolveComponentFactory(component);
		let compRef: any = compFactory.create(this.injector);

		if (onAttach) {
			onAttach(compRef);
		}

		// this.viewContainerRef.clear();

		this.mappRef.attachView(compRef.hostView);
		compRef.onDestroy(() => this.mappRef.detachView(compRef.hostView));

		const div = document.createElement('div');
		div.appendChild(compRef.location.nativeElement);
		return div;
	}

	isDecoupageRegion() {
		return this.donneeFiltres.decoupage === this.DECOUPAGE_REGION;
	}

	isDecoupageCommune() {
		return this.donneeFiltres.decoupage === this.DECOUPAGE_COMMUNE;
	}
}
