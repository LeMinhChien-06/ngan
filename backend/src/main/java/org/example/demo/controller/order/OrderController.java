package org.example.demo.controller.order;

import jakarta.validation.Valid;
import org.apache.coyote.BadRequestException;
import org.example.demo.controller.IControllerBasic;
import org.example.demo.dto.order.request.OrderRequestDTO;
import org.example.demo.dto.order.response.OrderOverviewResponseDTO;
import org.example.demo.dto.order.response.OrderResponseDTO;
import org.example.demo.entity.order.enums.Status;
import org.example.demo.entity.order.enums.Type;
import org.example.demo.mapper.order.response.OrderResponseMapper;
import org.example.demo.service.order.OrderService;
import org.example.demo.util.phah04.PageableObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

/**
 * @author PHAH04
 * Vui lòng không chỉnh sửa =))
 */
@RestController
@RequestMapping(value = "orders")
public class OrderController implements IControllerBasic<Integer, OrderRequestDTO> {
    @Autowired
    private OrderService orderService;

    @Autowired
    private OrderResponseMapper orderResponseMapper;

    @GetMapping(value = "")
    public ResponseEntity<?> findAll(
            @Valid @RequestBody PageableObject pageableObject
    ) {
        return ResponseEntity.ok(orderService.findAll(pageableObject.toPageRequest()));
    }

    @RequestMapping(value = "overview")
    public ResponseEntity<Page<OrderOverviewResponseDTO>> findAllByPageV2(
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "type", required = false) String type,
            @RequestParam(value = "createdFrom", required = false) @DateTimeFormat(pattern = "dd-MM-yyyy") LocalDate createdFrom,
            @RequestParam(value = "createdTo", required = false) @DateTimeFormat(pattern = "dd-MM-yyyy") LocalDate createdTo,
            @Valid @RequestBody PageableObject pageableObject,
            BindingResult bindingResult
    ) throws BindException {
        if (bindingResult.hasErrors()) {
            throw new BindException(bindingResult);
        }
        String query = pageableObject.getQuery();
        return ResponseEntity.ok(orderService.findAllOverviewByPage(status, type, createdFrom, createdTo, pageableObject));
    }

    @Override
    @PostMapping(value = "")
    public ResponseEntity<OrderResponseDTO> create(@Valid @RequestBody OrderRequestDTO billResponseDTO) throws BadRequestException {
        return ResponseEntity.ok(orderResponseMapper.toDTO(orderService.save(billResponseDTO)));
    }

    @Override
    @PutMapping(value = {"{id}"})
    public ResponseEntity<OrderResponseDTO> update(@PathVariable Integer id, OrderRequestDTO orderRequestDTO) {
        return ResponseEntity.ok(orderResponseMapper.toDTO(orderService.update(id, orderRequestDTO)));

    }

    @Override
    @DeleteMapping(value = "{id}")
    public ResponseEntity<OrderResponseDTO> delete(@PathVariable Integer id) throws BadRequestException {
        return ResponseEntity.ok(orderResponseMapper.toDTO(orderService.delete(id)));
    }

    @Override
    @GetMapping(value = "{id}")
    public ResponseEntity<OrderResponseDTO> detail(@PathVariable Integer id) throws BadRequestException {
        return ResponseEntity.ok(orderResponseMapper.toDTO(orderService.findById(id)));
    }


    @PutMapping(value = "status/change/{id}")
    public ResponseEntity<OrderResponseDTO> changeStatus(@PathVariable Integer id, @RequestParam Status status) throws BadRequestException {
        return ResponseEntity.ok(orderResponseMapper.toDTO(orderService.changeStatus(id, status)));
    }
}
