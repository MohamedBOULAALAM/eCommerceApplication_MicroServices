package b.m29.billingservice.Repositories;

import b.m29.billingservice.entities.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource
public interface BillRepository extends JpaRepository<Bill,Long> {}