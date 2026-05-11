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
    HistorialClinico,
    Mascota,
    VeterinariaDB,
} from "../../models/Veterinaria";

export default function RegistrarHistorial() {
  const { doctor } = useAuth();
  const mascotas = VeterinariaDB.obtenerMascotas();

  const [mascotaId, setMascotaId] = useState<string>(
    mascotas.length > 0 ? mascotas[0].id : ""
  );
  const [diagnostico, setDiagnostico] = useState("");
  const [descripcionDolencia, setDescripcionDolencia] = useState("");

  const mascotaSeleccionada: Mascota | null =
    VeterinariaDB.buscarMascota(mascotaId);

  const handleRegistrar = () => {
    if (!mascotaId || !diagnostico || !descripcionDolencia) {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }

    if (!doctor) {
      Alert.alert("Error", "No hay doctor autenticado");
      return;
    }

    const mascota = VeterinariaDB.buscarMascota(mascotaId);
    if (!mascota) {
      Alert.alert("Error", "Mascota no encontrada");
      return;
    }

    const nuevoHistorial = new HistorialClinico(
      Date.now().toString(),
      mascota,
      doctor,
      diagnostico,
      descripcionDolencia,
      new Date()
    );

    VeterinariaDB.registrarHistorial(nuevoHistorial);

    Alert.alert(
      "Éxito",
      `Historial registrado para ${mascota.nombre}`
    );

    setDiagnostico("");
    setDescripcionDolencia("");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.sectionTitle}>Nuevo Historial Clínico</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Seleccionar Mascota</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Mascota</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={mascotaId}
              onValueChange={(v) => setMascotaId(v as string)}
            >
              {mascotas.map((m) => (
                <Picker.Item
                  key={m.id}
                  label={`${m.nombre} (${m.tipo}) — ${m.propietario}`}
                  value={m.id}
                />
              ))}
            </Picker>
          </View>
        </View>

        {mascotaSeleccionada && (
          <View style={styles.infoBox}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Raza:</Text>
              <Text style={styles.infoValue}>{mascotaSeleccionada.raza}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Edad:</Text>
              <Text style={styles.infoValue}>{mascotaSeleccionada.edad} años</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Peso:</Text>
              <Text style={styles.infoValue}>{mascotaSeleccionada.peso} kg</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Medidas:</Text>
              <Text style={styles.infoValue}>{mascotaSeleccionada.medidas}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Propietario:</Text>
              <Text style={styles.infoValue}>{mascotaSeleccionada.propietario}</Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Información Clínica</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Doctor atendiente</Text>
          <View style={styles.doctorBox}>
            <Text style={styles.doctorText}>
              Dr. {doctor?.nombre} — {doctor?.especialidad}
            </Text>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Descripción de la dolencia</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            placeholder="Describe los síntomas y la dolencia del paciente..."
            multiline
            numberOfLines={4}
            value={descripcionDolencia}
            onChangeText={setDescripcionDolencia}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Diagnóstico</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            placeholder="Escribe el diagnóstico clínico..."
            multiline
            numberOfLines={4}
            value={diagnostico}
            onChangeText={setDiagnostico}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRegistrar}>
        <Text style={styles.buttonText}>Registrar Historial</Text>
      </TouchableOpacity>
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
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2d7a61",
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0f0ea",
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
  textarea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#c8e6da",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#f9fdfc",
  },
  infoBox: {
    backgroundColor: "#f0faf6",
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: "#c8e6da",
    gap: 6,
  },
  infoRow: {
    flexDirection: "row",
    gap: 8,
  },
  infoLabel: {
    fontWeight: "700",
    color: "#45ac8b",
    fontSize: 13,
    width: 90,
  },
  infoValue: {
    color: "#333",
    fontSize: 13,
    flex: 1,
  },
  doctorBox: {
    backgroundColor: "#e8f5ef",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#c8e6da",
  },
  doctorText: {
    color: "#2d7a61",
    fontWeight: "600",
    fontSize: 14,
  },
  button: {
    backgroundColor: "#45ac8b",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 17,
  },
});