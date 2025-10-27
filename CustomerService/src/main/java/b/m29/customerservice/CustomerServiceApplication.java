package b.m29.customerservice;

import b.m29.customerservice.entities.Customer;
import b.m29.customerservice.repositories.CustomerRpository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class CustomerServiceApplication {

    public static void main(String[] args) { SpringApplication.run(CustomerServiceApplication.class, args);}

    @Bean
    CommandLineRunner commandLineRunner(CustomerRpository customerRpository){
        return args -> {
            customerRpository.save(Customer.builder().name("Mohamed").email("BoMo@gmail.com").build());
            customerRpository.save(Customer.builder().name("Khadija").email("khadija@gmail.com").build());
            customerRpository.save(Customer.builder().name("Imene").email("imene@gmail.com").build());
            customerRpository.findAll().forEach(c-> {
                System.out.println("+--++--++--++-+++--++--++--+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-++-");
                System.out.println(c.getId()+ " name : " + c.getName()+" email : "+c.getEmail());
                System.out.println("+--++--++--++-+++--++--++--+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-++-");
            });
        };
    }
}
