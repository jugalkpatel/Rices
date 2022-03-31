import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

import {
  ActionIcon,
  Group,
  useMantineColorScheme,
  Menu,
  createStyles,
  Divider,
} from "@mantine/core";

import {
  IoIosSunny,
  IoMdAdd,
  IoMdExit,
  IoMdNotifications,
} from "react-icons/io";
import { MdNightsStay } from "react-icons/md";

import logo from "@/assets/LogoImg.png";
import Avatar from "@/assets/sample_avatar.svg";

const useStyles = createStyles((theme) => ({
  border: {
    borderBottom: `1px solid ${
      theme.colors.gray[theme.colorScheme === "light" ? 3 : 8]
    }`,
  },
}));

function NavigationBar() {
  const router = useRouter();
  const { classes } = useStyles();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  return (
    <Group position="apart" p="xs" className={classes.border}>
      <Link href="/" passHref>
        <a style={{ display: "flex", alignItems: "center" }}>
          <Image src={logo} layout="fixed" alt="rices" height={30} width={30} />
        </a>
      </Link>

      <Group>
        <ActionIcon variant="outline" title="create post">
          <IoMdAdd />
        </ActionIcon>

        <ActionIcon variant="outline" title="notifications">
          <IoMdNotifications />
        </ActionIcon>

        <Menu
          control={
            <ActionIcon size="md">
              <Avatar />
            </ActionIcon>
          }
        >
          <Menu.Label>Appearance</Menu.Label>
          <Menu.Item
            icon={dark ? <IoIosSunny /> : <MdNightsStay />}
            onClick={() => toggleColorScheme()}
          >
            {dark ? "Light Mode" : "Dark Mode"}
          </Menu.Item>

          <Divider />

          <Menu.Item icon={<IoMdExit />} onClick={() => router.push("/access")}>
            Login / Register
          </Menu.Item>
        </Menu>
      </Group>
    </Group>
  );
}

export { NavigationBar };
