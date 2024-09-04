export default () => {
  return (
    <>
      <div class="flex w-3/5 flex-col py-2 text-center">
        <p class="py-5 text-2xl font-bold">修改密码</p>
        <hr />
        <form
          class="space-y-4 py-3"
          onSubmit={(e) => {
            e.preventDefault();
            // TODO
            alert("修改密码");
          }}
        >
          <div class="flex px-20">
            <span class="w-1/2">新密码</span>
            <input type="password" class="rounded-md bg-gray-200 px-2" />
          </div>
          <div class="flex px-20">
            <span class="w-1/2">重复输入新密码</span>
            <input type="password" class="rounded-md bg-gray-200 px-2" />
          </div>
          <div class="flex w-full justify-center pt-4">
            <button
              type="submit"
              class="rounded-lg bg-blue-500 px-4 py-1 font-bold text-white hover:bg-blue-700"
            >
              提交
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
