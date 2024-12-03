import { Component, inject, resource, signal } from '@angular/core';
import { TransaccionesService } from '../../services/transacciones.service';
import { Usuarios } from '../../models/usuarios.modles';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-card-user',
  imports: [],
  templateUrl: './card-user.component.html',
  styleUrl: './card-user.component.scss',
})
export class CardUserComponent {
  private readonly tranService = inject(TransaccionesService);
  readonly user = signal<Usuarios[]>([]);

  userResource = resource({
    request: () => ({ userId: 1 }),

    loader: async ({ request }) => {
      const userId = request.userId;
      const res = firstValueFrom(this.tranService.getUsuarios(userId));

      return res;
    },
  });
}
