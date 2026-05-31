async function saveTodayToSupabase() {
  await saveAttendance({
    participantId: selectedYouth.id,
    status: todayRecord.attendance,
    ppeStatus: todayRecord.ppe ? "PPE Ready" : "Needs PPE",
    assignment: todayRecord.taskArea,
  });

  await saveDailyWellness({
    youthId: selectedYouth.id,
    moodScore:
      todayRecord.mood === "Ready" ? 5 :
      todayRecord.mood === "Okay" ? 4 :
      todayRecord.mood === "Tired" ? 3 :
      todayRecord.mood === "Concerned" ? 2 : 1,
    energyScore: todayRecord.slept ? 4 : 2,
    stressScore:
      todayRecord.mood === "Needs Support" ? 5 :
      todayRecord.mood === "Concerned" ? 4 : 2,
    supportNeeded: todayRecord.needsStaff || todayRecord.followUpNeeded,
    supportNotes: todayRecord.wellnessNote,
  });

  await saveSupervisorAssessment({
    youthId: selectedYouth.id,
    supervisorId: supervisor,
    teamwork: todayRecord.skillsObserved.includes("Worked with team") ? 5 : 3,
    communication: todayRecord.skillsObserved.includes("Communication") ? 5 : 3,
    leadership: todayRecord.badges.includes("Leadership") ? 5 : 3,
    reliability: todayRecord.badges.includes("Reliability") ? 5 : 3,
    safety: todayRecord.ppe && todayRecord.safety === "Cleared" ? 5 : 3,
    notes: todayRecord.supervisorNote,
  });

  if (todayRecord.incident) {
    await saveIncident({
      youthId: selectedYouth.id,
      supervisorId: supervisor,
      incidentType: todayRecord.safety,
      description: todayRecord.incidentNote,
      actionTaken: todayRecord.parentContactNeeded
        ? "Parent contact needed"
        : "Supervisor follow-up needed",
    });
  }

  alert("Saved to Bronson Family Farm Supabase database.");
}
