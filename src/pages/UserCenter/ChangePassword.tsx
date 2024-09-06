import { useNavigate } from "@solidjs/router";
import { createSignal } from "solid-js";
import { UserChangePasswordResponse } from "~/interfaces";
import { useState } from "~/state";

const OnChange = async (password: string, token: string) => {
  const pass = password.trim();
  const resp = await fetch("/api/change-password", {
    method: "POST",
    headers: { "content-type": "application/json", Authorization: token },
    body: JSON.stringify({
      password: pass,
    }),
  });

  if (resp.status === 200) {
    const res = (await resp.json()) as UserChangePasswordResponse;
    if (res.code === 0) alert("修改成功！");
    else {
      alert(res.message);
    }
  } else alert("修改失败，请稍后重试！");
};

export default () => {
  const navigate = useNavigate();
  const [newPwd, setNewPwd] = createSignal("");
  const [repeatPwd, setRepeatNewPwd] = createSignal("");
  const [state, _] = useState();
  if (state.user === null) {
    alert("请先登录！");
    navigate("/auth");
    return <></>;
  }
  const userState = state.user;
  return (
    <>
      <div class="flex w-3/5 flex-col py-2 text-center">
        <p class="py-5 text-2xl font-bold">修改密码</p>
        <hr />
        <form
          class="space-y-4 py-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (newPwd() === "" || repeatPwd() === "") {
              alert("新密码不能为空！");
              return;
            }
            if (newPwd() !== repeatPwd()) {
              alert("两次输入的密码不一致！");
              return;
            }
            OnChange(newPwd(), userState.token);
          }}
        >
          <div class="flex px-20">
            <span class="w-1/2">新密码</span>
            <input
              onChange={(e) => setNewPwd(e.currentTarget.value)}
              type="password"
              class="rounded-md bg-gray-200 px-2"
            />
          </div>
          <div class="flex px-20">
            <span class="w-1/2">重复输入新密码</span>
            <input
              onChange={(e) => setRepeatNewPwd(e.currentTarget.value)}
              type="password"
              class="rounded-md bg-gray-200 px-2"
            />
          </div>
          <div class="flex w-full justify-center pt-4">
            <button
              type="submit"
              class="rounded-lg bg-blue-500 px-4 py-1 font-bold text-white hover:bg-blue-700"
            >
              提交
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
