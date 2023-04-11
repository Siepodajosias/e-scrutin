import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { UtilisateurModal } from 'src/app/modules/admin/components/utilisateurs/utilisateur-modal/utilisateur-modal';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { UtilisateurService } from 'src/app/shared-elephant-bet/services/utilisateur.service';
import { delay, of } from 'rxjs';
import { Utilisateur } from 'src/app/shared-elephant-bet/models/utilisateur';

describe('UtilisateurModalComponent', () => {
	let component: UtilisateurModal;
	let fixture: ComponentFixture<UtilisateurModal>;

	let utilisateur: Utilisateur = { id: 1, nom: 'DIABY', prenoms: 'Kader', username: 'kader', password: '777', role: 'ADMIN' };

	const utilisateurServiceStub = jasmine.createSpyObj('UtilisateurService', ['inscrireUtilisateur', 'modifierUtilisateur']);
	const messageServiceStub = jasmine.createSpyObj('MessageService', ['add']);
	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [UtilisateurModal],
			imports: [ReactiveFormsModule, HttpClientModule],
			providers: [
				{ provide: MessageService, useValue: messageServiceStub },
				{ provide: UtilisateurService, useValue: utilisateurServiceStub }
			]
		}).compileComponents();

		fixture = TestBed.createComponent(UtilisateurModal);
		component = fixture.componentInstance;
		messageServiceStub.add.calls.reset();
		utilisateurServiceStub.inscrireUtilisateur.and.returnValue(of([]));
		utilisateurServiceStub.modifierUtilisateur.and.returnValue(of([]));
		fixture.detectChanges();
	});

	it('Test de la méthode enregistrement', fakeAsync(() => {
		// GIVEN
		utilisateurServiceStub.inscrireUtilisateur.and.returnValue(of(utilisateur).pipe(delay(1)));
		// WHEN
		component.enregistrement(utilisateur);
		// THEN
		expect(component.loading).toBeFalse();
		tick(1);
		expect(utilisateurServiceStub.inscrireUtilisateur).toHaveBeenCalled();
	}));

	it('Test de la méthode modification', fakeAsync(() => {
		// GIVEN
		let utilisateurModifier: Utilisateur = { id: 1, nom: 'DIABY', prenoms: 'Kader', username: 'kader', password: '777s', role: 'LECTEUR_SIMPLE' };
		utilisateurServiceStub.modifierUtilisateur.and.returnValue(of(utilisateurModifier).pipe(delay(1)));
		// WHEN
		component.modification(utilisateurModifier);
		// THEN
		expect(component.loading).toBeFalse();
		tick(1);
		expect(utilisateurServiceStub.modifierUtilisateur).toHaveBeenCalled();
	}));

	it('Test de la méthode enregistrerUtilisateur', fakeAsync(() => {
		// GIVEN

		// WHEN
		component.enregistrerUtilisateur();
		// THEN
		expect(component.loading).toBeFalse();
		tick(1);
	}));

	it('Test de la méthode renseignerFormulaire', fakeAsync(() => {
		// GIVEN
		let utilisateurForm: Utilisateur = { id: 1, nom: 'DIABY', prenoms: 'Kader', username: 'kader', password: '777s', role: 'Lecteur simple' };
		// WHEN
		component.renseignerFormulaire(utilisateurForm);
		// THEN
		expect(component.utilisateurForm.get('id')?.value).toEqual(1);
		expect(component.utilisateurForm.get('nom')?.value).toEqual('DIABY');
		expect(component.utilisateurForm.get('prenoms')?.value).toEqual('Kader');
		expect(component.utilisateurForm.get('role')?.value).toEqual({ code: 'Lecteur simple', designation: 'Lecteur simple' });
	}));
});
