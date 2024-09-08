package org.example.demo.controller.bill;

import jakarta.validation.Valid;
import org.apache.coyote.BadRequestException;
import org.example.demo.controller.IControllerBasic;
import org.example.demo.dto.bill.request.BillRequestDTO;
import org.example.demo.dto.bill.response.BillResponseDTO;
import org.example.demo.entity.bill.enums.Status;
import org.example.demo.mapper.bill.response.BillResponseMapper;
import org.example.demo.service.bill.BillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

/**
 * @author PHAH04
 * The type Bill controller.
 */
@RestController
@RequestMapping(value = "bill")
public class BillController implements IControllerBasic<Integer, BillRequestDTO> {
    @Autowired
    private BillService billService;

    @Autowired
    private BillResponseMapper billResponseMapper;

    @GetMapping(value = "")
    public ResponseEntity<?> findAll(
            @RequestParam(value = "page", required = false, defaultValue = "0") Integer page,
            @RequestParam(value = "size", required = false, defaultValue = "5") Integer size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(billService.findAll(pageable));
    }

    @GetMapping(value = "page")
    public ResponseEntity<Page<BillResponseDTO>> findAllByPage(
            @RequestParam(value = "code", required = false) String code,
            @RequestParam(value = "fromDate", required = false) @DateTimeFormat(pattern = "dd-MM-yyyy") LocalDate fromDate,
            @RequestParam(value = "toDate", required = false) @DateTimeFormat(pattern = "dd-MM-yyyy") LocalDate toDate,
            @RequestParam(value = "fromTotal", required = false) Double fromTotal,
            @RequestParam(value = "toTotal", required = false) Double toTotal,
            @RequestParam(value = "page", required = false, defaultValue = "0") Integer page,
            @RequestParam(value = "size", required = false, defaultValue = "5") Integer size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(billService.findAllByPage(code, fromDate, toDate, fromTotal, toTotal, pageable));
    }

    @Override
    @PostMapping(value = "")
    public ResponseEntity<BillResponseDTO> create(@Valid @RequestBody BillRequestDTO billResponseDTO) throws BadRequestException {
        return ResponseEntity.ok(billResponseMapper.toDTO(billService.save(billResponseDTO)));
    }

    @Override
    @PutMapping(value = {"{id}"})
    public ResponseEntity<BillResponseDTO> update(@PathVariable Integer id, BillRequestDTO billRequestDTO) {
        return ResponseEntity.ok(billResponseMapper.toDTO(billService.update(id, billRequestDTO)));

    }

    @Override
    @DeleteMapping(value = "{id}")
    public ResponseEntity<BillResponseDTO> delete(@PathVariable Integer id) throws BadRequestException {
        return ResponseEntity.ok(billResponseMapper.toDTO(billService.delete(id)));
    }

    @Override
    @GetMapping(value = "{id}")
    public ResponseEntity<BillResponseDTO> detail(@PathVariable Integer id) throws BadRequestException {
        return ResponseEntity.ok(billResponseMapper.toDTO(billService.findById(id)));
    }


    @PutMapping(value = "status/change/{id}")
    public ResponseEntity<BillResponseDTO> changeStatus(@PathVariable Integer id, @RequestParam Status status) throws BadRequestException {
        return ResponseEntity.ok(billResponseMapper.toDTO(billService.changeStatus(id, status)));
    }
}
