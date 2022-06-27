const replaceRegex = /-/g;
function convertToSentence(input: string) :string {
  if (input === '') {
    return input;
  }

  const str = input.replace(replaceRegex, ' ');
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default convertToSentence;
