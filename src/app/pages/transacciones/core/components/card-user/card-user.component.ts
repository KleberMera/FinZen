import { Component, inject, OnInit, resource, signal } from '@angular/core';
import { TransaccionesService } from '../../services/transacciones.service';
import { Usuarios } from '../../models/usuarios.modles';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-card-user',
  imports: [],
  templateUrl: './card-user.component.html',
  styleUrl: './card-user.component.scss',
})
export class CardUserComponent implements OnInit {
  private readonly tranService = inject(TransaccionesService);
  public readonly userName = signal<string>('');
  public readonly userApellido = signal<string>('');
  seletedUser = signal<number>(2);
  ngOnInit(): void {
    this.getUser();
  }

  async getUser() {
    try {
      const res: any = await firstValueFrom(
        this.tranService.getUsuarios(this.seletedUser())
      );

      this.userName.set(res.nombre);

      this.userApellido.set(res.apellido);
    } catch (error) {
      console.log(error);
    }
  }
}
