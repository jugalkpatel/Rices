import { NavigationBar } from "./NavigationBar";

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
