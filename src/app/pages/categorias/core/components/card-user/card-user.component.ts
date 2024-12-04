import { Component, inject, OnInit, resource, signal } from '@angular/core';
import { TransaccionesService } from '../../../../../services/transacciones.service';
import { firstValueFrom } from 'rxjs';
import { CategoriasService } from '../../../../../services/categorias.service';

@Component({
  selector: 'flowbite-user',
  imports: [],
  templateUrl: './card-user.component.html',
  styleUrl: './card-user.component.scss',
})
export class CardUserComponent implements OnInit {
  private readonly _categService = inject(CategoriasService);
  public readonly userName = signal<string>('');
  public readonly userApellido = signal<string>('');
  seletedUser = signal<number>(2);
  ngOnInit(): void {
    this.getUser();
  }

  async getUser() {
    try {
      const res: any = await firstValueFrom(
        this._categService.getUsuarios(this.seletedUser())
      );

      this.userName.set(res.nombre);

      this.userApellido.set(res.apellido);
    } catch (error) {
      console.log(error);
    }
  }
}
