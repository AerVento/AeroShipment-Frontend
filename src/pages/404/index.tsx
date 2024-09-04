import { A } from "@solidjs/router";
import Header from "~/component/Header";

export default () => {
  return (
    <>
      <Header />
      <div class="flex w-full justify-center py-20">
        <div class="flex flex-col text-center">
          <p class="text-4xl font-bold">404</p>
          <p class="text-2xl">Not Found</p>
          <A
            href="/index"
            class="py-20 text-blue-500 underline hover:text-blue-700"
          >
            回到首页
          </A>
        </div>
      </div>
    </>
  );
};
