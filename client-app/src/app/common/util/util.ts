export const combineDateTime = (date: string, time: string) => {
    var array = date.split('-');
    const year = array[2];
    const month = array[1];
    const day = array[0];
    const correctDataString = `${year}-${month}-${day}`;

    return new Date(correctDataString + ' ' + time);
}