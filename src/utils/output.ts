function convertToJson(input: string): any {
    try {
        
        const cleanedInput = input.replace(/```json|```/g, "").trim();
        
        return JSON.parse(cleanedInput);
    } catch (error) {
        console.error("Invalid JSON format:", error);
        return null;
    }
}
export default convertToJson