import { useNavigate } from "@solidjs/router";
import { createSignal, For, Show } from "solid-js";
import { GoodsData } from "~/data";
import { GetGoodsDataResponse } from "~/interfaces";
import { MockGoods } from "~/mock";
import { useState } from "~/state";

export type GoodsStatus =
  | "accepted"
  | "arrived"
  | "departed"
  | "finished"
  | "sending"
  | "waiting";
const StatusTable = {
  waiting: "未入库",
  arrived: "待调度",
  sending: "待出发",
  departed: "已离开",
  finished: "待收货",
  accepted: "已收货",
};

const SendQuery = async (username: string, token: string) => {
  // TODO: 与接口不一致
  const resp = await fetch(`/api/goods/search?username=${username}`, {
    method: "GET",
    headers: { "content-type": "application/json", Authorization: token },
  });
  if (resp.status === 200) {
    const res = (await resp.json()) as GetGoodsDataResponse;
    if (res.code === 0) return res.data;
    else {
      console.error(res.message);
      return [];
    }
  }
  return [];
};
export default () => {
  const navigate = useNavigate();
  const [state, _] = useState();
  if (state.user === null) {
    alert("请先登录！");
    navigate("/auth");
    return <></>;
  }
  const userState = state.user;
  const [goods, setGoods] = createSignal<GoodsData[] | null>(null);
  const query = async () => {
    const result = await SendQuery(userState.username, userState.token);
    setGoods(result.length === 0 ? MockGoods : result);
  };
  query();
  return (
    <>
      <div class="flex flex-col justify-center space-y-2 px-4 py-2 text-sm">
        <div class="flex w-full justify-center py-2 text-2xl">
          <p>历史货物订单信息</p>
        </div>
        <table class="bg-white/20">
          <thead>
            <tr class="bg-white/40">
              <th class="whitespace-nowrap border p-2">货物ID</th>
              <th class="whitespace-nowrap border p-2">货物名称</th>
              <th class="whitespace-nowrap border p-2">寄出人</th>
              <th class="whitespace-nowrap border p-2">寄出时间</th>
              <th class="whitespace-nowrap border p-2">接收人</th>
              <th class="whitespace-nowrap border p-2">目的地</th>
              <th class="whitespace-nowrap border p-2">入库人</th>
              <th class="whitespace-nowrap border p-2">金额</th>
              <th class="whitespace-nowrap border p-2">货物总重</th>
              <th class="whitespace-nowrap border p-2">货物状态</th>
              <th class="whitespace-nowrap border p-2">递送航班号码</th>
            </tr>
          </thead>

          <Show
            when={goods()}
            fallback={
              <tr class="bg-white/40">
                <th class="whitespace-nowrap border p-2" colSpan={11}>
                  加载中...
                </th>
              </tr>
            }
          >
            <For each={goods()}>
              {(item, _) => (
                <tr class="hover:bg-white/40">
                  <td class="border p-2 text-center">{item.id}</td>
                  <td class="border p-2 text-center">{item.name}</td>
                  <td class="border p-2 text-center">{item.sender}</td>
                  <td class="border p-2 text-center">
                    {new Date(item.send_time * 1000).toLocaleString()}
                  </td>
                  <td class="border p-2 text-center">{item.receiver}</td>
                  <td class="border p-2 text-center">{item.dest}</td>
                  <td class="border p-2 text-center">{item.operator}</td>
                  <td class="border p-2 text-center">{item.price}</td>
                  <td class="border p-2 text-center">{item.weight}</td>
                  <td class="border p-2 text-center">
                    {StatusTable[item.status]}
                  </td>
                  <td class="border p-2 text-center">{item.flight}</td>
                </tr>
              )}
            </For>
          </Show>
        </table>
      </div>
    </>
  );
};
