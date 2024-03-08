import {
    Box,
    Button,
    Center,
    Flex,
    Image,
    Input,
    Text,
    Textarea,
    useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API } from "../../sharedComponent/API";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { FaUserEdit } from "react-icons/fa";
const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
const schema = yup
    .object({
        fullName: yup
            .string()
            .min(3, "Name is too short.")
            .required("Please enter your name."),
        address: yup.string().required("Please enter the address."),
        dateOfBirth: yup.string().required("Please enter the Date of Birth."),
        phoneNumber: yup
            .string()
            .min(10, "Phone number is not valid.")
            .max(10, "Phone number is not valid.")
            .matches(phoneRegExp, "Phone number is not valid."),
    })
    .required();

const loggedInUserInfo = JSON.parse(
    localStorage.getItem("loggedInUserDetails")
);

const PersonalInfoEdit = () => {
    const [userDetails, setUserDetails] = useState({});
    const [loading, setLoading] = useState(false);
    let navigate = useNavigate();
    const toast = useToast();
    useEffect(() => {
        const changeDateFormat = (monthOrDay) => {
            if (monthOrDay < 10) {
                return `0${monthOrDay}`;
            } else {
                return monthOrDay;
            }
        };

        if (loggedInUserInfo) {
            // setUserDetails(loggedInUserInfo);
            console.log("loggedInUserInfo", loggedInUserInfo.user);
            console.log(
                "new Date(loggedInUserInfo.user.dateOfBirth)",
                new Date(loggedInUserInfo.user.dateOfBirth).getFullYear(),
                new Date(loggedInUserInfo.user.dateOfBirth).getMonth(),
                new Date(loggedInUserInfo.user.dateOfBirth).getDay()
            );

            setUserDetails({
                fullName: loggedInUserInfo.user.fullName,
                address: loggedInUserInfo.user.address,
                dateOfBirth: `${new Date(
                    loggedInUserInfo.user.dateOfBirth
                ).getFullYear()}-${changeDateFormat(
                    new Date(loggedInUserInfo.user.dateOfBirth).getMonth()
                )}-${changeDateFormat(
                    new Date(loggedInUserInfo.user.dateOfBirth).getDate()
                )}`,
                phoneNumber: loggedInUserInfo.user.phoneNumber,
            });
        }
    }, []);

    const {
        register,
        handleSubmit,
        watch,
        control,
        formState: { errors },
    } = useForm({
        mode: "onBlur",
        resolver: yupResolver(schema),
        values: userDetails,
    });

    const onSubmit = (data) => {
        console.log("dada", data);
        setLoading(true);
        // console.log(userDetails);
        const config = {
            headers: { Authorization: `Bearer ${loggedInUserInfo.token}` },
        };
        console.log("config", config);
        axios
            .post(`${API}/auth/updateUser`, data, config)
            .then((response) => {
                console.log("Response in edit user:", response);
                if (response.data.success) {
                } else {
                    console.log("sdsa", response.data.message);
                    toast({
                        title: `${response.data.message}`,
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                    });
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            })
            .finally(() => setLoading(false));
    };



    return (
        <Box>
            <br />
            <Flex
                w={["100%", "95%", "90%", "80%"]}
                m="auto"
                justifyContent="center"
                align="center"
                flexDir={["column-reverse", "column-reverse", "row", "row"]}
            >
                <Flex
                    w={["90%", "95%", "60%", "55%"]}
                    justifyContent="center"
                    flexDir="column"
                >
                    <Center>
                        <FaUserEdit size="55px" />
                    </Center>
                    <Text fontWeight="medium" fontSize="3xl" textAlign="center">
                        Edit personal details.
                    </Text>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Text mb="1">Name</Text>

                        <Controller
                            control={control}
                            name="fullName"
                            render={({ field: { onChange, onBlur, value, ref } }) => (
                                <Input
                                    w={["100%", "100%", "90%", "90%"]}
                                    placeholder="Enter your name"
                                    type="text"
                                    name="fullName"
                                    value={value}
                                    {...register("fullName")}
                                ></Input>
                                // <Input value={value} placeholder="Full name" {...register("name")} my="3" />
                            )}
                        />

                        <Text color="red">
                            {errors.fullName && errors.fullName?.message}
                        </Text>

                        <Text mt="3" mb="1">
                            Phone number
                        </Text>

                        <Controller
                            control={control}
                            name="phoneNumber"
                            render={({ field: { onChange, onBlur, value, ref } }) => (
                                <Input
                                    w={["100%", "100%", "90%", "90%"]}
                                    placeholder="Enter your phone number"
                                    type="number"
                                    name="phoneNumber"
                                    value={value}
                                    {...register("phoneNumber")}
                                ></Input>
                                // <Input value={value} placeholder="Full name" {...register("name")} my="3" />
                            )}
                        />

                        <Text color="red">
                            {errors.phoneNumber && errors.phoneNumber?.message}
                        </Text>

                        <Text mt="3" mb="1">
                            Date of birth
                        </Text>

                        <Controller
                            control={control}
                            name="dateOfBirth"
                            render={({ field: { onChange, onBlur, value, ref } }) => (
                                <Input
                                    w={["100%", "100%", "90%", "90%"]}
                                    placeholder="Date of Birth"
                                    type="date"
                                    name="dateOfBirth"
                                    // value={value}

                                    {...register("dateOfBirth")}
                                ></Input>

                                // <Input value={value} placeholder="Full name" {...register("name")} my="3" />
                            )}
                        />

                        <Text color="red">
                            {errors.dateOfBirth && errors.dateOfBirth?.message}
                        </Text>

                        <Text mt="3" mb="1">
                            Address
                        </Text>
                        <Controller
                            control={control}
                            name="address"
                            render={({ field: { onChange, onBlur, value, ref } }) => (
                                // <Input value={value} placeholder="Full name" {...register("name")} my="3" />
                                <Textarea
                                    w={["100%", "100%", "90%", "90%"]}
                                    placeholder="Enter your address"
                                    type="text"
                                    name="address"
                                    value={value}
                                    {...register("address")}
                                ></Textarea>
                            )}
                        />
                        <Text color="red">{errors.address && errors.address?.message}</Text>

                        <Button
                            w={["100%", "100%", "90%", "90%"]}
                            my="7"
                            type="submit"
                            colorScheme="blue"
                            isLoading={loading}
                        >
                            Submit
                        </Button>
                    </form>
                </Flex>
            </Flex>
        </Box>
    );
};

export default PersonalInfoEdit;
