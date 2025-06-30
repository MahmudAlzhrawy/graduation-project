import DoctorDetailsClientComponent from "@/components/Doctors/DoctorDetails";
import { doctorCards } from "@/constants/doctor";
import { DoctorCard } from "@/constants/doctor";
import { DoctorModel } from "@/components/Doctors/Doctors";
import { notFound } from "next/navigation";
type Props = {
  params: Promise<{ doctorId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};
interface WorkingHour {
  workingHourID: number;
  workingDate: string;
  workingDay: string;
  startTime: string;
  endTime: string;
  waitingHours: number;
  status: string;
  appointmentCount: number;
  maxAppointments: number;
}

interface Service {
  idService: number;
  clinicId: number;
  serviceName: string;
  serviceDescription: string;
  price: number;
}

async function DoctorDetails(props: Props) {
  const clinicId = (await props.params).doctorId.split("--")[1];
    const workingHourIDParam = (await props.searchParams)?.workingHourID;
  const workingHourID =
    typeof workingHourIDParam === "string" ? parseInt(workingHourIDParam) : 0;
  try {
    const response = await fetch(
      `https://citypulse.runasp.net/api/Clinic/DoctorsByClinicId?clinicId=${clinicId}`,
      {
        method: "GET",
      }
    );
    if (response.ok) {
      const data = await response.json();
      const DoctorObject = data;
      const doctor: DoctorModel = {
        doctorId: DoctorObject.doctorId,
        clinicId: DoctorObject.clinicId,
        doctorName: DoctorObject.doctorName,
        description: DoctorObject.description,
        specialization: DoctorObject.specialization,
        experienceYears: DoctorObject.experienceYears,
        profileImage: DoctorObject.profileImage,
        academicDegree: DoctorObject.academicDegree,
        retaing: DoctorObject.retaing, // typo: maybe should be `rating`?
        price: DoctorObject.price,
        city: DoctorObject.city,
        addressLine1: DoctorObject.addressLine1,
      workingHour: Array.isArray(DoctorObject.workingHour.$values)
  ? DoctorObject.workingHour.$values.map((hour: WorkingHour) => ({
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
        services: Array.isArray(DoctorObject.services.$values)
          ? DoctorObject.services.$values.map((service:Service) => ({
              idService: service.idService,
              clinicId: service.clinicId,
              serviceName: service.serviceName,
              serviceDescription: service.serviceDescription,
              price: service.price,
            }))
          : [],
      };
return <DoctorDetailsClientComponent DoctorObject={doctor} workingHourID={workingHourID} />;    }

    return notFound;
  } catch (e) {
    console.log("Error", e);
  }
}

export default DoctorDetails;
