// import { userHasProjects } from "@/app/actions/project";
// import { redirect } from "next/navigation";
import OnboardingPage from "@/components/onboarding-client-component";

export default async function Onboarding(){
  

    // const hasProjects = await userHasProjects();
    
    // if(hasProjects){
    //   redirect('/dashboard/home');
    // }
    

    return <OnboardingPage></OnboardingPage>
  }
 