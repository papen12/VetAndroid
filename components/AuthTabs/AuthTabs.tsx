import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import {
  Doctor,
  especialidadesVeterinarias,
  EspecialidadVeterinaria,
  VeterinariaDB,
} from "../../models/Veterinaria";

export function Login() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const { setDoctor } = useAuth();

  const handleLogin = () => {
    if (!usuario || !password) {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }

    const doctor = VeterinariaDB.login(usuario, password);

    if (!doctor) {
      Alert.alert("Error", "Credenciales incorrectas");
      return;
    }

    setDoctor(doctor);
    setUsuario("");
    setPassword("");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Login Veterinario</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Usuario</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingrese su usuario"
          value={usuario}
          onChangeText={setUsuario}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingrese su contraseña"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Iniciar Sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

export function SignUp() {
  const [nombre, setNombre] = useState("");
  const [especialidad, setEspecialidad] =
    useState<EspecialidadVeterinaria>("Medicina General");
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = () => {
    if (!nombre || !especialidad || !usuario || !password) {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }

    if (VeterinariaDB.existeUsuario(usuario)) {
      Alert.alert("Error", "El usuario ya existe");
      return;
    }

    const nuevoDoctor = new Doctor(
      Date.now().toString(),
      nombre,
      especialidad,
      usuario,
      password
    );

    VeterinariaDB.registrarDoctor(nuevoDoctor);

    Alert.alert("Éxito", "Veterinario registrado correctamente. Ahora puedes iniciar sesión.");

    setNombre("");
    setEspecialidad("Medicina General");
    setUsuario("");
    setPassword("");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Registro Veterinario</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre completo"
          value={nombre}
          onChangeText={setNombre}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Especialidad</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={especialidad}
            onValueChange={(itemValue) =>
              setEspecialidad(itemValue as EspecialidadVeterinaria)
            }
          >
            {especialidadesVeterinarias.map((esp) => (
              <Picker.Item key={esp} label={esp} value={esp} />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Usuario</Text>
        <TextInput
          style={styles.input}
          placeholder="Usuario"
          value={usuario}
          onChangeText={setUsuario}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Registrar Veterinario</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

export default function AuthTabs() {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");

  return (
    <View style={styles.mainContainer}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "login" ? styles.activeTab : styles.inactiveTab,
          ]}
          onPress={() => setActiveTab("login")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "login"
                ? styles.activeTabText
                : styles.inactiveTabText,
            ]}
          >
            Login
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "signup" ? styles.activeTab : styles.inactiveTab,
          ]}
          onPress={() => setActiveTab("signup")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "signup"
                ? styles.activeTabText
                : styles.inactiveTabText,
            ]}
          >
            Sign Up
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {activeTab === "login" ? <Login /> : <SignUp />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
    backgroundColor: "#FFFFFF",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#45ac8b",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: "#45ac8b",
    marginBottom: 8,
    fontWeight: "600",
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#45ac8b",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#000000",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#45ac8b",
    borderRadius: 12,
    overflow: "hidden",
  },
  button: {
    backgroundColor: "#45ac8b",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 18,
  },
  tabContainer: {
    flexDirection: "row",
    marginTop: 50,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: "#45ac8b",
    borderRadius: 12,
    overflow: "hidden",
  },
  tabButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#45ac8b",
  },
  inactiveTab: {
    backgroundColor: "#FFFFFF",
  },
  tabText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  activeTabText: {
    color: "#FFFFFF",
  },
  inactiveTabText: {
    color: "#45ac8b",
  },
  content: {
    flex: 1,
  },
});