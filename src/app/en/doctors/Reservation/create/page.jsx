import DoctorReservation from "@/components/Doctors/DoctorReservation";

export default function FirstReservationAppointmentPage({ searchParams }) {
  const workingHourID = Number(searchParams?.workingHourID || 0);
  const doctorId = Number(searchParams?.doctorId || 0);
  const clinicId = Number(searchParams?.clinicId || 0);
  const userId = Number(searchParams?.userId || 0);

  return (
    <DoctorReservation
      workingHourID={workingHourID}
      doctorId={doctorId}
      clinicId={clinicId}
      userId={userId}
    />
  );
}
