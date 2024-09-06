import { useNavigate, useSearchParams } from "@solidjs/router";
import { createQuery } from "@tanstack/solid-query";
import { createSignal, For, Show } from "solid-js";
import Header from "~/component/Header";
import Pagination from "~/component/Pagination";
import { FlightData } from "~/data";
import { GetFlightDataByPageResponse } from "~/interfaces";
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

export default () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = createSignal(+(searchParams.page ?? "1"));
  const [state, _] = useState();
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
              <p>航班信息列表</p>
            </div>
            <table class="bg-white/20">
              <thead>
                <tr class="bg-white/40">
                  <th class="whitespace-nowrap border p-2">航班号码</th>
                  <th class="whitespace-nowrap border p-2">出发地</th>
                  <th class="whitespace-nowrap border p-2">起飞时间</th>
                  <th class="whitespace-nowrap border p-2">目的地</th>
                  <th class="whitespace-nowrap border p-2">到达时间</th>
                  <th class="whitespace-nowrap border p-2">航空公司</th>
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
                        {new Date(item.departure_time * 1000).toLocaleString()}
                      </td>
                      <td class="border p-2 text-center">{item.dest}</td>
                      <td class="border p-2 text-center">
                        {new Date(item.arrive_time * 1000).toLocaleString()}
                      </td>
                      <td class="border p-2 text-center">{item.airline}</td>
                    </tr>
                  )}
                </For>
              </Show>
            </table>
          </div>
        </div>
      </div>
      <Pagination
        initialPage={1}
        onPageChanged={(page) => {
          setPage(page);
          setSearchParams({ page: page.toString() });
        }}
      />
    </>
  );
};
