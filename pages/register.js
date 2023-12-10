import { useState } from "react";
import Center from "@/components/Center";
import styled from "styled-components";
import Title from "@/components/Title";
import Input from "@/components/Input";
import CustomBtn from "@/components/Button";
import Notify, { notify } from "@/components/Notification";
import axios from "axios";
import { registerUser } from "@/lib/supabase";

const ParentDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const LoginBox = styled.div`
  max-width: 40%;
  height: fit-content;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
  background-color: #fff;
  border-radius: 10px;
  padding: 30px;
  padding-bottom: 40px;
  text-align: center;
  @media screen and (max-width: 767px) {
    max-width: 90%;
  }
`;

const InlineInputWrapper = styled.div`
  display: flex;
  gap: 10px;
`;

const Label = styled.label`
  font-size: 0.9rem;
  text-align: left;
  font-weight: 500;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  justify-content: left;
  box-sizing: border-box;
`;

const StyledLabel = styled.label`
  font-size: 0.9rem;
  border: none;
`;

const StyledInput = styled.input`
  border: none;
  margin: 0 auto;
  max-height: 0rem !important;
  max-width: 0rem !important;
  outline: none;
  cursor: pointer;
  background-color: transparent;
  display: none;
`;

const MaskedDivInput = styled.div`
  width: 100%;
  padding: 10px;
  margin-bottom: 7px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  box-sizing: border-box;
  outline: none;
  text-align: left;
  display: flex;
  gap: 15px;
`;

const StyledSpan = styled.span`
  font-size: 0.9rem;
  border: none;
  opacity: 0.4;
`;

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [image, setImage] = useState("");
  const [fileName, setFileName] = useState("No file chosen");

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
    setFileName(e.target.files[0] ? e.target.files[0].name : "No file chosen");
  };

  async function uploadImages(file) {
    const data = new FormData();
    data.append("file", file);
    try {
      const res = await axios.post("/api/upload", data);
      notify("Image uploaded successfully", "success");
      return res.data;
    } catch (err) {
      notify("Error uploading image", "error");
      console.error("Error uploading image:", err);
      return "";
    }
  }

  const createUser = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !phoneNumber ||
      !password ||
      !address
    ) {
      notify("Please fill all fields", "error");
      return;
    } else if (!emailRegex.test(email)) {
      notify("Invalid email format", "error");
      setEmail("");
      return;
    } else if (password.length < 6) {
      notify("Password must be at least 6 characters long", "error");
      setPassword("");
      return;
    }
    if (!image) {
      try {
        const response = await axios.post("/api/register", {
          firstName,
          lastName,
          email,
          phoneNumber,
          password,
          address,
        });
        notify(
          "User registered successfully. Saving information...",
          "success"
        );
        try {
          const sup_res = await registerUser(email, password);
          if (sup_res === "success") {
            notify("User created successfully", "success");
          } else {
            notify("Error creating user", "error");
            return;
          }
        } catch (error) {
          console.error(error);
          notify("Error saving information", "error");
          return;
        }

        window.location = "/login";
        console.log(response);
      } catch (err) {
        notify("Error creating user", "error");
        console.error("Error creating user:", err);
      }
    } else {
      try {
        const realImage = await uploadImages(image);
        if (realImage) {
          const response = await axios.post("/api/register", {
            firstName,
            lastName,
            email,
            phoneNumber,
            password,
            address,
            image: realImage.links[0],
          });
          notify(
            "User registered successfully. Saving information...",
            "success"
          );
          try {
            const sup_res = await registerUser(email, password);
            if (sup_res === "success") {
              notify("User created successfully", "success");
            } else {
              notify("Error creating user", "error");
              return;
            }
          } catch (error) {
            console.error(error);
            notify("Error saving information", "error");
            return;
          }
          window.location = "/login";
          console.log(response);
        } else {
          console.error("Image upload failed");
        }
      } catch (err) {
        notify("Error creating user", "error");
        console.error("Error creating user:", err);
      }
    }
  };

  return (
    <>
      <Notify />
      <Center>
        <ParentDiv>
          <LoginBox>
            <Title>Sign Up</Title>
            <Label>Name</Label>
            <InlineInputWrapper>
              <Input
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <Input
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </InlineInputWrapper>
            <Label>Password</Label>
            <Input
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Label>Contact Information</Label>
            <InlineInputWrapper>
              <Input
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <Input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </InlineInputWrapper>
            <Label>Image</Label>
            <MaskedDivInput>
              <StyledLabel>
                Choose File
                <StyledInput
                  placeholder="Image"
                  type="file"
                  onChange={handleFileChange}
                />
              </StyledLabel>
              <StyledSpan>{fileName}</StyledSpan>
            </MaskedDivInput>
            <Label>Address</Label>
            <Input
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <CustomBtn block={1} black={1} onClick={createUser}>
              Sign Up
            </CustomBtn>
          </LoginBox>
        </ParentDiv>
      </Center>
    </>
  );
}
