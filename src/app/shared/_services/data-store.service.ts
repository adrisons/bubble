import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

/**
 * Servicio para mantener el estado de la aplicacion
 * Puede guardar el estado en el localstorage
 * Se comunica con la app mediante Observabales
 * */
export abstract class DataStoreService {

  /** Data Change emitter */
  private dataSubject: BehaviorSubject<any>;


  constructor(protected localStoreKey: string, protected data: any) {
    this.getData();
    this.dataSubject = new BehaviorSubject(this.data);
    this.emitChange();
  }
  /** Un observable al que suscribirse para recibir cambios */
  public getDataObservable = (): Observable<any> => this.dataSubject.asObservable();

  protected setData(data) {
    this.saveData(data);
    this.emitChange();
  }

  private saveData(data) {
    this.data = data;
    if (this.localStoreKey) {
      localStorage.setItem(this.localStoreKey, JSON.stringify(this.data));
    }
  }

  private emitChange() {
    /** Notifies el siguente estado de la aplicación */
    this.dataSubject.next(this.data);
  }
  /**
   * Obtiene el estado actual
   */
  protected getData(): any {
    this.loadData();
    return this.data;
  }
  private loadData() {
    if (this.localStoreKey) {
      const localData = localStorage.getItem(this.localStoreKey);
      if (localData) {
        this.data = JSON.parse(localData);
      }
    }
  }
}
