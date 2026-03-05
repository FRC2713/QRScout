import { useQRScoutState } from "@/store/store";

export function FloatingFormValue() {
    const floatingField = useQRScoutState(state => state.formData.floatingField);
    
    // Early return if floatingField is not configured
    if (!floatingField || !floatingField.show) {
        return null;
    }
    
    const codeValue = floatingField.codeValue;
    const fieldValue = useQRScoutState(state => state.fieldValues).find(f => f.code === codeValue);
    
    // Early return if the field value is not found
    if (!fieldValue) {
        return null;
    }
    
    const rawValue = fieldValue.value;
    // TBA-team-and-robot stores { teamNumber, robotPosition }; avoid rendering [Object object]
    const displayValue =
        rawValue != null &&
        typeof rawValue === 'object' &&
        'teamNumber' in rawValue &&
        typeof (rawValue as { teamNumber?: number }).teamNumber === 'number'
            ? String((rawValue as { teamNumber: number }).teamNumber)
            : rawValue;

    const className = "sticky top-5 w-1/2 sm:w-full space-y-1.5 p-2 bg-primary mb-2 rounded-xl leading-none text-primary-foreground font-rhr-ns block";
    
    return (
        <div className={className}>
            {displayValue}
        </div>
    );
}