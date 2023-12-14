import { useState } from "react";
import Center from "@/components/Center";
import styled from "styled-components";
import Title from "@/components/Title";
import Input from "@/components/Input";
import CustomBtn from "@/components/Button";
import Notify, { notify } from "@/components/Notification";
import axios from "axios";
import { registerUser } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/router";
import { set } from "mongoose";

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
  padding-bottom: 45px;
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

const StyledSpanner = styled.div`
  width: 1rem !important;
  height: 1rem !important;
  position: relative;
  float: right;
`;

const PasswordDiv = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px;
  margin-bottom: 7px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  box-sizing: border-box;
  outline: none;
`;

const StyledInputPass = styled.input`
  width: 90%;
  border: none;
  outline: none;
`;

const LittleText = styled.p`
  font-size: 0.8rem;
  position: absolute;
  color: grey;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  a {
    color: #000;
    text-decoration: none;
  }
`;

export default function RegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [image, setImage] = useState("");
  const [fileName, setFileName] = useState("No file chosen");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

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
      notify(`Error uploading image: ${err}`, "error");
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
        setLoading(true);
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
              setLoading(false);
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
            <PasswordDiv>
              <StyledInputPass
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <StyledSpanner onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                    />
                  </svg>
                )}
              </StyledSpanner>
            </PasswordDiv>
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

            {loading ? (
              <CustomBtn block={1} black={1} disabled>
                Please wait...
              </CustomBtn>
            ) : (
              <CustomBtn block={1} black={1} onClick={createUser}>
                Sign Up
              </CustomBtn>
            )}

            <LittleText>
              Already have an account?&nbsp;
              <Link href="/login">Login</Link>
            </LittleText>
          </LoginBox>
        </ParentDiv>
      </Center>
    </>
  );
}
