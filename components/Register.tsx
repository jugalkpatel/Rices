import { useState } from "react";
import { useRouter } from "next/router";
import { SubmitHandler, useForm } from "react-hook-form";
import { gql, useMutation } from "@apollo/client";
import { useNotifications } from "@mantine/notifications";

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
} from "@mantine/core";

import Rocket from "../public/assets/rocket.svg";

import { AuthError, AuthResponse } from "../types";
import { IoMdClose } from "react-icons/io";

type Props = {
  switchPage: () => void;
};

type FormValues = {
  name: string;
  email: string;
  password: string;
};

const REGISTER_MUTATION = gql`
  mutation Register($name: String!, $email: String!, $password: String!) {
    register(name: $name, email: $email, password: $password) {
      ... on AuthPayload {
        __typename
        token
        user {
          id
          name
        }
      }
      ... on AuthError {
        __typename
        message
      }
    }
  }
`;

function Register({ switchPage }: Props) {
  const router = useRouter();
  const notifications = useNotifications();
  const [opened] = useState(true);

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: { name: "", email: "", password: "" },
  });

  const [registerUser, { loading }] = useMutation<{
    register: AuthResponse | AuthError;
  }>(REGISTER_MUTATION, {
    onCompleted: ({ register }) => {
      console.log({ register });
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (values: FormValues) => {
    console.log({ values });

    let message = "something went wrong!";

    registerUser({
      variables: {
        name: values.name,
        email: values.email,
        password: values.password,
      },
    })
      .then((res) => {
        const { data } = res;

        if (data?.register && "token" in data.register) {
          console.log(data.register);
          return;
        }

        if (data?.register && "message" in data.register) {
          message = data.register.message;
        }

        notifications.showNotification({
          message,
          icon: <IoMdClose />,
          color: "red",
        });
      })
      .catch((err) => {
        notifications.showNotification({
          message,
          icon: <IoMdClose />,
          color: "red",
        });
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
