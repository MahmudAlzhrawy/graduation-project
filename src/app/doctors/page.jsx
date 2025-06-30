import Doctors from "@/components/Doctors/Doctors";


export default async function DoctorsPage({ searchParams }) {
  const response = await fetch(
    "https://citypulse.runasp.net/api/Clinic/AllDoctors"
  );
  const data = await response.json();
  const getAllDoctors = data.$values;

  if (!Array.isArray(getAllDoctors)) return;

  const mappedDoctors = getAllDoctors.map((element) => ({
    doctorId: element.doctorId,
    clinicId: element.clinicId,
    doctorName: element.doctorName,
    description: element.description,
    specialization: element.specialization,
    experienceYears: element.experienceYears,
    profileImage: element.profileImage,
    academicDegree: element.academicDegree,
    retaing: element.retaing,
    price: element.price,
    city: element.city,
    addressLine1: element.addressLine1,
    workingHour: Array.isArray(element.workingHour?.$values)
      ? element.workingHour.$values.map((hour) => ({
          workingHourID: hour.workingHourID,
          workingDate: hour.workingDate,
          workingDay: hour.workingDay,
          startTime: hour.startTime,
          endTime: hour.endTime,
          waitingHours: hour.waitingHours,
          status: hour.status,
          appointmentCount: hour.appointmentCount,
          maxAppointments: hour.maxAppointments,
        }))
      : [],
    services: Array.isArray(element.services?.$values)
      ? element.services.$values.map((service) => ({
          idService: service.idService,
          clinicId: service.clinicId,
          serviceName: service.serviceName,
          serviceDescription: service.serviceDescription,
          price: service.price,
        }))
      : [],
  }));

  const getParam = (key) =>
    typeof searchParams?.[key] === "string" ? searchParams[key] : "";

  return (
    <Doctors
      getAllDoctors={mappedDoctors}
      DoctorsSearchParams={{
        title: getParam("title"),
        examination_fee: getParam("examination_fee"),
        sorting: getParam("sorting"),
        specialty: getParam("specialty"),
        city: getParam("city"),
        search_name: getParam("search_name"),
      }}
    />
  );
}
