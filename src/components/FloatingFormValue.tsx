import { useQRScoutState } from "@/store/store";

export function FloatingFormValue() {
    const {showField, codeValue} = useQRScoutState(state => {return {showField: state.formData.floatingField.show, codeValue: state.formData.floatingField.codeValue}});
    const teamNumber = useQRScoutState(state => state.fieldValues).filter(f => f.code === codeValue)[0].value;
    const className = "sticky top-5 w-1/2 sm:w-full space-y-1.5 p-2 bg-primary mb-2 rounded-xl leading-none text-primary-foreground font-rhr-ns " + ((showField)? "block" : "hidden");
    return (
        <div
        className={className}>
            {teamNumber}
        </div>
    );
}