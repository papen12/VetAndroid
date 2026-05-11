import { CameraView, useCameraPermissions } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import React, { useRef, useState } from "react";
import {
  Alert,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function EnviarFotoMascota() {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
  const [camaraActiva, setCamaraActiva] = useState(false);
  const [fotoUri, setFotoUri] = useState<string | null>(null);
  const [fotoGuardada, setFotoGuardada] = useState(false);
  const [correo, setCorreo] = useState("");
  const [asunto, setAsunto] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);
  const camaraRef = useRef<CameraView>(null);

  const abrirCamara = async () => {
    if (!cameraPermission?.granted) {
      const result = await requestCameraPermission();
      if (!result.granted) {
        Alert.alert("Permiso denegado", "Se necesita acceso a la cámara.");
        return;
      }
    }
    setCamaraActiva(true);
    setFotoGuardada(false);
  };

  const tomarFoto = async () => {
    if (!camaraRef.current) return;

    if (!mediaPermission?.granted) {
      const result = await requestMediaPermission();
      if (!result.granted) {
        Alert.alert("Permiso denegado", "Se necesita acceso a la galería para guardar la foto.");
        return;
      }
    }

    const foto = await camaraRef.current.takePictureAsync({ quality: 0.85 });
    if (!foto?.uri) return;

    const asset = await MediaLibrary.createAssetAsync(foto.uri);
    await MediaLibrary.createAlbumAsync("VetApp", asset, false);

    setFotoUri(foto.uri);
    setFotoGuardada(true);
    setCamaraActiva(false);

    Alert.alert("✅ Foto guardada", "La foto se guardó en tu galería en el álbum 'VetApp'.");
  };

  const enviarCorreo = async () => {
    if (!correo.trim()) {
      Alert.alert("Error", "Ingresa un correo electrónico.");
      return;
    }
    if (!asunto.trim()) {
      Alert.alert("Error", "Ingresa un asunto.");
      return;
    }
    if (!mensaje.trim()) {
      Alert.alert("Error", "Escribe un mensaje.");
      return;
    }
    if (!fotoUri || !fotoGuardada) {
      Alert.alert("Error", "Toma y guarda una foto primero.");
      return;
    }

    setEnviando(true);
    try {
      const asuntoCodificado = encodeURIComponent(asunto);
      const cuerpo = `${mensaje}\n\n📎 Adjunta manualmente la foto desde tu álbum 'VetApp' en la galería.`;
      const mensajeCodificado = encodeURIComponent(cuerpo);
      const mailtoUrl = `mailto:${correo}?subject=${asuntoCodificado}&body=${mensajeCodificado}`;

      const puedeAbrir = await Linking.canOpenURL(mailtoUrl);
      if (!puedeAbrir) {
        Alert.alert("Sin app de correo", "No se encontró una app de correo instalada en el dispositivo.");
        return;
      }

      await Linking.openURL(mailtoUrl);
    } catch {
      Alert.alert("Error", "No se pudo abrir el correo.");
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
        <Text style={styles.cardTitle}>📷 Foto de la mascota</Text>
        {fotoUri ? (
          <View>
            <Image source={{ uri: fotoUri }} style={styles.preview} />
            {fotoGuardada && (
              <View style={styles.savedBadge}>
                <Text style={styles.savedBadgeText}>✅ Guardada en galería — álbum VetApp</Text>
              </View>
            )}
            <TouchableOpacity style={styles.retakeBtn} onPress={abrirCamara}>
              <Text style={styles.retakeBtnText}>📷 Tomar otra foto</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.cameraBtn} onPress={abrirCamara}>
            <Text style={styles.cameraBtnIcon}>📷</Text>
            <Text style={styles.cameraBtnText}>Abrir cámara</Text>
            <Text style={styles.cameraBtnSub}>
              La foto se guardará en tu galería
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>✉️ Datos del correo</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Correo destinatario</Text>
          <View style={styles.emailRow}>
            <Text style={styles.emailIcon}>✉️</Text>
            <TextInput
              style={styles.emailInput}
              placeholder="ejemplo@correo.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={correo}
              onChangeText={setCorreo}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Asunto</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Foto de mascota - Consulta veterinaria"
            value={asunto}
            onChangeText={setAsunto}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Mensaje</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            placeholder="Escribe el cuerpo del correo..."
            multiline
            numberOfLines={4}
            value={mensaje}
            onChangeText={setMensaje}
          />
        </View>
      </View>

      {fotoGuardada && (
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            📌 Al abrir el correo, adjunta manualmente la foto desde tu galería en el álbum <Text style={styles.infoBold}>VetApp</Text>.
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.sendBtn,
          (!fotoGuardada || enviando) && styles.sendBtnDisabled,
        ]}
        onPress={enviarCorreo}
        disabled={!fotoGuardada || enviando}
      >
        <Text style={styles.sendBtnText}>
          {enviando ? "Abriendo correo..." : "📧 Abrir correo"}
        </Text>
      </TouchableOpacity>

      {!fotoGuardada && (
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
  inputContainer: {
    marginBottom: 14,
  },
  label: {
    color: "#45ac8b",
    marginBottom: 6,
    fontWeight: "600",
    fontSize: 14,
  },
  emailRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#c8e6da",
    borderRadius: 10,
    backgroundColor: "#f9fdfc",
    paddingHorizontal: 12,
  },
  emailIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  emailInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: "#1a1a1a",
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
    marginBottom: 10,
  },
  savedBadge: {
    backgroundColor: "#e0f5ed",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  savedBadgeText: {
    color: "#2d7a61",
    fontWeight: "600",
    fontSize: 13,
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
  infoBox: {
    backgroundColor: "#fff8e1",
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    borderLeftWidth: 4,
    borderLeftColor: "#f5c518",
  },
  infoText: {
    color: "#7a6000",
    fontSize: 13,
    lineHeight: 20,
  },
  infoBold: {
    fontWeight: "700",
  },
  sendBtn: {
    backgroundColor: "#45ac8b",
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