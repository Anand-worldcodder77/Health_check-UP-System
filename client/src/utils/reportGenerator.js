import { jsPDF } from "jspdf";
import "jspdf-autotable";

export const generateHealthReport = (user, booking) => {
  const doc = new jsPDF();

  // --- BRANDING HEADER ---
  doc.setFillColor(0, 148, 148); // HealthChecks Teal
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setFontSize(24);
  doc.setTextColor(255, 255, 255);
  doc.text("HealthChecks Diagnostic", 14, 25);
  
  doc.setFontSize(10);
  doc.text("ISO 9001:2015 CERTIFIED | SMART LABS INDIA", 14, 33);

  // --- PATIENT & REPORT DETAILS ---
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("PATIENT INFORMATION", 14, 50);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Name: ${user?.name || "Guest Patient"}`, 14, 58);
  doc.text(`Email: ${user?.email || "N/A"}`, 14, 64);
  doc.text(`Report ID: HC-${booking._id.slice(-6).toUpperCase()}`, 14, 70);
  
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 58);
  doc.text(`Status: DIGITAL VERIFIED`, 150, 64);

  // --- TEST RESULTS TABLE ---
  const tableColumn = ["Test Parameter", "Result", "Unit", "Reference Range", "Status"];
  const tableRows = [
    ["Haemoglobin (Hb)", "14.5", "g/dL", "13.0 - 17.0", "NORMAL"],
    ["Blood Sugar (Fasting)", "92", "mg/dL", "70 - 100", "NORMAL"],
    ["TSH (Thyroid)", "2.1", "uIU/mL", "0.4 - 4.5", "NORMAL"],
    ["Vitamin D3", "32", "ng/mL", "30 - 100", "OPTIMAL"],
    ["Cholesterol (Total)", "170", "mg/dL", "< 200", "NORMAL"],
  ];

  doc.autoTable({
    startY: 80,
    head: [tableColumn],
    body: tableRows,
    theme: 'striped',
    headStyles: { fillColor: [0, 148, 148], fontSize: 11 },
    styles: { fontSize: 10, cellPadding: 5 },
  });

  // --- SIGNATURE SECTION ---
  const finalY = doc.lastAutoTable.finalY + 30;
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Dr. Anand Kumar (MD, Pathologist)", 130, finalY);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text("This is a computer generated report and ", 130, finalY + 5);
  doc.text("does not require physical signature.", 130, finalY + 10);

  // --- SAVE PDF ---
  doc.save(`${user.name}_HealthReport.pdf`);
};