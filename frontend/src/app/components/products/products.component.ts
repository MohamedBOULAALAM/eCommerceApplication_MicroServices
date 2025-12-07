import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  selectedProduct: Product | null = null;
  isEditing = false;
  showForm = false;
  productForm: Product = { name: '', price: 0, quantity: 0 };
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (response) => {
        this.products = this.productService.extractProducts(response);
        this.errorMessage = '';
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement des produits: ' + (error.message || 'Erreur inconnue');
        console.error('Error loading products:', error);
      }
    });
  }

  showAddForm(): void {
    this.showForm = true;
    this.isEditing = false;
    this.productForm = { name: '', price: 0, quantity: 0 };
    this.selectedProduct = null;
    this.clearMessages();
  }

  showEditForm(product: Product): void {
    this.showForm = true;
    this.isEditing = true;
    this.selectedProduct = product;
    this.productForm = { ...product };
    this.clearMessages();
  }

  cancelForm(): void {
    this.showForm = false;
    this.isEditing = false;
    this.productForm = { name: '', price: 0, quantity: 0 };
    this.selectedProduct = null;
    this.clearMessages();
  }

  saveProduct(): void {
    if (!this.productForm.name || this.productForm.price <= 0 || this.productForm.quantity < 0) {
      this.errorMessage = 'Veuillez remplir tous les champs correctement';
      return;
    }

    if (this.isEditing && this.selectedProduct?.id) {
      this.productService.updateProduct(this.selectedProduct.id, this.productForm).subscribe({
        next: () => {
          this.successMessage = 'Produit modifié avec succès';
          this.loadProducts();
          this.cancelForm();
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors de la modification: ' + (error.message || 'Erreur inconnue');
          console.error('Error updating product:', error);
        }
      });
    } else {
      this.productService.createProduct(this.productForm).subscribe({
        next: () => {
          this.successMessage = 'Produit créé avec succès';
          this.loadProducts();
          this.cancelForm();
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors de la création: ' + (error.message || 'Erreur inconnue');
          console.error('Error creating product:', error);
        }
      });
    }
  }

  deleteProduct(id: number | undefined): void {
    if (!id) return;
    
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.successMessage = 'Produit supprimé avec succès';
          this.loadProducts();
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors de la suppression: ' + (error.message || 'Erreur inconnue');
          console.error('Error deleting product:', error);
        }
      });
    }
  }

  clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }
}

