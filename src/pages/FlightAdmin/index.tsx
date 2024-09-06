import { A, useNavigate, useSearchParams } from "@solidjs/router";
import { createQuery } from "@tanstack/solid-query";
import { createSignal, For, Show } from "solid-js";
import { createStore } from "solid-js/store";
import Header from "~/component/Header";
import Pagination from "~/component/Pagination";
import { FlightData } from "~/data";
import {
  AddFlightDataResponse,
  GetFlightDataByPageResponse,
  RemoveFlightDataResponse,
} from "~/interfaces";
import { MockFlights } from "~/mock";
import { useState } from "~/state";

const SendQuery = async (page: string, token: string) => {
  const resp = await fetch(`/api/flights?page=${page}`, {
    method: "GET",
    headers: { "content-type": "application/json", Authorization: token },
  });

  if (resp.status === 200) {
    const res = (await resp.json()) as GetFlightDataByPageResponse;
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

const OnAdd = async (data: Partial<FlightData>, token: string) => {
  if (data.id === "" || data.id === undefined) {
    alert("未填写航班号码！");
    return;
  }
  if (data.source === "" || data.source === undefined) {
    alert("未填写起飞地！");
    return;
  }
  if (data.departure_time === undefined) {
    alert("未填写起飞时间！");
    return;
  }
  if (data.dest === "" || data.dest === undefined) {
    alert("未填写目的地！");
    return;
  }
  if (data.arrive_time === undefined) {
    alert("未填写到达时间！");
    return;
  }
  if (data.airline === "" || data.airline === undefined) {
    alert("未填写航空公司！");
    return;
  }
  data = { ...data, remain_weight: data.max_weight };
  const resp = await fetch(`/api/flights`, {
    method: "PUT",
    headers: { "content-type": "application/json", Authorization: token },
    body: JSON.stringify(data),
  });

  if (resp.status === 200) {
    const res = (await resp.json()) as AddFlightDataResponse;
    if (res.code === 0) alert("添加成功！");
    else {
      alert(res.message);
    }
  } else alert("添加失败，请稍后重试！");
};

const OnDelete = async (id: string, token: string) => {
  const resp = await fetch(`/api/flights`, {
    method: "DELETE",
    headers: { "content-type": "application/json", Authorization: token },
    body: id,
  });

  if (resp.status === 200) {
    const res = (await resp.json()) as RemoveFlightDataResponse;
    if (res.code === 0) {
      alert("删除成功！");
      window.location.reload();
    } else {
      alert(res.message);
    }
  } else alert("删除失败，请稍后重试！");
};

export default () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [state, _] = useState();
  const [page, setPage] = createSignal(+(searchParams.page ?? "1"));
  const [showAdd, setShowAdd] = createSignal(false);
  const [newFlight, setNewFlight] = createStore<Partial<FlightData>>();
  if (state.user === null) {
    alert("请先登录！");
    navigate("/auth");
    return <></>;
  }
  const token = state.user.token;
  const query = createQuery<FlightData[]>(() => ({
    queryKey: [page()],
    queryFn: (param) =>
      SendQuery((param.queryKey[1] as number).toString(), token),
  }));
  return (
    <>
      <Header />
      <div class="flex w-full justify-center">
        <div class="mx-10 my-2 w-full rounded-lg border-2">
          <div class="flex flex-col justify-center space-y-2 px-4 py-2 text-sm">
            <div class="flex w-full justify-center py-2 text-2xl">
              <p>航班管理</p>
            </div>
            <Show
              when={state.user.role !== "user"}
              fallback={
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
              }
            >
              <table class="bg-white/20">
                <thead>
                  <tr class="bg-white/40">
                    <th class="whitespace-nowrap border p-2">航班号码</th>
                    <th class="whitespace-nowrap border p-2">出发地</th>
                    <th class="whitespace-nowrap border p-2">起飞时间</th>
                    <th class="whitespace-nowrap border p-2">目的地</th>
                    <th class="whitespace-nowrap border p-2">到达时间</th>
                    <th class="whitespace-nowrap border p-2">航空公司</th>
                    <th class="whitespace-nowrap border p-2">操作</th>
                  </tr>
                </thead>
                <Show
                  when={query.status !== "pending"}
                  fallback={
                    <tr class="hover:bg-white/40">
                      <td class="border p-2 text-center" colSpan={7}>
                        加载中
                      </td>
                    </tr>
                  }
                >
                  <For
                    each={query.status === "success" ? query.data : MockFlights}
                  >
                    {(item, _) => (
                      <tr class="hover:bg-white/40">
                        <td class="border p-2 text-center">{item.id}</td>
                        <td class="border p-2 text-center">{item.source}</td>
                        <td class="border p-2 text-center">
                          {new Date(
                            item.departure_time * 1000,
                          ).toLocaleString()}
                        </td>
                        <td class="border p-2 text-center">{item.dest}</td>
                        <td class="border p-2 text-center">
                          {new Date(item.arrive_time * 1000).toLocaleString()}
                        </td>
                        <td class="border p-2 text-center">{item.airline}</td>
                        <td class="border p-2 text-center">
                          <button
                            class="w-7 rounded-2xl bg-red-500 text-xl text-white hover:bg-red-700"
                            onClick={() => OnDelete(item.id, token)}
                          >
                            ×
                          </button>
                        </td>
                      </tr>
                    )}
                  </For>
                </Show>
              </table>
            </Show>
          </div>
        </div>
      </div>
      <div class="flex w-full justify-center pt-10">
        <button
          class="rounded-lg bg-blue-500 px-4 py-1 font-bold text-white hover:bg-blue-700"
          onClick={() => setShowAdd(!showAdd())}
        >
          {showAdd() ? "收起" : "添加航班"}
        </button>
      </div>
      <div class="flex w-full justify-center pt-10">
        <hr />
        <Show when={showAdd()}>
          <form
            class="space-y-4 rounded-lg border-2 py-3"
            onSubmit={(e) => {
              e.preventDefault();
              OnAdd(newFlight, token);
            }}
          >
            <div class="flex px-20">
              <span class="w-1/2">航班号码</span>
              <input
                type="text"
                class="w-full rounded-md bg-gray-200 text-center text-lg"
                onChange={(e) =>
                  setNewFlight((s) => {
                    return { ...s, id: e.currentTarget.value };
                  })
                }
              ></input>
            </div>
            <div class="flex px-20">
              <span class="w-1/2">出发地</span>
              <input
                type="text"
                class="w-full rounded-md bg-gray-200 text-center text-lg"
                onChange={(e) =>
                  setNewFlight((s) => {
                    return { ...s, source: e.currentTarget.value };
                  })
                }
              ></input>
            </div>
            <div class="flex px-20">
              <span class="w-1/2">起飞时间</span>
              <input
                type="datetime-local"
                class="w-full rounded-md bg-gray-200 text-center text-lg"
                onChange={(e) =>
                  setNewFlight((s) => {
                    return {
                      ...s,
                      departure_time:
                        new Date(e.currentTarget.value).getTime() / 1000,
                    };
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
                  setNewFlight((s) => {
                    return { ...s, dest: e.currentTarget.value };
                  })
                }
              ></input>
            </div>
            <div class="flex px-20">
              <span class="w-1/2">到达时间</span>
              <input
                type="datetime-local"
                class="w-full rounded-md bg-gray-200 text-center text-lg"
                onChange={(e) =>
                  setNewFlight((s) => {
                    return {
                      ...s,
                      arrive_time:
                        new Date(e.currentTarget.value).getTime() / 1000,
                    };
                  })
                }
              ></input>
            </div>
            <div class="flex px-20">
              <span class="w-1/2">航空公司</span>
              <input
                type="text"
                class="w-full rounded-md bg-gray-200 text-center text-lg"
                onChange={(e) =>
                  setNewFlight((s) => {
                    return { ...s, airline: e.currentTarget.value };
                  })
                }
              ></input>
            </div>
            <div class="flex px-20">
              <span class="w-1/2">最大载重（kg）</span>
              <input
                type="number"
                class="h-7 w-full rounded-md bg-gray-200 text-center text-lg"
                onChange={(e) =>
                  setNewFlight((s) => {
                    return { ...s, max_weight: +e.currentTarget.value };
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
    </>
  );
};
