// src/supabaseClient.ts

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/* ---------------------------------------------
   Bronson Family Farm Ecosystem Database Actions
---------------------------------------------- */

// FEEDBACK
export async function saveFeedback({
  userId,
  feedbackType,
  rating,
  comments,
}: {
  userId?: string | null;
  feedbackType: string;
  rating: number;
  comments: string;
}) {
  const { data, error } = await supabase
    .from("feedback")
    .insert({
      user_id: userId || null,
      feedback_type: feedbackType,
      rating,
      comments,
    })
    .select();

  if (error) {
    console.error("Feedback save error:", error);
    return { success: false, error };
  }

  return { success: true, data };
}

// ATTENDANCE
export async function saveAttendance({
  participantId,
  status,
  ppeStatus,
  assignment,
}: {
  participantId: string;
  status: string;
  ppeStatus: string;
  assignment: string;
}) {
  const { data, error } = await supabase
    .from("attendance")
    .insert({
      participant_id: participantId,
      date: new Date().toISOString().slice(0, 10),
      status,
      ppe_status: ppeStatus,
      assignment,
    })
    .select();

  if (error) {
    console.error("Attendance save error:", error);
    return { success: false, error };
  }

  return { success: true, data };
}

// DAILY WELLNESS
export async function saveDailyWellness({
  youthId,
  attendanceId,
  moodScore,
  energyScore,
  stressScore,
  supportNeeded,
  supportNotes,
}: {
  youthId: string;
  attendanceId?: string | null;
  moodScore: number;
  energyScore: number;
  stressScore: number;
  supportNeeded: boolean;
  supportNotes?: string;
}) {
  const { data, error } = await supabase
    .from("daily_wellness")
    .insert({
      youth_id: youthId,
      attendance_id: attendanceId || null,
      mood_score: moodScore,
      energy_score: energyScore,
      stress_score: stressScore,
      support_needed: supportNeeded,
      support_notes: supportNotes || "",
    })
    .select();

  if (error) {
    console.error("Daily wellness save error:", error);
    return { success: false, error };
  }

  return { success: true, data };
}

// DAILY REFLECTION
export async function saveDailyReflection({
  youthId,
  learnedToday,
  proudOfToday,
  needHelpWith,
  tomorrowGoal,
}: {
  youthId: string;
  learnedToday: string;
  proudOfToday: string;
  needHelpWith: string;
  tomorrowGoal: string;
}) {
  const { data, error } = await supabase
    .from("daily_reflections")
    .insert({
      youth_id: youthId,
      learned_today: learnedToday,
      proud_of_today: proudOfToday,
      need_help_with: needHelpWith,
      tomorrow_goal: tomorrowGoal,
    })
    .select();

  if (error) {
    console.error("Daily reflection save error:", error);
    return { success: false, error };
  }

  return { success: true, data };
}

// SUPERVISOR ASSESSMENT
export async function saveSupervisorAssessment({
  youthId,
  supervisorId,
  teamwork,
  communication,
  leadership,
  reliability,
  safety,
  notes,
}: {
  youthId: string;
  supervisorId: string;
  teamwork: number;
  communication: number;
  leadership: number;
  reliability: number;
  safety: number;
  notes?: string;
}) {
  const { data, error } = await supabase
    .from("supervisor_assessments")
    .insert({
      youth_id: youthId,
      supervisor_id: supervisorId,
      teamwork,
      communication,
      leadership,
      reliability,
      safety,
      notes: notes || "",
    })
    .select();

  if (error) {
    console.error("Supervisor assessment save error:", error);
    return { success: false, error };
  }

  return { success: true, data };
}

// INCIDENT
export async function saveIncident({
  youthId,
  supervisorId,
  incidentType,
  description,
  actionTaken,
}: {
  youthId: string;
  supervisorId: string;
  incidentType: string;
  description: string;
  actionTaken: string;
}) {
  const { data, error } = await supabase
    .from("incidents")
    .insert({
      youth_id: youthId,
      supervisor_id: supervisorId,
      incident_type: incidentType,
      description,
      action_taken: actionTaken,
    })
    .select();

  if (error) {
    console.error("Incident save error:", error);
    return { success: false, error };
  }

  return { success: true, data };
}

// INVENTORY
export async function saveInventoryItem({
  productName,
  category,
  quantity,
  unit,
  price,
  snapEligible,
  imageUrl,
}: {
  productName: string;
  category: string;
  quantity: number;
  unit: string;
  price: number;
  snapEligible: boolean;
  imageUrl?: string;
}) {
  const { data, error } = await supabase
    .from("inventory")
    .insert({
      product_name: productName,
      category,
      quantity,
      unit,
      price,
      snap_eligible: snapEligible,
      image_url: imageUrl || "",
    })
    .select();

  if (error) {
    console.error("Inventory save error:", error);
    return { success: false, error };
  }

  return { success: true, data };
}

// HARVEST
export async function saveHarvest({
  productId,
  harvestedBy,
  quantity,
  unit,
  harvestDate,
}: {
  productId: string;
  harvestedBy: string;
  quantity: number;
  unit: string;
  harvestDate?: string;
}) {
  const { data, error } = await supabase
    .from("harvests")
    .insert({
      product_id: productId,
      harvested_by: harvestedBy,
      quantity,
      unit,
      harvest_date: harvestDate || new Date().toISOString().slice(0, 10),
    })
    .select();

  if (error) {
    console.error("Harvest save error:", error);
    return { success: false, error };
  }

  return { success: true, data };
}

// ECOSYSTEM METRICS
export async function loadEcosystemMetrics() {
  const { data, error } = await supabase
    .from("ecosystem_metrics")
    .select("*")
    .single();

  if (error) {
    console.error("Metrics load error:", error);
    return null;
  }

  return data;
}

// INVENTORY LIST
export async function loadInventory() {
  const { data, error } = await supabase
    .from("inventory")
    .select("*")
    .order("product_name", { ascending: true });

  if (error) {
    console.error("Inventory load error:", error);
    return [];
  }

  return data;
}

// WORKFORCE TEAMS
export async function loadWorkforceTeams() {
  const { data, error } = await supabase
    .from("workforce_teams")
    .select("*")
    .order("team_name", { ascending: true });

  if (error) {
    console.error("Workforce teams load error:", error);
    return [];
  }

  return data;
}
