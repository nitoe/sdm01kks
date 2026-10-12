import { rosterKey, type Duty } from "./logic.ts";

export const SCHOOL_YEAR = "2026/2027";

export type RosterTeacher = {
  key: string;
  name: string;
  duties: Duty[];
};

function teach(kelas: string, ...mapel: string[]): Duty[] {
  return mapel.map((item) => ({ kelas, mapel: item }));
}

const RAW: { name: string; duties: Duty[] }[] = [
  {
    name: "Abdurrahman",
    duties: [
      ...teach("4-A", "Bahasa Arab", "Kemuhammadiyahan"),
      ...teach("4-B", "Bahasa Arab", "Kemuhammadiyahan"),
      ...teach("5-A", "Bahasa Arab", "Kemuhammadiyahan"),
      ...teach("5-B", "Bahasa Arab", "Kemuhammadiyahan"),
      ...teach("5-C", "Bahasa Arab", "Kemuhammadiyahan"),
      ...teach("6-A", "Kemuhammadiyahan"),
      ...teach("6-B", "Kemuhammadiyahan"),
    ],
  },
  {
    name: "Anastasia Yulianasari",
    duties: teach(
      "3-B",
      "Pendidikan Pancasila",
      "Bahasa Indonesia",
      "Matematika",
      "Ilmu Pengetahuan Alam dan Sosial",
      "Seni Budaya",
      "Bahasa Sunda",
      "Kemuhammadiyahan",
    ),
  },
  {
    name: "Aprilia Nur Hidayati",
    duties: teach(
      "4-A",
      "Al-Islam",
      "Pendidikan Pancasila",
      "Bahasa Indonesia",
      "Matematika",
      "Ilmu Pengetahuan Alam dan Sosial",
      "Seni Budaya",
      "Bahasa Sunda",
    ),
  },
  {
    name: "Arif Azwar Anas",
    duties: teach(
      "5-A",
      "Pendidikan Pancasila",
      "Bahasa Indonesia",
      "Ilmu Pengetahuan Alam dan Sosial",
      "Seni Budaya",
    ),
  },
  {
    name: "Asuroh Susanti",
    duties: [
      ...teach("6-A", "Bahasa Sunda"),
      ...teach(
        "6-B",
        "Pendidikan Pancasila",
        "Bahasa Indonesia",
        "Matematika",
        "Ilmu Pengetahuan Alam dan Sosial",
        "Seni Budaya",
        "Bahasa Sunda",
      ),
    ],
  },
  {
    name: "Azizah Zahro Ibrahim",
    duties: [
      ...teach("5-A", "Matematika", "Bahasa Sunda"),
      ...teach("5-B", "Matematika"),
      ...teach("5-C", "Matematika"),
    ],
  },
  {
    name: "Darmiati",
    duties: teach("2-A", "Pendidikan Pancasila", "Bahasa Indonesia", "Matematika", "Seni Budaya", "Bahasa Sunda"),
  },
  {
    name: "Elya",
    duties: teach("2-B", "Pendidikan Pancasila", "Bahasa Indonesia", "Matematika", "Seni Budaya", "Bahasa Sunda"),
  },
  {
    name: "Evi Sumyati",
    duties: teach("1-C", "Pendidikan Pancasila", "Bahasa Indonesia", "Matematika", "Seni Budaya", "Bahasa Sunda"),
  },
  {
    name: "Febrian Raka Ramadan",
    duties: [
      "1-A",
      "1-B",
      "1-C",
      "2-A",
      "2-B",
      "3-A",
      "3-B",
      "3-C",
      "4-A",
      "4-B",
      "5-A",
      "5-B",
      "5-C",
      "6-A",
      "6-B",
    ].flatMap((kelas) => teach(kelas, "Pendidikan Jasmani, Olahraga, dan Kesehatan")),
  },
  {
    name: "Idatul Fitri",
    duties: teach(
      "5-C",
      "Al-Islam",
      "Pendidikan Pancasila",
      "Bahasa Indonesia",
      "Ilmu Pengetahuan Alam dan Sosial",
      "Seni Budaya",
      "Bahasa Sunda",
    ),
  },
  {
    name: "Luzyas Indra Permana",
    duties: ["3-A", "3-B", "3-C", "4-A", "4-B"].flatMap((kelas) => teach(kelas, "Tahsin", "Tahfizh")),
  },
  {
    name: "Marnie Septia .K",
    duties: teach(
      "4-B",
      "Al-Islam",
      "Pendidikan Pancasila",
      "Bahasa Indonesia",
      "Matematika",
      "Ilmu Pengetahuan Alam dan Sosial",
      "Seni Budaya",
      "Bahasa Sunda",
    ),
  },
  {
    name: "Muhammad Rizki",
    duties: ["5-A", "5-B", "5-C", "6-A", "6-B"].flatMap((kelas) => teach(kelas, "Tahsin", "Tahfizh")),
  },
  {
    name: "Nisya El Salsabila",
    duties: [
      ...teach("1-A", "Al-Islam"),
      ...teach(
        "1-B",
        "Al-Islam",
        "Pendidikan Pancasila",
        "Bahasa Indonesia",
        "Matematika",
        "Seni Budaya",
        "Bahasa Inggris",
        "Bahasa Sunda",
      ),
      ...teach("1-C", "Al-Islam"),
    ],
  },
  {
    name: "Rahmah Yuningsih",
    duties: [
      ...teach("3-A", "Al-Islam", "Bahasa Arab"),
      ...teach("3-B", "Al-Islam", "Bahasa Arab"),
      ...teach("3-C", "Al-Islam", "Bahasa Arab"),
      ...teach("5-A", "Al-Islam"),
      ...teach("6-A", "Al-Islam", "Bahasa Arab"),
      ...teach("6-B", "Al-Islam", "Bahasa Arab"),
    ],
  },
  {
    name: "Ratih Yuniati",
    duties: [
      ...teach(
        "6-A",
        "Pendidikan Pancasila",
        "Bahasa Indonesia",
        "Matematika",
        "Ilmu Pengetahuan Alam dan Sosial",
        "Seni Budaya",
        "Bahasa Inggris",
      ),
      ...teach("6-B", "Bahasa Inggris"),
    ],
  },
  {
    name: "Silvia Sa'diah",
    duties: ["1-C", "2-A", "2-B", "3-A", "3-B", "3-C", "4-A", "4-B", "5-A", "5-B", "5-C"].flatMap((kelas) =>
      teach(kelas, "Bahasa Inggris"),
    ),
  },
  {
    name: "Suci Lestari",
    duties: teach(
      "1-A",
      "Pendidikan Pancasila",
      "Bahasa Indonesia",
      "Matematika",
      "Seni Budaya",
      "Bahasa Inggris",
      "Bahasa Sunda",
    ),
  },
  {
    name: "Supitriatna Hindrawan",
    duties: ["4-A", "4-B", "5-A", "5-B", "5-C", "6-A", "6-B"].flatMap((kelas) => teach(kelas, "Informatika")),
  },
  {
    name: "Syam Apri Wilisseri",
    duties: teach(
      "3-A",
      "Pendidikan Pancasila",
      "Bahasa Indonesia",
      "Matematika",
      "Ilmu Pengetahuan Alam dan Sosial",
      "Seni Budaya",
      "Bahasa Sunda",
      "Kemuhammadiyahan",
    ),
  },
  {
    name: "Tisandi",
    duties: [
      ...teach("1-A", "Tahsin"),
      ...teach("1-B", "Tahsin"),
      ...teach("1-C", "Tahsin"),
      ...teach("2-A", "Al-Islam", "Tahsin"),
      ...teach("2-B", "Al-Islam", "Tahsin"),
    ],
  },
  {
    name: "Ummu Muwahidah",
    duties: teach(
      "5-B",
      "Al-Islam",
      "Pendidikan Pancasila",
      "Bahasa Indonesia",
      "Ilmu Pengetahuan Alam dan Sosial",
      "Seni Budaya",
      "Bahasa Sunda",
    ),
  },
  {
    name: "Yulia",
    duties: teach(
      "3-C",
      "Pendidikan Pancasila",
      "Bahasa Indonesia",
      "Matematika",
      "Ilmu Pengetahuan Alam dan Sosial",
      "Seni Budaya",
      "Bahasa Sunda",
      "Kemuhammadiyahan",
    ),
  },
];

export const ROSTER: RosterTeacher[] = RAW.map((teacher) => ({
  key: rosterKey(teacher.name),
  name: teacher.name,
  duties: teacher.duties,
}));

export const ROSTER_BY_KEY = new Map(ROSTER.map((teacher) => [teacher.key, teacher]));

export const SUBJECTS = [...new Set(ROSTER.flatMap((teacher) => teacher.duties.map((duty) => duty.mapel)))];

export function teacherByKey(key: string): RosterTeacher | undefined {
  return ROSTER_BY_KEY.get(key);
}
