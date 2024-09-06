import { A, useNavigate, useSearchParams } from "@solidjs/router";
import { createQuery } from "@tanstack/solid-query";
import { createSignal, For, Match, Show, Switch } from "solid-js";
import { createStore } from "solid-js/store";
import Header from "~/component/Header";
import Pagination from "~/component/Pagination";
import { GoodsData } from "~/data";
import {
  AddOrModifyGoodsResponse,
  GetGoodsDataByPageResponse,
  RemoveGoodsResponse,
} from "~/interfaces";
import { MockGoods } from "~/mock";
import { UserState, useState } from "~/state";

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

const OnModify = async (
  source: GoodsData,
  dest: Partial<GoodsData>,
  user: UserState,
) => {
  console.log(JSON.stringify(dest));
  let final: Partial<GoodsData> = dest;
  switch (user.role) {
    case "admin":
      break;
    case "op":
      if (
        source.operator === null &&
        source.status === "waiting" &&
        dest.status !== "waiting"
      )
        final = { ...final, operator: user.username };
      break;
    default:
      console.error("shit");
  }
  const resp = await fetch(`/api/goods`, {
    method: "POST",
    headers: { "content-type": "application/json", Authorization: user.token },
    body: JSON.stringify(final),
  });

  if (resp.status === 200) {
    const res = (await resp.json()) as AddOrModifyGoodsResponse;
    if (res.code === 0) {
      alert("修改成功！");
      window.location.reload();
    } else {
      alert(res.message);
    }
  } else alert("修改失败，请稍后重试！");
};

