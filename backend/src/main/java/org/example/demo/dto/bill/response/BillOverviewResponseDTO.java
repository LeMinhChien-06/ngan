package org.example.demo.dto.bill.response;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.demo.entity.bill.enums.Status;
/**
 * @author PHAH04
 * Vui lòng không chỉnh sửa =))
 */
import java.util.List;
@AllArgsConstructor
@NoArgsConstructor
@Data
public class BillOverviewResponseDTO {
    private Integer id;
    private String code;
    private String address;
    private String phone;
    private Boolean deleted;
    @Enumerated(EnumType.STRING)
    private Status status;
    private Double total;
    private Double subTotal;
    private String customerName;
    private String voucherName;
    private String staffName;
}