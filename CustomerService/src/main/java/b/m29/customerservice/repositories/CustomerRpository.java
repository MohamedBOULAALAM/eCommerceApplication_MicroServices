package b.m29.customerservice.repositories;

import b.m29.customerservice.entities.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource
public interface CustomerRpository extends JpaRepository<Customer, Long> {
}
