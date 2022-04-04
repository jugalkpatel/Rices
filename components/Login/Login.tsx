import { useState } from "react";
import { useRouter } from "next/router";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNotifications } from "@mantine/notifications";
import { NotificationsContextProps } from "@mantine/notifications/lib/types";

import {
  Modal,
  Group,
  InputWrapper,
  Input,
  PasswordInput,
  Text,
  Button,
  Anchor,
  Title,
} from "@mantine/core";
import { IoMdClose } from "react-icons/io";
import WavingHand from "@/assets/waving_hand.svg";

import { useLoginMutation } from "./__generated__/login.generated";
import setAuthCredentials from "@/utils/setAuthCredentials";
import { setAuthorization, setUserId, setUserName } from "../../cache";

type Props = {
  switchPage: () => void;
};

type FormValues = {
  email: string;
  password: string;
};

function showNotification(
  msg: string,
  notifications: NotificationsContextProps
) {
  notifications.showNotification({
    message: msg,
    icon: <IoMdClose />,
    color: "red",
  });
}

function Login({ switchPage }: Props) {
  const router = useRouter();
  const redirectToLogin = () => router.push("/access");
  const notifications = useNotifications();
  const [opened] = useState(true);

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    mode: "onBlur",
    defaultValues: { email: "", password: "" },
  });

  const [loginUser, { loading }] = useLoginMutation();

  const onSubmit: SubmitHandler<FormValues> = async (values: FormValues) => {
    let message = "something went wrong!";

    loginUser({
      variables: {
        email: values.email,
        password: values.password,
      },
    })
      .then((response) => {
        const { data } = response;

        if (data?.login && data.login.__typename === "AuthPayload") {
          const {
            token,
            user: { id, name },
          } = data.login;

          const isSavedInLocalStorage = setAuthCredentials({ token, id, name });

          setAuthorization(true);

          setUserId(id);

          setUserName(name);

          if (!isSavedInLocalStorage) {
            showNotification(
              "failed to save item in the localstorage",
              notifications
            );
            return;
          }

          router.push("/");
          return;
        }

        if (data?.login && data.login.__typename === "AuthError") {
          message = data.login.message;
        }

        showNotification(message, notifications);
        redirectToLogin();
      })
      .catch((err) => {
        // for unknown errors
        showNotification(message, notifications);
        redirectToLogin();
      });
  };

  return (
    <>
      <Modal opened={opened} size="sm" onClose={() => router.back()} centered>
        <Group direction="column" spacing="md" grow>
          <Group direction="column">
            <WavingHand />

            <Title order={2}>Welcome Back!</Title>

            <Group direction="row" spacing={5}>
              <Text color="dimmmed">New to Rices?</Text>
              <Text
                color="orange"
                weight="700"
                onClick={() => switchPage()}
                sx={() => ({ cursor: "pointer" })}
              >
                Register
              </Text>
            </Group>
          </Group>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Group direction="column" spacing="xl" grow>
              <InputWrapper
                id="email-input"
                label="Email"
                error={errors.email ? errors.email.message : null}
              >
                <Input
                  id="email-input"
                  placeholder="Type your email"
                  {...register("email", {
                    required: "Email is required",
                  })}
                />
              </InputWrapper>

              <div>
                <Group position="apart" mb={5}>
                  <Text
                    component="label"
                    htmlFor="password-input"
                    size="sm"
                    weight={500}
                  >
                    Password
                  </Text>

                  <Anchor<"a">
                    href="#"
                    onClick={(event) => {
                      event.preventDefault();
                    }}
                    sx={(theme) => ({
                      paddingTop: 2,
                      color:
                        theme.colors[theme.primaryColor][
                          theme.colorScheme === "dark" ? 4 : 6
                        ],
                      fontWeight: 500,
                      fontSize: theme.fontSizes.xs,
                    })}
                  >
                    Forgot your password?
                  </Anchor>
                </Group>

                <PasswordInput
                  placeholder="Your password"
                  id="password-input"
                  error={errors.password ? errors.password.message : null}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "minimum length should be 8 characters",
                    },
                    maxLength: {
                      value: 15,
                      message: "maximum length should be 15 characters",
                    },
                  })}
                />
              </div>

              <Button type="submit" loading={isSubmitting || loading}>
                Login
              </Button>
            </Group>
          </form>
        </Group>
      </Modal>
    </>
  );
}

export { Login };
