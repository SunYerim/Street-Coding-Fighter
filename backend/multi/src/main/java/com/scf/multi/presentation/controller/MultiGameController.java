package com.scf.multi.presentation.controller;

import com.scf.multi.application.MultiGameService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/multi")
public class MultiGameController {

    private final MultiGameService multiGameService;
}
