import { useSearchParams } from "@solidjs/router";
import { For } from "solid-js";
import Header from "~/component/Header";
import Pagination from "~/component/Pagination";
import { MockFlights } from "~/mock";

export default () => {
  //TODO
  const flights = MockFlights;
  const [searchParams, setSearchParams] = useSearchParams();
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
      <Pagination
        initialPage={1}
        onPageChanged={(page) => setSearchParams({ page })}
      />
    </>
  );
};
