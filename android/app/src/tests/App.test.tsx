import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { View, Button, Text } from "react-native";
import { loginUser } from "../../../../src/domain/auth";

function TestApp() {
  const [message, setMessage] = React.useState("");

  const handleLogin = () => {
    const result = loginUser("admin@test.com", "123456");
    if (result.success) {
      setMessage("Bienvenido");
    }
  };

  return (
    <View>
      <Button title="Login" onPress={handleLogin} />
      <Text>{message}</Text>
    </View>
  );
}

test("flujo de login muestra Bienvenido", () => {
  const { getByText } = render(<TestApp />);

  fireEvent.press(getByText("Login"));

  expect(getByText("Bienvenido")).toBeTruthy();
});