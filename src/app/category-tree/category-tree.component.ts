import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { firstValueFrom } from 'rxjs';
import { Category } from 'src/app/models/category';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-category-tree',
  templateUrl: './category-tree.component.html',
  styleUrls: ['./category-tree.component.css']
})
export class CategoryTreeComponent implements OnInit {

  categoryTree: TreeNode[] = [];

  constructor(
    private categoryService: CategoryService
  ) { }

  async ngOnInit(): Promise<void> {
    const categories = await firstValueFrom(this.categoryService.getCategories());
    this.categoryTree = this.buildTree(categories);
  }

  buildTree(categories: Category[]): TreeNode[] {
    return categories
      .filter(category => !category.subcategory || category.subcategory.length > 0) // Keep only valid parent categories
      .map(category => ({
        label: category.name,
        data: category,
        children: category.subcategory ? this.buildTree(category.subcategory) : []
      }));
  }

}