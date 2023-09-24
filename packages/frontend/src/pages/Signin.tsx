import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
import "./Signin.css";
import { Auth } from "aws-amplify";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../libs/contextLib";
// use form
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

// type
type FormData = {
  email: string;
  password: string;
};

export default function Login() {
  const { register, handleSubmit, formState } = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(schema),
  });

  const nav = useNavigate();
  const { userHasAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true);

    try {
      await Auth.signIn(data.email, data.password);
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
          <Button size="lg" type="submit" disabled={isLoading}>
            Login
          </Button>
        </Stack>
      </Form>
    </div>
  );
}
