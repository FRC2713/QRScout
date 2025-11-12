import { useQRScoutState } from "@/store/store";

export function FloatingFormValue() {
    const showTeamNumber = useQRScoutState(state => state.formData.showTeamNumber);
    const teamNumber = useQRScoutState(state => state.fieldValues).filter(f => f.code === 'teamNumber')[0].value;
    const className = "sticky top-5 w-1/2 sm:w-full space-y-1.5 p-2 bg-primary mb-2 rounded-xl leading-none text-primary-foreground font-rhr-ns" + ((showTeamNumber)? "block" : "hidden");
    console.log(className);
    return (
        <div
        className={className}>
            {teamNumber}
        </div>
    );
}