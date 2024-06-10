import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.loadingSubject.asObservable();

  show() {
    this.setLoading(true);
  }

  hide() {
    this.setLoading(false);
  }

  private setLoading(isLoading: boolean) {
    this.loadingSubject.next(isLoading);
  }
}