const OnAdd = async (goods: Partial<GoodsData>, token: string) => {
  if (goods.name === undefined || goods.name === "") {
    alert("未填写货物名称！");
    return;
  }
  if (goods.sender === undefined || goods.sender === "") {
    alert("未填写寄出人！");
    return;
  }
  if (goods.send_time === undefined) {
    alert("未填写寄出时间！");
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
  if (goods.customer === undefined || goods.customer === "") {
    alert("未填写客户账户名！");
    return;
  }
  goods = {
    ...goods,
    operator: null,
    price: null,
    status: "waiting",
    flight: null,
  };

  const resp = await fetch(`/api/goods`, {
    method: "POST",
    headers: { "content-type": "application/json", Authorization: token },
    body: JSON.stringify(goods),
  });

  if (resp.status === 200) {
    const res = (await resp.json()) as AddOrModifyGoodsResponse;
    if (res.code === 0) alert("添加成功！");
    else {
      alert(res.message);
    }
  } else alert("添加失败，请稍后重试！");
};

const OnDelete = async (id: number, token: string) => {
  const resp = await fetch(`/api/goods`, {
    method: "DELETE",
    headers: { "content-type": "application/json", Authorization: token },
    body: id.toString(),
  });

  if (resp.status === 200) {
    const res = (await resp.json()) as RemoveGoodsResponse;
    if (res.code === 0) {
      alert("删除成功！");
      window.location.reload();
    } else {
      alert(res.message);
    }
  } else alert("删除失败，请稍后重试！");
};

const SendQuery = async (page: string, token: string) => {
  const resp = await fetch(`/api/goods?page=${page}`, {
    method: "GET",
    headers: { "content-type": "application/json", Authorization: token },
  });
  if (resp.status === 200) {
    const res = (await resp.json()) as GetGoodsDataByPageResponse;
    if (res.code === 0) return res.data;
    else {
      console.error(res.message);
      return [];
    }
  }

  let err;
  try {
    err = await resp.json();
  } catch {
    throw {
      retry: true,
      msg: await resp.text(),
    };
  }

  throw {
    retry: false,
    msg: err.msg,
  };
};

export default () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = createSignal(+(searchParams.page ?? "1"));
  const [state, _] = useState();

  const [modify, setModify] = createSignal(-1);
  const [modifiedGood, setModifiedGood] = createStore<Partial<GoodsData>>();

  const [showAdd, setShowAdd] = createSignal(false);
  const [newGoods, setNewGoods] = createStore<Partial<GoodsData>>();
  if (state.user === null) {
    alert("请先登录！");
    navigate("/auth");
    return <></>;
  }
  const userState = state.user;
  const query = createQuery<GoodsData[]>(() => ({
    queryKey: [page()],
    queryFn: (param) =>
      SendQuery((param.queryKey[1] as number).toString(), userState.token),
  }));

  const OpTable = () => {
    return (
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
            <th class="whitespace-nowrap border p-2">金额（元）</th>
            <th class="whitespace-nowrap border p-2">货物总重</th>
            <th class="whitespace-nowrap border p-2">货物状态</th>
            <th class="whitespace-nowrap border p-2">递送航班号码</th>
            <th class="whitespace-nowrap border p-2">客户账户名</th>
            <th class="whitespace-nowrap border p-2">操作</th>
          </tr>
        </thead>
        <Show
          when={query.status !== "pending"}
          fallback={
            <tr class="hover:bg-white/40">
              <td class="border p-2 text-center" colSpan={13}>
                加载中
              </td>
            </tr>
          }
        >
          <For each={query.status === "success" ? query.data : MockGoods}>
            {(item, i) => (
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
                <td class="border p-2 text-center">
                  <Show
                    when={modify() === i()}
                    fallback={item.price ? (item.price / 100).toString() : ""}
                  >
                    <input
                      type="number"
                      value={item.price ? (item.price / 100).toString() : ""}
                      class="w-full rounded-md bg-gray-200 text-center text-lg"
                      onChange={(e) =>
                        setModifiedGood((s) => {
                          const val = +e.currentTarget.value;
                          if (val > 0) return { ...s, price: val * 100 };
                          return s;
                        })
                      }
                    ></input>
                  </Show>
                </td>
                <td class="border p-2 text-center">
                  <Show when={modify() === i()} fallback={item.weight}>
                    <input
                      type="number"
                      value={item.weight?.toString()}
                      class="w-full rounded-md bg-gray-200 text-center text-lg"
                      onChange={(e) =>
                        setModifiedGood((s) => {
                          const val = +e.currentTarget.value;
                          if (val > 0) return { ...s, weight: val };
                          return s;
                        })
                      }
                    ></input>
                  </Show>
                </td>
                <td class="border p-2 text-center">
                  <Show
                    when={modify() === i()}
                    fallback={StatusTable[item.status]}
                  >
                    <select
                      value={item.status}
                      onChange={(e) =>
                        setModifiedGood((s) => {
                          return {
                            ...s,
                            status: e.currentTarget.value as GoodsStatus,
                          };
                        })
                      }
                    >
                      <option value="waiting">未入库</option>
                      <option value="arrived">待调度</option>
                      <option value="sending">待出发</option>
                      <option value="departed">已离开</option>
                      <option value="finished">待收货</option>
                      <option value="accepted">已收货</option>
                    </select>
                  </Show>
                </td>
                <td class="border p-2 text-center">{item.flight}</td>
                <td class="border p-2 text-center">{item.customer}</td>
                <Show
                  when={modify() === i()}
                  fallback={
                    <td class="border p-2 text-center">
                      <div class="flex h-full w-full justify-evenly space-x-2">
                        <button
                          class="h-[28px] w-[60px] rounded-lg bg-blue-500 px-2 py-1 font-bold text-white hover:bg-blue-700"
                          onClick={() => {
                            setModifiedGood(item);
                            setModify(i());
                          }}
                        >
                          调整
                        </button>
                        <button
                          class="w-7 rounded-2xl bg-red-500 text-xl text-white hover:bg-red-700"
                          onClick={() => OnDelete(item.id, userState.token)}
                        >
                          ×
                        </button>
                      </div>
                    </td>
                  }
                >
                  <td class="border p-2 text-center">
                    <div class="flex h-full w-full justify-evenly space-x-2">
                      <button
                        class="w-7 rounded-2xl bg-green-600 text-xl text-white"
                        onClick={() => {
                          OnModify(item, modifiedGood, userState);
                          setModify(-1);
                        }}
                      >
                        √
                      </button>
                      <button
                        class="w-7 rounded-2xl bg-red-600 text-xl text-white"
                        onClick={() => setModify(-1)}
                      >
                        ×
                      </button>
                    </div>
                  </td>
                </Show>
              </tr>
            )}
          </For>
        </Show>
      </table>
    );
  };
  const AdminTable = () => {
    return (
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
            <th class="whitespace-nowrap border p-2">金额（元）</th>
            <th class="whitespace-nowrap border p-2">货物总重</th>
            <th class="whitespace-nowrap border p-2">货物状态</th>
            <th class="whitespace-nowrap border p-2">递送航班号码</th>
            <th class="whitespace-nowrap border p-2">客户账户名</th>
            <th class="whitespace-nowrap border p-2">操作</th>
          </tr>
        </thead>
        <Show
          when={true || query.status !== "pending"}
          fallback={
            <tr class="hover:bg-white/40">
              <td class="border p-2 text-center" colSpan={13}>
                加载中
              </td>
            </tr>
          }
        >
          <For each={query.status === "success" ? query.data : MockGoods}>
            {(item, i) => (
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
                <td class="border p-2 text-center">
                  {item.price ? (item.price / 100).toString() : ""}
                </td>
                <td class="border p-2 text-center">{item.weight}</td>
                <td class="border p-2 text-center">
                  <Show
                    when={modify() === i()}
                    fallback={StatusTable[item.status]}
                  >
                    <select
                      onChange={(e) =>
                        setModifiedGood((s) => {
                          return {
                            ...s,
                            status: e.currentTarget.value as GoodsStatus,
                          };
                        })
                      }
                      value={item.status}
                    >
                      <option value="waiting">未入库</option>
                      <option value="arrived">待调度</option>
                      <option value="sending">待出发</option>
                      <option value="departed">已离开</option>
                      <option value="finished">待收货</option>
                      <option value="accepted">已收货</option>
                    </select>
                  </Show>
                </td>
                <td class="border p-2 text-center">
                  <Show when={modify() === i()} fallback={item.flight}>
                    <input
                      type="text"
                      value={item.flight === null ? "" : item.flight}
                      class="w-full rounded-md bg-gray-200 text-center text-lg"
                      onChange={(e) =>
                        setModifiedGood((s) => {
                          return { ...s, flight: e.currentTarget.value };
                        })
                      }
                    ></input>
                  </Show>
                </td>
                <td class="border p-2 text-center">{item.customer}</td>
                <Show
                  when={modify() === i()}
                  fallback={
                    <Show
                      when={item.status === "arrived"}
                      fallback={<td class="border p-2 text-center" />}
                    >
                      <td class="border p-2 text-center">
                        <div class="flex h-full w-full justify-evenly space-x-2">
                          <button
                            class="h-[28px] w-[60px] rounded-lg bg-blue-500 px-2 py-1 font-bold text-white hover:bg-blue-700"
                            onClick={() => {
                              setModifiedGood(item);
                              setModify(i());
                            }}
                          >
                            调度
                          </button>
                          <button
                            class="w-7 rounded-2xl bg-red-500 text-xl text-white hover:bg-red-700"
                            onClick={() => OnDelete(item.id, userState.token)}
                          >
                            ×
                          </button>
                        </div>
                      </td>
                    </Show>
                  }
                >
                  <td class="border p-2 text-center">
                    <div class="flex h-full w-full justify-evenly space-x-2">
                      <button
                        class="w-7 rounded-2xl bg-green-600 text-xl text-white"
                        onClick={() => {
                          OnModify(item, modifiedGood, userState);
                          setModify(-1);
                        }}
                      >
                        √
                      </button>
                      <button
                        class="w-7 rounded-2xl bg-red-600 text-xl text-white"
                        onClick={() => setModify(-1)}
                      >
                        ×
                      </button>
                    </div>
                  </td>
                </Show>
              </tr>
            )}
          </For>
        </Show>
      </table>
    );
  };

  return (
    <>
      <Header />
      <div class="flex h-auto w-full justify-center pl-4">
        <div class="mx-10 w-full rounded-lg border-2">
          <div class="flex flex-col justify-center space-y-2 px-4 py-2 text-sm">
            <div class="flex w-full justify-center py-2 text-2xl">
              <p>货物信息</p>
            </div>
            <Switch>
              <Match when={state.user.role === "user"}>
                <div class="flex w-full justify-center py-20">
                  <div class="flex flex-col text-center">
                    <p class="text-4xl font-bold">权限受限</p>
                    <p class="text-2xl">普通用户不能访问该页面！</p>
                    <A
                      href="/index"
                      class="py-20 text-blue-500 underline hover:text-blue-700"
                    >
                      回到首页
                    </A>
                  </div>
                </div>
              </Match>
              <Match when={state.user.role === "op"}>
                <OpTable />
              </Match>
              <Match when={state.user.role === "admin"}>
                <AdminTable />
              </Match>
            </Switch>
            <div class="flex w-full justify-center pt-10">
              <button
                class="rounded-lg bg-blue-500 px-4 py-1 font-bold text-white hover:bg-blue-700"
                onClick={() => setShowAdd(!showAdd())}
              >
                {showAdd() ? "收起" : "添加货物"}
              </button>
            </div>
            <div class="flex w-full justify-center pt-10">
              <hr />
              <Show when={showAdd()}>
                <form
                  class="space-y-4 rounded-lg border-2 py-3"
                  onSubmit={(e) => {
                    e.preventDefault();
                    OnAdd(newGoods, userState.token);
                  }}
                >
                  <div class="flex px-20">
                    <span class="w-1/2">货物名称</span>
                    <input
                      type="text"
                      class="w-full rounded-md bg-gray-200 text-center text-lg"
                      onChange={(e) =>
                        setNewGoods((s) => {
                          return { ...s, name: e.currentTarget.value };
                        })
                      }
                    ></input>
                  </div>
                  <div class="flex px-20">
                    <span class="w-1/2">寄出人</span>
                    <input
                      type="text"
                      class="w-full rounded-md bg-gray-200 text-center text-lg"
                      onChange={(e) =>
                        setNewGoods((s) => {
                          return { ...s, sender: e.currentTarget.value };
                        })
                      }
                    ></input>
                  </div>
                  <div class="flex px-20">
                    <span class="w-1/2">寄出时间</span>
                    <input
                      type="datetime-local"
                      class="w-full rounded-md bg-gray-200 text-center text-lg"
                      onChange={(e) =>
                        setNewGoods((s) => {
                          return {
                            ...s,
                            send_time:
                              new Date(e.currentTarget.value).getTime() / 1000,
                          };
                        })
                      }
                    ></input>
                  </div>
                  <div class="flex px-20">
                    <span class="w-1/2">接收人</span>
                    <input
                      type="text"
                      class="w-full rounded-md bg-gray-200 text-center text-lg"
                      onChange={(e) =>
                        setNewGoods((s) => {
                          return { ...s, receiver: e.currentTarget.value };
                        })
                      }
                    ></input>
                  </div>
                  <div class="flex px-20">
                    <span class="w-1/2">目的地</span>
                    <input
                      type="text"
                      class="w-full rounded-md bg-gray-200 text-center text-lg"
                      onChange={(e) =>
                        setNewGoods((s) => {
                          return { ...s, dest: e.currentTarget.value };
                        })
                      }
                    ></input>
                  </div>
                  <div class="flex px-20">
                    <span class="w-1/2">货物总重（kg）</span>
                    <input
                      type="number"
                      class="w-full rounded-md bg-gray-200 text-center text-lg"
                      onChange={(e) =>
                        setNewGoods((s) => {
                          const val = +e.currentTarget.value;
                          if (val > 0)
                            return { ...s, weight: +e.currentTarget.value };
                          return s;
                        })
                      }
                    ></input>
                  </div>
                  <div class="flex px-20">
                    <span class="w-1/2">客户账户名</span>
                    <input
                      type="text"
                      class="w-full rounded-md bg-gray-200 text-center text-lg"
                      onChange={(e) =>
                        setNewGoods((s) => {
                          return { ...s, customer: e.currentTarget.value };
                        })
                      }
                    ></input>
                  </div>
                  <div class="flex justify-center px-20">
                    <button
                      type="submit"
                      class="rounded-lg bg-blue-500 px-4 py-1 font-bold text-white hover:bg-blue-700"
                    >
                      提交
                    </button>
                  </div>
                </form>
              </Show>
              <hr />
            </div>
            <Pagination
              initialPage={page()}
              onPageChanged={(page) => {
                setPage(page);
                setSearchParams({ page: page.toString() });
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};
