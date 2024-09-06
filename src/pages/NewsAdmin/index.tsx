import { A, useNavigate, useSearchParams } from "@solidjs/router";
import { createQuery } from "@tanstack/solid-query";
import { createSignal, For, Show } from "solid-js";
import { createStore } from "solid-js/store";
import Header from "~/component/Header";
import Pagination from "~/component/Pagination";
import { NewsDetailData } from "~/data";
import {
  AddNewsDataResponse,
  GetNewsBriefDataByPageResponse,
  GetNewsDetailDataByIdResponse,
} from "~/interfaces";
import { MockNews } from "~/mock";
import { useState } from "~/state";

const SendQueryDetail = async (id: number, token: string) => {
  const resp = await fetch(`/api/news/detail`, {
    method: "GET",
    headers: { "content-type": "application/json", Authorization: token },
    body: id.toString(),
  });

  if (resp.status === 200) {
    const res = (await resp.json()) as GetNewsDetailDataByIdResponse;
    if (res.code === 0) return res.data;
    else {
      console.error(res.message);
      return null;
    }
  }
  return null;
};

const SendQuery = async (page: string, token: string) => {
  const resp = await fetch(`/api/news?page={${page}}`, {
    method: "GET",
    headers: { "content-type": "application/json", Authorization: token },
  });

  if (resp.status === 200) {
    const res = (await resp.json()) as GetNewsBriefDataByPageResponse;
    if (res.code === 0) {
      const result: NewsDetailData[] = [];
      res.data.forEach(async (elem) => {
        const elemResp = await SendQueryDetail(elem.id, token);
        if (elemResp === null)
          result.push({ ...elem, author: "加载失败", text: "加载失败" });
        else result.push(elemResp);
      });
      return result;
    } else {
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

const OnAdd = async (news: Partial<NewsDetailData>, token: string) => {
  if (news.title === "" || news.title === undefined) {
    alert("未填写新闻标题！");
    return;
  }
  if (news.author === "" || news.author === undefined) {
    alert("未填写作者！");
    return;
  }
  const resp = await fetch(`/api/news`, {
    method: "PUT",
    headers: { "content-type": "application/json", Authorization: token },
    body: JSON.stringify({
      title: news.title,
      author: news.author,
      text: news.text === undefined || news.text === "" ? null : news.text,
    }),
  });

  if (resp.status === 200) {
    const res = (await resp.json()) as AddNewsDataResponse;
    if (res.code === 0) alert("添加成功！");
    else {
      alert(res.message);
    }
  } else alert("添加失败，请稍后重试！");
};

const OnDelete = async (id: number, token: string) => {
  const resp = await fetch(`/api/news`, {
    method: "DELETE",
    headers: { "content-type": "application/json", Authorization: token },
    body: id.toString(),
  });

  if (resp.status === 200) {
    const res = (await resp.json()) as AddNewsDataResponse;
    if (res.code === 0) alert("删除成功！");
    else {
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
  const [newNews, setNewNews] = createStore<Partial<NewsDetailData>>();
  if (state.user === null) {
    alert("请先登录！");
    navigate("/auth");
    return <></>;
  }
  const userState = state.user;
  const query = createQuery<NewsDetailData[]>(() => ({
    queryKey: [page()],
    queryFn: (param) =>
      SendQuery((param.queryKey[1] as number).toString(), userState.token),
  }));

  return (
    <>
      <Header />
      <div class="flex h-auto w-full justify-center pl-4">
        <div class="mx-10 w-full rounded-lg border-2">
          <div class="flex w-full justify-center py-2 text-2xl">
            <p>新闻管理</p>
          </div>
          <div class="flex flex-col justify-center space-y-2 px-4 py-2 text-sm">
            <Show
              when={userState.role !== "user"}
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
                    <th class="whitespace-nowrap border p-2">新闻ID</th>
                    <th class="whitespace-nowrap border p-2">新闻标题</th>
                    <th class="whitespace-nowrap border p-2">作者</th>
                    <th class="whitespace-nowrap border p-2">发布时间</th>
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
                    each={query.status === "success" ? query.data : MockNews}
                  >
                    {(item, _) => (
                      <tr class="hover:bg-white/40">
                        <td class="border p-2 text-center">{item.id}</td>
                        <td class="border p-2 text-center">
                          <A
                            href={`/news/detail/${item.id}`}
                            class="underline hover:text-blue-500"
                          >
                            {item.title}
                          </A>
                        </td>
                        <td class="border p-2 text-center">{item.author}</td>
                        <td class="border p-2 text-center">
                          {new Date(item.publish_time * 1000).toLocaleString()}
                        </td>
                        <td class="border p-2 text-center">
                          <button
                            class="w-7 rounded-2xl bg-red-500 text-xl text-white hover:bg-red-700"
                            onClick={() => OnDelete(item.id, userState.token)}
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
          {showAdd() ? "收起" : "添加新闻"}
        </button>
      </div>
      <div class="flex w-full justify-center pt-10">
        <hr />
        <Show when={showAdd()}>
          <form
            class="w-2/3 space-y-4 rounded-lg border-2 py-3"
            onSubmit={(e) => {
              e.preventDefault();
              OnAdd(newNews, userState.token);
            }}
          >
            <div class="flex px-20">
              <span class="w-1/2">新闻标题</span>
              <input
                type="text"
                class="w-full rounded-md bg-gray-200 text-center text-lg"
                onChange={(e) =>
                  setNewNews((s) => {
                    return { ...s, title: e.currentTarget.value };
                  })
                }
              ></input>
            </div>
            <div class="flex px-20">
              <span class="w-1/2">新闻正文</span>
              <textarea
                class="w-full rounded-md bg-gray-200 p-2 text-sm"
                onChange={(e) =>
                  setNewNews((s) => {
                    return { ...s, text: e.currentTarget.value };
                  })
                }
              ></textarea>
            </div>
            <div class="flex px-20">
              <span class="w-1/2">作者</span>
              <input
                type="text"
                class="w-full rounded-md bg-gray-200 text-center text-lg"
                onChange={(e) =>
                  setNewNews((s) => {
                    return { ...s, author: e.currentTarget.value };
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
