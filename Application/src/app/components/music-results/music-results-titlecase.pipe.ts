import { Pipe, PipeTransform } from '@angular/core';
/*
 * Some additional considerations to take into when using title-case pipe
*/
@Pipe({
  standalone: true,
  name: 'musicTitleCase'
})
export class MusicTitleCasePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return value;

    const wordlist = ['A', 'An', 'The'];
    const words = value.split(' ');

    return words
      .map((word, index) => {
        // Always ignore first word
        if (index === 0) return word;

        // Capitalize single-letter words
        if (word.length === 1 && word !== 'A') return word.toUpperCase();

        // lowercase 2 letter words
        if (word.length === 2) return word.toLowerCase();

        // Handle articles
        if (wordlist.includes(word) && index !== 0) return word.toLowerCase();

        // Check for various roman numerals (other than I)
        if (word.match(/^(II|III|IV|V|VI|VII|VIII|IX|X)+$/i)) return word.toUpperCase();

        return word;
      })
      .join(' ');
  }
}