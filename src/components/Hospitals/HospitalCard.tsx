    "use client";
    import { FaLocationDot } from "react-icons/fa6";

    interface Props {
    hospital: {
        hospitalId: number;
        hospitalName: string;
        location: string;
        description: string;
        phoneNumber: number;
        website: string;
        openingHours: string;
        hospitalImage: string;
    };
    }

    export default function HospitalCard({ hospital }: Props) {
    const imageUrl = `https://citypulse.runasp.net/images/hospitals/${hospital.hospitalImage}`;

    return (
        <div className="bg-white border border-gray-300 rounded-lg shadow-md hover:shadow-xl transition duration-300 overflow-hidden">
        {/* صورة المستشفى */}
        <div className="h-48 overflow-hidden">
            <img
            src={imageUrl}
            alt={hospital.hospitalName}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
        </div>

        {/* محتوى البطاقة */}
        <div className="p-4 text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-2">{hospital.hospitalName}</h3>

            <p className="flex justify-center items-center text-sm text-blue-600 mb-1 gap-1">
            <FaLocationDot />
            {hospital.location}
            </p>

            <p className="text-gray-600 text-sm mb-2">{hospital.description}</p>

            <p className="text-gray-700 text-sm">📞 Phone: {hospital.phoneNumber}</p>
            <p className="text-gray-700 text-sm mb-2">🕐 Open: {hospital.openingHours}</p>

            <a
            href={`https://${hospital.website}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 text-sm text-blue-500 hover:text-blue-700 underline"
            >
            Visit Website
            </a>
        </div>
        </div>
    );
    }
