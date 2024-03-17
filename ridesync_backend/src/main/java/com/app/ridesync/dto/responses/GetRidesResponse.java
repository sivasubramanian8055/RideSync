package com.app.ridesync.dto.responses;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GetRidesResponse {
	private List<RideResponse> rides;
	private String message;
    private boolean success;
}
