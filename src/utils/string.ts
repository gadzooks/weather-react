const replaceRegex = /-/g;
function convertToSentence(input: string): string {
  if (input === '') {
    return input;
  }

  if (input === 'partly-cloudy-day') {
    return 'Ptly Cloudy';
  }

  const str = input.replace(replaceRegex, ' ');
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default convertToSentence;
