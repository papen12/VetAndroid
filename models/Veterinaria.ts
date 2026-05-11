export type TipoAnimal =
  | "Perro"
  | "Gato"
  | "Ave"
  | "Conejo"
  | "Hamster"
  | "Reptil"
  | "Otro";

export type EspecialidadVeterinaria =
  | "Medicina General"
  | "Cirugía"
  | "Dermatología"
  | "Odontología"
  | "Cardiología"
  | "Neurología"
  | "Traumatología"
  | "Nutrición"
  | "Oncología"
  | "Exóticos";

export class Animal {
  nombre: string;
  edad: number;
  peso: number;
  tipo: TipoAnimal;
  medidas: string;

  constructor(
    nombre: string,
    edad: number,
    peso: number,
    tipo: TipoAnimal,
    medidas: string
  ) {
    this.nombre = nombre;
    this.edad = edad;
    this.peso = peso;
    this.tipo = tipo;
    this.medidas = medidas;
  }
}

export class Mascota extends Animal {
  id: string;
  propietario: string;
  raza: string;
  imagen?: string;

  constructor(
    id: string,
    nombre: string,
    edad: number,
    peso: number,
    tipo: TipoAnimal,
    medidas: string,
    propietario: string,
    raza: string,
    imagen?: string
  ) {
    super(nombre, edad, peso, tipo, medidas);
    this.id = id;
    this.propietario = propietario;
    this.raza = raza;
    this.imagen = imagen;
  }
}

export class Doctor {
  id: string;
  nombre: string;
  especialidad: EspecialidadVeterinaria;
  usuario: string;
  password: string;

  constructor(
    id: string,
    nombre: string,
    especialidad: EspecialidadVeterinaria,
    usuario: string,
    password: string
  ) {
    this.id = id;
    this.nombre = nombre;
    this.especialidad = especialidad;
    this.usuario = usuario;
    this.password = password;
  }
}

export class HistorialClinico {
  id: string;
  mascota: Mascota;
  doctor: Doctor;
  diagnostico: string;
  descripcionDolencia: string;
  fecha: Date;

  constructor(
    id: string,
    mascota: Mascota,
    doctor: Doctor,
    diagnostico: string,
    descripcionDolencia: string,
    fecha: Date
  ) {
    this.id = id;
    this.mascota = mascota;
    this.doctor = doctor;
    this.diagnostico = diagnostico;
    this.descripcionDolencia = descripcionDolencia;
    this.fecha = fecha;
  }
}

export const especialidadesVeterinarias: EspecialidadVeterinaria[] = [
  "Medicina General",
  "Cirugía",
  "Dermatología",
  "Odontología",
  "Cardiología",
  "Neurología",
  "Traumatología",
  "Nutrición",
  "Oncología",
  "Exóticos",
];

export const tiposAnimal: TipoAnimal[] = [
  "Perro",
  "Gato",
  "Ave",
  "Conejo",
  "Hamster",
  "Reptil",
  "Otro",
];

export class VeterinariaDB {
  private static doctores: Doctor[] = [];
  private static mascotas: Mascota[] = [
    new Mascota("1", "Max", 4, 20, "Perro", "60cm", "Carlos Pérez", "Labrador"),
    new Mascota("2", "Michi", 2, 5, "Gato", "30cm", "Ana Torres", "Siames"),
    new Mascota("3", "Rocky", 1, 1.2, "Conejo", "25cm", "Luis Mendoza", "Mini Lop"),
  ];
  private static historiales: HistorialClinico[] = [];

  static registrarDoctor(doctor: Doctor) {
    this.doctores.push(doctor);
  }

  static obtenerDoctores(): Doctor[] {
    return this.doctores;
  }

  static login(usuario: string, password: string): Doctor | null {
    return (
      this.doctores.find(
        (doctor) =>
          doctor.usuario === usuario && doctor.password === password
      ) || null
    );
  }

  static existeUsuario(usuario: string): boolean {
    return this.doctores.some((doctor) => doctor.usuario === usuario);
  }

  static registrarMascota(mascota: Mascota) {
    this.mascotas.push(mascota);
  }

  static obtenerMascotas(): Mascota[] {
    return this.mascotas;
  }

  static buscarMascota(id: string): Mascota | null {
    return this.mascotas.find((m) => m.id === id) || null;
  }

  static registrarHistorial(historial: HistorialClinico) {
    this.historiales.push(historial);
  }

  static obtenerHistoriales(): HistorialClinico[] {
    return this.historiales;
  }

  static obtenerHistorialesPorMascota(mascotaId: string): HistorialClinico[] {
    return this.historiales.filter((h) => h.mascota.id === mascotaId);
  }
}