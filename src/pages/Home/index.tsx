import { A } from "@solidjs/router";
import { For } from "solid-js";
import Header from "~/component/Header";
import { MockFlights, MockNews } from "~/mock";

export default () => {
  const flights = MockFlights;
  const news = MockNews;
  return (
    <>
      <Header />
      <div class="my-2 flex">
        <div class="w-1/3 pr-4">
          <div class="mx-10 flex h-full w-full justify-center rounded-lg border-2">
            <div class="flex flex-col justify-evenly text-center">
              <span>您好，请先登录</span>
              <A
                href="/auth"
                class="text-blue-500 underline hover:text-blue-700"
              >
                前往登录/注册界面
              </A>
            </div>
          </div>
        </div>
        <div class="flex h-auto w-2/3 justify-center pl-4">
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
      </div>

      <div class="flex w-full justify-center">
        <div class="mx-10 my-2 w-full rounded-lg border-2">
          <div class="flex w-full justify-center py-2 text-2xl">
            <p>航班信息</p>
          </div>
          <div class="flex flex-col justify-center space-y-2 px-4 py-2 text-sm">
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
              <For each={flights}>
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
            </table>
          </div>
        </div>
      </div>
    </>
  );
};
