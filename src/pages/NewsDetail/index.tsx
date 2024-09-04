import { useNavigate, useParams } from "@solidjs/router";
import Header from "~/component/Header";
import { MockNews } from "~/mock";

export default () => {
  const params = useParams();
  const newsId = params.id;
  // TODO
  const news = MockNews;
  const result = news.find((n) => n.id.toString() === newsId);
  if (result === undefined) {
    const navigate = useNavigate();
    navigate("/404");
    return <></>;
  }
  return (
    <>
      <Header />
      <div class="flex h-auto w-full justify-center">
        <div class="mx-10 flex w-full justify-center rounded-lg border-2">
          <div class="flex w-4/5 flex-col py-2 text-center">
            <p class="pb-3 pt-5 text-2xl font-bold">{result.title}</p>
            <p class="pb-2 text-sm">
              {new Date(result.publish_time * 1000).toLocaleString()}
            </p>
            <hr />
            <p class="py-10 text-lg">{result.text}</p>
            <hr />
            <p class="py-5 text-right text-sm">{`作者：${result.author}`}</p>
          </div>
        </div>
      </div>
    </>
  );
};
