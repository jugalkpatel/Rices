import { Stack, Container, createStyles } from "@mantine/core";
import { NavigationBar } from "@/components/all";

type Props = {
  children: JSX.Element | JSX.Element[];
};

const useStyles = createStyles((theme) => ({
  width: {
    width: "100%",

    [theme.fn.largerThan("md")]: {
      width: "720px",
    },

    [theme.fn.largerThan("lg")]: {
      width: "960px",
    },

    [theme.fn.largerThan("xl")]: {
      width: "1140px",
    },
  },
}));

function Layout({ children }: Props) {
  const { classes } = useStyles();
  return (
    <>
      <NavigationBar />
      <Stack justify="center" mt="lg">
        <Container className={classes.width}>{children}</Container>
      </Stack>
    </>
  );
}

export { Layout };
