import React, { useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import EnviarFotoMascota from "./EnviarFotoMascota";
import Recepcion from "./Recepcion";
import RegistrarHistorial from "./Registrarhistorial";
import RegistrarMascota from "./Registrarmascota";

type Screen =
  | "recepcion"
  | "registrarMascota"
  | "registrarHistorial"
  | "enviarFoto";

const menuItems: { id: Screen; label: string; icon: string }[] = [
  { id: "recepcion", label: "Recepción", icon: "🏠" },
  { id: "registrarMascota", label: "Registrar Mascota", icon: "🐾" },
  { id: "registrarHistorial", label: "Historial Clínico", icon: "📋" },
  { id: "enviarFoto", label: "Enviar Foto Mascota", icon: "📸" },
];

const optionsMenuItems = [
  { id: "recepcion", label: "Ir a Recepción", icon: "🏠" },
  { id: "registrarMascota", label: "Registrar Mascota", icon: "🐾" },
  { id: "registrarHistorial", label: "Nuevo Historial", icon: "📋" },
  { id: "enviarFoto", label: "Enviar Foto Mascota", icon: "📸" },
  { id: "logout", label: "Cerrar sesión", icon: "🚪", danger: true },
];

export default function Main() {
  const { doctor, logout } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<Screen>("recepcion");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const navigate = (screen: string) => {
    setCurrentScreen(screen as Screen);
    setSidebarOpen(false);
  };

  const handleOptionsSelect = (id: string) => {
    setOptionsOpen(false);
    if (id === "logout") {
      setLogoutModalVisible(true);
    } else {
      navigate(id);
    }
  };

  const confirmLogout = () => {
    setLogoutModalVisible(false);
    logout();
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case "recepcion":
        return <Recepcion onNavigate={navigate} />;
      case "registrarMascota":
        return <RegistrarMascota />;
      case "registrarHistorial":
        return <RegistrarHistorial />;
      case "enviarFoto":
        return <EnviarFotoMascota />;
      default:
        return <Recepcion onNavigate={navigate} />;
    }
  };

  const currentItem = menuItems.find((m) => m.id === currentScreen);

  return (
    <View style={styles.container}>
      {(sidebarOpen || optionsOpen) && (
        <TouchableWithoutFeedback
          onPress={() => {
            setSidebarOpen(false);
            setOptionsOpen(false);
          }}
        >
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}

      {sidebarOpen && (
        <View style={styles.sidebar}>
          <View style={styles.sidebarHeader}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>
                {doctor?.nombre?.charAt(0).toUpperCase() ?? "D"}
              </Text>
            </View>
            <Text style={styles.sidebarName} numberOfLines={1}>
              Dr. {doctor?.nombre}
            </Text>
            <Text style={styles.sidebarEspecialidad} numberOfLines={1}>
              {doctor?.especialidad}
            </Text>
          </View>

          <View style={styles.sidebarMenu}>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.menuItem,
                  currentScreen === item.id && styles.menuItemActive,
                ]}
                onPress={() => navigate(item.id)}
              >
                <Text style={styles.menuIcon}>{item.icon}</Text>
                <Text
                  style={[
                    styles.menuLabel,
                    currentScreen === item.id && styles.menuLabelActive,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => {
              setSidebarOpen(false);
              setLogoutModalVisible(true);
            }}
          >
            <Text style={styles.logoutIcon}>🚪</Text>
            <Text style={styles.logoutText}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>
      )}

      {optionsOpen && (
        <View style={styles.optionsDropdown}>
          {optionsMenuItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.optionItem,
                index < optionsMenuItems.length - 1 && styles.optionItemBorder,
              ]}
              onPress={() => handleOptionsSelect(item.id)}
            >
              <Text style={styles.optionIcon}>{item.icon}</Text>
              <Text
                style={[
                  styles.optionLabel,
                  item.danger && styles.optionLabelDanger,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <Modal
        transparent
        visible={logoutModalVisible}
        animationType="fade"
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalIcon}>🚪</Text>
            <Text style={styles.modalTitle}>Cerrar sesión</Text>
            <Text style={styles.modalMessage}>
              ¿Estás seguro de que deseas cerrar la sesión?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalBtnCancel}
                onPress={() => setLogoutModalVisible(false)}
              >
                <Text style={styles.modalBtnCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalBtnConfirm}
                onPress={confirmLogout}
              >
                <Text style={styles.modalBtnConfirmText}>Cerrar sesión</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.main}>
        <View style={styles.topbar}>
          <TouchableOpacity
            style={styles.hamburger}
            onPress={() => {
              setSidebarOpen(!sidebarOpen);
              setOptionsOpen(false);
            }}
          >
            <View style={styles.hamburgerLine} />
            <View style={styles.hamburgerLine} />
            <View style={styles.hamburgerLine} />
          </TouchableOpacity>

          <Text style={styles.topbarTitle}>
            {currentItem?.icon} {currentItem?.label}
          </Text>

          <TouchableOpacity
            style={styles.optionsBtn}
            onPress={() => {
              setOptionsOpen(!optionsOpen);
              setSidebarOpen(false);
            }}
          >
            <Text style={styles.optionsDots}>⋮</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>{renderScreen()}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#f5faf8",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.35)",
    zIndex: 10,
  },
  sidebar: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: 270,
    backgroundColor: "#1e4d3a",
    zIndex: 20,
    paddingTop: 50,
    paddingBottom: 30,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  sidebarHeader: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
    marginBottom: 16,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#45ac8b",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  avatarText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },
  sidebarName: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  sidebarEspecialidad: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 13,
    textAlign: "center",
    marginTop: 2,
  },
  sidebarMenu: {
    flex: 1,
    paddingHorizontal: 12,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 4,
  },
  menuItemActive: {
    backgroundColor: "#45ac8b",
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  menuLabel: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 15,
    fontWeight: "600",
  },
  menuLabelActive: {
    color: "#ffffff",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 28,
    paddingVertical: 14,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
  },
  logoutIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  logoutText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 15,
    fontWeight: "600",
  },
  optionsDropdown: {
    position: "absolute",
    top: 100,
    right: 12,
    backgroundColor: "#ffffff",
    borderRadius: 14,
    zIndex: 30,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 12,
    minWidth: 200,
    overflow: "hidden",
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  optionItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  optionIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  optionLabel: {
    fontSize: 15,
    color: "#1a1a1a",
    fontWeight: "500",
  },
  optionLabelDanger: {
    color: "#e05555",
    fontWeight: "600",
  },
  main: {
    flex: 1,
  },
  topbar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingTop: 50,
    paddingBottom: 14,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  hamburger: {
    padding: 4,
    gap: 5,
    marginRight: 12,
  },
  hamburgerLine: {
    width: 24,
    height: 2.5,
    backgroundColor: "#2d7a61",
    borderRadius: 2,
  },
  topbarTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  optionsBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  optionsDots: {
    fontSize: 24,
    color: "#2d7a61",
    lineHeight: 28,
  },
  content: {
    flex: 1,
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
    padding: 28,
    width: "80%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  modalIcon: {
    fontSize: 36,
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
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
    backgroundColor: "#e05555",
    alignItems: "center",
  },
  modalBtnConfirmText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 15,
  },
});