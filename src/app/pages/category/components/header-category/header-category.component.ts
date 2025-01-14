import { Component, input } from '@angular/core';
import { Category } from '@models/category';

@Component({
  selector: 'app-header-category',
  imports: [],
  templateUrl: './header-category.component.html',
  styleUrl: './header-category.component.scss'
})
export class HeaderCategoryComponent {
  category = input<Category[]>();
}
