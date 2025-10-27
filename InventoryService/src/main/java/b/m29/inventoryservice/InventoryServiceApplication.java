package b.m29.inventoryservice;

import b.m29.inventoryservice.entities.Product;
import b.m29.inventoryservice.repositories.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.UUID;

@SpringBootApplication
public class InventoryServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(InventoryServiceApplication.class, args);
    }

    @Bean
    CommandLineRunner commandLineRunner(ProductRepository productRepository){
        return args -> {
            productRepository.save(Product.builder().name("Laptop").price(100.00F).quantity(10).build());
            productRepository.save(Product.builder().name("Tablet").price(5000.0F).quantity(500).build());
            productRepository.save(Product.builder().name("Phone").price(2500.0F).quantity(1500).build());
            productRepository.findAll().forEach(p-> {
                System.out.println("+--++--++--++-+++--++--++--+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-++-");
                System.out.println(" name : " + p.getName()+" price : "+p.getPrice()+" quantity : "+p.getQuantity());
                System.out.println("+--++--++--++-+++--++--++--+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-++-");
            });
        };
    }
}
