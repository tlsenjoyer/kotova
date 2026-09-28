import getUrlFromHeaders from "@/lib/getUrlFromHeaders";
import MainLayoutHeaderLeftSectionContent from "./Content";

export default async function MainLayoutHeaderLeftSection() {
  const url = new URL((await getUrlFromHeaders()) || "/");

  return (
    <MainLayoutHeaderLeftSectionContent
      {...{
        initPageLoadUrl: url.toString(),
        initPageLoadTimestamp: Date.now(),
      }}
    />
  );
}
