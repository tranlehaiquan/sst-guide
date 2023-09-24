import { useState } from "react";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
import "./Signin.css";
import { ISignUpResult } from "amazon-cognito-identity-js";
import { Auth } from "aws-amplify";
// import { useNavigate } from "react-router-dom";
import { useAppContext } from "../libs/contextLib";
// use form
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
  // confirm password must match password
  confirmPassword: yup
    .string()
    .required()
    .oneOf([yup.ref("password")]),
});

// type
type FormData = {
  email: string;
  password: string;
  confirmPassword: string;
};

export default function Login() {
  const { register, handleSubmit, formState } = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    resolver: yupResolver(schema),
  });
  const [newUser, setNewUser] = useState<null | ISignUpResult>(null);

  const nav = useNavigate();
  const { userHasAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);

  // use form confirm
  const methods = useForm<{ code: string }>({
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true);

    try {
      const newUser = await Auth.signUp(data.email, data.password);
      setNewUser(newUser);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert(String(error));
      }
    } finally {
      setIsLoading(false);
    }
  });

  const onSubmitConfirm = methods.handleSubmit(async (data) => {
    setIsLoading(true);

    try {
      if (!newUser) {
        throw new Error("newUser is null");
      }
      await Auth.confirmSignUp(newUser.user.getUsername(), data.code);
      await Auth.signIn(newUser.user.getUsername(), data.code);
      userHasAuthenticated(true);
      nav("/");
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert(String(error));
      }
      setIsLoading(false);
    }
  });

  if (newUser) {
    // show confirm
    return (
      <div className="Login">
        <Form onSubmit={onSubmitConfirm}>
          <Stack gap={3}>
            <Form.Group controlId="code">
              <Form.Label>Code</Form.Label>
              <Form.Control
                autoFocus
                size="lg"
                type="text"
                {...methods.register("code")}
              />
              {/* error */}
              {methods.formState.errors.code && (
                <p className="error">{methods.formState.errors.code.message}</p>
              )}
            </Form.Group>
            <Button size="lg" type="submit" disabled={isLoading}>
              Confirm
            </Button>
          </Stack>
        </Form>
      </div>
    );
  }

  return (
    <div className="Login">
      <Form onSubmit={onSubmit}>
        <Stack gap={3}>
          <Form.Group controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              autoFocus
              size="lg"
              type="email"
              {...register("email")}
            />
            {/* error */}
            {formState.errors.email && (
              <p className="error">{formState.errors.email.message}</p>
            )}
          </Form.Group>
          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control size="lg" type="password" {...register("password")} />
            {formState.errors.password && (
              <p className="error">{formState.errors.password.message}</p>
            )}
          </Form.Group>
          <Form.Group controlId="confirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              size="lg"
              type="password"
              {...register("confirmPassword")}
            />
            {formState.errors.confirmPassword && (
              <p className="error">
                {formState.errors.confirmPassword.message}
              </p>
            )}
          </Form.Group>
          <Button size="lg" type="submit" disabled={isLoading}>
            Login
          </Button>
        </Stack>
      </Form>
    </div>
  );
}
