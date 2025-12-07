import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BillService } from '../../services/bill.service';
import { Bill } from '../../../models/bill.model';

@Component({
  selector: 'app-bills',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bills.component.html',
  styleUrl: './bills.component.css'
})
export class BillsComponent implements OnInit {
  billId: number | null = null;
  bill: Bill | null = null;
  loading = false;
  errorMessage: string = '';

  constructor(private billService: BillService) {}

  ngOnInit(): void {
    // Optionnel: charger une facture par défaut
  }

  loadBill(): void {
    if (!this.billId) {
      this.errorMessage = 'Veuillez entrer un ID de facture';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.bill = null;

    this.billService.getBillById(this.billId).subscribe({
      next: (bill) => {
        this.bill = bill;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement de la facture: ' + (error.message || 'Facture non trouvée');
        this.loading = false;
        console.error('Error loading bill:', error);
      }
    });
  }

  calculateTotal(): number {
    if (!this.bill?.productItems) return 0;
    return this.bill.productItems.reduce((total, item) => {
      return total + (item.quantity * item.unitPrice);
    }, 0);
  }
}

