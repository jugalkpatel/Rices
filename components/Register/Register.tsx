import { useState } from "react";
import { useRouter } from "next/router";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNotifications } from "@mantine/notifications";
import { NotificationsContextProps } from "@mantine/notifications/lib/types";

import {
  Modal,
  Button,
  Group,
  Title,
  Text,
  InputWrapper,
  Input,
  Anchor,
  PasswordInput,
  Box,
  Notification,
} from "@mantine/core";
import { IoMdClose } from "react-icons/io";
import Rocket from "@/assets/rocket.svg";

import { useRegisterMutation } from "./__generated__/register.generated";
import setAuthCredentialsInLocalStorage from "@/utils/setAuthCredentialsInLocalStorage";
import { setAuthCredentials } from "../../cache";

type Props = {
  switchPage: () => void;
};

type FormValues = {
  name: string;
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

function Register({ switchPage }: Props) {
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
    defaultValues: { name: "", email: "", password: "" },
  });

  const [registerUser, { loading }] = useRegisterMutation();

  const onSubmit: SubmitHandler<FormValues> = async (values: FormValues) => {
    let message = "something went wrong!";

    registerUser({
      variables: {
        name: values.name,
        email: values.email,
        password: values.password,
      },
    })
      .then((response) => {
        const { data } = response;

        if (data?.register && data.register.__typename === "AuthPayload") {
          const {
            token,
            user: { id, name },
          } = data.register;

          const isSavedInLocalStorage = setAuthCredentialsInLocalStorage({
            id,
            name,
            token,
          });

          // TODO: Replace following three lines with a function: setUserCredentials
          setAuthCredentials({
            authorization: true,
            userId: id,
            userName: name,
          });

          if (!isSavedInLocalStorage) {
            showNotification(
              "failed to save item in localstorage",
              notifications
            );
            return;
          }

          router.push("/");

          return;
        }

        if (data?.register && data.register.__typename === "AuthError") {
          message = data.register.message;
        }

        showNotification(message, notifications);
        redirectToLogin();
      })
      .catch((error) => {
        // unhandled errors
        showNotification(message, notifications);
        redirectToLogin();
      });
  };

  return (
    <>
      <Modal opened={opened} onClose={() => router.back()} size="sm" centered>
        <Group direction="column" spacing="md" grow>
          <Group direction="column">
            <Box sx={() => ({ height: "3rem", width: "3rem" })}>
              <Rocket />
            </Box>

            <Title order={2}>Get Started</Title>

            <Group direction="row" spacing={5}>
              <Text color="dimmmed">Already have an account?</Text>
              <Text
                color="orange"
                weight="700"
                onClick={() => switchPage()}
                sx={() => ({
                  cursor: "pointer",
                })}
              >
                Login
              </Text>
            </Group>
          </Group>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Group direction="column" spacing="xl" grow>
              <InputWrapper
                id="name-input"
                label="Name"
                error={errors.name ? errors.name.message : null}
              >
                <Input
                  id="name-input"
                  placeholder="Type your name"
                  {...register("name", {
                    required: "Name is required",
                  })}
                />
              </InputWrapper>

              {/*TODO: validate Email */}
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

                  {/* TODO: Implement forget password */}
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
                  placeholder="Type your password"
                  id="password-inpput"
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
                Register
              </Button>
            </Group>
          </form>
        </Group>
      </Modal>
    </>
  );
}

export { Register };
