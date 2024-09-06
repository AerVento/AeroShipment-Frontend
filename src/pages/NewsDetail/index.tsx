import { useNavigate, useParams } from "@solidjs/router";
import { createSignal, Show } from "solid-js";
import Header from "~/component/Header";
import { NewsDetailData } from "~/data";
import { GetNewsDetailDataByIdResponse } from "~/interfaces";
import { useState } from "~/state";

const SendQueryDetail = async (id: number, token: string) => {
  // TODO:与接口不一致
  const resp = await fetch(`/api/news/detail?id={${id}}`, {
    method: "GET",
    headers: { "content-type": "application/json", Authorization: token },
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

export default () => {
  const navigate = useNavigate();
  const params = useParams();
  const newsId = params.id;
  const [news, setNews] = createSignal<NewsDetailData | null>(null);
  const [state, _] = useState();
  if (state.user === null) {
    alert("请先登录！");
    navigate("/auth");
    return <></>;
  }
  const userState = state.user;
  const query = async () => {
    const result = await SendQueryDetail(+newsId, userState.token);
    if (result === null) navigate("/404");
    else setNews(result);
  };
  query();
  return (
    <>
      <Header />
      <div class="flex h-auto w-full justify-center">
        <div class="mx-10 flex w-full justify-center rounded-lg border-2">
          <Show
            when={news()}
            fallback={
              <div class="flex w-full justify-center py-5">
                <p>加载中...</p>
              </div>
            }
          >
            {(item) => (
              <div class="flex w-4/5 flex-col py-2 text-center">
                <p class="pb-3 pt-5 text-2xl font-bold">{item().title}</p>
                <p class="pb-2 text-sm">
                  {new Date(item().publish_time * 1000).toLocaleString()}
                </p>
                <hr />
                <p class="py-10 text-lg">{item().text}</p>
                <hr />
                <p class="py-5 text-right text-sm">{`作者：${item().author}`}</p>
              </div>
            )}
          </Show>
        </div>
      </div>
    </>
  );
};
