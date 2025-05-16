import moment from 'moment';

export function logger(text: string) {
  console.log('[' + moment().format() + '] ' + text);
}
