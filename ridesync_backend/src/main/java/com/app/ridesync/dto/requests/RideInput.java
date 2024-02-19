package com.app.ridesync.dto.requests;

import java.time.LocalDateTime;
import java.time.LocalTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RideInput{
	
	private String userId; //-----------------common userId
	
	//Ride
	private LocalDateTime startTime;
	private LocalDateTime createdTime;
	private int oneTimePassword; //generate random otp
	private String status; // status posted (posted/ active/ completed)
	private String description;
	private int seatsAvailable;
	private int vehicleId;
	
	//Location - 1 start
	private double lattitude1;
	private double longitude1;
	private String landmark1;
	private String address1;
	
	//Location - 2 end
	private double lattitude2;
	private double longitude2;
	private String landmark2;
	private String address2;
	
	//RideInfo
	private String isActive;
	private String isDriver;
	private double fare;
	private int rating;
	private String comments;
	private LocalTime waitTime;
	private LocalDateTime estimatedTripStartTime;
	private LocalDateTime estimatedTripEndTime;	
	
		
}
