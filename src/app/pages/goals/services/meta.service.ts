import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '@environments/environment.development';
import { apiResponse } from '@models/apiResponse';
import { Meta, MetaTracking } from '@models/meta';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MetaService {
  private readonly _htpp = inject(HttpClient);

  createMeta(meta: Meta): Observable<apiResponse<Meta>> {
    const url = `${environment.apiUrl}/meta`;
    return this._htpp.post<apiResponse<Meta>>(url, meta);
  }

  createMetaTracking(
    metaTracking: MetaTracking
  ): Observable<apiResponse<MetaTracking>> {
    const url = `${environment.apiUrl}/meta/tracking`;
    return this._htpp.post<apiResponse<MetaTracking>>(url, metaTracking);
  }


  formMeta(meta: Partial<Meta> = {}) {
    const form = signal<FormGroup>(
      new FormGroup({
        user_id: new FormControl(meta.user_id, [Validators.required]),
        name: new FormControl(meta.name, [Validators.required]),
        description: new FormControl(meta.description || ''),
        target_amount: new FormControl(meta.target_amount, [Validators.required]),
        deadline: new FormControl(meta.deadline || ''),
        status: new FormControl(meta.status || 'Active'),
      })
    );
    return form;

  }
}
