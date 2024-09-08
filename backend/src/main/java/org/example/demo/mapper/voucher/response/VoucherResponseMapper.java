package org.example.demo.mapper.voucher.response;

import org.example.demo.dto.voucher.response.VoucherResponseDTO;
import org.example.demo.entity.voucher.Voucher;
import org.example.demo.mapper.IMapperBasic;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface VoucherResponseMapper extends IMapperBasic<Voucher, VoucherResponseDTO> {
}
