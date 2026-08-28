import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { DoctorProfile } from "@/models/DoctorProfile";
import { User } from "@/models/User";

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);

    const ayushSystem = searchParams.get("ayushSystem");
    const specialization = searchParams.get("specialization");
    const location = searchParams.get("location");
    const queryStr = searchParams.get("query");
    const maxFee = searchParams.get("maxFee");

    const query: Record<string, unknown> = {
      profileStatus: "VERIFIED",
    };

    if (ayushSystem && ayushSystem !== "ALL") {
      query.ayushSystem = ayushSystem;
    }
    if (specialization) {
      query.specialization = { $regex: specialization, $options: "i" };
    }
    if (location) {
      query["chamberInformation.city"] = { $regex: location, $options: "i" };
    }
    if (maxFee) {
      query.consultationFee = { $lte: Number(maxFee) };
    }

    const doctorProfiles = await DoctorProfile.find(query)
      .populate("userId", "fullName email phone profileImage")
      .lean();

    // Filter by query string if provided (matches doctor name or clinic)
    let results = doctorProfiles;
    if (queryStr) {
      const qLower = queryStr.toLowerCase();
      results = doctorProfiles.filter((doc: any) => {
        const nameMatch = doc.userId?.fullName?.toLowerCase().includes(qLower);
        const specMatch = doc.specialization?.toLowerCase().includes(qLower);
        const clinicMatch = doc.chamberInformation?.clinicName?.toLowerCase().includes(qLower);
        return nameMatch || specMatch || clinicMatch;
      });
    }

    return NextResponse.json({
      success: true,
      count: results.length,
      doctors: JSON.parse(JSON.stringify(results)),
    });
  } catch (err: any) {
    console.error("GET /api/doctor/search error:", err);
    return NextResponse.json({ error: "Failed to search doctors." }, { status: 500 });
  }
}
