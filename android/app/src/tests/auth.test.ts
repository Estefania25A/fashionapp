import { loginUser, formatUser } from "../../../../src/domain/auth";

test("login correcto", () => {
  const result = loginUser("admin@test.com", "123456");
  expect(result.success).toBe(true);
});

test("login incorrecto", () => {
  const result = loginUser("admin@test.com", "wrong");
  expect(result.success).toBe(false);
});

test("error si faltan datos", () => {
  expect(() => loginUser("", "")).toThrow("Campos requeridos");
});

test("formatea el email", () => {
  const user = formatUser(" ADMIN@TEST.COM ");
  expect(user.email).toBe("admin@test.com");
});