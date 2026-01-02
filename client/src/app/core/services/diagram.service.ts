import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class DiagramStorageService {
    private readonly STORAGE_KEY = 'my_diagrams';

    addDiagram(){}
    removeDiagram(diagramId: string){}
    getAllDiagrams(){}
    getDiagram(diagramId: string){}
    getRecentDiagrams(){}
    getUsername(){}
}