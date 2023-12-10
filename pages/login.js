import CustomBtn from "@/components/Button";
import Center from "@/components/Center";
import Input from "@/components/Input";
import Notify, { notify } from "@/components/Notification";
import Title from "@/components/Title";
import { useState } from "react";
import styled from "styled-components";
import { loginUser } from "@/lib/supabase";

const ParentDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const LoginBox = styled.div`
  width: 40%;
  height: fit-content;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
  background-color: #fff;
  border-radius: 10px;
  padding: 30px;
  padding-bottom: 40px;
  text-align: center;
  @media screen and (max-width: 767px) {
    width: 90%;
  }
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

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const logInUser = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !password) {
      notify("Please fill all fields", "error");
      return;
    } else if (!emailRegex.test(email)) {
      notify("Invalid email format", "error");
      setEmail("");
      return;
    }
    try {
      const sup_res = await loginUser(email, password);
      if (sup_res === "success") {
        notify("Logged in successfully", "success");
      }
      window.location.href = "/";
    } catch (error) {
      notify(`${error}`, "error");
    }
  };

  return (
    <>
      <Notify />
      <Center>
        <ParentDiv>
          <LoginBox>
            <Title>Login</Title>
            <Label>Email</Label>
            <Input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Label>Password</Label>
            <Input
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
            />

            <CustomBtn block={1} black={1} onClick={logInUser}>
              Login
            </CustomBtn>
          </LoginBox>
        </ParentDiv>
      </Center>
    </>
  );
}
