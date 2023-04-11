import { CodeDesignation } from '../model/code-designation';

export class NotificationMessage {
	type: string;
	nom: string;
	region: CodeDesignation;
	circonscription: CodeDesignation;
	commune: CodeDesignation;
	commissionLocale: CodeDesignation;
}
