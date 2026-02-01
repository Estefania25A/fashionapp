import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,          // 👈 ESTA LÍNEA FALTABA
} from 'react-native';

import { z } from 'zod';

export default function App() {
  // ---------- ESTADOS ----------
  const [step, setStep] = useState(0);
  const [isRegister, setIsRegister] = useState(false);
  const [logged, setLogged] = useState(false);

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const API_URL = 'http://10.0.2.2:5000';

  // ---------- ZOD SCHEMA ----------
  const registerSchema = z
    .object({
      nombre: z.string().min(1, 'El nombre es obligatorio'),
      email: z.string().email('Correo no válido'),
      password: z
        .string()
        .min(6, 'La contraseña debe tener al menos 6 caracteres'),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Las contraseñas no coinciden',
      path: ['confirmPassword'],
    });

  // ---------- VALIDACIÓN ----------
  const validateRegister = () => {
    const result = registerSchema.safeParse({
      nombre,
      email,
      password,
      confirmPassword,
    });

    if (!result.success) {
      Alert.alert('Error', result.error.errors[0].message);
      return false;
    }
    return true;
  };

  // ---------- LOGIN ----------
  const login = async () => {
  if (!email || !password) {
    Alert.alert('Error', 'Ingrese email y contraseña');
    return;
  }

  try {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      setNombre(data.nombre);
      setLogged(true);
    } else {
      Alert.alert(
        'Error',
        data.message || 'Correo o contraseña incorrectos'
      );
    }
  } catch {
    Alert.alert('Error', 'No se pudo conectar al servidor');
  }
};
// ---------- REGISTRO ----------
const register = async () => {
  if (!validateRegister()) return;

  try {
    const res = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre,
        email,
        password,
        rol: 'cliente',
      }),
    });

    const data = await res.json();

    if (res.ok) {
      Alert.alert('Éxito', 'Usuario registrado correctamente');
      setIsRegister(false);
    } else {
      Alert.alert(
        'Error',
        data.message || 'Este correo ya está registrado'
      );
    }
  } catch {
    Alert.alert('Error', 'No se pudo registrar');
  }
};

  // ---------- RENDER ----------
  return (
    <View style={styles.container}>
      {/* ---------- VISTA PROTEGIDA ---------- */}
      {logged && (
        <>
          <Text style={styles.title}>Bienvenida {nombre} 💖</Text>
          <Text style={styles.text}>Vista protegida activa</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => setLogged(false)}
          >
            <Text style={styles.buttonText}>Cerrar sesión</Text>
          </TouchableOpacity>
        </>
      )}

      {/* ---------- ONBOARDING ---------- */}
      {!logged && step < 3 && (
        <>
          <Image
            source={require('./assets/divamujer.png')}
            style={styles.logo}
          />

          <Text style={styles.title}>
            {step === 0 && 'Bienvenida a Divina Mujer'}
            {step === 1 && 'Moda pensada para ti'}
            {step === 2 && 'Regístrate y empieza ahora'}
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => setStep(step + 1)}
          >
            <Text style={styles.buttonText}>Siguiente</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setStep(3)}>
            <Text style={styles.link}>Saltar</Text>
          </TouchableOpacity>
        </>
      )}

      {/* ---------- LOGIN / REGISTRO ---------- */}
      {!logged && step >= 3 && (
        <>
          <Image
            source={require('./assets/divamujer.png')}
            style={styles.logo}
          />

          <Text style={styles.title}>Divina Mujer</Text>

          {isRegister && (
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              value={nombre}
              onChangeText={setNombre}
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {isRegister && (
            <TextInput
              style={styles.input}
              placeholder="Confirmar contraseña"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          )}

          <TouchableOpacity
            style={styles.button}
            onPress={isRegister ? register : login}
          >
            <Text style={styles.buttonText}>
              {isRegister ? 'Registrar' : 'Ingresar'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsRegister(!isRegister)}>
            <Text style={styles.link}>
              {isRegister
                ? '¿Ya tienes cuenta? Inicia sesión'
                : '¿Eres nueva? Crea una cuenta'}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

// ---------- ESTILOS ----------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 140,
    height: 140,
    alignSelf: 'center',
    marginBottom: 20,
    resizeMode: 'contain',
  },
  title: {
  fontSize: 26,
  fontWeight: '700',
  textAlign: 'center',
  marginBottom: 20,
  letterSpacing: 1,
},
text: {
  fontSize: 16,
  textAlign: 'center',
  marginBottom: 15,
  fontWeight: '400',
},

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
    padding: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#c2185b',
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  link: {
    color: '#c2185b',
    marginTop: 15,
    textAlign: 'center',
  },
});
