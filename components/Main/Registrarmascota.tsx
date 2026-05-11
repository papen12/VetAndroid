import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Mascota,
  TipoAnimal,
  tiposAnimal,
  VeterinariaDB,
} from "../../models/Veterinaria";

export default function RegistrarMascota() {
  const [nombre, setNombre] = useState("");
  const [propietario, setPropietario] = useState("");
  const [raza, setRaza] = useState("");
  const [tipo, setTipo] = useState<TipoAnimal>("Perro");
  const [edad, setEdad] = useState("");
  const [peso, setPeso] = useState("");
  const [medidas, setMedidas] = useState("");
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [errorVisible, setErrorVisible] = useState(false);

  const handlePreRegistrar = () => {
    if (!nombre || !propietario || !raza || !edad || !peso || !medidas) {
      setErrorMsg("Por favor, completa todos los campos antes de continuar.");
      setErrorVisible(true);
      return;
    }
    if (isNaN(parseFloat(edad)) || isNaN(parseFloat(peso))) {
      setErrorMsg("La edad y el peso deben ser valores numéricos válidos.");
      setErrorVisible(true);
      return;
    }
    setConfirmVisible(true);
  };

  const handleConfirmar = () => {
    const nuevaMascota = new Mascota(
      Date.now().toString(),
      nombre,
      parseFloat(edad),
      parseFloat(peso),
      tipo,
      medidas,
      propietario,
      raza
    );
    VeterinariaDB.registrarMascota(nuevaMascota);
    setConfirmVisible(false);
    setSuccessVisible(true);
  };

  const handleSuccessClose = () => {
    setSuccessVisible(false);
    setNombre("");
    setPropietario("");
    setRaza("");
    setTipo("Perro");
    setEdad("");
    setPeso("");
    setMedidas("");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.sectionTitle}>Datos de la Mascota</Text>

      <View style={styles.card}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nombre de la mascota</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Max"
            value={nombre}
            onChangeText={setNombre}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Propietario</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre del dueño"
            value={propietario}
            onChangeText={setPropietario}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Tipo de animal</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={tipo}
              onValueChange={(v) => setTipo(v as TipoAnimal)}
            >
              {tiposAnimal.map((t) => (
                <Picker.Item key={t} label={t} value={t} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Raza</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Labrador"
            value={raza}
            onChangeText={setRaza}
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.inputContainer, styles.half]}>
            <Text style={styles.label}>Edad (años)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: 3"
              keyboardType="numeric"
              value={edad}
              onChangeText={setEdad}
            />
          </View>
          <View style={[styles.inputContainer, styles.half]}>
            <Text style={styles.label}>Peso (kg)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: 12.5"
              keyboardType="numeric"
              value={peso}
              onChangeText={setPeso}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Medidas</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: 50cm de altura"
            value={medidas}
            onChangeText={setMedidas}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handlePreRegistrar}>
        <Text style={styles.buttonText}>Registrar Mascota</Text>
      </TouchableOpacity>

      <Modal
        transparent
        visible={confirmVisible}
        animationType="fade"
        onRequestClose={() => setConfirmVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalIcon}>🐾</Text>
            <Text style={styles.modalTitle}>Confirmar registro</Text>
            <Text style={styles.modalMessage}>
              ¿Deseas registrar a{" "}
              <Text style={styles.modalBold}>{nombre}</Text> ({tipo}) como
              nuevo paciente?
            </Text>
            <View style={styles.modalSummary}>
              <Text style={styles.summaryRow}>
                👤 Propietario: <Text style={styles.summaryVal}>{propietario}</Text>
              </Text>
              <Text style={styles.summaryRow}>
                🐕 Raza: <Text style={styles.summaryVal}>{raza}</Text>
              </Text>
              <Text style={styles.summaryRow}>
                ⚖️ Peso: <Text style={styles.summaryVal}>{peso} kg</Text>
                {"  "}🎂 Edad:{" "}
                <Text style={styles.summaryVal}>{edad} años</Text>
              </Text>
              <Text style={styles.summaryRow}>
                📐 Medidas: <Text style={styles.summaryVal}>{medidas}</Text>
              </Text>
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalBtnCancel}
                onPress={() => setConfirmVisible(false)}
              >
                <Text style={styles.modalBtnCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalBtnConfirm}
                onPress={handleConfirmar}
              >
                <Text style={styles.modalBtnConfirmText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        visible={successVisible}
        animationType="fade"
        onRequestClose={handleSuccessClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalIcon}>✅</Text>
            <Text style={styles.modalTitle}>¡Mascota registrada!</Text>
            <Text style={styles.modalMessage}>
              <Text style={styles.modalBold}>{nombre}</Text> ha sido agregado
              correctamente al sistema.
            </Text>
            <TouchableOpacity
              style={[styles.modalBtnConfirm, { marginTop: 8 }]}
              onPress={handleSuccessClose}
            >
              <Text style={styles.modalBtnConfirmText}>Aceptar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        visible={errorVisible}
        animationType="fade"
        onRequestClose={() => setErrorVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalIcon}>⚠️</Text>
            <Text style={styles.modalTitle}>Campos incompletos</Text>
            <Text style={styles.modalMessage}>{errorMsg}</Text>
            <TouchableOpacity
              style={[styles.modalBtnConfirm, { marginTop: 8 }]}
              onPress={() => setErrorVisible(false)}
            >
              <Text style={styles.modalBtnConfirmText}>Entendido</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f5faf8",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2d7a61",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#45ac8b",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    color: "#45ac8b",
    marginBottom: 6,
    fontWeight: "600",
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: "#c8e6da",
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: "#1a1a1a",
    backgroundColor: "#f9fdfc",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#c8e6da",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#f9fdfc",
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  half: {
    flex: 1,
  },
  button: {
    backgroundColor: "#45ac8b",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 17,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalBox: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 26,
    width: "88%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  modalIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 8,
    textAlign: "center",
  },
  modalMessage: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 20,
  },
  modalBold: {
    fontWeight: "700",
    color: "#1a1a1a",
  },
  modalSummary: {
    backgroundColor: "#f0faf6",
    borderRadius: 12,
    padding: 14,
    width: "100%",
    marginBottom: 20,
    gap: 6,
  },
  summaryRow: {
    fontSize: 13,
    color: "#444",
  },
  summaryVal: {
    fontWeight: "600",
    color: "#1a1a1a",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  modalBtnCancel: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#c8e6da",
    alignItems: "center",
  },
  modalBtnCancelText: {
    color: "#45ac8b",
    fontWeight: "700",
    fontSize: 15,
  },
  modalBtnConfirm: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: "#45ac8b",
    alignItems: "center",
  },
  modalBtnConfirmText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 15,
  },
});