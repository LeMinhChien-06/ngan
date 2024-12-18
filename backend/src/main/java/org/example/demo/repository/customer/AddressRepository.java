package org.example.demo.repository.customer;

import org.example.demo.dto.customer.AddressDTO;
import org.example.demo.entity.human.customer.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AddressRepository extends JpaRepository<Address, Integer> {
    // Tìm tất cả địa chỉ của khách hàng dựa trên customerId
    List<Address> findByCustomerId(Integer customerId);

    // check trùng sdt
    List<Address> findAddressByPhone(String phone);

}
