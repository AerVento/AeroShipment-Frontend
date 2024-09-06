import { useNavigate } from "@solidjs/router";
import { createStore } from "solid-js/store";
import Header from "~/component/Header";
import { GoodsData } from "~/data";
import { NormalUserAddGoodsResponse } from "~/interfaces";
import { useState } from "~/state";

const OnCreate = async (goods: Partial<GoodsData>, token: string) => {
  if (goods.name === undefined || goods.name === "") {
    alert("未填写货物名称！");
    return;
  }
  if (goods.sender === undefined || goods.sender === "") {
    alert("未填写寄出人！");
    return;
  }
  if (goods.receiver === undefined || goods.receiver === "") {
    alert("未填写接收人！");
    return;
  }
  if (goods.dest === undefined || goods.dest === "") {
    alert("未填写目的地！");
    return;
  }
  if (goods.weight === undefined) {
    alert("未填写货物重量！");
    return;
  }

  goods = { ...goods, send_time: new Date().getTime() / 1000 };

  const resp = await fetch(`/api/goods`, {
    method: "POST",
    headers: { "content-type": "application/json", Authorization: token },
    body: JSON.stringify(goods),
  });

  if (resp.status === 200) {
    const res = (await resp.json()) as NormalUserAddGoodsResponse;
    if (res.code === 0) alert("提交成功！");
    else {
      alert(res.message);
    }
  } else alert("提交失败，请稍后重试！");
};
export default () => {
  const navigate = useNavigate();
  const [state, _] = useState();
  const [order, setOrder] = createStore<Partial<GoodsData>>();
  if (state.user === null) {
    alert("请先登录！");
    navigate("/auth");
    return <></>;
  }
  const userState = state.user;
  return (
    <>
      <Header />
      <div class="flex h-auto w-full justify-center">
        <div class="mx-10 flex w-full justify-center rounded-lg border-2">
          <div class="flex w-3/5 flex-col py-2 text-center">
            <p class="py-5 text-2xl font-bold">提交货物递送订单</p>
            <hr />
            <form
              class="space-y-4 py-3"
              onSubmit={(e) => {
                e.preventDefault();
                OnCreate(order, userState.token);
              }}
            >
              <div class="flex px-20">
                <span class="w-1/2">货物名称</span>
                <input
                  type="text"
                  class="rounded-md bg-gray-200 px-2"
                  onChange={(e) =>
                    setOrder((s) => {
                      return { ...s, name: e.currentTarget.value };
                    })
                  }
                />
              </div>
              <div class="flex px-20">
                <span class="w-1/2">寄出人</span>
                <input
                  type="text"
                  class="rounded-md bg-gray-200 px-2"
                  onChange={(e) =>
                    setOrder((s) => {
                      return { ...s, sender: e.currentTarget.value };
                    })
                  }
                />
              </div>
              <div class="flex px-20">
                <span class="w-1/2">接收人</span>
                <input
                  type="text"
                  class="rounded-md bg-gray-200 px-2"
                  onChange={(e) =>
                    setOrder((s) => {
                      return { ...s, receiver: e.currentTarget.value };
                    })
                  }
                />
              </div>
              <div class="flex px-20">
                <span class="w-1/2">目的地</span>
                <input
                  type="text"
                  class="rounded-md bg-gray-200 px-2"
                  onChange={(e) =>
                    setOrder((s) => {
                      return { ...s, dest: e.currentTarget.value };
                    })
                  }
                />
              </div>
              <div class="flex px-20">
                <span class="w-1/2">总重（kg）</span>
                <input
                  type="number"
                  class="rounded-md bg-gray-200 px-2"
                  onChange={(e) =>
                    setOrder((s) => {
                      const val = +e.currentTarget.value;
                      if (val > 0) return { ...s, weight: val };
                      return s;
                    })
                  }
                />
              </div>
              <div class="flex w-full justify-center pt-4">
                <button
                  type="submit"
                  class="rounded-lg bg-blue-500 px-4 py-1 font-bold text-white hover:bg-blue-700"
                >
                  提交订单
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
