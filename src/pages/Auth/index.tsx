import { A, useNavigate } from "@solidjs/router";
import { createSignal } from "solid-js";
import { NormalUserRegisterResponse, UserLoginResponse } from "~/interfaces";
import { useState } from "~/state";

export default () => {
  const navigate = useNavigate();
  const [_, setState] = useState();
  const [loginUsername, setLoginUsername] = createSignal("");
  const [loginPassword, setLoginPassword] = createSignal("");
  const [registerUsername, setRegisterUsername] = createSignal("");
  const [registerPassword, setRegisterPassword] = createSignal("");
  const onLogin = async () => {
    const user = loginUsername().trim();
    const pass = loginPassword().trim();

    const resp = await fetch("/api/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        username: user,
        password: pass,
      }),
    });

    const res: UserLoginResponse = await resp.json();

    if (res.code !== 0) {
      setState("user", {
        username: user,
        token: res.data.token,
        role: res.data.role,
      });
      navigate("/");
      alert(`登录成功！`);
    } else {
      alert(`登陆失败！原因：${res.message}`);
    }
  };
  const onRegister = async () => {
    const user = registerUsername().trim();
    const pass = registerPassword().trim();

    const resp = await fetch("/api/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        username: user,
        password: pass,
      }),
    });

    const res: NormalUserRegisterResponse = await resp.json();

    if (res.code !== 0) {
      alert(`注册成功！`);
    } else {
      alert(`注册失败！原因：${res.message}`);
    }
  };

  return (
    <>
      <div class="w-full pt-10 text-center text-5xl font-bold">
        <p>身份验证</p>
      </div>
      <div class="flex w-full pt-10">
        <div class="mx-10 my-20 flex w-1/2 flex-col border-2">
          <div class="w-full py-4 text-center text-4xl">
            <p>登录</p>
          </div>
          <form
            class="w-full space-y-6 p-4"
            onSubmit={(e) => {
              e.preventDefault();
              onLogin();
            }}
          >
            <div class="flex justify-between px-20">
              <span>账户名</span>
              <input
                type="text"
                class="rounded-md bg-gray-200 px-2"
                onchange={(e) => setLoginUsername(e.currentTarget.value)}
              />
            </div>
            <div class="flex justify-between px-20">
              <span>密码</span>
              <input
                type="password"
                class="rounded-md bg-gray-200 px-2"
                onchange={(e) => setLoginPassword(e.currentTarget.value)}
              />
            </div>
            <div class="flex w-full justify-center">
              <button
                type="submit"
                class="rounded-lg bg-blue-500 px-4 py-1 font-bold text-white hover:bg-blue-700"
              >
                登录
              </button>
            </div>
          </form>
        </div>
        <div class="mx-10 my-20 flex w-1/2 flex-col border-2">
          <div class="w-full py-4 text-center text-4xl">
            <p>注册</p>
          </div>
          <form
            class="w-full space-y-6 p-4"
            onSubmit={(e) => {
              e.preventDefault();
              onRegister();
            }}
          >
            <div class="flex justify-between px-20">
              <span>账户名</span>
              <input
                type="text"
                class="rounded-md bg-gray-200 px-2"
                onchange={(e) => setRegisterUsername(e.currentTarget.value)}
              />
            </div>
            <div class="flex justify-between px-20">
              <span>密码</span>
              <input
                type="password"
                class="rounded-md bg-gray-200 px-2"
                onchange={(e) => setRegisterPassword(e.currentTarget.value)}
              />
            </div>
            <div class="flex w-full justify-center">
              <button
                type="submit"
                class="rounded-lg bg-blue-500 px-4 py-1 font-bold text-white hover:bg-blue-700"
              >
                注册
              </button>
            </div>
          </form>
        </div>
      </div>
      <div class="flex justify-center">
        <A href="/" class="text-blue-500 underline hover:text-blue-700">
          回到首页
        </A>
      </div>
    </>
  );
};
