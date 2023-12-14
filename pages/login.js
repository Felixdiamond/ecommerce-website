import CustomBtn from "@/components/Button";
import Center from "@/components/Center";
import Input from "@/components/Input";
import Notify, { notify } from "@/components/Notification";
import Title from "@/components/Title";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { loginUser } from "@/lib/supabase";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

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
  padding-bottom: 45px;
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

const LittleText = styled.p`
  font-size: 0.8rem;
  position: absolute;
  color: grey;
  left: 50%;
  transform: translateX(-50%);
  a {
    color: #000;
    text-decoration: none;
  }
`;

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const secretKey = process.env.NEXT_PUBLIC_CRYPTO_SECRET_KEY;

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
      setLoading(true);
      const sup_res = await loginUser(email, password);
      if (sup_res === "success") {
        notify("Logged in successfully", "success");
        setLoading(false);
        const user = await axios.post("/api/findByEmail", { email: email });

        // Encrypt the user data
        notify("saving cookies, please wait...");
        const ciphertext = CryptoJS.AES.encrypt(
          JSON.stringify(user.data.data),
          secretKey
        ).toString();

        // Set the cookie with the encrypted user data
        Cookies.set("user", ciphertext);
      }
      router.push("/");
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

            {loading ? (
              <CustomBtn block={1} black={1} disabled>
                Please wait...
              </CustomBtn>
            ) : (
              <CustomBtn block={1} black={1} onClick={logInUser}>
                Login
              </CustomBtn>
            )}

            <LittleText>
              Don&apos;t have an account?&nbsp;
              <Link href="/register">Register</Link>
            </LittleText>
          </LoginBox>
        </ParentDiv>
      </Center>
    </>
  );
}
