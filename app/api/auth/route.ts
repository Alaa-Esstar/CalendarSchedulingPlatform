import { nylas, nylasConfig } from "@/app/lib/nylas";
import { redirect } from "next/navigation";

export async function GET() {
    const authurl = nylas.auth.urlForOAuth2({
        clientId: nylasConfig.clinetId,
        redirectUri: nylasConfig.redirectUri,
    });

    return redirect(authurl);
}