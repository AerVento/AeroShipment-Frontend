import { A, useNavigate } from "@solidjs/router";
import { createSignal } from "solid-js";
import { NormalUserRegisterResponse } from "~/interfaces";
import { MockUserData } from "~/mock";

export default () => {
  const navigate = useNavigate();
  const [loginUsername, setLoginUsername] = createSignal("");
  const [loginPassword, setLoginPassword] = createSignal("");
  const [registerUsername, setRegisterUsername] = createSignal("");
  const [registerPassword, setRegisterPassword] = createSignal("");
  const onLogin = async () => {
    // TODO
    const result = MockUserData.find(
      (v) => v.username === loginUsername() && v.password === loginPassword(),
    );
    if (result === undefined) {
      alert("登陆失败！");
      return;
    }
    alert("登陆成功！");
    navigate("/");
  };
  const onRegister = async () => {
    // TODO
    const resp = await fetch("/api/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        username: registerUsername(),
        password: registerPassword(),
      }),
    });

    if (resp.status !== 200) {
      const msg = (await resp.json()).msg;
      alert(msg);
      return;
    }
    const data: NormalUserRegisterResponse = await resp.json();
    if (data.code !== 0) {
      const msg = (await resp.json()).msg;
      alert(msg);
      return;
    }
    alert("注册成功！");
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
