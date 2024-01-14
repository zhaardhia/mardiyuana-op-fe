import React, { useState, useEffect } from 'react'
import { useRouter } from "next/router";
import axios from "axios";

const SignIn = () => {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [msgError, setMsgError] = useState<string>();
  const [visiblePass, setVisiblePass] = useState<boolean>(false)

  const submitUser = async () => {
    console.log("tes");
    console.log({ username, password });
    console.log(process.env.NEXT_PUBLIC_BASE_URL);
    try {
      // axios.defaults.withCredentials = true
      const login = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/mardiyuana/admin/login`,
        {
          username,
          password,
        },
        {
          withCredentials: true,
          headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
        }
      );
      console.log({login})
      // const expires = new Date();
      // expires.setTime(expires.getTime() + 1 + 24 * 60 * 60 * 1000);
      // const cookie = `${"refreshToken"}=${login?.data?.data?.refreshToken};expires=${expires.toUTCString()}`;
      // console.log({cookie})
      // document.cookie = cookie;
      setMsgError('');
      // refreshToken()
      router.push("/");
    } catch (error: any) {
      console.error(error.response.data.message);
      setMsgError(error.response.data.message);
    }
  };

  return (
    <div className='flex md:flex-row flex-col items-center justify-center bg-login-color h-screen lg:gap-36 md:gap-20 ' >
      <div className='lg:w-[448px] md:w-[320px] w-[15rem] p-10 items-center justify-center flex'>
        <img className='w-[300px]' src='/LogoMY.png' />
      </div>
      <div className='flex items-center md:w-auto w-full'>
        <div className='2xl:px-16 lg:px-12 px-5 lg:w-[448px] md:w-[400px] w-[90%] bg-white h-[30rem] rounded-lg bg-login-card border-0 flex flex-col justify-center items-center gap-10 md:mx-0 mx-auto'>
          <div className='text-3xl font-semibold text-white'>Operator Login</div>
          <div className="flex flex-col gap-4 w-[100%]">
            <input className='h-10 w-full rounded-xl p-2 text-slate-800' placeholder='Username' 
              onChange={(e) => setUsername(e.target.value)}
              value={username}
            />
            <input className='h-10 w-full rounded-xl p-2 text-slate-800' placeholder='Password' type='password' 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className='text-xl bg-login-button rounded-lg px-6 py-2'
            onClick={() => submitUser()}
          >Login</button>
        </div>
      </div>
    </div>
  )
}

export default SignIn
