import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class MethodService {


  methodFrances(data : FormGroup ){
    console.log(data.value);
  }
}
