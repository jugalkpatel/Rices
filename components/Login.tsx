import { useState } from "react";
import { useRouter } from "next/router";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation, gql } from "@apollo/client";

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
import WavingHand from "../public/assets/waving_hand.svg";

import { AuthError, AuthResponse } from "../types";

type Props = {
  switchPage: () => void;
};

type FormValues = {
  email: string;
  password: string;
};

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
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

function Login({ switchPage }: Props) {
  const router = useRouter();
  const [opened] = useState(true);
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: { email: "", password: "" },
  });

  const onSubmit: SubmitHandler<FormValues> = async (values: FormValues) => {
    console.log({ values });
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
                    htmlFor="passoword-input"
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

              <Button type="submit" loading={isSubmitting}>
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
