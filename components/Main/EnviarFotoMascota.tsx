import { CameraView, useCameraPermissions } from "expo-camera";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import React, { useRef, useState } from "react";
import {
  Alert,
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function EnviarFotoMascota() {
  const [permission, requestPermission] = useCameraPermissions();
  const [camaraActiva, setCamaraActiva] = useState(false);
  const [fotoUri, setFotoUri] = useState<string | null>(null);
  const [numero, setNumero] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);
  const camaraRef = useRef<CameraView>(null);

  const abrirCamara = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert("Permiso denegado", "Se necesita acceso a la cámara.");
        return;
      }
    }
    setCamaraActiva(true);
  };

  const tomarFoto = async () => {
    if (!camaraRef.current) return;
    const foto = await camaraRef.current.takePictureAsync({ quality: 0.7 });
    setFotoUri(foto?.uri ?? null);
    setCamaraActiva(false);
  };

  const enviarConFoto = async () => {
    const telefonoLimpio = numero.replace(/\D/g, "");
    if (!telefonoLimpio) {
      Alert.alert("Error", "Ingresa un número de teléfono válido.");
      return;
    }
    if (!fotoUri) {
      Alert.alert("Error", "Toma una foto primero.");
      return;
    }
    if (!mensaje.trim()) {
      Alert.alert("Error", "Escribe un mensaje antes de enviar.");
      return;
    }

    setEnviando(true);
    try {
      const disponible = await Sharing.isAvailableAsync();
      if (!disponible) {
        Alert.alert("No disponible", "Compartir no está disponible en este dispositivo.");
        return;
      }

      const phone =
        Platform.OS === "ios"
          ? `591${telefonoLimpio}`
          : `591${telefonoLimpio}`;

      const textoCodificado = encodeURIComponent(mensaje);
      const whatsappUrl = `whatsapp://send?phone=${phone}&text=${textoCodificado}`;

     const destino = `${FileSystem.Paths.cache}/mascota_foto.jpg`;

      await FileSystem.copyAsync({
        from: fotoUri,
        to: destino,
      });

      const puedeAbrir = await Linking.canOpenURL(whatsappUrl);

      if (puedeAbrir) {
        await Linking.openURL(whatsappUrl);
        await new Promise((resolve) => setTimeout(resolve, 1500));
      } else {
        Alert.alert(
          "WhatsApp no disponible",
          "No se pudo abrir WhatsApp en este dispositivo."
        );
      }

      await Sharing.shareAsync(destino, {
        mimeType: "image/jpeg",
        dialogTitle: "Enviar foto de mascota por WhatsApp",
        UTI: "public.jpeg",
      });
    } catch (error) {
      Alert.alert("Error", "No se pudo compartir la foto.");
      console.error(error);
    } finally {
      setEnviando(false);
    }
  };

  if (camaraActiva) {
    return (
      <View style={styles.cameraContainer}>
        <CameraView ref={camaraRef} style={styles.camera} facing="back" />
        <View style={styles.cameraControls}>
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => setCamaraActiva(false)}
          >
            <Text style={styles.cancelBtnText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shutterBtn} onPress={tomarFoto}>
            <View style={styles.shutterInner} />
          </TouchableOpacity>
          <View style={{ width: 80 }} />
        </View>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.sectionTitle}>Enviar Foto de Mascota</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Número WhatsApp</Text>
        <View style={styles.phoneRow}>
          <View style={styles.prefixBox}>
            <Text style={styles.prefixText}>🇧🇴 +591</Text>
          </View>
          <TextInput
            style={styles.phoneInput}
            placeholder="Ej: 70000000"
            keyboardType="phone-pad"
            value={numero}
            onChangeText={setNumero}
            maxLength={8}
          />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Foto de la mascota</Text>
        {fotoUri ? (
          <View>
            <Image source={{ uri: fotoUri }} style={styles.preview} />
            <TouchableOpacity style={styles.retakeBtn} onPress={abrirCamara}>
              <Text style={styles.retakeBtnText}>📷 Tomar otra foto</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.cameraBtn} onPress={abrirCamara}>
            <Text style={styles.cameraBtnIcon}>📷</Text>
            <Text style={styles.cameraBtnText}>Abrir cámara</Text>
            <Text style={styles.cameraBtnSub}>Toma una foto de la mascota</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Mensaje</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          placeholder="Escribe un mensaje para acompañar la foto..."
          multiline
          numberOfLines={4}
          value={mensaje}
          onChangeText={setMensaje}
        />
      </View>

      <TouchableOpacity
        style={[
          styles.sendBtn,
          (!fotoUri || enviando) && styles.sendBtnDisabled,
        ]}
        onPress={enviarConFoto}
        disabled={!fotoUri || enviando}
      >
        <Text style={styles.sendBtnText}>
          {enviando ? "Preparando..." : "💬 Enviar por WhatsApp"}
        </Text>
      </TouchableOpacity>

      {!fotoUri && (
        <Text style={styles.hint}>
          * Toma una foto primero para habilitar el envío
        </Text>
      )}
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
  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  prefixBox: {
    backgroundColor: "#e8f5ef",
    borderWidth: 1,
    borderColor: "#c8e6da",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  prefixText: {
    color: "#2d7a61",
    fontWeight: "700",
    fontSize: 15,
  },
  phoneInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#c8e6da",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: "#1a1a1a",
    backgroundColor: "#f9fdfc",
  },
  cameraBtn: {
    backgroundColor: "#e8f5ef",
    borderWidth: 1.5,
    borderColor: "#45ac8b",
    borderStyle: "dashed",
    borderRadius: 12,
    paddingVertical: 30,
    alignItems: "center",
    gap: 6,
  },
  cameraBtnIcon: { fontSize: 36 },
  cameraBtnText: {
    color: "#2d7a61",
    fontWeight: "700",
    fontSize: 16,
  },
  cameraBtnSub: {
    color: "#888",
    fontSize: 13,
  },
  preview: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    marginBottom: 12,
  },
  retakeBtn: {
    borderWidth: 1,
    borderColor: "#45ac8b",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  retakeBtnText: {
    color: "#45ac8b",
    fontWeight: "700",
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
  sendBtn: {
    backgroundColor: "#25D366",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  sendBtnDisabled: {
    backgroundColor: "#a0d9b8",
  },
  sendBtnText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 17,
  },
  hint: {
    textAlign: "center",
    color: "#aaa",
    fontSize: 12,
    fontStyle: "italic",
    marginBottom: 20,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
  },
  cameraControls: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 20,
  },
  cancelBtn: {
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    width: 80,
    alignItems: "center",
  },
  cancelBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  shutterBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  shutterInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#fff",
  },
});