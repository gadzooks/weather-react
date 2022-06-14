export function convertToSentence(input: string) :string {
    if(input === '') {
        return input;
    }

    const str = input.replaceAll('-', ' ');
    return str.charAt(0).toUpperCase() + str.slice(1);
}