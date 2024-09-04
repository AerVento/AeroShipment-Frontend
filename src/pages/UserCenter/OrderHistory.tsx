import { For } from "solid-js";
import { MockGoods } from "~/mock";

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
export default () => {
  const goods = MockGoods;
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
          <For each={goods}>
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
        </table>
      </div>
    </>
  );
};
