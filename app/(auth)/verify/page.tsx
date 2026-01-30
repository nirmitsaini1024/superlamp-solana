import VerifyWalletPage from "@/components/verify-client-component";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function VerifyWallet(){
    const { userId } = await auth();
    
    if (!userId) {
        redirect('/signin');
    }

    const user = await currentUser();
    
    if (!user) {
        redirect('/signin');
    }

    // Check if user has wallet address in metadata
    const walletAddress = user.publicMetadata?.walletAddress as string | undefined;
    
    if (walletAddress) {
        redirect('/onboarding');
    }

    return <VerifyWalletPage></VerifyWalletPage>
}
