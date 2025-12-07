import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../../models/customer.model';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css'
})
export class CustomersComponent implements OnInit {
  customers: Customer[] = [];
  selectedCustomer: Customer | null = null;
  isEditing = false;
  showForm = false;
  customerForm: Customer = { name: '', email: '' };
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private customerService: CustomerService) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.customerService.getAllCustomers().subscribe({
      next: (response) => {
        this.customers = this.customerService.extractCustomers(response);
        this.errorMessage = '';
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement des clients: ' + (error.message || 'Erreur inconnue');
        console.error('Error loading customers:', error);
      }
    });
  }

  showAddForm(): void {
    this.showForm = true;
    this.isEditing = false;
    this.customerForm = { name: '', email: '' };
    this.selectedCustomer = null;
    this.clearMessages();
  }

  showEditForm(customer: Customer): void {
    this.showForm = true;
    this.isEditing = true;
    this.selectedCustomer = customer;
    this.customerForm = { ...customer };
    this.clearMessages();
  }

  cancelForm(): void {
    this.showForm = false;
    this.isEditing = false;
    this.customerForm = { name: '', email: '' };
    this.selectedCustomer = null;
    this.clearMessages();
  }

  saveCustomer(): void {
    if (!this.customerForm.name || !this.customerForm.email) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      return;
    }

    if (this.isEditing && this.selectedCustomer?.id) {
      this.customerService.updateCustomer(this.selectedCustomer.id, this.customerForm).subscribe({
        next: () => {
          this.successMessage = 'Client modifié avec succès';
          this.loadCustomers();
          this.cancelForm();
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors de la modification: ' + (error.message || 'Erreur inconnue');
          console.error('Error updating customer:', error);
        }
      });
    } else {
      this.customerService.createCustomer(this.customerForm).subscribe({
        next: () => {
          this.successMessage = 'Client créé avec succès';
          this.loadCustomers();
          this.cancelForm();
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors de la création: ' + (error.message || 'Erreur inconnue');
          console.error('Error creating customer:', error);
        }
      });
    }
  }

  deleteCustomer(id: number | undefined): void {
    if (!id) return;
    
    if (confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      this.customerService.deleteCustomer(id).subscribe({
        next: () => {
          this.successMessage = 'Client supprimé avec succès';
          this.loadCustomers();
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors de la suppression: ' + (error.message || 'Erreur inconnue');
          console.error('Error deleting customer:', error);
        }
      });
    }
  }

  clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }
}

