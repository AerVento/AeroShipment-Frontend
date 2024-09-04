import { A, useSearchParams } from "@solidjs/router";
import { For } from "solid-js";
import Header from "~/component/Header";
import Pagination from "~/component/Pagination";
import { MockNews } from "~/mock";

export default () => {
  // TODO
  const news = MockNews;
  const [searchParams, setSearchParams] = useSearchParams();
  return (
    <>
      <Header />
      <div class="flex h-auto w-full justify-center pl-4">
        <div class="mx-10 w-full rounded-lg border-2">
          <div class="flex w-full justify-center py-2 text-2xl">
            <p>新闻信息</p>
          </div>
          <div class="flex flex-col justify-center space-y-2 px-4 py-2 text-sm">
            <For each={news}>
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
          </div>
        </div>
      </div>
      <Pagination
        initialPage={1}
        onPageChanged={(page) => setSearchParams({ page })}
      />
    </>
  );
};
