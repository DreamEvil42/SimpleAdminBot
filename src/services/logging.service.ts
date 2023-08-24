import moment from 'moment-timezone';

export const Logger = {
    log(...values: any[]) {
        console.log(moment().tz('Australia/Sydney').format('DD/MM/YYYY @ hh:mm:ss A') + ' - ', ...values);
    },
    error(...values: any[]) {
        console.error(moment().tz('Australia/Sydney').format('DD/MM/YYYY @ hh:mm:ss A') + ' - ', ...values);
    },
};