import { A } from "@solidjs/router";
import { JSX, Match, Switch } from "solid-js";
import { MockUserData } from "~/mock";

interface TagButtonProps {
  href: string;
  children: JSX.Element;
}

const TagButton = (props: TagButtonProps) => (
  <A
    class="w-full rounded-lg border-2 text-center text-lg"
    activeClass="bg-blue-300"
    inactiveClass="text-black hover:text-white hover:bg-blue-500"
    {...props}
  />
);

export default () => {
  // TODO: 改成从本地存储中读取用户角色信息
  let role = MockUserData.find((u) => u.username === "AerVento3")?.role;
  if (role === undefined) role = "admin";

  return (
    <>
      <div class="w-full pb-10 pt-20 text-center text-4xl font-bold">
        <p>航空散货调度系统</p>
      </div>
      <div class="flex w-full justify-center space-x-3 px-10 py-4">
        <Switch>
          <Match when={role === "user"}>
            <TagButton href="/index">首页</TagButton>
            <TagButton href="/flights">航班信息</TagButton>
            <TagButton href="/news">新闻信息</TagButton>
            <TagButton href="/order/create">提交订单</TagButton>
            <TagButton href="/user">个人中心</TagButton>
          </Match>
          <Match when={role === "op"}>
            <TagButton href="/index">首页</TagButton>
            <TagButton href="/flights">航班信息</TagButton>
            <TagButton href="/news">新闻信息</TagButton>
            <TagButton href="/news/admin">新闻管理</TagButton>
            <TagButton href="/goods/admin">货物管理</TagButton>
          </Match>
          <Match when={role === "admin"}>
            <TagButton href="/index">首页</TagButton>
            <TagButton href="/flights/admin">航班管理</TagButton>
            <TagButton href="/news/admin">新闻管理</TagButton>
            <TagButton href="/goods/admin">调度管理</TagButton>
            <TagButton href="/user/admin">用户管理</TagButton>
          </Match>
        </Switch>
      </div>
    </>
  );
};
