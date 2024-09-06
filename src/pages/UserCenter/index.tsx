import { A, Navigate, Route } from "@solidjs/router";
import { JSX, lazy } from "solid-js";
import Header from "~/component/Header";
import { useState } from "~/state";

interface TagButtonProps {
  href: string;
  children: JSX.Element;
}

const TagButton = (props: TagButtonProps) => (
  <A
    class="w-full text-center text-lg"
    activeClass="text-blue-700"
    inactiveClass="text-black hover:text-blue-500"
    {...props}
  />
);

interface UserCenterProps {
  children?: JSX.Element;
}
export default (props: UserCenterProps) => {
  const [state, _] = useState();
  if (state.user === null) {
    alert("请先登录！");
    return <></>;
  }
  return (
    <>
      <Header />
      <div class="mb-10 flex w-full justify-center">
        <div class="ml-10 flex w-1/5 rounded-lg border-2">
          <div class="flex w-full flex-col space-y-2 py-2 text-center">
            <TagButton href="/user/change-password">修改密码</TagButton>
            <hr />
            <TagButton href="/user/order-history">历史订单</TagButton>
          </div>
        </div>
        <div class="mx-5 flex w-full justify-center rounded-lg border-2">
          {props.children}
        </div>
      </div>
    </>
  );
};

const ChangePassword = lazy(() => import("./ChangePassword"));
const OrderHistory = lazy(() => import("./OrderHistory"));

export const UserCenterRoutes = () => (
  <>
    <Route path="/change-password" component={ChangePassword} />
    <Route path="/order-history" component={OrderHistory} />
    <Route path="/" component={() => <Navigate href="/user/order-history" />} />
  </>
);
