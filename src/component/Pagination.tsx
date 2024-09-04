import { createSignal } from "solid-js";

interface PaginationProps {
  onPageChanged?: (page: number) => void;
  initialPage: number;
}

export default (props: PaginationProps) => {
  const [page, setPage] = createSignal(props.initialPage);
  return (
    <div class="flex justify-center py-10 first-line:w-full">
      <div class="flex w-2/5 justify-evenly">
        <button
          class="rounded-lg bg-blue-500 px-4 py-1 font-bold text-white hover:bg-blue-700"
          onClick={() => {
            if (page() > 1) setPage(page() - 1);
            props.onPageChanged?.(page());
          }}
        >
          上一页
        </button>
        <div class="flex">
          <input
            type="number"
            class="w-20 rounded-md bg-gray-200 px-2 text-center"
            onChange={(e) => {
              const val = Number.parseInt(e.currentTarget.value);
              if (!Number.isInteger(val) || val <= 0)
                e.currentTarget.value = page().toString();
              else setPage(val);
            }}
            value={page()}
          ></input>
          <button
            class="rounded-lg bg-blue-500 px-4 py-1 font-bold text-white hover:bg-blue-700"
            onClick={() => props.onPageChanged?.(page())}
          >
            跳转
          </button>
        </div>
        <button
          class="rounded-lg bg-blue-500 px-4 py-1 font-bold text-white hover:bg-blue-700"
          onClick={() => {
            setPage(page() + 1);
            props.onPageChanged?.(page());
          }}
        >
          下一页
        </button>
      </div>
    </div>
  );
};
