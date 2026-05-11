import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { HistorialClinico, VeterinariaDB } from "../../models/Veterinaria";

interface RecepcionProps {
  onNavigate: (screen: string) => void;
}

export default function Recepcion({ onNavigate }: RecepcionProps) {
  const { doctor } = useAuth();
  const mascotas = VeterinariaDB.obtenerMascotas();
  const historiales = VeterinariaDB.obtenerHistoriales();

  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [selectedHistorial, setSelectedHistorial] =
    useState<HistorialClinico | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  const hoy = new Date();
  const historialesHoy = historiales.filter((h) => {
    const fecha = new Date(h.fecha);
    return fecha.toDateString() === hoy.toDateString();
  });

  const handleLongPress = (h: HistorialClinico) => {
    setSelectedHistorial(h);
    setContextMenuVisible(true);
  };

  const handleContextOption = (option: string) => {
    setContextMenuVisible(false);
    if (option === "ver") {
      setDetailModalVisible(true);
    } else if (option === "nuevoHistorial") {
      onNavigate("registrarHistorial");
    } else if (option === "registrarMascota") {
      onNavigate("registrarMascota");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.welcomeBanner}>
        <Text style={styles.welcomeText}>Bienvenido,</Text>
        <Text style={styles.doctorName}>Dr. {doctor?.nombre}</Text>
        <Text style={styles.especialidad}>{doctor?.especialidad}</Text>
      </View>

      <Text style={styles.sectionTitle}>Resumen del día</Text>

      <View style={styles.statsRow}>
        <View style={[styles.statCard, styles.statGreen]}>
          <Text style={styles.statNumber}>{mascotas.length}</Text>
          <Text style={styles.statLabel}>Mascotas{"\n"}registradas</Text>
        </View>
        <View style={[styles.statCard, styles.statTeal]}>
          <Text style={styles.statNumber}>{historiales.length}</Text>
          <Text style={styles.statLabel}>Historiales{"\n"}totales</Text>
        </View>
        <View style={[styles.statCard, styles.statMint]}>
          <Text style={styles.statNumber}>{historialesHoy.length}</Text>
          <Text style={styles.statLabel}>Consultas{"\n"}hoy</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Acciones rápidas</Text>

      <TouchableOpacity
        style={styles.actionCard}
        onPress={() => onNavigate("registrarMascota")}
      >
        <View style={styles.actionIcon}>
          <Text style={styles.actionIconText}>🐾</Text>
        </View>
        <View style={styles.actionInfo}>
          <Text style={styles.actionTitle}>Registrar Mascota</Text>
          <Text style={styles.actionDesc}>
            Agrega un nuevo paciente al sistema
          </Text>
        </View>
        <Text style={styles.actionArrow}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.actionCard}
        onPress={() => onNavigate("registrarHistorial")}
      >
        <View style={styles.actionIcon}>
          <Text style={styles.actionIconText}>📋</Text>
        </View>
        <View style={styles.actionInfo}>
          <Text style={styles.actionTitle}>Registrar Historial</Text>
          <Text style={styles.actionDesc}>
            Crea un historial clínico con diagnóstico
          </Text>
        </View>
        <Text style={styles.actionArrow}>›</Text>
      </TouchableOpacity>

      {historiales.length > 0 && (
        <>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Últimos historiales</Text>
            <Text style={styles.sectionHint}>Mantén presionado para opciones</Text>
          </View>
          {historiales
            .slice(-3)
            .reverse()
            .map((h) => (
              <TouchableOpacity
                key={h.id}
                style={styles.historialCard}
                onLongPress={() => handleLongPress(h)}
                delayLongPress={400}
                activeOpacity={0.75}
              >
                <View style={styles.historialHeader}>
                  <Text style={styles.historialMascota}>
                    {h.mascota.nombre}
                  </Text>
                  <Text style={styles.historialFecha}>
                    {new Date(h.fecha).toLocaleDateString("es-ES")}
                  </Text>
                </View>
                <Text style={styles.historialDiag}>
                  Diagnóstico: {h.diagnostico}
                </Text>
                <Text style={styles.historialDoctor}>
                  Dr. {h.doctor.nombre}
                </Text>
                <Text style={styles.longPressHint}>⋯ mantén para opciones</Text>
              </TouchableOpacity>
            ))}
        </>
      )}

      <Modal
        transparent
        visible={contextMenuVisible}
        animationType="fade"
        onRequestClose={() => setContextMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setContextMenuVisible(false)}
        >
          <View style={styles.contextMenu}>
            <View style={styles.contextHeader}>
              <Text style={styles.contextTitle}>
                🐾 {selectedHistorial?.mascota.nombre}
              </Text>
              <Text style={styles.contextSubtitle}>
                {selectedHistorial?.mascota.tipo} —{" "}
                {selectedHistorial?.mascota.propietario}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.contextItem}
              onPress={() => handleContextOption("ver")}
            >
              <Text style={styles.contextIcon}>👁️</Text>
              <Text style={styles.contextLabel}>Ver detalle completo</Text>
            </TouchableOpacity>

            <View style={styles.contextDivider} />

            <TouchableOpacity
              style={styles.contextItem}
              onPress={() => handleContextOption("nuevoHistorial")}
            >
              <Text style={styles.contextIcon}>📋</Text>
              <Text style={styles.contextLabel}>Nuevo historial</Text>
            </TouchableOpacity>

            <View style={styles.contextDivider} />

            <TouchableOpacity
              style={styles.contextItem}
              onPress={() => handleContextOption("registrarMascota")}
            >
              <Text style={styles.contextIcon}>🐾</Text>
              <Text style={styles.contextLabel}>Registrar mascota</Text>
            </TouchableOpacity>

            <View style={styles.contextDivider} />

            <TouchableOpacity
              style={[styles.contextItem, styles.contextItemLast]}
              onPress={() => setContextMenuVisible(false)}
            >
              <Text style={styles.contextIcon}>✕</Text>
              <Text style={[styles.contextLabel, styles.contextLabelClose]}>
                Cerrar
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        transparent
        visible={detailModalVisible}
        animationType="slide"
        onRequestClose={() => setDetailModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.detailModal}>
            <View style={styles.detailHeader}>
              <Text style={styles.detailTitle}>
                Historial — {selectedHistorial?.mascota.nombre}
              </Text>
              <TouchableOpacity onPress={() => setDetailModalVisible(false)}>
                <Text style={styles.detailClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>Datos de la mascota</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Tipo:</Text>
                <Text style={styles.detailValue}>
                  {selectedHistorial?.mascota.tipo}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Raza:</Text>
                <Text style={styles.detailValue}>
                  {selectedHistorial?.mascota.raza}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Edad:</Text>
                <Text style={styles.detailValue}>
                  {selectedHistorial?.mascota.edad} años
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Peso:</Text>
                <Text style={styles.detailValue}>
                  {selectedHistorial?.mascota.peso} kg
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Medidas:</Text>
                <Text style={styles.detailValue}>
                  {selectedHistorial?.mascota.medidas}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Propietario:</Text>
                <Text style={styles.detailValue}>
                  {selectedHistorial?.mascota.propietario}
                </Text>
              </View>
            </View>

            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>Información clínica</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Doctor:</Text>
                <Text style={styles.detailValue}>
                  Dr. {selectedHistorial?.doctor.nombre}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Fecha:</Text>
                <Text style={styles.detailValue}>
                  {selectedHistorial?.fecha
                    ? new Date(selectedHistorial.fecha).toLocaleDateString(
                        "es-ES"
                      )
                    : ""}
                </Text>
              </View>
              <Text style={styles.detailLabel}>Dolencia:</Text>
              <Text style={styles.detailBlock}>
                {selectedHistorial?.descripcionDolencia}
              </Text>
              <Text style={styles.detailLabel}>Diagnóstico:</Text>
              <Text style={styles.detailBlock}>
                {selectedHistorial?.diagnostico}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.detailCloseBtn}
              onPress={() => setDetailModalVisible(false)}
            >
              <Text style={styles.detailCloseBtnText}>Cerrar</Text>
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
  welcomeBanner: {
    backgroundColor: "#45ac8b",
    borderRadius: 18,
    padding: 24,
    marginBottom: 24,
  },
  welcomeText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 15,
  },
  doctorName: {
    color: "#ffffff",
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 2,
  },
  especialidad: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 14,
    marginTop: 4,
  },
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2d7a61",
    marginBottom: 12,
    marginTop: 4,
  },
  sectionHint: {
    fontSize: 11,
    color: "#aaa",
    fontStyle: "italic",
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
  },
  statGreen: { backgroundColor: "#d4f0e5" },
  statTeal: { backgroundColor: "#b8e8d6" },
  statMint: { backgroundColor: "#e0f5ed" },
  statNumber: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2d7a61",
  },
  statLabel: {
    fontSize: 11,
    color: "#45ac8b",
    textAlign: "center",
    fontWeight: "600",
    marginTop: 4,
  },
  actionCard: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#45ac8b",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#e8f5ef",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  actionIconText: { fontSize: 22 },
  actionInfo: { flex: 1 },
  actionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  actionDesc: {
    fontSize: 13,
    color: "#888",
    marginTop: 2,
  },
  actionArrow: {
    fontSize: 26,
    color: "#45ac8b",
    fontWeight: "300",
  },
  historialCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#45ac8b",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  historialHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  historialMascota: {
    fontWeight: "700",
    color: "#1a1a1a",
    fontSize: 15,
  },
  historialFecha: {
    color: "#888",
    fontSize: 12,
  },
  historialDiag: {
    color: "#444",
    fontSize: 13,
    marginBottom: 4,
  },
  historialDoctor: {
    color: "#45ac8b",
    fontSize: 12,
    fontWeight: "600",
  },
  longPressHint: {
    color: "#ccc",
    fontSize: 10,
    marginTop: 6,
    fontStyle: "italic",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  contextMenu: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    width: "80%",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
  contextHeader: {
    backgroundColor: "#f0faf6",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#e0f0ea",
  },
  contextTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  contextSubtitle: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  contextItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  contextItemLast: {
    paddingBottom: 18,
  },
  contextDivider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginHorizontal: 20,
  },
  contextIcon: {
    fontSize: 18,
    marginRight: 14,
    width: 24,
    textAlign: "center",
  },
  contextLabel: {
    fontSize: 15,
    color: "#1a1a1a",
    fontWeight: "500",
  },
  contextLabelClose: {
    color: "#888",
  },
  detailModal: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    width: "90%",
    maxHeight: "85%",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
    overflow: "hidden",
  },
  detailHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#45ac8b",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  detailTitle: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    flex: 1,
  },
  detailClose: {
    color: "#fff",
    fontSize: 20,
    paddingLeft: 12,
  },
  detailSection: {
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  detailSectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#45ac8b",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 8,
    gap: 8,
  },
  detailLabel: {
    fontWeight: "700",
    color: "#555",
    fontSize: 13,
    width: 90,
    marginBottom: 6,
  },
  detailValue: {
    color: "#1a1a1a",
    fontSize: 13,
    flex: 1,
  },
  detailBlock: {
    color: "#333",
    fontSize: 13,
    lineHeight: 20,
    backgroundColor: "#f5faf8",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  detailCloseBtn: {
    margin: 16,
    backgroundColor: "#45ac8b",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  detailCloseBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});