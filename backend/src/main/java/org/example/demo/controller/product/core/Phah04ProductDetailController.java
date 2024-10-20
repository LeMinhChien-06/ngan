package org.example.demo.controller.product.core;

import jakarta.validation.Valid;
import org.example.demo.mapper.product.phah04.ProductDetailResponseMapper;
import org.example.demo.repository.product.core.ProductDetailRepository;
import org.example.demo.util.phah04.PageableObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping
@RestController
public class Phah04ProductDetailController {
    @Autowired
    private ProductDetailRepository productDetailRepository;

    @Autowired
    private ProductDetailResponseMapper productDetailResponseMapper;

    @PostMapping("v2/product")
    public ResponseEntity<?> findAllByPageWithQuery(
            @RequestParam(value = "size", required = false) Integer size,
            @RequestParam(value = "color", required = false) Integer color,
            @RequestParam(value = "product", required = false) Integer product,
            @RequestParam(value = "texture", required = false) Integer texture,
            @RequestParam(value = "origin", required = false) Integer origin,
            @RequestParam(value = "brand", required = false) Integer brand,
            @RequestParam(value = "collar", required = false) Integer collar,
            @RequestParam(value = "sleeve", required = false) Integer sleeve,
            @RequestParam(value = "material", required = false) Integer material,
            @RequestParam(value = "thickness", required = false) Integer thickness,
            @RequestParam(value = "elasticity", required = false) Integer elasticity,
            @Valid @RequestBody PageableObject pageableObject
    ) {
        return ResponseEntity.ok(productDetailRepository.findAllByPageWithQuery(
                pageableObject.getQuery(),
                size,
                color,
                product,
                texture,
                origin,
                brand,
                collar,
                sleeve,
                material,
                thickness,
                elasticity,
                pageableObject.toPageRequest()
        ).map(s -> productDetailResponseMapper.toOverviewDTO(s)));
    }

}
