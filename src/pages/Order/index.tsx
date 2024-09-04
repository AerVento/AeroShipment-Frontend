import Header from "~/component/Header";

export default () => {
  const OnCreate = () => {
    // TODO
    alert("提交成功！");
  };
  return (
    <>
      <Header />
      <div class="flex h-auto w-full justify-center">
        <div class="mx-10 flex w-full justify-center rounded-lg border-2">
          <div class="flex w-3/5 flex-col py-2 text-center">
            <p class="py-5 text-2xl font-bold">提交货物递送订单</p>
            <hr />
            <form
              class="space-y-4 py-3"
              onSubmit={(e) => {
                e.preventDefault();
                OnCreate();
              }}
            >
              <div class="flex px-20">
                <span class="w-1/2">货物名称</span>
                <input type="text" class="rounded-md bg-gray-200 px-2" />
              </div>
              <div class="flex px-20">
                <span class="w-1/2">寄出人</span>
                <input type="text" class="rounded-md bg-gray-200 px-2" />
              </div>
              <div class="flex px-20">
                <span class="w-1/2">接收人</span>
                <input type="text" class="rounded-md bg-gray-200 px-2" />
              </div>
              <div class="flex px-20">
                <span class="w-1/2">目的地</span>
                <input type="text" class="rounded-md bg-gray-200 px-2" />
              </div>
              <div class="flex px-20">
                <span class="w-1/2">总重（kg）</span>
                <input type="number" class="rounded-md bg-gray-200 px-2" />
              </div>
              <div class="flex w-full justify-center pt-4">
                <button
                  type="submit"
                  class="rounded-lg bg-blue-500 px-4 py-1 font-bold text-white hover:bg-blue-700"
                >
                  提交订单
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
