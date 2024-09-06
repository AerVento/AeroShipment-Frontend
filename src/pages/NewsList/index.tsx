import { A, useNavigate, useSearchParams } from "@solidjs/router";
import { createQuery } from "@tanstack/solid-query";
import { createSignal, For, Show } from "solid-js";
import Header from "~/component/Header";
import Pagination from "~/component/Pagination";
import { NewsBriefData } from "~/data";
import { GetNewsBriefDataByPageResponse } from "~/interfaces";
import { MockNews } from "~/mock";
import { useState } from "~/state";

const SendQuery = async (page: string, token: string) => {
  const resp = await fetch(`/api/news?page=${page}`, {
    method: "GET",
    headers: { "content-type": "application/json", Authorization: token },
  });

  if (resp.status === 200) {
    const res = (await resp.json()) as GetNewsBriefDataByPageResponse;
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
  const [state, _] = useState();
  const [page, setPage] = createSignal(+(searchParams.page ?? "1"));
  if (state.user === null) {
    alert("请先登录！");
    navigate("/auth");
    return <></>;
  }
  const token = state.user.token;
  const query = createQuery<NewsBriefData[]>(() => ({
    queryKey: [page()],
    queryFn: (param) =>
      SendQuery((param.queryKey[1] as number).toString(), token),
  }));
  return (
    <>
      <Header />
      <div class="flex h-auto w-full justify-center pl-4">
        <div class="mx-10 w-full rounded-lg border-2">
          <div class="flex w-full justify-center py-2 text-2xl">
            <p>新闻信息</p>
          </div>
          <div class="flex flex-col justify-center space-y-2 px-4 py-2 text-sm">
            <Show
              when={query.status !== "pending"}
              fallback={
                <div class="flex w-full justify-center py-5">
                  <p>加载中...</p>
                </div>
              }
            >
              <For each={query.status === "success" ? query.data : MockNews}>
                {(item, _) => (
                  <div>
                    <span class="px-4 text-gray-400">{`[${new Date(item.publish_time * 1000).toLocaleDateString()}]`}</span>
                    <A
                      href={`/news/detail/${item.id}`}
                      class="underline hover:text-blue-500"
                    >
                      {item.title}
                    </A>
                  </div>
                )}
              </For>
            </Show>
          </div>
        </div>
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
