import {
    Box,
    Button,
    ButtonGroup,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Image,
    Input,
    InputGroup,
    InputLeftAddon,
    Select,
    Text,
    Textarea,
    useControllableState,
    useMediaQuery,
    useToast
} from '@chakra-ui/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import moment from 'moment';

import Locations from '../../sharedComponent/Maps/Locations'
import Navbar from '../Navbar/Navbar'
import BottomNavbar from '../Navbar/BottomNavbar'
import { API } from '../../sharedComponent/API'


const AddRide = () => {
    const [isLargerThan1280] = useMediaQuery('(min-width: 700px)');
    const [loading, setLoading] = useState(false);
    const [loggedInUserDetails, setLoggedInUserDetails] = useState({});
    const [fromAddress, setFromAddress] = useState({
        address: "",
        lat: null,
        lng: null
    });
    const [toAddress, setToAddress] = useState({
        address: "",
        lat: null,
        lng: null
    });
    const [sourceLandmark, setSourceLandmark] = useState('');
    const [destinationLandmark, setDestinationLandmark] = useState('');
    const [depatureDate, setDepatureDate] = useState('');
    const [depatureTime, setDepatureTime] = useState('');
    const [availableSeats, setAvailableSeats] = useState(2);
    const [fare, setFare] = useState('');
    const [selectedVehicle, setSelectedVehicle] = useState('');
    const [description, setDescription] = useState('');
    const toast = useToast();

    useEffect(() => {
        const loggedInUserInfo = JSON.parse(localStorage.getItem('loggedInUserDetails'));
        if (loggedInUserInfo) {
            setLoggedInUserDetails(loggedInUserInfo);
        }
    }, []);

    const onSubmitAddRide = () => {
        setLoading(true);
        const config = {
            headers: { Authorization: `Bearer ${loggedInUserDetails.token}` }
        };
        const dateTime = moment(depatureDate + ' ' + depatureTime, "YYYY/MM/DD HH:mm");

        // Format the date and time into the desired format
        const formattedDateTime = dateTime.format("YYYY-MM-DDTHH:mm:ss");
        let requestObj = {

            "lattitude1": fromAddress.lat,
            "longitude1": fromAddress.lng,
            "address1": fromAddress.address,
            "lattitude2": toAddress.lat,
            "longitude2": toAddress.lng,
            "address2": toAddress.address,
            "landmark1": sourceLandmark,
            "landmark2": destinationLandmark,
            "startTime": formattedDateTime,
            "seatsAvailable": availableSeats,
            description,
            fare,
            // fields to be removed in later point of time
            "createdTime": "2024-02-11T14:30:00",
            "comments": "Test comments",
            "waitTime": "14:30:00",
            "estimatedTripStartTime": "2024-02-11T14:30:00",
            "estimatedTripEndTime": "2024-02-11T14:30:00"
        }

        axios.post(`${API}/ride/addRide`, requestObj, config)
            .then(response => {
                if (response.data.success) {
                    setLoading(false);
                    toast({
                        title: 'Ride Created',
                        status: 'success',
                        duration: 5000,
                        isClosable: true,
                    });
                } else {
                    toast({
                        title: response.data.message,
                        status: 'error',
                        duration: 5000,
                        isClosable: true,
                    });
                    setLoading(false);
                    console.log('Response:', response);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
    return (
        <>
            {isLargerThan1280 ? <Navbar /> : <BottomNavbar />}
            <br />
            <Box p="10px" zIndex="-10">
                <Flex w={["100%", "100%", "70%", "70%"]}
                    h={["115vh", "100h", "80vh", "110vh"]}
                    m="auto"
                    justifyContent="flex-start"
                    align="flex-start"
                    flexDir="column"
                >
                    <Heading mb={6}>Post Ride</Heading>
                    <Flex direction="column" w="100%" align="start" paddingLeft={isLargerThan1280 ? "20px" : "0px"}>
                        <Heading size="md">Route Details</Heading>
                        <Text mb={4}>Set your source and destination of your ride</Text>
                        <Locations fromAddress={fromAddress} toAddress={toAddress} setFromAddress={setFromAddress} setToAddress={setToAddress} />
                        <Flex align="center" w="100%" gap={3}>
                            <FormControl>
                                <FormLabel mb="0" >Landmark near source</FormLabel>
                                <Input w="100%" value={sourceLandmark} onChange={(e) => setSourceLandmark(e.target.value)} />
                            </FormControl>
                            <FormControl>
                                <FormLabel htmlFor="time" mb="0" >Landmark near Destination</FormLabel>
                                <Input w="100%" value={destinationLandmark} onChange={(e) => setDestinationLandmark(e.target.value)} />
                            </FormControl>
                        </Flex>
                    </Flex>
                    <Flex direction="column" w="100%" align="start" marginTop={"15px"} paddingLeft={isLargerThan1280 ? "20px" : "0px"}>
                        <Heading size="md">Route Schedule</Heading>
                        <Text mb={4}>Set your travel Date and time of your ride</Text>
                        <Flex align="center" w="100%" gap={3}>
                            <FormControl>
                                <FormLabel htmlFor="date" mb="0" >Leaving at</FormLabel>
                                <Input id="date" type="date" w="100%" value={depatureDate} onChange={(e) => setDepatureDate(e.target.value)} />
                            </FormControl>
                            <FormControl>
                                <FormLabel htmlFor="time" mb="0" >On</FormLabel>
                                <Input id="time" type="time" w="100%" value={depatureTime} onChange={(e) => setDepatureTime(e.target.value)} />
                            </FormControl>
                        </Flex>
                    </Flex>
                    <Flex direction="column" w="100%" align="start" marginTop={"25px"} paddingLeft={isLargerThan1280 ? "20px" : "0px"}>
                        <Heading size="md">Trip Preference</Heading>
                        <Text mb={4}>Set available seats and fair</Text>
                        <Flex flexDirection={['column', 'column', 'row', 'row']} gap={3} w="100%">
                            <Flex flexDirection={'column'} w={["100%", "100%", "35%", "35%"]}>
                                <Text fontSize="md" mb={1}>Seats Available:</Text>
                                <ButtonGroup isAttached variant="outline" size={isLargerThan1280 ? "md" : "sm"}>
                                    <Button
                                        mr="-px"
                                        colorScheme={availableSeats === 2 ? 'blue' : 'gray'}
                                        onClick={() => setAvailableSeats(2)}
                                    >
                                        2 People
                                    </Button>
                                    <Button
                                        mr="-px"
                                        colorScheme={availableSeats === 3 ? 'blue' : 'gray'}
                                        onClick={() => setAvailableSeats(3)}
                                    >
                                        3 People
                                    </Button>
                                    <Button
                                        colorScheme={availableSeats === 4 ? 'blue' : 'gray'}
                                        onClick={() => setAvailableSeats(4)}
                                    >
                                        4 People
                                    </Button>
                                </ButtonGroup>
                            </Flex>
                            <Flex flexDirection={'column'} w={["100%", "100%", "35%", "35%"]}>
                                <Text fontSize="md" mb={1}>Set Fare:</Text>
                                <InputGroup>
                                    <InputLeftAddon children="CAD$" />
                                    <Input placeholder="Enter amount" value={fare} onChange={(e) => setFare(e.target.value)} />
                                </InputGroup>
                            </Flex>
                            <Flex flexDirection={"column"} w={["100%", "100%", "30%", "30%"]}>
                                <Text fontSize="md" mb={1}>Vehicle To Be used:</Text>
                                <Select
                                    placeholder='Select Vehicle'
                                    value={selectedVehicle}
                                    onChange={(e) => {
                                        setSelectedVehicle(e.target.value);
                                    }}>
                                    <option value='honda civic'>Honda Civic</option>
                                    <option value='mustang'>Mustang</option>
                                    <option value='mini_cooper'>Mini Cooper</option>
                                </Select>
                            </Flex>
                        </Flex>
                    </Flex>
                    <Flex direction="column" w="100%" align="start" marginTop={"25px"} paddingLeft={isLargerThan1280 ? "20px" : "0px"}>
                        <Heading size="md" mb={4}>Description</Heading>
                        <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder='Add extra info here'
                            size={isLargerThan1280 ? 'lg' : 'md'}
                            mb={4}
                        />
                    </Flex>
                    <Button w="25%" h={"5vh"} colorScheme='blue' onClick={onSubmitAddRide} isLoading={loading} alignSelf={"flex-end"}>Submit</Button>
                </Flex></Box >
        </>
    )
}

export default AddRide