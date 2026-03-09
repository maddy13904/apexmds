import Subject from "../models/Subject.js";

export const seedSubjects = async () => {
    const count = await Subject.countDocuments();

  if (count > 0) {
    console.log("Subjects already seeded.");
    return;
  }
  const subjects = [
    { name: "Oral & Maxillofacial Surgery", code: "OMFS" },
    { name: "Pediatrics / Pedodontics", code: "PEDO" },
    { name: "Oral Medicine and Radiology", code: "OMR" },
    { name: "Oral Pathology", code: "OPATH" },
    { name: "Orthodontics", code: "ORTHO" },
    { name: "Pharmacology", code: "PHARMA" },
    { name: "General and Oral Human Anatomy", code: "ANATOMY" },
    { name: "Dental Material", code: "DMAT" },
    { name: "General Pathology and Microbiology", code: "GPM" },
    { name: "General Medicine", code: "GMED" },
    { name: "General Surgery", code: "GSURG" },
    { name: "Preventive and Community Medicine", code: "PCM" },
    { name: "Prosthodontics and Crown & Bridge", code: "PROSTHO" },
    { name: "Conservative Dentistry", code: "CONS" },
    { name: "Endodontics", code: "ENDO" }
  ];

  for (const subject of subjects) {
    await Subject.findOneAndUpdate(
      { code: subject.code },
      subject,
      { upsert: true }
    );
  }

  console.log("Subjects seeded successfully");
};
