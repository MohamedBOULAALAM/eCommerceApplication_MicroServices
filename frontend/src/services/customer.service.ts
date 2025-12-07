import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer, CustomerPage } from '../models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = 'http://localhost:8888/api/customers';

  constructor(private http: HttpClient) {}

  getAllCustomers(): Observable<CustomerPage> {
    return this.http.get<CustomerPage>(this.apiUrl);
  }

  // Helper method to extract customers from HATEOAS response
  extractCustomers(page: CustomerPage): Customer[] {
    if (page.content) {
      return page.content;
    }
    if (page._embedded?.customers) {
      return page._embedded.customers;
    }
    return [];
  }

  getCustomerById(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/${id}`);
  }

  createCustomer(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(this.apiUrl, customer);
  }

  updateCustomer(id: number, customer: Customer): Observable<Customer> {
    return this.http.put<Customer>(`${this.apiUrl}/${id}`, customer);
  }

  deleteCustomer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

