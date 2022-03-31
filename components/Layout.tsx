import { NavigationBar } from "@/components/all";

type Props = {
  children: JSX.Element | JSX.Element[];
};

function Layout({ children }: Props) {
  return (
    <>
      <NavigationBar />
      {children}
    </>
  );
}

export { Layout };
